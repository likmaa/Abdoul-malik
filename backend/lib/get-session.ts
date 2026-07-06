import { auth } from '@/backend/lib/auth-config';

/**
 * Récupère la session utilisateur côté serveur
 */
export async function getSession() {
  return await auth();
}

/**
 * Récupère la session utilisateur (alias pour compatibilité)
 */
export async function getServerSession() {
  return await auth();
}

