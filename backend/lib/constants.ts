export const SUPPORTED_LANGUAGES = ['fr', 'en', 'es', 'de', 'it'] as const;
export type Locale = (typeof SUPPORTED_LANGUAGES)[number];
