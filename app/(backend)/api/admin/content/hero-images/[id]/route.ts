import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { isAdmin } from '@/backend/lib/auth';
import { z } from 'zod';

const heroImageUpdateSchema = z.object({
  type: z.enum(['tech', 'garden']).optional(),
  name: z.string().min(1).optional(),
  mediaType: z.enum(['image', 'video']).optional(),
  imageUrl: z.string().min(1).optional().nullable(),
  videoUrl: z.string().min(1).optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  price: z.number().int().positive().optional().nullable(),
  productId: z.string().uuid().optional().nullable(),
  available: z.boolean().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// GET, PUT, DELETE pour les images hero
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

    const image = await prisma.hero_images.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

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
    const validatedData = heroImageUpdateSchema.parse(body);

    const image = await prisma.hero_images.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ image });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

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

    await prisma.hero_images.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Image supprimée' });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

