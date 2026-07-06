import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { canAccessAdmin } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Récupérer les notifications (nouvelles commandes)
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
        const lastSeenId = searchParams.get('lastSeenId');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Récupérer les commandes récentes
        const recentOrders = await prisma.orders.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                status: true,
                totalTTC: true,
                createdAt: true,
                users: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        });

        // Compter les nouvelles commandes depuis la dernière vue
        let newCount = 0;
        if (lastSeenId) {
            const lastSeenOrder = await prisma.orders.findUnique({
                where: { id: lastSeenId },
                select: { createdAt: true }
            });

            if (lastSeenOrder) {
                newCount = await prisma.orders.count({
                    where: {
                        createdAt: { gt: lastSeenOrder.createdAt }
                    }
                });
            }
        } else {
            // Si pas de lastSeenId, compter les commandes des dernières 24h
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            newCount = await prisma.orders.count({
                where: {
                    createdAt: { gt: yesterday },
                    status: 'PENDING'
                }
            });
        }

        // Formater les notifications
        const notifications = recentOrders.map((order, index) => ({
            id: order.id,
            type: 'new_order',
            title: `Nouvelle commande #${order.id.slice(-8).toUpperCase()}`,
            message: `${order.users?.name || order.users?.email || 'Client'} - ${(order.totalTTC / 100).toFixed(2)}€`,
            status: order.status.toLowerCase(),
            createdAt: order.createdAt,
            link: `/admin/orders/${order.id}`
        }));

        return NextResponse.json({
            notifications,
            newCount,
            latestId: recentOrders[0]?.id || null
        });
    } catch (error) {
        console.error('Erreur récupération notifications:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

