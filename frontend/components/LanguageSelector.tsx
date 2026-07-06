'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n-navigation';
import { useLocale } from 'next-intl';

// Hardcoded for robustness in client component
const SUPPORTED_LANGS = ['fr', 'en', 'es', 'de', 'it'];

const languageNames: Record<string, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
};

const languageFlags: Record<string, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
};

interface LanguageSelectorProps {
  variant?: 'default' | 'light';
}

export function LanguageSelector({ variant = 'default' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLight = variant === 'light';

  // Debugging
  useEffect(() => {
    console.log('[LanguageSelector] Current locale:', locale);
    console.log('[LanguageSelector] Current pathname:', pathname);
    console.log('[LanguageSelector] Supported languages:', SUPPORTED_LANGS);
  }, [locale, pathname]);

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLanguageChange = (nextLocale: string) => {
    console.log('[LanguageSelector] Changing to:', nextLocale);
    console.log('[LanguageSelector] Current locale:', locale);
    setIsOpen(false);

    // Set the NEXT_LOCALE cookie to persist the language choice
    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
    console.log('[LanguageSelector] Set cookie NEXT_LOCALE=', nextLocale);

    // Get the current full path
    const currentPath = window.location.pathname;
    console.log('[LanguageSelector] Current path:', currentPath);

    // Remove any existing locale prefix from the path
    let pathWithoutLocale = currentPath;
    for (const lang of SUPPORTED_LANGS) {
      if (currentPath.startsWith(`/${lang}/`)) {
        // Remove /lang/ (length = lang.length + 2 for the two slashes, but we keep the trailing part)
        pathWithoutLocale = currentPath.substring(lang.length + 1);
        console.log('[LanguageSelector] Removed prefix /' + lang + '/, pathWithoutLocale:', pathWithoutLocale);
        break;
      } else if (currentPath === `/${lang}`) {
        pathWithoutLocale = '/';
        console.log('[LanguageSelector] Path was exactly /' + lang + ', set to /');
        break;
      }
    }

    // Ensure path starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }

    // Build the new path
    let newPath: string;
    if (nextLocale === 'es') {
      // Default locale doesn't need prefix
      newPath = pathWithoutLocale;
    } else {
      newPath = `/${nextLocale}${pathWithoutLocale}`;
    }

    // Clean up double slashes
    newPath = newPath.replace(/\/+/g, '/');

    // Remove trailing slash except for root
    if (newPath !== '/' && newPath.endsWith('/')) {
      newPath = newPath.slice(0, -1);
    }

    console.log('[LanguageSelector] Final navigation path:', newPath);
    window.location.href = newPath;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${isLight
          ? 'text-white hover:bg-white/10'
          : 'text-black-deep hover:bg-gray-100'
          }`}
        aria-label="Choisir la langue"
      >
        <span className="text-lg">{languageFlags[locale] || '🌐'}</span>
        <span className="hidden sm:inline uppercase">{locale}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]"
          onClick={(e) => e.stopPropagation()}
        >
          {SUPPORTED_LANGS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[LanguageSelector] Button clicked for lang:', lang);
                handleLanguageChange(lang);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${locale === lang ? 'bg-violet-50 text-violet-electric' : 'text-black-deep'
                }`}
            >
              <span className="text-xl">{languageFlags[lang]}</span>
              <span className="font-medium">{languageNames[lang]}</span>
              {locale === lang && (
                <svg
                  className="w-4 h-4 ml-auto text-violet-electric"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
