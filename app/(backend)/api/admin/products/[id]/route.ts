import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin, getUserPermissions } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';
import { z } from 'zod';

const productUpdateSchema = z.object({
  name: z.record(z.string()).optional(),
  description: z.record(z.string()).optional(),
  priceHT: z.number().int().positive().optional(),
  defaultVATRate: z.number().min(0).max(1).optional(),
  weight: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }).optional(),
  stock: z.number().int().min(0).optional(),
  brand: z.string().min(1).optional(),
  category: z.string().optional(),
  images: z.array(z.string()).optional(),
  attributes: z.record(z.any()).optional(),
  brandLink: z.string().url().optional().or(z.literal('')),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
  deliveryInfo: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
});

// GET - Détails d'un produit
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

    const product = await prisma.products.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un produit
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
    const validatedData = productUpdateSchema.parse(body);

    const product = await prisma.products.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la mise à jour du produit:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un produit
export async function DELETE(
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

    // Vérifier si le produit est utilisé dans des commandes
    const orderItemsCount = await prisma.order_items.count({
      where: { productId: id }
    });

    if (orderItemsCount > 0) {
      // Le produit est dans des commandes, on ne peut pas le supprimer
      // On propose de le désactiver à la place
      return NextResponse.json(
        {
          error: 'Ce produit est présent dans ' + orderItemsCount + ' commande(s) et ne peut pas être supprimé.',
          suggestion: 'Vous pouvez le désactiver à la place.',
          canDeactivate: true
        },
        { status: 409 } // Conflict
      );
    }

    // Seuls les admins peuvent supprimer définitivement
    if (!permissions.canDeleteProducts) {
      // Soft delete pour les managers
      const product = await prisma.products.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ product, message: 'Produit désactivé' });
    }

    // Suppression définitive pour les admins (si pas de commandes liées)
    await prisma.products.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Produit supprimé' });
  } catch (error: any) {
    console.error('Erreur lors de la suppression du produit:', error);

    // Gestion spécifique de l'erreur de contrainte FK
    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          error: 'Ce produit est référencé dans des commandes et ne peut pas être supprimé.',
          suggestion: 'Désactivez le produit à la place.'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

