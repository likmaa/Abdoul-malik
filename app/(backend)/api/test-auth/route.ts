import { NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    return NextResponse.json({
      success: true,
      nextAuthUrl: process.env.NEXTAUTH_URL || 'not set',
      nextAuthSecret: process.env.NEXTAUTH_SECRET
        ? 'set (' + process.env.NEXTAUTH_SECRET.length + ' chars)'
        : 'not set',
      databaseUrl: process.env.DATABASE_URL ? 'set' : 'not set',
      authenticated: !!session,
      user: session?.user ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

