import { NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin } from '@/backend/lib/auth';

// PUT update a category
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || !canAccessAdmin(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, slug, parentId, order, isActive } = body;

        const category = await prisma.categories.update({
            where: { id },
            data: {
                name,
                slug,
                parentId,
                order: order || 0,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

// DELETE a category
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Check if there are subcategories
        const subcategories = await prisma.categories.count({
            where: { parentId: id },
        });

        if (subcategories > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with subcategories' },
                { status: 400 }
            );
        }

        // Check if there are products
        const products = await prisma.products.count({
            where: { categoryId: id },
        });

        if (products > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with products' },
                { status: 400 }
            );
        }

        await prisma.categories.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
