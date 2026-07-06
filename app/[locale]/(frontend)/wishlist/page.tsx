'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWishlist } from '@/frontend/contexts/WishlistContext';
import { formatPrice, calculateTTC } from '@/backend/lib/utils';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { WishlistButton } from '@/frontend/components/WishlistButton';
import { useCart } from '@/frontend/contexts/CartContext';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: typeof wishlist[0]) => {
    addToCart(
      {
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        priceHT: item.priceHT,
        vatRate: item.vatRate,
        image: item.image,
      },
      1
    );
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-off-white py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <svg
                className="w-24 h-24 text-gray-300 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h1 className="text-3xl font-bold text-black-deep mb-4">Votre liste de souhaits est vide</h1>
              <p className="text-gray-600 mb-8">
                Commencez à ajouter des produits à votre liste de souhaits pour les retrouver facilement plus tard.
              </p>
              <Link href="/products">
                <Button variant="primary">Découvrir nos produits</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black-deep mb-2">
              Ma liste de souhaits
            </h1>
            <p className="text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? 'produit' : 'produits'}
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              aria-label="Vider la liste de souhaits"
            >
              Tout retirer
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <Link href={`/products/${item.productId}`} className="block">
                    <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="absolute top-2 right-2">
                    <WishlistButton
                      productId={item.productId}
                      sku={item.sku}
                      name={item.name}
                      priceHT={item.priceHT}
                      vatRate={item.vatRate}
                      image={item.image}
                      brand={item.brand}
                      variant="icon"
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  {item.brand && (
                    <p className="text-sm text-gray-500 mb-1">{item.brand}</p>
                  )}
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-violet-electric transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-2xl font-bold text-violet-electric mb-4">
                    {formatPrice(calculateTTC(item.priceHT, item.vatRate))}
                  </p>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleAddToCart(item)}
                  >
                    Ajouter au panier
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

