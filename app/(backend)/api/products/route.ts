import { NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const search = searchParams.get('search');
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam) : 100;

        const where: any = {
            isActive: true
        };

        if (category && category !== 'all') {
            const catIds = category.split(',').filter(id => id.length > 0);

            // Check if we are using UUIDs (IDs) or slugs/names
            const isIdFilter = catIds[0]?.length === 36 || catIds[0]?.includes('-');

            if (isIdFilter) {
                // Find all subcategories for the selected categories to include children in results
                const subcategories = await (prisma as any).categories.findMany({
                    where: { parentId: { in: catIds } },
                    select: { id: true }
                });
                const allSelectedIds = [...catIds, ...subcategories.map((s: any) => s.id)];
                where.categoryId = { in: allSelectedIds };
            } else {
                // If filtering by name/slug, we also include synonyms or linked names if needed
                // For now, keep the simple 'in' filter on the string field
                where.category = { in: catIds };
            }
        }

        if (brand) {
            where.brand = brand;
        }

        if (search) {
            where.OR = [
                { name: { path: ['es'], string_contains: search } },
                { name: { path: ['fr'], string_contains: search } },
                { sku: { contains: search, mode: 'insensitive' } }
            ];
        }

        const products = await prisma.products.findMany({
            where,
            orderBy: {
                updatedAt: 'desc'
            },
            take: limit
        });

        // Transformer le format JSONB de Prisma en objet plat pour le frontend
        const formattedProducts = products.map(p => ({
            id: p.id,
            sku: p.sku,
            name: (p.name as any)?.es || (p.name as any)?.fr || p.sku,
            description: (p.description as any)?.es || (p.description as any)?.fr || "",
            price: (p.priceHT / 100), // Convert cents to euros for mock-compatibility
            image: (p.images as string[])[0] || '/images/placeholder-product.png',
            images: (p.images as string[]).length > 0 ? (p.images as string[]) : ['/images/placeholder-product.png'],
            category: p.category,
            categoryId: (p as any).categoryId,
            brand: p.brand,
            creator: p.brand,
            categoryLabel: p.category.charAt(0).toUpperCase() + p.category.slice(1),
            type: p.category
        }));

        return NextResponse.json({ products: formattedProducts });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
