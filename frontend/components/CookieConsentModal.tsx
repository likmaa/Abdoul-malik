'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

const safeLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  } as any;
};

export function CookieConsentModal() {
  const t = useTranslations('Cookies');
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
  });
  const [mounted, setMounted] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné (uniquement côté client)
    if (!mounted) return;

    const storage = window.localStorage;
    const consent = storage.getItem('cookie-consent');

    if (!consent) {
      // Attendre un peu avant d'afficher le modal
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  const handleAcceptAll = () => {
    const storage = window.localStorage;
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    storage.setItem('cookie-consent', JSON.stringify(allAccepted));
    storage.setItem('cookie-consent-date', new Date().toISOString());
    setIsOpen(false);
    // Ici, vous pouvez initialiser les scripts de tracking
    initializeCookies(allAccepted);
  };

  const handleAcceptSelected = () => {
    const storage = window.localStorage;
    storage.setItem('cookie-consent', JSON.stringify(preferences));
    storage.setItem('cookie-consent-date', new Date().toISOString());
    setIsOpen(false);
    initializeCookies(preferences);
  };

  const handleRejectAll = () => {
    const storage = window.localStorage;
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    storage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    storage.setItem('cookie-consent-date', new Date().toISOString());
    setIsOpen(false);
    initializeCookies(onlyNecessary);
  };

  const initializeCookies = (consent: typeof preferences) => {
    // Initialiser les cookies selon le consentement
    if (consent.analytics) {
      // Initialiser Google Analytics, etc.
      console.log('Analytics cookies activés');
    }
    if (consent.marketing) {
      // Initialiser les cookies marketing
      console.log('Marketing cookies activés');
    }
  };

  // Ne pas rendre le modal avant que le composant soit monté côté client
  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="cookie-modal"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 lg:bottom-4 lg:left-4 lg:right-auto z-50 w-full lg:w-auto lg:max-w-sm transform overflow-hidden rounded-t-2xl lg:rounded-xl bg-white shadow-2xl transition-all border border-gray-200 lg:border-t-0 mb-16 lg:mb-0 max-h-[85vh] lg:max-h-none"
        >
          {/* Header avec gradient */}
          <div className="bg-gradient-to-r from-violet-electric via-purple-600 to-indigo-600 px-4 py-2.5 lg:py-3">
            <h2 className="text-sm lg:text-base font-bold text-white flex items-center gap-2">
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {t('title')}
            </h2>
          </div>

          {/* Contenu */}
          <div className="px-4 py-3 lg:py-4 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto pb-4">
            <p className="text-xs lg:text-sm text-gray-700 mb-3 lg:mb-4 leading-relaxed">
              {t('description')}
            </p>

            {/* Types de cookies */}
            <div className="space-y-2 lg:space-y-3 mb-3 lg:mb-4">
              {/* Cookies nécessaires */}
              <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5 lg:mb-1">
                    <h3 className="text-xs lg:text-sm font-semibold text-gray-900">{t('necessary')}</h3>
                    <span className="text-[10px] lg:text-xs font-medium text-violet-electric bg-violet-50 px-1.5 py-0.5 rounded">
                      {t('active')}
                    </span>
                  </div>
                  <p className="text-[10px] lg:text-xs text-gray-600">
                    {t('necessaryDescription')}
                  </p>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-violet-electric border-gray-300 rounded focus:ring-violet-electric cursor-not-allowed opacity-50"
                  />
                </div>
              </div>

              {/* Cookies analytiques */}
              <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition-colors">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs lg:text-sm font-semibold text-gray-900 mb-0.5 lg:mb-1">{t('analytics')}</h3>
                  <p className="text-[10px] lg:text-xs text-gray-600">
                    {t('analyticsDescription')}
                  </p>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 lg:w-9 lg:h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 lg:after:h-4 lg:after:w-4 after:transition-all peer-checked:bg-violet-electric"></div>
                  </label>
                </div>
              </div>

              {/* Cookies marketing */}
              <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition-colors">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs lg:text-sm font-semibold text-gray-900 mb-0.5 lg:mb-1">{t('marketing')}</h3>
                  <p className="text-[10px] lg:text-xs text-gray-600">
                    {t('marketingDescription')}
                  </p>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 lg:w-9 lg:h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 lg:after:h-4 lg:after:w-4 after:transition-all peer-checked:bg-violet-electric"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Lien vers la politique */}
            <p className="text-[10px] lg:text-xs text-gray-500 mb-3 lg:mb-4">
              {t('policyText')}{' '}
              <a href="/cookies" className="text-violet-electric hover:underline font-medium">
                {t('policyLink')}
              </a>
              .
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-2 pb-20 lg:pb-0">
              <button
                onClick={handleAcceptAll}
                className="w-full px-3 py-2.5 lg:py-2 text-xs font-medium text-white bg-gradient-to-r from-violet-electric to-purple-600 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                {t('acceptAll')}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-3 py-2.5 lg:py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('rejectAll')}
                </button>
                <button
                  onClick={handleAcceptSelected}
                  className="flex-1 px-3 py-2.5 lg:py-2 text-xs font-medium text-white bg-violet-electric rounded-lg hover:bg-violet-700 transition-colors"
                >
                  {t('customize')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

