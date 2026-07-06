import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin, getUserPermissions } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CUSTOMER', 'B2B_CUSTOMER']),
  vatNumber: z.string().optional(),
});

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CUSTOMER', 'B2B_CUSTOMER']).optional(),
  vatNumber: z.string().optional(),
  isEmailVerified: z.boolean().optional(),
});

// GET - Liste des utilisateurs
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const where: any = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isEmailVerified: true,
          vatNumber: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
        },
      }),
      prisma.users.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un utilisateur
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

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
    const validatedData = userCreateSchema.parse(body);

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.users.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email: validatedData.email,
        passwordHash,
        name: validatedData.name,
        role: validatedData.role,
        vatNumber: validatedData.vatNumber,
        isEmailVerified: validatedData.role === 'ADMIN' || validatedData.role === 'MANAGER',
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        vatNumber: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

