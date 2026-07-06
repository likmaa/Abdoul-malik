import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';

// DELETE /api/admin/orders/[id]/delete - Supprimer une commande
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        // Vérifier que l'utilisateur est ADMIN
        if (session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Seuls les administrateurs peuvent supprimer des commandes' },
                { status: 403 }
            );
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID de commande requis' }, { status: 400 });
        }

        // Vérifier que la commande existe
        const order = await prisma.orders.findUnique({
            where: { id },
            include: { order_items: true }
        });

        if (!order) {
            return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
        }

        // Supprimer d'abord les order_items (relation)
        await prisma.order_items.deleteMany({
            where: { orderId: id }
        });

        // Supprimer la commande
        await prisma.orders.delete({
            where: { id }
        });

        console.log(`[Admin] Commande ${id} supprimée par ${session.user.email}`);

        return NextResponse.json({
            success: true,
            message: 'Commande supprimée avec succès'
        });
    } catch (error) {
        console.error('[Admin] Erreur suppression commande:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression de la commande' },
            { status: 500 }
        );
    }
}
