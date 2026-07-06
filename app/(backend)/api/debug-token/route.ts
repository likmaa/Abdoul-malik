import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // On reproduit exactement la logique du middleware
    const token =
      (await getToken({
        req: request as any,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: 'authjs.session-token',
      })) ||
      (await getToken({
        req: request as any,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: 'next-auth.session-token',
      }));

    return NextResponse.json({
      hasToken: !!token,
      token,
    });
  } catch (error) {
    return NextResponse.json(
      {
        hasToken: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}


