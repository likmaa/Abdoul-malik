'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import dynamic from 'next/dynamic';
import { Toast } from '@/frontend/components/Toast';

// Lazy load les composants mobile pour améliorer les performances
const MobileProductCard = dynamic(() => import('@/frontend/components/mobile').then(mod => ({ default: mod.MobileProductCard })), {
  ssr: false,
});

const MobileFiltersButton = dynamic(() => import('@/frontend/components/mobile').then(mod => ({ default: mod.MobileFiltersButton })), {
  ssr: false,
});

const MobileFiltersModal = dynamic(() => import('@/frontend/components/mobile').then(mod => ({ default: mod.MobileFiltersModal })), {
  ssr: false,
});

const PullToRefresh = dynamic(() => import('@/frontend/components/mobile').then(mod => ({ default: mod.PullToRefresh })), {
  ssr: false,
});

// Lazy load le modal pour améliorer les performances
const ProductDetailModal = dynamic(() => import('@/frontend/components/ProductDetailModal').then(mod => ({ default: mod.ProductDetailModal })), {
  loading: () => <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>,
  ssr: false,
});
import { useCart } from '@/frontend/contexts/CartContext';
import { calculateTTC, getProductImageUrl } from '@/backend/lib/utils';

// Les produits sont maintenant récupérés via l'API /api/products

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const t = useTranslations('Products');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const { addToCart, itemsCount } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<{ name: string; image: string; quantity: number } | null>(null);

  // États pour les filtres avancés
  const [openDropdown, setOpenDropdown] = useState<'category' | 'brand' | 'price' | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 5000 });
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // État pour le modal de filtres mobile
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Références pour fermer les dropdowns au clic extérieur
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const priceDropdownRef = useRef<HTMLDivElement>(null);

  // Options de filtres
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);

  // Charger les catégories dynamiquement
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories) {
          setCategoryOptions(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Extraire toutes les marques uniques
  const allBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.brand));
    return Array.from(brands).sort().map(brand => ({
      id: String(brand).toLowerCase().replace(/\s+/g, '-'),
      label: String(brand),
    }));
  }, [products]);

  // Calcul du nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (priceRange.min > 0 || priceRange.max < 5000) count += 1;
    return count;
  }, [selectedCategories, selectedBrands, priceRange]);

  // Charger les produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const category = selectedCategories.join(',');
        const brand = selectedBrands.join(',');
        const search = searchParams.get('search') || '';

        const res = await fetch(`/api/products?category=${category}&brand=${brand}&search=${search}`);
        const data = await res.json();

        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, selectedBrands, searchParams]);

  // Initialiser les filtres à partir de l'URL (?category=...&brand=...&type=...)
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const brandFromUrl = searchParams.get('brand');
    const typeFromUrl = searchParams.get('type');

    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }

    if (brandFromUrl) {
      const brandId = brandFromUrl.toLowerCase().replace(/\s+/g, '-');
      setSelectedBrands([brandId]);
    }

    if (typeFilter !== typeFromUrl) {
      setTypeFilter(typeFromUrl);
    }
  }, [searchParams, typeFilter]);

  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    if (!openDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (categoryDropdownRef.current && categoryDropdownRef.current.contains(target)) return;
      if (brandDropdownRef.current && brandDropdownRef.current.contains(target)) return;
      if (priceDropdownRef.current && priceDropdownRef.current.contains(target)) return;

      setOpenDropdown(null);
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown]);

  // Fonctions de gestion des filtres
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 5000 });
    setOpenDropdown(null);
  };

  const removeFilter = (type: 'category' | 'brand' | 'price', id?: string) => {
    if (type === 'category' && id) {
      setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
    } else if (type === 'brand' && id) {
      setSelectedBrands((prev) => prev.filter((brandId) => brandId !== id));
    } else if (type === 'price') {
      setPriceRange({ min: 0, max: 5000 });
      setTypeFilter(null);
    }
  };

  // États pour la section immersive 3D
  const [currentImmersiveIndex, setCurrentImmersiveIndex] = useState(0);
  const immersiveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Motion values pour l'effet 3D parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations pour les valeurs de la souris
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  // Transform pour la rotation 3D
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  // Transform pour la position de l'effet de lumière (glow) en pourcentage
  const glowXPercent = useTransform(smoothX, [-0.5, 0.5], [20, 80]);
  const glowYPercent = useTransform(smoothY, [-0.5, 0.5], [20, 80]);

  // Images immersives (produits tech uniquement)
  const immersiveImages = useMemo(() => [
    {
      id: 1,
      url: '/img1.webp',
      name: 'iPhone 15 Pro Max',
    },
    {
      id: 2,
      url: '/img2.webp',
      name: 'MacBook Pro M3',
    },
    {
      id: 3,
      url: '/img3.webp',
      name: 'PlayStation 5',
    },
  ], []);

  // Gestion du mouvement de la souris pour l'effet 3D
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Auto-play pour la section immersive - change toutes les 11 secondes
  useEffect(() => {
    if (immersiveIntervalRef.current) {
      clearInterval(immersiveIntervalRef.current);
    }

    immersiveIntervalRef.current = setInterval(() => {
      setCurrentImmersiveIndex((prev) => (prev + 1) % immersiveImages.length);
    }, 11000); // 11 secondes

    return () => {
      if (immersiveIntervalRef.current) {
        clearInterval(immersiveIntervalRef.current);
      }
    };
  }, [immersiveImages.length]);

  // Filtrage et tri des produits
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Tri (le filtrage est géré côté API maintenant, mais on garde le tri local pour la réactivité)
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [products, sortBy]);

  // Fonction pour obtenir les détails complets d'un produit (Utilise maintenant les données chargées)
  const getProductDetails = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return null;

    // Convertir price (euros) en priceHT (centimes) pour le modal
    const priceHT = typeof product.priceHT === 'number'
      ? product.priceHT
      : (typeof product.price === 'number' ? product.price * 100 : 0);
    const vatRate = product.vatRate || product.defaultVATRate || 0.21;

    return {
      ...product,
      priceHT,
      vatRate,
      description: { es: product.description, fr: product.description, en: product.description },
      images: product.images || [product.image],
      features: ['Produit authentique', 'Garantie constructeur', 'Expédition rapide'],
      attributes: { Brand: product.creator, Category: product.categoryLabel }
    };
  }, [products]);

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleQuickAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const priceHT = product.price * 100;
    addToCart(
      {
        productId: product.id,
        sku: `SKU-${product.id}`,
        name: product.name,
        priceHT,
        vatRate: 0.20,
        image: product.image,
      },
      1
    );
    setLastAddedProduct({ name: product.name, image: getProductImageUrl(product.image), quantity: 1 });
    setShowToast(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-4 md:py-8">
      <h1 className="text-5xl font-extrabold text-violet-electric mb-4">{t('title')}</h1>
      <p className="text-lg text-gray-600 mb-8">
        {t('description')}
      </p>

      {/* Barre de filtres améliorée - Masquée sur mobile */}
      <div className="hidden lg:block bg-gray-soft rounded-xl px-6 py-4 mb-8 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Ligne principale avec boutons de filtres */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Dropdown Catégorie */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${openDropdown === 'category' || selectedCategories.length > 0
                    ? 'bg-violet-electric text-white shadow-md hover:bg-violet-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-electric'
                    }`}
                >
                  {t('category')}
                  {selectedCategories.length > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {selectedCategories.length}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'category' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {openDropdown === 'category' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[240px]"
                    >
                      <div className="space-y-1">
                        {categoryOptions.map((cat) => (
                          <div key={cat.id} className="space-y-1">
                            <div
                              onClick={() => toggleCategory(cat.id)}
                              className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 flex items-center gap-3 cursor-pointer ${selectedCategories.includes(cat.id)
                                ? 'bg-violet-electric/10 text-violet-electric font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              <span className="flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </span>
                              <span className="flex-1">{cat.name.fr || cat.name.en || cat.slug}</span>

                              {cat.children && cat.children.length > 0 && (
                                <button
                                  onClick={(e) => toggleExpand(cat.id, e)}
                                  className={`p-1 hover:bg-gray-200 rounded-md transition-transform duration-200 ${expandedCategories.has(cat.id) ? 'rotate-180' : ''}`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              )}

                              {selectedCategories.includes(cat.id) && (
                                <svg className="w-4 h-4 text-violet-electric" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>

                            <AnimatePresence>
                              {expandedCategories.has(cat.id) && cat.children && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden pl-6 space-y-1"
                                >
                                  {cat.children.map((child: any) => (
                                    <button
                                      key={child.id}
                                      onClick={() => toggleCategory(child.id)}
                                      className={`w-full px-4 py-2 rounded-lg text-left text-sm transition-all duration-200 flex items-center gap-3 ${selectedCategories.includes(child.id)
                                        ? 'bg-violet-electric/10 text-violet-electric font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 ml-1" />
                                      <span className="flex-1">{child.name.fr || child.name.en || child.slug}</span>
                                      {selectedCategories.includes(child.id) && (
                                        <svg className="w-4 h-4 text-violet-electric" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown Marque */}
              <div className="relative" ref={brandDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'brand' ? null : 'brand')}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${openDropdown === 'brand' || selectedBrands.length > 0
                    ? 'bg-violet-electric text-white shadow-md hover:bg-violet-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-electric'
                    }`}
                >
                  {t('brand')}
                  {selectedBrands.length > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {selectedBrands.length}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'brand' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {openDropdown === 'brand' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[200px] max-h-[300px] overflow-y-auto"
                    >
                      <div className="space-y-1">
                        {allBrands.map((brand) => (
                          <button
                            key={brand.id}
                            onClick={() => toggleBrand(brand.id)}
                            className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 flex items-center gap-3 ${selectedBrands.includes(brand.id)
                              ? 'bg-violet-electric/10 text-violet-electric font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            <span className="flex-1">{brand.label}</span>
                            {selectedBrands.includes(brand.id) && (
                              <svg className="w-4 h-4 text-violet-electric" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown Prix */}
              <div className="relative" ref={priceDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${openDropdown === 'price' || priceRange.min > 0 || priceRange.max < 5000
                    ? 'bg-violet-electric text-white shadow-md hover:bg-violet-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-electric'
                    }`}
                >
                  Prix
                  {(priceRange.min > 0 || priceRange.max < 5000) && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'price' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {openDropdown === 'price' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[280px]"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('priceMin')}: {priceRange.min}€
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="50"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('priceMax')}: {priceRange.max}€
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="50"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {priceRange.min}€ - {priceRange.max}€
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tri */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-violet-electric transition-all duration-200 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric"
                >
                  <option value="name">{t('sort')}: {t('sortNames.name')}</option>
                  <option value="price-asc">{t('sort')}: {t('sortNames.price-asc')}</option>
                  <option value="price-desc">{t('sort')}: {t('sortNames.price-desc')}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 bg-violet-electric rounded-full flex items-center justify-center shadow-md"
                >
                  <span className="text-white text-sm font-bold">{activeFiltersCount}</span>
                </motion.div>
              )}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 bg-transparent text-gray-600 rounded-lg font-medium text-sm hover:bg-white/80 hover:text-violet-electric transition-all duration-200 flex items-center gap-2"
                >
                  {t('resetFilters')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Tags des filtres actifs */}
          {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange.min > 0 || priceRange.max < 5000) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-300"
            >
              {selectedCategories.map((catId) => {
                let category = categoryOptions.find((c) => c.id === catId);
                if (!category) {
                  for (const cat of categoryOptions) {
                    const sub = cat.children?.find((c: any) => c.id === catId);
                    if (sub) {
                      category = sub;
                      break;
                    }
                  }
                }
                const label = category ? (category.name?.fr || category.name?.en || category.slug || category.label) : '';
                return category ? (
                  <motion.button
                    key={catId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => removeFilter('category', catId)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-electric/10 text-violet-electric rounded-lg text-sm font-medium hover:bg-violet-electric/20 transition-colors"
                  >
                    <span>{label}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                ) : null;
              })}
              {selectedBrands.map((brandId) => {
                const brand = allBrands.find((b) => b.id === brandId);
                return brand ? (
                  <motion.button
                    key={brandId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => removeFilter('brand', brandId)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-electric/10 text-violet-electric rounded-lg text-sm font-medium hover:bg-violet-electric/20 transition-colors"
                  >
                    <span>{brand.label}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                ) : null;
              })}
              {(priceRange.min > 0 || priceRange.max < 5000) && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => removeFilter('price')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-electric/10 text-violet-electric rounded-lg text-sm font-medium hover:bg-violet-electric/20 transition-colors"
                >
                  <span>Prix: {priceRange.min}€ - {priceRange.max}€</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bouton Filtres Mobile (flottant) */}
      <MobileFiltersButton
        onClick={() => setIsMobileFiltersOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Modal Filtres Mobile */}
      <MobileFiltersModal
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        onApply={(filters) => {
          setSelectedCategories(filters.categories);
          setSelectedBrands(filters.brands);
          setPriceRange(filters.priceRange);
        }}
        categoryOptions={categoryOptions}
        brandOptions={allBrands}
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
        priceRange={priceRange}
        maxPrice={5000}
      />

      {/* Liste produits avec le même style que la page d'accueil */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
              {/* Image skeleton */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skeleton-shimmer" />
              </div>
              {/* Content skeleton */}
              <div className="p-3 lg:p-4 space-y-3">
                {/* Brand skeleton */}
                <div className="h-3 bg-gray-200 rounded w-16" />
                {/* Title skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
                {/* Price skeleton */}
                <div className="h-6 bg-violet-100 rounded w-24" />
                {/* Button skeleton */}
                <div className="h-10 bg-gray-100 rounded-lg w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedProducts.length > 0 ? (
        <PullToRefresh
          onRefresh={async () => {
            // Simuler un rafraîchissement (à remplacer par un vrai appel API)
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Ici, on pourrait recharger les produits depuis l'API
          }}
          disabled={false}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 items-stretch">
            {filteredAndSortedProducts.map((product) => {
              return (
                <div key={product.id}>
                  {/* Version Mobile */}
                  <div className="lg:hidden">
                    <MobileProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      creator={product.creator}
                      category={product.categoryLabel}
                      onViewProduct={() => handleOpenModal(product)}
                    />
                  </div>

                  {/* Version Desktop */}
                  <div className="hidden lg:block">
                    <Card hover className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-sm group relative">
                      <div className="h-80 bg-gray-soft rounded-t-lg overflow-hidden flex-shrink-0 relative">
                        <img
                          src={getProductImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-125"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-7 flex-1 flex flex-col justify-between min-h-[300px] bg-off-white">
                        {/* Section 1: Category + Title */}
                        <div className="border-b border-gray-200 pb-3 mb-3">
                          <p className="text-xs text-gray-400 mb-2 font-normal">{product.categoryLabel}</p>
                          <h3 className="font-bold text-black-deep text-xl leading-snug">{product.name}</h3>
                        </div>

                        {/* Section 2: By Creator + Price */}
                        <div className="border-b border-gray-200 pb-3 mb-3 flex items-baseline justify-between">
                          <div>
                            <span className="text-sm text-gray-500 font-normal">{t('by')} </span>
                            <span className="text-sm text-black-deep font-medium">{product.creator}</span>
                          </div>
                          <div className="text-right flex items-baseline">
                            <span className="text-sm text-black-deep font-normal">{t('from')} </span>
                            <span className="text-4xl font-bold text-black-deep ml-1">{Math.floor(product.price)}</span>
                            <span className="text-sm text-black-deep font-normal ml-1"> €</span>
                          </div>
                        </div>

                        {/* Section 3: Actions */}
                        <div className="pt-1 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenModal(product);
                            }}
                            className="text-sm text-violet-electric hover:underline font-normal"
                          >
                            {t('viewProduct')}
                          </button>
                          <button
                            onClick={(e) => handleQuickAddToCart(e, product)}
                            className="p-2 bg-violet-electric text-white rounded-full hover:bg-violet-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                            aria-label={t('addToCart')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </PullToRefresh>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {t('noProducts')}
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-violet-electric text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Section Immersive 3D - Produits Tech */}
      <section
        className="relative w-full h-[90vh] min-h-[700px] overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black mt-16"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Images avec transition fade */}
          <div className="absolute inset-0 w-full h-full">
            {immersiveImages.map((product, index) => {
              const isVisible = index === currentImmersiveIndex;
              const isNext = index === (currentImmersiveIndex + 1) % immersiveImages.length;

              return (
                <motion.div
                  key={product.id}
                  className="absolute inset-0 w-full h-full"
                  initial={false}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 1.1,
                  }}
                  transition={{
                    duration: 1.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    zIndex: isVisible ? 10 : isNext ? 5 : 1,
                  }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={product.url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      style={{
                        filter: 'brightness(0.7) contrast(1.1)',
                      }}
                    />
                    {/* Overlay gradient pour améliorer la lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Effet de lumière/glow qui suit la souris */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: useTransform(glowXPercent, (v) => `${v}%`),
              top: useTransform(glowYPercent, (v) => `${v}%`),
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          {/* Indicateurs de position (points en bas) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {immersiveImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImmersiveIndex(index);
                  // Réinitialiser l'intervalle
                  if (immersiveIntervalRef.current) {
                    clearInterval(immersiveIntervalRef.current);
                  }
                  immersiveIntervalRef.current = setInterval(() => {
                    setCurrentImmersiveIndex((prev) => (prev + 1) % immersiveImages.length);
                  }, 11000);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${index === currentImmersiveIndex
                  ? 'w-8 bg-violet-electric'
                  : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                aria-label={`Voir ${immersiveImages[index].name}`}
              />
            ))}
          </div>

          {/* Call-to-action subtil au centre */}
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 text-center"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Link
              href={`/products/${immersiveImages[currentImmersiveIndex]?.id}`}
              className="inline-block px-6 py-3 bg-violet-electric text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-violet-700 active:bg-violet-800"
            >
              Découvrir {immersiveImages[currentImmersiveIndex]?.name}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Modal de détail produit */}
      {selectedProduct && (
        <ProductDetailModal
          product={getProductDetails(selectedProduct.id)!}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Toast de confirmation */}
      {lastAddedProduct && (
        <Toast
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          message="Produit ajouté au panier"
          productName={lastAddedProduct.name}
          productImage={lastAddedProduct.image}
          quantity={lastAddedProduct.quantity}
          totalItems={itemsCount}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-gray-200 rounded-lg" />
            <div className="h-4 w-96 bg-gray-200 rounded-lg" />
            <div className="h-64 w-full bg-gray-200 rounded-xl mt-8" />
          </div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
