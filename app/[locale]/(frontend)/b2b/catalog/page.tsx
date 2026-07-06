'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { Badge } from '@/frontend/components/ui/Badge';
import { getProductImageUrl } from '@/backend/lib/utils';

// Données mockées - à remplacer par des appels API
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    priceHT: 119900, // Prix normal
    priceB2B: 101915, // Prix B2B avec remise 15%
    stock: 10,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200',
    discount: 15,
  },
  {
    id: '2',
    name: 'PlayStation 5',
    brand: 'Sony',
    priceHT: 49900,
    priceB2B: 42415,
    stock: 5,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200',
    discount: 15,
  },
  {
    id: '3',
    name: 'Robot Tondeuse Automower 430X',
    brand: 'Husqvarna',
    priceHT: 249900,
    priceB2B: 212415,
    stock: 3,
    category: 'garden',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200',
    discount: 15,
  },
];

export default function B2BCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Catalogue B2B</h2>
          <p className="text-gray-600 mt-1">
            {filteredProducts.length} produit(s) disponible(s) avec tarifs dégressifs
          </p>
        </div>
        <Badge variant="success" className="w-fit">
          Remise B2B : 15%
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                placeholder="Nom du produit..."
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
              >
                <option value="all">Toutes</option>
                <option value="electronics">Électronique</option>
                <option value="garden">Jardin</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} hover className="h-full flex flex-col">
            <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
              <img
                src={getProductImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="mb-2">
                <p className="text-sm text-gray-500">{product.brand}</p>
                <h3 className="font-semibold text-lg text-gray-900 mt-1">
                  {product.name}
                </h3>
              </div>

              <div className="mt-auto space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-500 line-through">
                    {(product.priceHT / 100).toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                  <span className="text-2xl font-bold text-violet-electric">
                    {(product.priceB2B / 100).toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                  <Badge variant="success" className="ml-2">
                    -{product.discount}%
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">Prix HT - Remise B2B appliquée</p>

                <div className="flex items-center gap-2 mt-4">
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Voir détails
                    </Button>
                  </Link>
                  <Button variant="primary" className="flex-1">
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

