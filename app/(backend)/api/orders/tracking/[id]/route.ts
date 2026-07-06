import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';

// API publique pour le suivi de commande
// Accessible sans authentification, mais avec des données limitées
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'ID de commande requis' },
                { status: 400 }
            );
        }

        // Rechercher la commande
        const order = await prisma.orders.findUnique({
            where: { id },
            include: {
                order_items: {
                    include: {
                        products: {
                            select: {
                                name: true,
                                images: true,
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Commande non trouvée' },
                { status: 404 }
            );
        }

        // Retourner seulement les informations nécessaires au tracking (pas de données sensibles)
        const safeOrder = {
            id: order.id,
            status: order.status,
            totalTTC: order.totalTTC,
            trackingNumber: order.trackingNumber,
            createdAt: order.createdAt,
            // Adresse partielle (sans les détails complets pour la confidentialité)
            shippingAddress: order.shippingAddress ? {
                city: (order.shippingAddress as any).city,
                country: (order.shippingAddress as any).country,
            } : null,
            // Articles de la commande
            items: order.order_items.map((item) => ({
                name: item.products?.name || 'Produit',
                quantity: item.quantity,
                priceTTC: Math.round(item.priceHT * (1 + item.vatRate)),
                image: item.products?.images?.[0] || null,
            })),
        };

        return NextResponse.json({ order: safeOrder });
    } catch (error) {
        console.error('[Tracking API] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération de la commande' },
            { status: 500 }
        );
    }
}
