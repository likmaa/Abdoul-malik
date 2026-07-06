import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { isAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';
import { z } from 'zod';

const immersiveImageSchema = z.object({
  name: z.string().min(1),
  mediaType: z.enum(['image', 'video']).default('image'),
  imageUrl: z.string().min(1).optional().nullable(),
  videoUrl: z.string().min(1).optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  productId: z.string().uuid().optional().nullable(),
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

// GET - Liste des images immersives
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier que le modèle existe
    if (!prisma.immersive_images) {
      console.error('Le modèle ImmersiveImage n\'existe pas dans Prisma Client. Exécutez: npx prisma generate');
      return NextResponse.json(
        {
          error: 'Modèle non trouvé',
          details: 'Le modèle ImmersiveImage n\'existe pas. Veuillez exécuter: npx dotenv-cli -e .env.local -- npx prisma generate puis redémarrer le serveur.'
        },
        { status: 500 }
      );
    }

    const images = await prisma.immersive_images.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des images immersives:', error);

    // Gestion spécifique des erreurs Prisma
    if (error?.code === 'P2021' || error?.code === 'P1001') {
      return NextResponse.json(
        {
          error: 'Table non trouvée',
          details: 'La table "immersive_images" n\'existe pas. Exécutez: npx dotenv-cli -e .env.local -- npx prisma db push',
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

// POST - Créer une image immersive
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
    const validatedData = immersiveImageSchema.parse(body);

    const image = await prisma.immersive_images.create({
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

    console.error('Erreur lors de la création de l\'image immersive:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

