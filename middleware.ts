import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES, defaultLocale } from './i18n/config';

// Mapping pays → langue
const COUNTRY_TO_LOCALE: Record<string, string> = {
  ES: 'es', // Espagne
  FR: 'fr', // France
  BE: 'fr', // Belgique (francophone par défaut)
  CH: 'de', // Suisse (germanophone par défaut)
  DE: 'de', // Allemagne
  AT: 'de', // Autriche
  IT: 'it', // Italie
  PT: 'es', // Portugal (espagnol proche)
  GB: 'en', // Royaume-Uni
  US: 'en', // États-Unis
  CA: 'en', // Canada (anglais par défaut)
  MX: 'es', // Mexique
  AR: 'es', // Argentine
  CL: 'es', // Chili
  CO: 'es', // Colombie
  PE: 'es', // Pérou
  VE: 'es', // Venezuela
};

const intlMiddleware = createMiddleware({
  locales: SUPPORTED_LANGUAGES,
  defaultLocale: defaultLocale,
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Si l'URL contient déjà une locale explicite, on laisse passer
  const hasLocalePrefix = SUPPORTED_LANGUAGES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocalePrefix) {
    return intlMiddleware(request);
  }

  // Vérifier si l'utilisateur a déjà une préférence enregistrée
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie && SUPPORTED_LANGUAGES.includes(localeCookie as any)) {
    return intlMiddleware(request);
  }

  // Détecter le pays via les headers (Vercel, Cloudflare, etc.)
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    null;

  if (country && COUNTRY_TO_LOCALE[country]) {
    const detectedLocale = COUNTRY_TO_LOCALE[country];

    // Seulement rediriger si la locale détectée n'est pas la locale par défaut
        if (detectedLocale !== defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${detectedLocale}${pathname}`;

      const response = NextResponse.redirect(url);
      // Sauvegarder la préférence pour les prochaines visites
      response.cookies.set('NEXT_LOCALE', detectedLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 an
        path: '/'
      });
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|uploads|.*\\..*).*)', '/']
};

