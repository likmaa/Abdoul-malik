// @ts-nocheck
'use client';

import { useState } from 'react';
import { useCart } from '@/frontend/contexts/CartContext';
import { formatPrice, getProductImageUrl } from '@/backend/lib/utils';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import Link from 'next/link';
import { SegmentedCartButton } from './SegmentedCartButton';
import { useTranslations } from 'next-intl';

export function StickyCart() {
  const t = useTranslations('Cart');
  const { cart, itemsCount, totalTTC, updateQuantity, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sticky Button - Desktop (Centré en bas avec bouton segmenté) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="focus:outline-none focus:ring-2 focus:ring-violet-electric focus:ring-offset-2 rounded-lg"
        >
          <SegmentedCartButton />
        </button>
      </div>

      {/* Sticky Button - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full focus:outline-none"
        >
          <SegmentedCartButton />
        </button>
      </div>

      {/* Cart Drawer */}
      {isOpen && (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="w-screen max-w-md transform transition-all">
              <div className="flex h-full flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                  <DialogTitle className="text-lg font-semibold text-black-deep">
                    {t('title')}
                  </DialogTitle>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">{t('empty')}</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => {
                        const priceTTC = item.priceHT * (1 + item.vatRate);
                        return (
                          <div key={item.productId} className="flex gap-4 border-b border-gray-200 pb-4">
                            {item.image && (
                              <div className="relative w-20 h-20 bg-gray-soft rounded-lg flex-shrink-0">
                                <img
                                  src={getProductImageUrl(item.image)}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-black-deep">{item.name}</h4>
                              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                              <p className="text-violet-electric font-semibold mt-1">
                                {formatPrice(priceTTC)} × {item.quantity}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-sm"
                                >
                                  -
                                </button>
                                <span className="text-sm w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-sm"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.productId)}
                                  className="ml-auto text-red-500 text-sm hover:text-red-700"
                                >
                                  {t('remove')}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-gray-200 px-4 py-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-black-deep">Total</span>
                      <span className="text-xl font-bold text-violet-electric">{formatPrice(totalTTC)}</span>
                    </div>
                    <Link
                      href="/cart"
                      onClick={() => setIsOpen(false)}
                      className="block w-full bg-violet-electric text-white text-center py-3 rounded-lg hover:bg-violet-700 transition-colors font-medium"
                    >
                      {t('viewFull')}
                    </Link>
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </>
  );
}
