import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const orderCreateSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().min(1),
  paymentMethod: z.string().default('virement'),
  items: z.array(z.object({
    productId: z.string(),
    sku: z.string(),
    name: z.string(),
    priceHT: z.number(),
    vatRate: z.number(),
    quantity: z.number(),
  })),
  totalHT: z.number(),
  totalTTC: z.number(),
  vatAmount: z.number(),
  shippingCost: z.number().default(0),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const validatedData = orderCreateSchema.parse(body);

    let userId = session?.user?.id;

    // Si l'utilisateur n'est pas connecté, on gère le "Guest Checkout"
    if (!userId) {
      // 1. Vérifier si un utilisateur existe déjà avec cet email
      const existingUser = await prisma.users.findUnique({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        // Optionnel: On lie la commande à l'utilisateur existant
        // Dans un flux parfait on demanderait de se connecter, 
        // mais pour la simplicité on l'associe d'office
        userId = existingUser.id;
      } else {
        // 2. Créer un nouvel utilisateur (Invisible Registration)
        const newUser = await prisma.users.create({
          data: {
            id: uuidv4(),
            email: validatedData.email,
            name: `${validatedData.firstName} ${validatedData.lastName}`,
            role: 'CUSTOMER',
            passwordHash: "", // Utiliser une chaîne vide au lieu de null pour satisfaire TypeScript
            // Pas de mot de passe, l'utilisateur se connectera via Magic Link ou Social plus tard
          }
        });
        userId = newUser.id;
      }
    }

    // Préparation de l'adresse de livraison pour le stockage en JSON
    const shippingAddress = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      address: validatedData.address,
      city: validatedData.city,
      postalCode: validatedData.postalCode,
      country: validatedData.country,
      phone: validatedData.phone,
    };

    // Création de la commande dans une transaction Prisma
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Créer la commande
      const newOrder = await tx.orders.create({
        data: {
          id: `CMD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`.toUpperCase(),
          userId: userId!,
          status: 'PENDING',
          totalHT: Math.round(validatedData.totalHT),
          totalTTC: Math.round(validatedData.totalTTC),
          vatAmount: Math.round(validatedData.vatAmount),
          shippingCost: Math.round(validatedData.shippingCost),
          shippingAddress,
          paymentMethod: validatedData.paymentMethod,
          paymentIntentId: null as any, // Forcer null si nécessaire, ou utiliser undefined si le type le permet
          order_items: {
            create: validatedData.items.map((item) => ({
              id: uuidv4(),
              productId: item.productId,
              quantity: item.quantity,
              priceHT: Math.round(item.priceHT),
              vatRate: item.vatRate,
            })),
          },
        },
      });

      // 2. Optionnel: On pourrait décrémenter le stock ici, 
      // mais pour le virement on attend souvent le paiement réel.
      // Dans ce projet, on semble le faire au moment du paiement.

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
