'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Badge } from '@/frontend/components/ui/Badge';

// Données mockées - à remplacer par des appels API
const mockOrders = [
  {
    id: 'ORD-B2B-1001',
    date: '2024-11-25',
    total: 49900,
    status: 'SHIPPED',
    itemsCount: 1,
    trackingNumber: 'TRACK-123456',
  },
  {
    id: 'ORD-B2B-1002',
    date: '2024-11-24',
    total: 119900,
    status: 'DELIVERED',
    itemsCount: 2,
    trackingNumber: 'TRACK-123455',
  },
  {
    id: 'ORD-B2B-1003',
    date: '2024-11-23',
    total: 249900,
    status: 'PROCESSING',
    itemsCount: 1,
  },
];

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  PENDING: 'En attente',
  PAID: 'Payée',
  PROCESSING: 'En traitement',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

export default function B2BOrdersPage() {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = mockOrders.filter((order) => {
    return filterStatus === 'all' || order.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mes Commandes</h2>
        <p className="text-gray-600 mt-1">
          {filteredOrders.length} commande(s) trouvée(s)
        </p>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} hover>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-mono font-semibold text-gray-900">
                      {order.id}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[order.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {new Date(order.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.itemsCount} article{order.itemsCount > 1 ? 's' : ''}
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm text-gray-500 mt-1">
                      Suivi: {order.trackingNumber}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {(order.total / 100).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>
                    <p className="text-xs text-gray-500">Prix B2B HT</p>
                  </div>
                  <Link href={`/b2b/orders/${order.id}`}>
                    <button className="px-4 py-2 bg-violet-electric text-white rounded-lg hover:bg-violet-700 transition-colors">
                      Voir détails
                    </button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

