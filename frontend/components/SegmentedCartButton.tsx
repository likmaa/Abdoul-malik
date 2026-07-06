'use client';

import { useCart } from '@/frontend/contexts/CartContext';
import { formatPrice, getProductImageUrl } from '@/backend/lib/utils';
import Link from 'next/link';

export function SegmentedCartButton() {
  const { cart, itemsCount, totalTTC } = useCart();

  // Récupérer la dernière image du dernier produit ajouté
  const lastAddedItem = cart.length > 0 ? cart[cart.length - 1] : null;
  const lastImage = lastAddedItem?.image;

  return (
    <div className="inline-flex items-center gap-0 rounded-lg overflow-hidden shadow-lg">
      {/* Partie gauche - Panier (Noir) */}
      <div className="bg-black-deep text-white px-3 py-2.5 flex items-center gap-2">
        <div className="relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {/* Badge avec le nombre d'articles */}
          {itemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-violet-electric text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-black-deep">
              {itemsCount > 99 ? '99+' : itemsCount}
            </span>
          )}
          {/* Image du dernier produit ajouté (seulement si pas de badge) */}
          {lastImage && itemsCount === 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-black-deep overflow-hidden bg-white">
              <img
                src={getProductImageUrl(lastImage)}
                alt="Dernier produit"
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
        {itemsCount > 0 && (
          <span className="text-sm font-semibold">{itemsCount} article{itemsCount > 1 ? 's' : ''}</span>
        )}
        {itemsCount === 0 && (
          <span className="text-xs opacity-75">Panier</span>
        )}
      </div>

      {/* Partie droite - Commander (Orange) */}
      <div className="bg-orange-submit text-black-deep px-4 py-2.5 flex items-center gap-2 text-sm font-medium">
        <span>Commander</span>
        {itemsCount > 0 ? (
          <span className="font-bold text-xs">{formatPrice(totalTTC)}</span>
        ) : (
          <span className="text-xs opacity-75">0,00 €</span>
        )}
      </div>
    </div>
  );
}

