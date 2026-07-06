'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatPrice, calculateTTC, getProductImageUrl } from '@/backend/lib/utils';
import { useCart } from '@/frontend/contexts/CartContext';

interface QuickViewModalProps {
  product: {
    id: string;
    sku: string;
    name: string;
    description?: string;
    priceHT: number;
    vatRate: number;
    images?: string[];
    brand: string;
    stock: number;
    isActive: boolean;
    attributes?: Record<string, any>;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const priceTTC = calculateTTC(product.priceHT, product.vatRate);
  const images = product.images || [];

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        priceHT: product.priceHT,
        vatRate: product.vatRate,
        image: images[0],
      },
      quantity
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <DialogTitle className="text-xl font-bold text-black-deep">
              {product.name}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Images */}
              <div>
                <div className="relative w-full h-64 md:h-96 bg-gray-soft rounded-lg mb-4" style={{ aspectRatio: '4 / 3' }}>
                  {images[selectedImage] ? (
                    <img
                      src={getProductImageUrl(images[selectedImage])}
                      alt={`${product.name} - Vue rapide`}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === index
                          ? 'border-violet-electric'
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

              {/* Info */}
              <div>
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                <div className="flex items-center gap-2 mb-4">
                  {product.stock > 0 ? (
                    <Badge variant="success">En stock ({product.stock} disponibles)</Badge>
                  ) : (
                    <Badge variant="error">Rupture de stock</Badge>
                  )}
                  <Badge variant="info">SKU: {product.sku}</Badge>
                </div>

                <div className="mb-6">
                  <p className="text-3xl font-bold text-violet-electric mb-2">
                    {formatPrice(priceTTC)}
                  </p>
                  <p className="text-sm text-gray-500">
                    HT: {formatPrice(product.priceHT)} (TVA incl.)
                  </p>
                </div>

                {product.description && (
                  <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
                )}

                {/* Attributs */}
                {product.attributes && Object.keys(product.attributes).length > 0 && (
                  <div className="mb-6 p-4 bg-gray-soft rounded-lg">
                    <h4 className="font-semibold mb-3">Caractéristiques</h4>
                    <dl className="grid grid-cols-2 gap-3">
                      {Object.entries(product.attributes).map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-sm text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </dt>
                          <dd className="font-medium">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="font-medium">Quantité:</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || !product.isActive}
                  >
                    {product.stock > 0
                      ? `Ajouter ${quantity > 1 ? `${quantity} × ` : ''}au panier`
                      : 'Rupture de stock'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

