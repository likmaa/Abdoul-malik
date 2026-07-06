import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { isAdmin } from '@/backend/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const heroImageSchema = z.object({
  type: z.enum(['tech', 'garden']),
  name: z.string().min(1),
  mediaType: z.enum(['image', 'video']).default('image'),
  imageUrl: z.string().min(1).optional().nullable(),
  videoUrl: z.string().min(1).optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  price: z.number().int().positive().optional().nullable(),
  productId: z.string().uuid().optional().nullable(),
  available: z.boolean().default(true),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
}).refine(
  (data) => {
    if (data.mediaType === 'image') return !!data.imageUrl;
    if (data.mediaType === 'video') return !!data.videoUrl;
    return false;
  },
  {
    message: 'imageUrl est requis pour les images, videoUrl est requis pour les vidéos',
  }
);

// GET - Liste des images hero
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // "tech" ou "garden"

    const where: any = {};
    if (type) {
      where.type = type;
    }

    // Vérifier que le modèle existe
    if (!prisma.hero_images) {
      console.error('Le modèle HeroImage n\'existe pas dans Prisma Client. Exécutez: npx prisma generate');
      return NextResponse.json(
        {
          error: 'Modèle non trouvé',
          details: 'Le modèle HeroImage n\'existe pas. Veuillez exécuter: npx dotenv-cli -e .env.local -- npx prisma generate puis redémarrer le serveur.'
        },
        { status: 500 }
      );
    }

    const images = await prisma.hero_images.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des images hero:', error);

    // Gestion spécifique des erreurs Prisma
    if (error?.code === 'P2021' || error?.code === 'P1001') {
      return NextResponse.json(
        {
          error: 'Table non trouvée',
          details: 'La table "hero_images" n\'existe pas. Exécutez: npx dotenv-cli -e .env.local -- npx prisma db push',
          code: error.code
        },
        { status: 500 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    const errorCode = error?.code || 'UNKNOWN';

    return NextResponse.json(
      { error: 'Erreur serveur', details: errorMessage, code: errorCode },
      { status: 500 }
    );
  }
}

// POST - Créer une image hero
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = heroImageSchema.parse(body);

    const image = await prisma.hero_images.create({
      data: {
        ...validatedData,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création de l\'image hero:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

