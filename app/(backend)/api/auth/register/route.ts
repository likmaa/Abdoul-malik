import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  vatNumber: z.string().optional(), // Pour B2B
  role: z.enum(['CUSTOMER', 'B2B_CUSTOMER']).default('CUSTOMER'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Vérifier si l'utilisateur existe déjà
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

    // Créer l'utilisateur
    const user = await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email: validatedData.email,
        passwordHash,
        name: validatedData.name,
        role: validatedData.role,
        vatNumber: validatedData.vatNumber,
        isEmailVerified: false,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(
      { message: 'Compte créé avec succès', user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création du compte:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
}

