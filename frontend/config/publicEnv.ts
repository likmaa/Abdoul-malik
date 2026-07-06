// Variables accessibles côté client (préfixées NEXT_PUBLIC_)
// Important : ne JAMAIS exposer DATABASE_URL / NEXTAUTH_SECRET côté navigateur.

export const publicEnv = {
  BANK_NAME: process.env.NEXT_PUBLIC_BANK_NAME || 'BBVA',
  BANK_IBAN: process.env.NEXT_PUBLIC_BANK_IBAN || 'ES06 0182 5322 2600 0304 6609',
  BANK_BIC: process.env.NEXT_PUBLIC_BANK_BIC || 'BBVAESMM',
  BANK_BENEFICIARY: process.env.NEXT_PUBLIC_BANK_BENEFICIARY || 'ROCIO GUTIÉRREZ',
} as const;


