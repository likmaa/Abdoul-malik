import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';
import { z } from 'zod';

const testimonialSchema = z.object({
  name: z.string().min(1),
  initial: z.string().length(2),
  rating: z.number().int().min(1).max(5),
  text: z.record(z.string(), z.string()), // { fr: "...", en: "..." }
  product: z.string().min(1),
  date: z.string().min(1),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// GET - Liste des témoignages
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.role || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier que le modèle existe
    if (!prisma.testimonials) {
      console.error('Le modèle Testimonial n\'existe pas dans Prisma Client. Exécutez: npx prisma generate');
      return NextResponse.json(
        {
          error: 'Modèle non trouvé',
          details: 'Le modèle Testimonial n\'existe pas. Veuillez exécuter: npx dotenv-cli -e .env.local -- npx prisma generate puis redémarrer le serveur.'
        },
        { status: 500 }
      );
    }

    const testimonials = await prisma.testimonials.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ testimonials });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des témoignages:', error);

    // Gestion spécifique des erreurs Prisma
    if (error?.code === 'P2021' || error?.code === 'P1001') {
      return NextResponse.json(
        {
          error: 'Table non trouvée',
          details: 'La table "testimonials" n\'existe pas. Exécutez: npx dotenv-cli -e .env.local -- npx prisma db push',
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

// POST - Créer un témoignage
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.role || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonials.create({
      data: {
        ...validatedData,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création du témoignage:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

