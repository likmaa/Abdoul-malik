'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { formatPrice, getProductImageUrl } from '@/backend/lib/utils';
import { useCart } from '@/frontend/contexts/CartContext';

export default function CartPage() {
  const {
    cart,
    totalHT,
    totalVAT,
    totalTTC,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8 text-sm lg:text-base">
            Découvrez nos produits et commencez vos achats
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg" className="w-full lg:w-auto">
              Voir les produits
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
      <h1 className="text-2xl lg:text-4xl font-bold mb-6 lg:mb-8">Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-3 lg:space-y-4">
          {cart.map((item, index) => {
            const priceTTC = item.priceHT * (1 + item.vatRate);
            const totalItemTTC = priceTTC * item.quantity;

            return (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-3 lg:p-4">
                    <div className="flex gap-3 lg:gap-4">
                      {/* Image - Plus petite sur mobile */}
                      <div className="relative w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-lg flex-shrink-0">
                        {item.image ? (
                          <img
                            src={getProductImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Informations */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-semibold text-sm lg:text-lg mb-1 hover:text-violet-electric line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xs lg:text-sm text-gray-500 mb-1 lg:mb-2">SKU: {item.sku}</p>
                        <p className="text-base lg:text-lg font-bold text-violet-electric">
                          {formatPrice(priceTTC)} × {item.quantity} = {formatPrice(totalItemTTC)}
                        </p>
                      </div>

                      {/* Actions - Optimisé mobile */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-600 hover:text-red-700 text-xs lg:text-sm p-1"
                          aria-label="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 lg:w-9 lg:h-9 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-transform min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0"
                            aria-label="Diminuer la quantité"
                          >
                            -
                          </button>
                          <span className="w-10 lg:w-12 text-center text-sm lg:text-base font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 lg:w-9 lg:h-9 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-transform min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0"
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={clearCart} className="text-sm lg:text-base">
              Vider le panier
            </Button>
          </div>
        </div>

        {/* Résumé - Sticky sur mobile */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <Card>
              <CardContent className="p-4 lg:p-6">
                <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Résumé</h2>

                <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                  <div className="flex justify-between text-sm lg:text-base text-gray-600">
                    <span>Sous-total HT</span>
                    <span>{formatPrice(totalHT)}</span>
                  </div>
                  <div className="flex justify-between text-sm lg:text-base text-gray-600">
                    <span>TVA</span>
                    <span>{formatPrice(totalVAT)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 lg:pt-3 flex justify-between text-lg lg:text-xl font-bold">
                    <span>Total TTC</span>
                    <span className="text-violet-electric">{formatPrice(totalTTC)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="w-full"
                  >
                    <Link href="/checkout" className="block w-full">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full bg-violet-electric hover:bg-violet-700 text-white font-semibold py-4 text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        aria-label="Passer la commande et procéder au paiement"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Passer la commande
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="w-full mt-1"
                  >
                    <Link href="/products" className="block w-full">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-violet-electric text-violet-electric hover:bg-violet-50 hover:border-violet-700 font-medium py-3 text-sm lg:text-base transition-all duration-200 flex items-center justify-center gap-2 bg-white"
                        aria-label="Continuer les achats et retourner à la boutique"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Continuer les achats
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

