'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { getProductImageUrl } from '@/backend/lib/utils';

// Mock data pour les commandes
const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '15 Janvier 2024',
    status: 'DELIVERED',
    statusLabel: 'Livrée',
    total: 1199,
    items: [
      { name: 'iPhone 15 Pro', quantity: 1, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500' },
    ],
    trackingNumber: 'TRACK-123456',
  },
  {
    id: 'ORD-2024-002',
    date: '20 Janvier 2024',
    status: 'SHIPPED',
    statusLabel: 'Expédiée',
    total: 499,
    items: [
      { name: 'PlayStation 5', quantity: 1, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500' },
    ],
    trackingNumber: 'TRACK-789012',
  },
  {
    id: 'ORD-2024-003',
    date: '25 Janvier 2024',
    status: 'PROCESSING',
    statusLabel: 'En préparation',
    total: 2499,
    items: [
      { name: 'Robot Tondeuse Automower 430X', quantity: 1, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500' },
    ],
  },
];

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-orange-100 text-orange-800',
  SHIPPED: 'bg-violet-100 text-violet-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export default function OrdersPage() {
  const [searchOrder, setSearchOrder] = useState('');

  const filteredOrders = mockOrders.filter(order =>
    order.id.toLowerCase().includes(searchOrder.toLowerCase()) ||
    (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchOrder.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-off-white pb-20 lg:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black-deep mb-2">Mes commandes</h1>
          <p className="text-gray-600">
            Suivez l&apos;état de vos commandes et accédez à vos factures
          </p>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par numéro de commande ou de suivi..."
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Liste des commandes */}
        {filteredOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune commande trouvée</h3>
              <p className="text-gray-500 mb-6">
                {searchOrder ? 'Aucune commande ne correspond à votre recherche.' : 'Vous n\'avez pas encore passé de commande.'}
              </p>
              {!searchOrder && (
                <Link href="/products">
                  <button className="px-6 py-3 bg-violet-electric text-white rounded-lg font-medium hover:bg-violet-700 transition-colors">
                    Découvrir nos produits
                  </button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {/* Header de la commande */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <h3 className="font-bold text-lg text-black-deep mb-1">
                          Commande {order.id}
                        </h3>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                          {order.statusLabel}
                        </span>
                        <span className="text-lg font-bold text-black-deep">
                          {order.total.toFixed(2)} €
                        </span>
                      </div>
                    </div>

                    {/* Items de la commande */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getProductImageUrl(item.image)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      {order.trackingNumber && (
                        <Link
                          href={`/tracking?order=${order.id}`}
                          className="flex-1 px-4 py-2.5 bg-violet-electric text-white rounded-lg font-medium hover:bg-violet-700 transition-colors text-center"
                        >
                          Suivre la commande
                        </Link>
                      )}
                      <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Voir les détails
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lien vers le suivi de commande */}
        <div className="mt-8 text-center">
          <Link
            href="/tracking"
            className="text-violet-electric hover:text-violet-700 font-medium underline"
          >
            Suivre une commande avec un numéro de suivi
          </Link>
        </div>
      </div>
    </div>
  );
}

