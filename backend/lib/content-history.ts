import { prisma } from './prisma';

export interface HistoryChange {
  field: string;
  before: any;
  after: any;
}

export async function logContentChange(
  contentType: 'partner' | 'testimonial' | 'heroImage' | 'immersiveImage',
  contentId: string,
  action: 'create' | 'update' | 'delete' | 'toggle_active',
  changes?: HistoryChange[],
  userId?: string,
  userName?: string
) {
  try {
    await prisma.content_history.create({
      data: {
        id: crypto.randomUUID(),
        contentType,
        contentId,
        action,
        changes: changes ? (JSON.parse(JSON.stringify({ changes })) as any) : null,
        userId: userId ?? null,
        userName: userName ?? null,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'historique:', error);
    // Ne pas bloquer l'opération principale en cas d'erreur d'historique
  }
}

export async function getContentHistory(
  contentType: 'partner' | 'testimonial' | 'heroImage' | 'immersiveImage',
  contentId: string
) {
  try {
    return await prisma.content_history.findMany({
      where: {
        contentType,
        contentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limiter à 50 dernières modifications
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return [];
  }
}

