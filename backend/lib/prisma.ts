import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configuration Prisma optimisée
const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development'
    ? (['query', 'error', 'warn'] as Prisma.LogLevel[])
    : (['error'] as Prisma.LogLevel[]),
}

// Log connection info (masked) for debug
if (typeof window === 'undefined') {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
    console.log('[Prisma] DATABASE_URL detected:', maskedUrl);
  } else {
    console.warn('[Prisma] DATABASE_URL is not set (expected during build or if using secrets)');
  }
}

// Singleton pattern pour eviter les fuites de connexion
// Important en production (Coolify/Docker) pour garder une seule instance
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions)

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
} else {
  // En production aussi on peut vouloir le singleton si hot-reload ou environnements spécifiques
  if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma
}

