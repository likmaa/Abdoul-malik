import { getRequestConfig } from 'next-intl/server';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
    // Get the locale from the request
    const locale = await requestLocale;

    // Validate and fallback to 'es' if not valid
    const activeLocale = (locale && SUPPORTED_LANGUAGES.includes(locale as any))
        ? locale
        : DEFAULT_LANGUAGE;

    console.log('[i18n/request] Loading messages for locale:', activeLocale);

    return {
        locale: activeLocale,
        messages: (await import(`../messages/${activeLocale}.json`)).default
    };
});
