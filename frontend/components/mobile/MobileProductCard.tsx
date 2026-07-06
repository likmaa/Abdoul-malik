'use client';

import { memo, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/frontend/contexts/CartContext';
import { formatPrice, getProductImageUrl } from '@/backend/lib/utils';

interface MobileProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  creator?: string;
  category?: string;
  onViewProduct?: () => void;
}

export const MobileProductCard = memo(function MobileProductCard({
  id,
  name,
  price,
  image,
  creator,
  category,
  onViewProduct,
}: MobileProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const priceHT = price * 100; // Convertir en centimes
    addToCart({
      productId: id,
      sku: `SKU-${id}`,
      name,
      priceHT,
      vatRate: 0.20,
      image,
    }, 1);
  }, [id, name, price, image, addToCart]);

  const handleViewProduct = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewProduct) {
      onViewProduct();
    }
  }, [onViewProduct]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full active:scale-[0.98]"
    >
      {/* Image - Hauteur similaire au desktop (h-80 = 320px, adapté pour mobile) */}
      <Link href={`/products/${id}`} className="relative w-full h-64 bg-gray-100 overflow-hidden block flex-shrink-0" aria-label={`Voir les détails de ${name}`} style={{ aspectRatio: '1 / 1' }}>
        <img
          src={getProductImageUrl(image)}
          alt={`${name}${creator ? ` par ${creator}` : ''}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Contenu - Hauteur similaire au desktop (min-h-[300px] adapté) */}
      <div className="p-4 flex-1 flex flex-col justify-between min-h-[280px] bg-off-white">
        {/* Section 1: Category + Title - Similaire au desktop */}
        <div className="border-b border-gray-200 pb-3 mb-3">
          {/* Catégorie */}
          {category && (
            <p className="text-xs text-gray-600 mb-2 font-normal">
              {category}
            </p>
          )}

          {/* Nom du produit */}
          <h3 className="font-bold text-base text-black-deep leading-snug line-clamp-2">
            {name}
          </h3>
        </div>

        {/* Section 2: By Creator + Price - Similaire au desktop */}
        <div className="border-b border-gray-200 pb-3 mb-3 flex items-baseline justify-between">
          <div>
            {creator && (
              <>
                <span className="text-sm text-gray-600 font-normal">By </span>
                <span className="text-sm text-black-deep font-medium">{creator}</span>
              </>
            )}
          </div>
          <div className="text-right flex items-baseline">
            <span className="text-sm text-black-deep font-normal">from </span>
            <span className="text-2xl font-bold text-black-deep ml-1">{Math.floor(price)}</span>
            <span className="text-sm text-black-deep font-normal ml-1"> €</span>
          </div>
        </div>

        {/* Section 3: Actions - Similaire au desktop */}
        <div className="pt-1 flex items-center justify-between">
          <button
            onClick={handleViewProduct}
            className="text-sm text-violet-electric hover:underline font-normal"
            aria-label={`Voir les détails de ${name}`}
          >
            Détails
          </button>
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-violet-electric text-white rounded-full hover:bg-violet-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
            aria-label={`Ajouter ${name} au panier`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

