'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { Badge } from '@/frontend/components/ui/Badge';
import { useAuth } from '@/frontend/hooks/useAuth';
import { FileDownloadIcon, PlusCircleIcon, BoxIcon } from '@/admin-panel/components/admin/AdminIcons';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ProductDetailModal } from '@/frontend/components/ProductDetailModal';
import { getProductImageUrl } from '@/backend/lib/utils';

interface Product {
  id: string;
  sku: string;
  name: any; // JSON { fr: "...", en: "..." }
  brand: string;
  priceHT: number;
  stock: number;
  isActive: boolean;
  category: string;
  images: string[];
  description?: any;
  defaultVATRate?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  attributes?: any;
}

type ActiveFilter = 'all' | 'active' | 'inactive';
type SortOption = 'updated_desc' | 'price_desc' | 'stock_asc' | 'best_sellers';

export default function AdminProductsPage() {
  const { permissions } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [filterActive, setFilterActive] = useState<ActiveFilter>('all');
  const [filterBrand, setFilterBrand] = useState('');
  const [sort, setSort] = useState<SortOption>('updated_desc');
  const [categories, setCategories] = useState<any[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProductForView, setSelectedProductForView] = useState<any>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams();
        if (filterCategory !== 'all') params.append('category', filterCategory);
        if (filterStock !== 'all') params.append('stock', filterStock);
        if (searchTerm) params.append('search', searchTerm);
        if (filterActive !== 'all') params.append('active', filterActive);
        if (filterBrand) params.append('brand', filterBrand);
        if (sort && sort !== 'updated_desc') params.append('sort', sort);

        const response = await fetch(`/api/admin/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const response = await fetch('/api/admin/categories');
        const data = await response.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
      }
    }

    fetchProducts();
    fetchCategories();
  }, [searchTerm, filterCategory, filterStock, filterActive, filterBrand, sort]);

  const getProductName = (name: any): string => {
    if (typeof name === 'string') return name;
    if (typeof name === 'object' && name !== null) {
      return name.fr || name.en || Object.values(name)[0] || 'Produit sans nom';
    }
    return 'Produit sans nom';
  };

  const handleViewProduct = (product: Product) => {
    // Transformer l'objet produit pour le modal
    const modalProduct = {
      ...product,
      name: getProductName(product.name),
      creator: product.brand,
      categoryLabel: product.category.charAt(0).toUpperCase() + product.category.slice(1),
      vatRate: product.defaultVATRate || 0.21,
      description: typeof product.description === 'object' && product.description !== null
        ? { fr: product.description.fr || '', en: product.description.en || '' }
        : { fr: product.description || '', en: product.description || '' },
      images: product.images || [],
    };
    setSelectedProductForView(modalProduct);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
          <p className="text-gray-600 mt-1">
            {products.length} produit(s) trouvé(s)
          </p>
        </div>
        <div className="flex gap-3">
          {permissions.canExportData && (
            <Button
              variant="outline"
              onClick={() => {
                window.open('/api/admin/export?type=products&format=csv', '_blank');
              }}
            >
              <span className="flex items-center gap-2">
                <FileDownloadIcon />
                <span>Exporter CSV</span>
              </span>
            </Button>
          )}
          <Link href="/admin/products/new">
            <Button variant="primary" size="lg">
              <span className="flex items-center gap-2">
                <PlusCircleIcon className="w-4 h-4" />
                <span>Ajouter un produit</span>
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recherche
                </label>
                <input
                  type="text"
                  placeholder="Nom, SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent bg-white"
                >
                  <option value="all">Toutes</option>
                  {categories.map((cat) => (
                    <optgroup key={cat.id} label={cat.name.fr || cat.name.en || cat.slug}>
                      <option value={cat.id}>{cat.name.fr || cat.name.en || cat.slug} (Racine)</option>
                      {cat.children?.map((child: any) => (
                        <option key={child.id} value={child.id}>
                          &nbsp;&nbsp;{child.name.fr || child.name.en || child.slug}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque
                </label>
                <input
                  type="text"
                  placeholder="Ex : Apple, Bosch..."
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock
                </label>
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                >
                  <option value="all">Tous</option>
                  <option value="low">Stock faible (&lt;5)</option>
                  <option value="out">Rupture de stock</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Statut
                </span>
                <div className="inline-flex rounded-full bg-gray-50 border border-gray-200 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterActive('all')}
                    className={`px-3 py-1 rounded-full transition-colors ${filterActive === 'all'
                      ? 'bg-violet-electric text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Tous
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterActive('active')}
                    className={`px-3 py-1 rounded-full transition-colors ${filterActive === 'active'
                      ? 'bg-violet-electric text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Actifs
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterActive('inactive')}
                    className={`px-3 py-1 rounded-full transition-colors ${filterActive === 'inactive'
                      ? 'bg-violet-electric text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Inactifs
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Tri
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                >
                  <option value="updated_desc">Derniers modifiés</option>
                  <option value="best_sellers">Meilleures ventes</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="stock_asc">Stock croissant</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-electric mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des produits...</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix HT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Aucun produit trouvé
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={getProductImageUrl(product.images[0])}
                                  alt={getProductName(product.name)}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <BoxIcon className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {getProductName(product.name)}
                              </div>
                              <div className="text-sm text-gray-500">{product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 font-mono">
                            {product.sku}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {(product.priceHT / 100).toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${product.stock === 0
                              ? 'text-red-600'
                              : product.stock < 5
                                ? 'text-orange-600'
                                : 'text-green-600'
                              }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">
                            {product.category || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.isActive ? (
                            <Badge variant="success">Actif</Badge>
                          ) : (
                            <Badge variant="error">Inactif</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProduct(product)}
                              className="flex items-center gap-1.5 text-violet-600 border-violet-200 hover:bg-violet-50"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Voir</span>
                            </Button>

                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1.5 text-gray-600 border-gray-200 hover:bg-gray-50"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Modifier</span>
                              </Button>
                            </Link>

                            {permissions.canDeleteProducts && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                                    try {
                                      const response = await fetch(`/api/admin/products/${product.id}`, {
                                        method: 'DELETE',
                                      });
                                      if (response.ok) {
                                        setProducts(products.filter((p) => p.id !== product.id));
                                      }
                                    } catch (error) {
                                      console.error('Erreur lors de la suppression:', error);
                                    }
                                  }
                                }}
                                className="flex items-center gap-1.5 text-red-600 border-red-100 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de visualisation */}
      {selectedProductForView && (
        <ProductDetailModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          product={selectedProductForView}
        />
      )}
    </div>
  );
}

