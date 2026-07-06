// Validation des variables d'environnement avec Zod

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // NextAuth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),

  // Bank Details (pour virement)
  NEXT_PUBLIC_BANK_NAME: z.string().optional(),
  NEXT_PUBLIC_BANK_IBAN: z.string().optional(),
  NEXT_PUBLIC_BANK_BIC: z.string().optional(),
  NEXT_PUBLIC_BANK_BENEFICIARY: z.string().optional(),

  // Algolia (optionnel - recherche)
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().optional(),
  NEXT_PUBLIC_ALGOLIA_API_KEY: z.string().optional(),
  ALGOLIA_ADMIN_API_KEY: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

// Validation au runtime (en développement)
if (process.env.NODE_ENV !== 'production') {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
}

// Export des variables validées
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  // Bank Details
  BANK_NAME: process.env.NEXT_PUBLIC_BANK_NAME || 'BBVA',
  BANK_IBAN: process.env.NEXT_PUBLIC_BANK_IBAN || 'ES06 0182 5322 2600 0304 6609',
  BANK_BIC: process.env.NEXT_PUBLIC_BANK_BIC || 'BBVAESMM',
  BANK_BENEFICIARY: process.env.NEXT_PUBLIC_BANK_BENEFICIARY || 'ROCIO GUTIÉRREZ',
  // Algolia
  NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_API_KEY: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
  ALGOLIA_ADMIN_API_KEY: process.env.ALGOLIA_ADMIN_API_KEY,
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
} as const;

