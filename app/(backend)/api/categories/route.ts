import { NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const categories = await (prisma as any).categories.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                order: 'asc',
            },
            include: {
                children: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        // Filter to only return top-level categories at the root
        const rootCategories = categories.filter((c: any) => !c.parentId);

        return NextResponse.json({ categories: rootCategories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
