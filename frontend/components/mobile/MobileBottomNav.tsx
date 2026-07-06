'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MobileSidebar } from './MobileSidebar';
import { useTranslations } from 'next-intl';

interface NavItem {
  name: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
  matchPattern?: (pathname: string) => boolean;
  onClick?: () => void;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const t = useTranslations('MobileNav');

  const navItems: NavItem[] = [
    {
      name: t('home'),
      href: '/',
      icon: (active) => (
        <svg
          className={`w-6 h-6 transition-colors ${active ? 'text-violet-electric' : 'text-white/60'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 2.5 : 2}
            d={active ? "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" : "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"}
          />
        </svg>
      ),
      matchPattern: (path) => path === '/',
    },
    {
      name: "Blog",
      href: '/blog',
      icon: (active) => (
        <svg
          className={`w-6 h-6 transition-colors ${active ? 'text-violet-electric' : 'text-white/60'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 2.5 : 2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
      matchPattern: (path) => path.startsWith('/blog'),
    },
    {
      name: "Me Contacter",
      href: '/contact',
      icon: (active) => (
        <svg
          className={`w-6 h-6 transition-colors ${active ? 'text-violet-electric' : 'text-gray-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 2.5 : 2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      matchPattern: (path) => path === '/contact',
    },
  ];

  const isActive = (item: NavItem) => {
    // Pour le bouton burger, on considère qu'il est actif si la sidebar est ouverte
    if (item.onClick && isSidebarOpen) {
      return true;
    }
    if (item.matchPattern) {
      return item.matchPattern(pathname);
    }
    if (item.href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(item.href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-4 left-4 right-4 z-50 bg-[#111113]/90 backdrop-blur-xl border border-white/10 rounded-2xl lg:hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] mb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item);

            const isLoading = loadingHref === item.href;
            const isClickable = !item.onClick && item.href !== '#';

            const handleClick = async (e: React.MouseEvent) => {
              if (item.onClick) {
                item.onClick();
                return;
              }

              if (!isClickable) return;

              e.preventDefault();
              setLoadingHref(item.href);

              // Simuler un délai de chargement
              await new Promise(resolve => setTimeout(resolve, 300));

              // Naviguer vers la page
              router.push(item.href);

              // Réinitialiser après un court délai
              setTimeout(() => {
                setLoadingHref(null);
              }, 500);
            };

            const content = (
              <div className="flex flex-col items-center justify-center flex-1 min-w-0 px-2 py-1 relative">
                <motion.div
                  whileTap={{ scale: isLoading ? 1 : 0.9 }}
                  className="relative"
                >
                  {isLoading ? (
                    <svg className="w-6 h-6 animate-spin text-violet-electric" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    item.icon(active)
                  )}
                </motion.div>
                <motion.span
                  className={`text-xs mt-0.5 font-medium transition-colors relative inline-block ${active ? 'text-violet-electric' : isLoading ? 'text-violet-electric' : 'text-gray-500'
                    }`}
                  animate={{ fontWeight: active || isLoading ? 600 : 500 }}
                >
                  {item.name}
                  {/* Soulignement actif sous le texte */}
                  {(active || isLoading) && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-electric rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  )}
                </motion.span>
              </div>
            );

            if (item.onClick) {
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="flex-1 min-w-0"
                  disabled={isLoading}
                >
                  {content}
                </button>
              );
            }

            if (isClickable) {
              return (
                <button
                  key={item.name}
                  onClick={handleClick}
                  className="flex-1 min-w-0"
                  disabled={isLoading}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex-1 min-w-0"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* Sidebar */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}

