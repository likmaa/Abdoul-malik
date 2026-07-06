import { createNavigation } from 'next-intl/navigation';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './i18n/config';

export const locales = SUPPORTED_LANGUAGES;
export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter } = createNavigation({
    locales,
    localePrefix,
    defaultLocale: DEFAULT_LANGUAGE
});
