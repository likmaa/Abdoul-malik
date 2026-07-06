import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { isAdmin } from '@/backend/lib/auth';
import { z } from 'zod';

const partnerUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  logoPath: z.string().min(1).optional(),
  cdnUrl: z.string().url().optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  alt: z.string().min(1).optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// GET - Détails d'un partenaire
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const partner = await prisma.partners.findUnique({
      where: { id },
    });

    if (!partner) {
      return NextResponse.json(
        { error: 'Partenaire non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ partner });
  } catch (error) {
    console.error('Erreur lors de la récupération du partenaire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un partenaire
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = partnerUpdateSchema.parse(body);

    const partner = await prisma.partners.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ partner });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la mise à jour du partenaire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un partenaire
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    await prisma.partners.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Partenaire supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du partenaire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

