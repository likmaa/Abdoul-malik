import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        const counts = {
            users: await prisma.users.count(),
            testimonials: await prisma.testimonials.count(),
            partners: await prisma.partners.count(),
            hero_images: await prisma.hero_images.count(),
            immersive_images: await prisma.immersive_images.count(),
            site_settings: await prisma.site_settings.count(),
        };

        return NextResponse.json({
            status: 'success',
            version: '2026-01-04-V5-FINAL-ROBUST',
            counts,
            env: {
                DATABASE_URL_SET: !!process.env.DATABASE_URL,
                NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
                NODE_ENV: process.env.NODE_ENV,
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
