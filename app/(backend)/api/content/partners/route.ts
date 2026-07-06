import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const partners = await prisma.partners.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return new Response(JSON.stringify({ partners }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (err: any) {
    console.error('API ERROR [Partners]:', err);
    return new Response(`ERROR [Partners]: ${err.message}`, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
