import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/products/[id] - Récupérer un produit par ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        const product = await prisma.products.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
        }

        // Formater pour le frontend
        const formattedProduct = {
            id: product.id,
            sku: product.sku,
            name: (product.name as any)?.fr || (product.name as any)?.es || product.sku,
            nameObj: product.name, // Objet complet pour i18n
            description: product.description || {},
            priceHT: product.priceHT,
            defaultVATRate: product.defaultVATRate || 0.21,
            vatRate: product.defaultVATRate || 0.21,
            brand: product.brand,
            creator: product.brand,
            category: product.category,
            categoryId: (product as any).categoryId,
            categoryLabel: (product as any).categories?.name?.fr || product.category?.charAt(0).toUpperCase() + product.category?.slice(1),
            stock: product.stock,
            isActive: product.isActive,
            images: (product.images as string[])?.length > 0
                ? (product.images as string[])
                : ['/images/placeholder-product.png'],
            weight: product.weight || 0,
            dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
            attributes: (product as any).attributes || {},
            brandLink: (product as any).brandLink || '',
            features: (product as any).features || [],
            specifications: (product as any).specifications || {},
            deliveryInfo: (product as any).deliveryInfo || {},
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };

        return NextResponse.json({ product: formattedProduct });
    } catch (error) {
        console.error('[API Products] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération du produit' },
            { status: 500 }
        );
    }
}
