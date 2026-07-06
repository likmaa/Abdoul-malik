import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { canAccessAdmin, canAccessB2B } from './auth';

/**
 * Vérifie si une route nécessite une authentification
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/admin', '/b2b'];
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Vérifie si une route est publique
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/',
    '/products',
    '/cart',
    '/checkout',
    '/login',
    '/register',
    '/api/auth',
  ];
  return (
    publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public')
  );
}

/**
 * Redirige vers la page de login avec un paramètre de retour
 */
export function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

/**
 * Redirige vers la page non autorisée
 */
export function redirectToUnauthorized(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = '/unauthorized';
  return NextResponse.redirect(url);
}

/**
 * Vérifie l'accès à une route admin
 */
export function checkAdminAccess(userRole: UserRole | null | undefined): boolean {
  return canAccessAdmin(userRole);
}

/**
 * Vérifie l'accès à une route B2B
 */
export function checkB2BAccess(userRole: UserRole | null | undefined): boolean {
  return canAccessB2B(userRole);
}

/**
 * Récupère le rôle utilisateur depuis la session
 * TODO: Implémenter avec NextAuth getServerSession
 */
export async function getUserRole(request: NextRequest): Promise<UserRole | null> {
  // TODO: Récupérer depuis NextAuth session
  // const session = await getServerSession();
  // return session?.user?.role || null;
  
  // Pour l'instant, retourner null (sera implémenté avec NextAuth)
  return null;
}

