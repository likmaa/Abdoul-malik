'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Button } from '@/frontend/components/ui/Button';
import { Badge } from '@/frontend/components/ui/Badge';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { formatPrice, calculateTTC, getProductImageUrl } from '@/backend/lib/utils';
import { useCart } from '@/frontend/contexts/CartContext';
import { Toast } from '@/frontend/components/Toast';

interface ProductDetailModalProps {
  product: {
    id: string;
    sku: string;
    name: string;
    creator: string;
    description: {
      fr: string;
      en: string;
    };
    priceHT: number;
    vatRate: number;
    brand: string;
    category: string;
    categoryLabel: string;
    stock: number;
    isActive: boolean;
    images: string[];
    attributes?: Record<string, any>;
    features?: string[];
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { addToCart, itemsCount } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const priceTTC = calculateTTC(product.priceHT, product.vatRate);

  const handleAddToCart = async () => {
    if (product.stock === 0 || !product.isActive) return;

    setIsAdding(true);

    addToCart(
      {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        priceHT: product.priceHT,
        vatRate: product.vatRate,
        image: product.images[0],
      },
      quantity
    );

    await new Promise(resolve => setTimeout(resolve, 300));
    setIsAdding(false);
    setShowToast(true);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" />

        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-6xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-100">
            {/* Header avec bouton X */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
              <h2 className="text-2xl font-bold text-black-deep">{product.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-all p-2 hover:bg-gray-100 rounded-full"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content scrollable */}
            <div className="flex-1 overflow-y-auto bg-gray-50/30">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
                {/* Images */}
                <div>
                  <div className="relative w-full h-[400px] md:h-[500px] bg-gray-100 rounded-2xl mb-4 overflow-hidden group shadow-inner">
                    {product.images[selectedImage] ? (
                      <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                      >
                        <img
                          src={getProductImageUrl(product.images[selectedImage])}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                        />
                      </motion.div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {product.images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === index
                            ? 'border-violet-electric shadow-md scale-105'
                            : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                          <img
                            src={getProductImageUrl(image)}
                            alt={`${product.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="flex flex-col">
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2 font-medium">{product.creator || product.brand}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="text-sm text-gray-500 font-normal">from </span>
                        <span className="text-5xl font-bold text-black-deep">{Math.floor(priceTTC / 100)}</span>
                        <span className="text-xl text-gray-500 font-normal"> €</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        HT: {formatPrice(product.priceHT)} (TVA incl.)
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                      {product.stock > 0 ? (
                        <Badge variant="success" className="text-sm px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          En stock ({product.stock} disponibles)
                        </Badge>
                      ) : (
                        <Badge variant="error" className="text-sm px-3 py-1.5">Rupture de stock</Badge>
                      )}
                      <Badge variant="info" className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200">SKU: {product.sku}</Badge>
                      <span className="text-xs text-gray-500 bg-gray-100/80 px-3 py-1.5 rounded-full border border-gray-200/50">
                        {product.categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div
                      className="text-gray-600 leading-relaxed text-base prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: (product.description?.fr || '')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/\n/g, '<br />')
                      }}
                    />
                  </div>

                  {product.features && (
                    <Card className="mb-6 bg-gradient-to-br from-gray-50/50 to-white border-gray-200/50 shadow-sm">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-base mb-4 text-gray-800">Points forts</h3>
                        <ul className="space-y-3">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-violet-electric/70 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600 leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Ajout au panier */}
                  <div className="space-y-6 mb-6">
                    <div className="flex items-center gap-4">
                      <label className="font-semibold text-black-deep">Quantité:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-12 h-12 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:border-violet-400 transition-all font-semibold text-lg text-gray-600 hover:text-violet-electric"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={product.stock}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-xl text-center font-semibold focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none bg-white"
                        />
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="w-12 h-12 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:border-violet-400 transition-all font-semibold text-lg text-gray-600 hover:text-violet-electric"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        {product.stock} disponible{product.stock > 1 ? 's' : ''}
                      </span>
                    </div>

                    <motion.div
                      whileHover={{ scale: product.stock > 0 && product.isActive ? 1.02 : 1 }}
                      whileTap={{ scale: product.stock > 0 && product.isActive ? 0.98 : 1 }}
                    >
                      <Button
                        variant="primary"
                        size="lg"
                        className={`w-full bg-violet-electric hover:bg-violet-600 text-white py-4 text-lg font-semibold rounded-xl transition-all shadow-md hover:shadow-lg ${isAdding ? 'opacity-75 cursor-wait' : ''
                          }`}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || !product.isActive || isAdding}
                      >
                        {isAdding ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Ajout en cours...
                          </span>
                        ) : product.stock > 0 ? (
                          `Ajouter ${quantity > 1 ? `${quantity} × ` : ''}au panier`
                        ) : (
                          'Rupture de stock'
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Tabs */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex gap-4 mb-4 border-b border-gray-200">
                      {[
                        { id: 'description', label: 'Description' },
                        { id: 'specs', label: 'Spécifications' },
                        { id: 'shipping', label: 'Livraison' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`pb-3 px-3 font-medium transition-all border-b-2 ${activeTab === tab.id
                            ? 'border-violet-electric text-violet-electric'
                            : 'border-transparent text-gray-500 hover:text-violet-600 hover:border-gray-200'
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="min-h-[200px]">
                      {activeTab === 'description' && (
                        <div>
                          <div
                            className="text-gray-600 leading-relaxed mb-6 text-base prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: (product.description?.fr || '')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/\n/g, '<br />')
                            }}
                          />
                          {product.features && (
                            <ul className="space-y-3">
                              {product.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-600">
                                  <svg className="w-2 h-2 text-violet-electric/70 mt-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                  <span className="leading-relaxed">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {activeTab === 'specs' && product.attributes && (
                        <div>
                          <dl className="grid grid-cols-2 gap-4">
                            {Object.entries(product.attributes).map(([key, value]) => (
                              <div key={key} className="border-b border-gray-100 pb-3">
                                <dt className="text-sm text-gray-500 mb-1 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </dt>
                                <dd className="font-semibold text-black-deep">{String(value)}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}

                      {activeTab === 'shipping' && (
                        <div className="space-y-4 text-gray-700">
                          <div>
                            <h4 className="font-semibold mb-2">Livraison</h4>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-start gap-2">
                                <svg className="w-2 h-2 text-gray-400 mt-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>Livraison gratuite à partir de 100€</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg className="w-2 h-2 text-gray-400 mt-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>Délai : 2-3 jours ouvrables</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg className="w-2 h-2 text-gray-400 mt-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>Suivi en temps réel</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Retours</h4>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-start gap-2">
                                <svg className="w-2 h-2 text-gray-400 mt-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>30 jours pour retourner</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <svg className="w-2 h-2 text-gray-400 mt-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>Remboursement sous 14 jours</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Toast de confirmation */}
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message="Produit ajouté au panier"
        productName={product.name}
        productImage={product.images[0]}
        quantity={quantity}
        totalItems={itemsCount}
      />
    </>
  );
}

