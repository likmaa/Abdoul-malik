'use client';

import { Card, CardContent } from '@/frontend/components/ui/Card';
import Link from 'next/link';
import {
  CartIcon,
  BoxIcon,
  RevenueIcon,
  HourglassIcon,
  TrendIcon,
} from '@/admin-panel/components/admin/AdminIcons';

// Données mockées - à remplacer par des appels API
const stats = {
  totalOrders: 24,
  totalSpent: 125430,
  pendingOrders: 2,
  favoriteProducts: 8,
  discountRate: 15, // 15% de remise B2B
};

const recentOrders = [
  {
    id: 'ORD-B2B-1001',
    date: '2024-11-25',
    total: 49900,
    status: 'SHIPPED',
    itemsCount: 1,
  },
  {
    id: 'ORD-B2B-1002',
    date: '2024-11-24',
    total: 119900,
    status: 'DELIVERED',
    itemsCount: 2,
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

export default function B2BDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard B2B</h2>
        <p className="text-gray-600 mt-1">Bienvenue dans votre espace professionnel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commandes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <CartIcon className="w-7 h-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Dépensé</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(stats.totalSpent / 100).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                <RevenueIcon className="w-7 h-7" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Remise B2B : {stats.discountRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commandes en Cours</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                <HourglassIcon className="w-7 h-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produits Favoris</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.favoriteProducts}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                <TrendIcon className="w-7 h-7" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions Rapides
            </h3>
            <div className="space-y-3">
              <Link
                href="/b2b/catalog"
                className="flex items-center gap-3 p-3 rounded-lg bg-violet-electric text-white hover:bg-violet-700 transition-colors"
              >
                <BoxIcon className="w-5 h-5" />
                <span className="font-medium">Parcourir le catalogue</span>
              </Link>
              <Link
                href="/b2b/orders"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <CartIcon className="w-5 h-5" />
                <span className="font-medium">Voir mes commandes</span>
              </Link>
              <Link
                href="/b2b/invoices"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <BoxIcon className="w-5 h-5" />
                <span className="font-medium">Télécharger mes factures</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Commandes Récentes
            </h3>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/b2b/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 font-mono text-sm">
                      {order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('fr-FR')} • {order.itemsCount} article{order.itemsCount > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {(order.total / 100).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[order.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/b2b/orders"
              className="block mt-4 text-center text-sm text-violet-electric hover:underline"
            >
              Voir toutes les commandes →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* B2B Benefits */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Avantages B2B
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <RevenueIcon className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="font-medium text-gray-900">Tarifs Dégressifs</p>
                <p className="text-sm text-gray-600">
                  Jusqu'à {stats.discountRate}% de remise selon le volume
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BoxIcon className="w-6 h-6 text-orange-500" />
              <div>
                <p className="font-medium text-gray-900">Commandes en Gros</p>
                <p className="text-sm text-gray-600">
                  Quantités importantes sans limite
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HourglassIcon className="w-6 h-6 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Paiement Différé</p>
                <p className="text-sm text-gray-600">
                  Conditions 30j ou 60j selon votre contrat
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

