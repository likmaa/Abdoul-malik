export const locales = ['fr', 'en', 'es', 'de', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';
export const DEFAULT_LANGUAGE = defaultLocale;
export const SUPPORTED_LANGUAGES = locales;