import { z } from 'zod';

// Validation pour les produits
export const productSchema = z.object({
  sku: z.string().min(1, 'SKU requis'),
  name: z.record(z.string(), z.string()), // { fr: "...", en: "..." }
  description: z.record(z.string(), z.string()).optional(),
  priceHT: z.number().positive('Le prix doit être positif'),
  defaultVATRate: z.number().min(0).max(1, 'Taux TVA entre 0 et 1'),
  weight: z.number().positive('Le poids doit être positif'),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  stock: z.number().int().min(0, 'Stock ne peut pas être négatif'),
  brand: z.string().min(1, 'Marque requise'),
  category: z.enum(['electronics', 'garden', 'photo', 'mobility', 'tools']),
  images: z.array(z.string().url()).min(1, 'Au moins une image requise'),
  attributes: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
});

// Validation pour les utilisateurs
export const userSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().optional(),
  vatNumber: z.string().optional(),
});

// Validation pour les commandes
export const orderSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().length(2, 'Code pays à 2 lettres'),
    phone: z.string().optional(),
  }),
  billingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().length(2),
    phone: z.string().optional(),
  }).optional(),
});

