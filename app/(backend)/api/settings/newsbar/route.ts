import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const DEFAULT_TEXT = 'Livraison Gratuite en Europe dès 100€ ⚡️ Nouveaux Robots Husqvarna en stock ⚡️ -10% sur Apple avec le code EJS10 ⚡️';

export async function GET() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const settings = await prisma.site_settings.findUnique({
      where: { id: 'global' },
    });

    return new Response(JSON.stringify({
      newsBarText: settings?.newsBarText || null,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (error: any) {
    console.error('[NewsBar] Erreur:', error);
    return new Response(JSON.stringify({ newsBarText: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    await prisma.$disconnect();
  }
}
