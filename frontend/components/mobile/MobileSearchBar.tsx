'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { formatPrice, getProductImageUrl } from '@/backend/lib/utils';
import { useTranslations } from 'next-intl';

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

interface MobileSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    categoryLabel?: string;
  }>;
}

export function MobileSearchBar({ isOpen, onClose, products = [] }: MobileSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations('Search');

  // Charger l'historique depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('searchHistory');
      if (saved) {
        try {
          setSearchHistory(JSON.parse(saved));
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, []);

  // Focus sur l'input quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Recherche de produits
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || products.length === 0) return [];

    const query = searchQuery.toLowerCase().trim();
    return products
      .filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const categoryMatch = product.categoryLabel?.toLowerCase().includes(query);
        return nameMatch || categoryMatch;
      })
      .slice(0, 8); // Limiter à 8 résultats
  }, [searchQuery, products]);

  // Suggestions basées sur les produits populaires
  const suggestions = useMemo(() => {
    if (searchQuery.trim()) return [];

    // Retourner les produits les plus populaires ou récents
    return products.slice(0, 6);
  }, [searchQuery, products]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Ajouter à l'historique
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);

    if (typeof window !== 'undefined') {
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }

    // Naviguer vers la page produits avec le terme de recherche
    router.push(`/products?search=${encodeURIComponent(query)}`);
    onClose();
  };

  const handleSelectResult = (product: SearchResult) => {
    router.push(`/products/${product.id}`);
    onClose();
  };

  const handleSelectHistory = (term: string) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('searchHistory');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50"
            aria-hidden="true"
          />

          <div className="fixed inset-0 flex items-start justify-center pt-16 pointer-events-none">
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } }}
              exit={{ opacity: 0, y: -20, transition: { type: 'spring', damping: 30, stiffness: 300 } }}
              className="relative w-full max-h-[85vh] pointer-events-auto bg-white rounded-t-3xl shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        handleSearch(searchQuery);
                      }
                    }}
                    placeholder={t('placeholder')}
                    className="w-full px-4 py-3 pl-11 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric text-base"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t('cancel')}
                </button>
              </div>

              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Résultats de recherche */}
                {searchQuery.trim() && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 mb-6"
                  >
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {t('results')} ({searchResults.length})
                    </h3>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectResult(product)}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getProductImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 line-clamp-1">
                            {product.name}
                          </p>
                          {product.categoryLabel && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {product.categoryLabel}
                            </p>
                          )}
                          <p className="text-sm font-bold text-violet-electric mt-1">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Aucun résultat */}
                {searchQuery.trim() && searchResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-gray-500 font-medium mb-2">{t('noResults')}</p>
                    <p className="text-sm text-gray-400">
                      {t('tryOther')}
                    </p>
                  </motion.div>
                )}

                {/* Suggestions (quand pas de recherche) */}
                {!searchQuery.trim() && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 mb-6"
                  >
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {t('suggestions')}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelectResult(product)}
                          className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={getProductImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs font-medium text-gray-900 text-center line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-xs font-bold text-violet-electric">
                            {formatPrice(product.price)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Historique de recherche */}
                {!searchQuery.trim() && searchHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                        {t('recentSearches')}
                      </h3>
                      <button
                        onClick={clearHistory}
                        type="button"
                        className="text-xs text-violet-electric hover:underline font-medium px-2 py-1 rounded hover:bg-violet-50 transition-colors"
                        aria-label={t('clearAriaLabel')}
                      >
                        {t('clear')}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectHistory(term)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                          <svg
                            className="w-4 h-4 text-gray-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-700 flex-1">{term}</span>
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

