import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Vous devez être connecté' },
                { status: 401 }
            );
        }

        const order = await prisma.orders.findUnique({
            where: { id },
            include: {
                order_items: {
                    include: {
                        products: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                images: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Commande non trouvée' },
                { status: 404 }
            );
        }

        // Vérifier que la commande appartient bien à l'utilisateur
        if (order.userId !== session.user.id) {
            // On autorise aussi les admins à voir n'importe quelle commande via cette route (optionnel)
            if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
                return NextResponse.json(
                    { error: 'Non autorisé' },
                    { status: 403 }
                );
            }
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
