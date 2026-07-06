'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { CartIcon } from '@/admin-panel/components/admin/AdminIcons';

type Stats = {
  revenue: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  orders: {
    today: number;
    week: number;
    month: number;
  };
  products: {
    total: number;
    lowStock: number;
  };
  pendingOrders: number;
  topProducts: Array<{
    productId: string;
    product: { id: string; name: any; priceHT: number } | null;
    sales: number;
    orders: number;
  }>;
  recentOrders: Array<{
    id: string;
    createdAt: string;
    status: string;
    totalTTC: number;
    users: {
      email: string | null;
      name: string | null;
    } | null;
  }>;
};

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des statistiques');
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erreur inattendue lors du chargement',
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-electric mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          {error || "Aucune donnée disponible pour l'instant."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
        <p className="text-gray-600 mt-1">Analyse détaillée de votre activité</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Revenus Aujourd&apos;hui</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(stats.revenue.today / 100).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Revenus Cette Semaine</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(stats.revenue.week / 100).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Revenus Ce Mois</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(stats.revenue.month / 100).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Revenus Cette Année</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(stats.revenue.year / 100).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Commandes Aujourd&apos;hui</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders.today}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Commandes Cette Semaine</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders.week}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Commandes Ce Mois</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders.month}</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Produits les Plus Vendus
            </h3>
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">
                Pas encore de ventes, les produits apparaîtront ici lorsqu&apos;il y aura
                des commandes.
              </p>
            ) : (
              <div className="space-y-4">
                {stats.topProducts.map((item, index) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-violet-electric text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {typeof item.product?.name === 'string'
                            ? item.product?.name
                            : item.product?.name?.fr || 'Produit inconnu'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.sales} ventes · {item.orders} commandes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activité Récente
            </h3>
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucune commande récente pour l&apos;instant.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <CartIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {order.users?.name || order.users?.email || 'Client inconnu'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        · {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

