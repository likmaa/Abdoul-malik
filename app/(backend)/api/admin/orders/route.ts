import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Liste des commandes
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        {
          users: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
        {
          users: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const orders = await prisma.orders.findMany({
      where,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

