import { NextResponse } from 'next/server';
import { getServerSession } from '@/backend/lib/get-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession();

    return NextResponse.json({
      authenticated: !!session,
      user: session?.user ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        error:
          error instanceof Error ? error.message : 'Unknown error while reading session',
      },
      { status: 500 },
    );
  }
}


