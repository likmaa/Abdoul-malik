import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { isAdmin } from '@/backend/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const partnerSchema = z.object({
  name: z.string().min(1),
  logoPath: z.string().min(1),
  cdnUrl: z.string().url().optional().or(z.literal('')).nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  alt: z.string().min(1),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// GET - Liste des partenaires
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent gérer le contenu.' },
        { status: 403 }
      );
    }

    // Vérifier que le modèle existe
    if (!prisma.partners) {
      console.error('Le modèle Partner n\'existe pas dans Prisma Client. Exécutez: npx prisma generate');
      return NextResponse.json(
        {
          error: 'Modèle non trouvé',
          details: 'Le modèle Partner n\'existe pas. Veuillez exécuter: npx dotenv-cli -e .env.local -- npx prisma generate puis redémarrer le serveur.'
        },
        { status: 500 }
      );
    }

    const partners = await prisma.partners.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ partners });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des partenaires:', error);

    // Gestion spécifique des erreurs Prisma
    if (error?.code === 'P2021' || error?.code === 'P1001') {
      return NextResponse.json(
        {
          error: 'Table non trouvée',
          details: 'La table "partners" n\'existe pas. Exécutez: npx dotenv-cli -e .env.local -- npx prisma db push',
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

// POST - Créer un partenaire
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent gérer le contenu.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = partnerSchema.parse(body);

    const partner = await prisma.partners.create({
      data: {
        ...validatedData,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ partner }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création du partenaire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

