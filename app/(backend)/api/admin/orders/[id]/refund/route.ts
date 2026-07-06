import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin, getUserPermissions } from '@/backend/lib/auth';
import { z } from 'zod';

const refundSchema = z.object({
  amount: z.number().int().positive().optional(), // Montant partiel en centimes (optionnel)
  reason: z.string().min(1, 'Raison requise'),
});

// POST - Effectuer un remboursement
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const permissions = getUserPermissions(session.user.role);
    if (!permissions.canRefundOrders) {
      return NextResponse.json(
        { error: 'Permission refusée. Seuls les administrateurs peuvent effectuer des remboursements.' },
        { status: 403 }
      );
    }

    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que la commande peut être remboursée
    if (order.status === 'REFUNDED') {
      return NextResponse.json(
        { error: 'Cette commande a déjà été remboursée' },
        { status: 400 }
      );
    }

    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cette commande a été annulée' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = refundSchema.parse(body);

    // Montant du remboursement (total si non spécifié)
    const refundAmount = validatedData.amount || order.totalTTC;
    const isPartialRefund = validatedData.amount && validatedData.amount < order.totalTTC;

    // Pour l'instant, on met juste à jour le statut de la commande en base de données.
    // Le remboursement réel doit être effectué manuellement via virement bancaire.

    // Mettre à jour le statut de la commande
    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: {
        status: isPartialRefund ? 'PROCESSING' : 'REFUNDED',
      },
    });

    // TODO: Créer un log d'audit pour le remboursement
    // await prisma.auditLog.create({
    //   data: {
    //     userId: session.user.id,
    //     action: 'REFUND',
    //     entityType: 'ORDER',
    //     entityId: id,
    //     details: {
    //       amount: refundAmount,
    //       reason: validatedData.reason,
    //       isPartial: isPartialRefund,
    //     },
    //   },
    // });

    return NextResponse.json({
      order: updatedOrder,
      message: isPartialRefund
        ? `Remboursement partiel de ${(refundAmount / 100).toFixed(2)}€ effectué`
        : 'Remboursement complet effectué',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors du remboursement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

