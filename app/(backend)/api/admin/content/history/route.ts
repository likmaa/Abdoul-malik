import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { isAdmin } from '@/backend/lib/auth';
import { getContentHistory } from '@/backend/lib/content-history';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const historyQuerySchema = z.object({
  contentType: z.enum(['partner', 'testimonial', 'heroImage', 'immersiveImage']),
  contentId: z.string(),
});

// GET - Récupérer l'historique d'un contenu
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
    const contentType = searchParams.get('contentType');
    const contentId = searchParams.get('contentId');

    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: 'contentType et contentId sont requis' },
        { status: 400 }
      );
    }

    const validated = historyQuerySchema.parse({ contentType, contentId });
    const history = await getContentHistory(validated.contentType, validated.contentId);

    return NextResponse.json({ history });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la récupération de l\'historique:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

