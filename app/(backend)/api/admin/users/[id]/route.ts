import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin, getUserPermissions } from '@/backend/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CUSTOMER', 'B2B_CUSTOMER']).optional(),
  vatNumber: z.string().optional(),
  isEmailVerified: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

// GET - Détails d'un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const permissions = getUserPermissions(session.user.role);
    if (!permissions.canManageUsers) {
      return NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        vatNumber: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { orders: true, addresses: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const permissions = getUserPermissions(session.user.role);
    if (!permissions.canManageUsers) {
      return NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = userUpdateSchema.parse(body);

    // Vérifier si l'email existe déjà (si modifié)
    if (validatedData.email) {
      const existingUser = await prisma.users.findFirst({
        where: {
          email: validatedData.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    const updateData: any = { ...validatedData };
    
    // Hasher le mot de passe si fourni
    if (validatedData.password) {
      updateData.passwordHash = await bcrypt.hash(validatedData.password, 12);
      delete updateData.password;
    }

    const user = await prisma.users.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        vatNumber: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const permissions = getUserPermissions(session.user.role);
    if (!permissions.canManageUsers) {
      return NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      );
    }

    // Empêcher la suppression de son propre compte
    if (session.user.id === id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    await prisma.users.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

