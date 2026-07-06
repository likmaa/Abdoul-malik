'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/frontend/contexts/CartContext';
import { MobileSearchBar } from './MobileSearchBar';
import { MegaMenu } from '../MegaMenu';
import { mockProducts } from '@/backend/lib/mockProducts';

export function MobileHeader() {
  const pathname = usePathname();
  const { itemsCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  // Convertir les produits mockés au format attendu par MobileSearchBar
  const products = mockProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    categoryLabel: p.categoryLabel,
  }));

  return (
    <>
      <header className="lg:hidden sticky top-0 z-[100] bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo à gauche */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.webp"
              alt="eJS MARKET"
              className="h-8 w-auto"
            />
          </Link>

          {/* Bouton Explorer au centre */}
          <button
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="flex items-center gap-1 text-gray-700 hover:text-violet-electric transition-colors font-medium text-sm absolute left-1/2 transform -translate-x-1/2"
          >
            Explorer
            <svg
              className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Actions à droite */}
          <div className="flex items-center gap-3">
            {/* Recherche */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-600 hover:text-violet-electric transition-colors"
              aria-label="Rechercher"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Panier */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-violet-electric transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-violet-electric text-white text-xs rounded-full min-w-[18px] h-4.5 flex items-center justify-center font-bold px-1 border-2 border-white">
                  {itemsCount > 99 ? '99+' : itemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MegaMenu */}
        {isMegaMenuOpen && (
          <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />
        )}
      </header>

      {/* Modal de recherche */}
      <MobileSearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
      />
    </>
  );
}

