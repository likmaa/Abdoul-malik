'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useComparison } from '@/frontend/contexts/ComparisonContext';
import { formatPrice, calculateTTC } from '@/backend/lib/utils';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { ComparisonButton } from '@/frontend/components/ComparisonButton';
import { Button } from '@/frontend/components/ui/Button';
import { useCart } from '@/frontend/contexts/CartContext';

export default function ComparePage() {
  const { comparison, clearComparison } = useComparison();
  const { addToCart } = useCart();

  const handleAddToCart = (item: typeof comparison[0]) => {
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

  // Récupérer tous les attributs uniques pour le tableau
  const allAttributes = new Set<string>();
  comparison.forEach((item) => {
    if (item.attributes) {
      Object.keys(item.attributes).forEach((key) => allAttributes.add(key));
    }
  });

  if (comparison.length === 0) {
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
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
              <h1 className="text-3xl font-bold text-black-deep mb-4">Aucun produit à comparer</h1>
              <p className="text-gray-600 mb-8">
                Ajoutez des produits à la comparaison pour voir leurs différences côte à côte.
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
              Comparaison de produits
            </h1>
            <p className="text-gray-600">
              {comparison.length} {comparison.length === 1 ? 'produit' : 'produits'} à comparer
            </p>
          </div>
          {comparison.length > 0 && (
            <button
              onClick={clearComparison}
              className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              aria-label="Vider la comparaison"
            >
              Tout retirer
            </button>
          )}
        </div>

        {/* Tableau de comparaison */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-[200px]">
                  Caractéristiques
                </th>
                {comparison.map((item) => (
                  <th key={item.productId} className="px-6 py-4 text-center min-w-[250px]">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden mb-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-semibold text-base mb-2 hover:text-violet-electric transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      {item.brand && (
                        <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                      )}
                      <p className="text-xl font-bold text-violet-electric mb-3">
                        {formatPrice(calculateTTC(item.priceHT, item.vatRate))}
                      </p>
                      <div className="flex flex-col gap-2 w-full">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => handleAddToCart(item)}
                        >
                          Ajouter au panier
                        </Button>
                        <ComparisonButton
                          productId={item.productId}
                          sku={item.sku}
                          name={item.name}
                          priceHT={item.priceHT}
                          vatRate={item.vatRate}
                          image={item.image}
                          brand={item.brand}
                          attributes={item.attributes}
                          category={item.category}
                          variant="button"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Prix */}
              <tr className="border-b border-gray-100">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">Prix</td>
                {comparison.map((item) => (
                  <td key={item.productId} className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-violet-electric">
                      {formatPrice(calculateTTC(item.priceHT, item.vatRate))}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Attributs */}
              {Array.from(allAttributes).map((attrKey) => (
                <tr key={attrKey} className="border-b border-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 capitalize">
                    {attrKey.replace(/([A-Z])/g, ' $1').trim()}
                  </td>
                  {comparison.map((item) => (
                    <td key={item.productId} className="px-6 py-4 text-center text-sm text-gray-600">
                      {item.attributes?.[attrKey] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

