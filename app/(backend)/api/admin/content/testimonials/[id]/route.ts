import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { isAdmin } from '@/backend/lib/auth';
import { z } from 'zod';

const testimonialUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  initial: z.string().length(2).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  text: z.record(z.string(), z.string()).optional(),
  product: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// GET, PUT, DELETE pour les témoignages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const testimonial = await prisma.testimonials.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Témoignage non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = testimonialUpdateSchema.parse(body);

    const testimonial = await prisma.testimonials.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ testimonial });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    await prisma.testimonials.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Témoignage supprimé' });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

