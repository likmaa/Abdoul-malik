import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/backend/lib/prisma';
import { notifyAdminNewB2BRequest, sendB2BStatusEmail } from '@/backend/lib/email';

export const dynamic = 'force-dynamic';

const b2bRequestSchema = z.object({
  companyName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  vatNumber: z.string().min(2),
  address: z.string().min(3),
  city: z.string().min(2),
  postalCode: z.string().min(2),
  country: z.string().min(2),
  sector: z.string().min(2),
  annualVolume: z.string().min(1),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = b2bRequestSchema.parse(json);

    const created = await prisma.b2b_requests.create({
      data: {
        id: crypto.randomUUID(),
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        vatNumber: data.vatNumber,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        sector: data.sector,
        annualVolume: data.annualVolume,
        message: data.message,
      },
    });

    // Email de confirmation au B2B (réception)
    await sendB2BStatusEmail({
      to: data.email,
      companyName: data.companyName,
      status: 'PENDING',
    });

    // Notification à l'admin (si configurée)
    await notifyAdminNewB2BRequest({
      companyName: created.companyName,
      email: created.email,
      phone: created.phone,
      vatNumber: created.vatNumber,
      sector: created.sector,
      annualVolume: created.annualVolume,
    });

    return NextResponse.json(
      { success: true, message: 'Demande B2B enregistrée' },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Erreur lors de la création de la demande B2B:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la création de la demande' },
      { status: 500 },
    );
  }
}


