import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/backend/lib/prisma';
import { auth } from '@/backend/lib/auth-config';
import { canAccessAdmin } from '@/backend/lib/auth';
import { sendB2BStatusEmail } from '@/backend/lib/email';

const statusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
});

export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const session = await auth();
    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { status } = statusSchema.parse(body);

    const existing = await prisma.b2b_requests.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 });
    }

    const updated = await prisma.b2b_requests.update({
      where: { id: params.id },
      data: { status },
    });

    // Email au B2B pour l'informer du changement de statut
    await sendB2BStatusEmail({
      to: updated.email,
      companyName: updated.companyName,
      status,
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Erreur lors de la mise à jour du statut B2B:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du statut' },
      { status: 500 },
    );
  }
}


