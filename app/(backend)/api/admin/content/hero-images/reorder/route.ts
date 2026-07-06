import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { isAdmin } from '@/backend/lib/auth';
import { z } from 'zod';

const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    order: z.number().int(),
  })),
});

// PATCH - Réordonner les images hero
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { items } = reorderSchema.parse(body);

    await prisma.$transaction(
      items.map((item) =>
        prisma.hero_images.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de la réorganisation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}

