'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useTranslations } from 'next-intl';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const router = useRouter();
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const t = useTranslations('MobileSidebar');

  const menuItems = [
    {
      name: t('bePro'),
      href: '/be-pro',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      name: t('trackOrder'),
      href: '/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      name: t('blog'),
      href: '/blog',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: t('language'),
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLanguageOpen(!isLanguageOpen);
      },
    },
    {
      name: t('helpSupport'),
      href: '/help',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: t('about'),
      href: '/about',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/50 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in data-[enter]:duration-300 data-[leave]:duration-200"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <DialogPanel
          transition
          className="w-screen max-w-sm bg-white shadow-xl flex flex-col data-[closed]:translate-x-full data-[enter]:ease-in-out data-[leave]:ease-in-out data-[enter]:duration-300 data-[leave]:duration-300 transform transition-transform"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-bold text-black-deep">{t('menu')}</h2>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-4">
              {menuItems.map((item) => {
                const isLoading = loadingItem === item.name;
                const isLanguageItem = item.name === 'Langue';

                const handleClick = async (e: React.MouseEvent) => {
                  if (item.onClick) {
                    item.onClick(e);
                    return;
                  }

                  e.preventDefault();
                  setLoadingItem(item.name);

                  // Simuler un délai de chargement
                  await new Promise(resolve => setTimeout(resolve, 300));

                  // Naviguer vers la page
                  router.push(item.href);

                  // Fermer la sidebar après un court délai
                  setTimeout(() => {
                    onClose();
                    setLoadingItem(null);
                  }, 100);
                };

                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={handleClick}
                      disabled={isLoading}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-violet-50 hover:text-violet-electric transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-gray-400 group-hover:text-violet-electric transition-colors flex-shrink-0">
                        {isLoading ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          item.icon
                        )}
                      </span>
                      <span className="font-medium text-left flex-1">{item.name}</span>
                      {isLanguageItem && (
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                      {isLoading && (
                        <span className="text-xs text-gray-400">{t('loading')}</span>
                      )}
                    </button>

                    {/* Dropdown des langues */}
                    {isLanguageItem && (
                      <AnimatePresence>
                        {isLanguageOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-12 pr-4 pb-2 space-y-1">
                              {languages.map((lang) => (
                                <button
                                  key={lang.code}
                                  onClick={() => {
                                    setSelectedLanguage(lang.code);
                                    setIsLanguageOpen(false);
                                    // Ici vous pouvez ajouter la logique pour changer la langue
                                    console.log('Langue sélectionnée:', lang.code);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${selectedLanguage === lang.code
                                      ? 'bg-violet-electric text-white'
                                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                  <span className="text-lg">{lang.flag}</span>
                                  <span className="font-medium">{lang.label}</span>
                                  {selectedLanguage === lang.code && (
                                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 space-y-3">
            <p className="text-xs text-gray-500 text-center">
              © 2024 eJS MARKET
            </p>
            {/* Bouton X pour fermer */}
            <button
              onClick={onClose}
              className="w-full p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 font-medium"
              aria-label={t('closeAriaLabel')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{t('close')}</span>
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

