import { NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { auth } from '@/backend/lib/auth-config';
import { canAccessAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const requests = await prisma.b2b_requests.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes B2B:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des demandes B2B' },
      { status: 500 },
    );
  }
}


