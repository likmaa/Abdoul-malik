import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const testimonials = await prisma.testimonials.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return new Response(JSON.stringify({ testimonials }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (err: any) {
    console.error('API ERROR [Testimonials]:', err);
    return new Response(`ERROR [Testimonials]: ${err.message}`, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
