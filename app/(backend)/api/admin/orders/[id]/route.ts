import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';
import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

const orderUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  trackingNumber: z.string().optional(),
});

// GET - Détails d'une commande
export async function GET(
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

    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Modifier une commande
export async function PUT(
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

    const body = await request.json();
    const validatedData = orderUpdateSchema.parse(body);

    const order = await prisma.orders.update({
      where: { id },
      data: validatedData,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la mise à jour de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

