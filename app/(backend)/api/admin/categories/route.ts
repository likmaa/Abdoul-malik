import { NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

// GET all categories for admin (including inactive ones)
export async function GET() {
    const session = await auth();
    if (!session || !canAccessAdmin(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const categories = await (prisma as any).categories.findMany({
            orderBy: {
                order: 'asc',
            },
            include: {
                children: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        const rootCategories = categories.filter((c: any) => !c.parentId);
        return NextResponse.json({
            categories: rootCategories,
            flatCategories: categories
        });
    } catch (error) {
        console.error('Error fetching admin categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

// POST create a new category
export async function POST(request: Request) {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, slug, parentId, order, isActive } = body;

        const category = await (prisma as any).categories.create({
            data: {
                id: crypto.randomUUID(),
                name,
                slug,
                parentId,
                order: order || 0,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
