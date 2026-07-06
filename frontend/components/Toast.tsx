'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  productName?: string;
  productImage?: string;
  quantity?: number;
  totalItems?: number;
}

export function Toast({ isOpen, onClose, message, productName, productImage, quantity, totalItems }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Ferme automatiquement après 4 secondes

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 md:bottom-6 md:left-auto md:right-6 md:translate-x-0"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-[320px] max-w-md">
            <div className="flex items-start gap-4">
              {/* Image du produit */}
              {productImage && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-soft">
                  <img
                    src={productImage}
                    alt={productName || 'Produit'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Contenu */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-black-deep text-sm">
                    {message}
                  </h4>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {productName && (
                  <p className="text-sm text-gray-600 mb-2">
                    {quantity && quantity > 1 ? `${quantity} × ` : ''}{productName}
                  </p>
                )}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-violet-electric font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Ajouté au panier</span>
                  </div>
                  {totalItems !== undefined && totalItems > 0 && (
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-black-deep">{totalItems}</span> article{totalItems > 1 ? 's' : ''} dans le panier
                    </div>
                  )}
                </div>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="mt-3 block w-full text-center px-4 py-2 bg-violet-electric text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-semibold"
                >
                  Voir le panier
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

