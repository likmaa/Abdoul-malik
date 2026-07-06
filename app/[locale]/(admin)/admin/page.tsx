'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import Link from 'next/link';
import { useAuth } from '@/frontend/hooks/useAuth';
import {
  RevenueIcon,
  CartIcon,
  BoxIcon,
  TrendIcon,
  PlusCircleIcon,
  HourglassIcon,
  WarningIcon,
} from '@/admin-panel/components/admin/AdminIcons';

type Period = 'today' | 'week' | 'month';
type ChartMode = 'revenue' | 'orders';

interface Stats {
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
  dailyRevenue: Array<{
    date: string;
    label: string;
    total: number;
    orders: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
}

export default function AdminDashboard() {
  const { permissions } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('month');
  const [chartMode, setChartMode] = useState<ChartMode>('revenue');

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
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

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Erreur lors du chargement des statistiques</p>
      </div>
    );
  }

  const revenueByPeriod =
    period === 'today'
      ? stats.revenue.today
      : period === 'week'
      ? stats.revenue.week
      : stats.revenue.month;

  const ordersByPeriod =
    period === 'today'
      ? stats.orders.today
      : period === 'week'
      ? stats.orders.week
      : stats.orders.month;

  const chartData = stats.dailyRevenue;
  const maxChartValue = chartData.reduce((max, day) => {
    const value = chartMode === 'revenue' ? day.total : day.orders;
    return value > max ? value : max;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre activité</p>
        </div>
        {/* Sélecteur de période pour les KPIs */}
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 text-xs md:text-sm">
          {[
            { key: 'today', label: "Aujourd'hui" },
            { key: 'week', label: '7 derniers jours' },
            { key: 'month', label: '30 derniers jours' },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setPeriod(option.key as Period)}
              className={`px-3 py-1 rounded-md transition-colors ${
                period === option.key
                  ? 'bg-violet-electric text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(revenueByPeriod / 100).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <RevenueIcon className="w-7 h-7" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {period === 'today'
                ? "Aujourd'hui"
                : period === 'week'
                ? '7 derniers jours'
                : '30 derniers jours'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {ordersByPeriod}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <CartIcon className="w-7 h-7" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.pendingOrders} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produits</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.products.total}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <BoxIcon className="w-7 h-7" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.products.lowStock} en stock faible
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(stats.revenue.today / 100).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <TrendIcon className="w-7 h-7" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.orders.today} commandes aujourd'hui
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions Rapides
            </h3>
            <div className="space-y-3">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 p-3 rounded-lg bg-violet-electric text-white hover:bg-violet-700 transition-colors"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10">
                  <PlusCircleIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Ajouter un produit</span>
              </Link>
              <Link
                href="/admin/orders?status=PENDING"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white">
                  <HourglassIcon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-medium">
                  Voir les commandes en attente ({stats.pendingOrders})
                </span>
              </Link>
              <Link
                href="/admin/products?stock=low"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-50">
                  <WarningIcon className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="font-medium">
                  Produits en stock faible ({stats.products?.lowStock || 0})
                </span>
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
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {order.users?.name || order.users?.email || 'Client inconnu'}
                    </p>
                    <p className="text-xs text-gray-500">
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
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {(order.totalTTC / 100).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recentOrders.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucune commande récente
                </p>
              )}
            </div>
            <Link
              href="/admin/orders"
              className="block mt-4 text-center text-sm text-violet-electric hover:underline"
            >
              Voir toutes les commandes →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques & Diagrammes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des revenus / commandes (30 jours) */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {chartMode === 'revenue'
                    ? 'Évolution des revenus (30 jours)'
                    : 'Évolution des commandes (30 jours)'}
                </h3>
                <p className="text-xs text-gray-500">
                  {chartMode === 'revenue'
                    ? 'Somme des commandes payées / livrées, en euros.'
                    : 'Nombre de commandes créées par jour.'}
                </p>
              </div>
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 text-[11px] md:text-xs">
                <button
                  type="button"
                  onClick={() => setChartMode('revenue')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    chartMode === 'revenue'
                      ? 'bg-violet-electric text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  CA
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('orders')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    chartMode === 'orders'
                      ? 'bg-violet-electric text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Cmdes
                </button>
              </div>
            </div>
            {chartData.length === 0 || maxChartValue === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Pas encore de données suffisantes pour afficher le graphique.
              </p>
            ) : (
              <div className="h-48 w-full">
                <svg
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                  className="w-full h-full text-violet-electric"
                >
                  {/* Ligne de base */}
                  <line
                    x1="0"
                    y1="35"
                    x2="100"
                    y2="35"
                    stroke="#E5E7EB"
                    strokeWidth="0.5"
                  />
                  {/* Polyline des revenus */}
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartData
                      .map((day, index) => {
                        const x =
                          chartData.length === 1
                            ? 50
                            : (index / (chartData.length - 1)) * 100;
                        const value =
                          chartMode === 'revenue' ? day.total : day.orders;
                        const ratio = value / maxChartValue;
                        const y = 35 - ratio * 25; // marge haute
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                  {/* Points */}
                  {chartData.map((day, index) => {
                    const x =
                      chartData.length === 1
                        ? 50
                        : (index / (chartData.length - 1)) * 100;
                    const value =
                      chartMode === 'revenue' ? day.total : day.orders;
                    const ratio = value / maxChartValue;
                    const y = 35 - ratio * 25;
                    return (
                      <circle
                        key={day.date}
                        cx={x}
                        cy={y}
                        r={0.8}
                        fill="currentColor"
                      />
                    );
                  })}
                </svg>
                {/* Légende simple */}
                <div className="mt-3 flex justify-between text-[10px] text-gray-500">
                  <span>{chartData[0].label}</span>
                  <span>{chartData[Math.floor(chartData.length / 2)].label}</span>
                  <span>{chartData[chartData.length - 1].label}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diagramme des statuts de commandes */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Répartition des statuts de commandes
            </h3>
            {stats.statusBreakdown.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Aucune commande pour le moment.
              </p>
            ) : (
              <div className="space-y-3">
                {(() => {
                  const total = stats.statusBreakdown.reduce(
                    (sum, s) => sum + s.count,
                    0
                  );
                  const max = stats.statusBreakdown.reduce(
                    (max, s) => (s.count > max ? s.count : max),
                    0
                  );
                  const labels: Record<string, string> = {
                    PENDING: 'En attente',
                    PAID: 'Payée',
                    PROCESSING: 'En traitement',
                    SHIPPED: 'Expédiée',
                    DELIVERED: 'Livrée',
                    CANCELLED: 'Annulée',
                    REFUNDED: 'Remboursée',
                  };
                  const colors: Record<string, string> = {
                    PENDING: 'bg-yellow-400',
                    PAID: 'bg-blue-500',
                    PROCESSING: 'bg-purple-500',
                    SHIPPED: 'bg-indigo-500',
                    DELIVERED: 'bg-green-500',
                    CANCELLED: 'bg-red-500',
                    REFUNDED: 'bg-gray-500',
                  };

                  return stats.statusBreakdown.map((item) => {
                    const percent = total > 0 ? (item.count / total) * 100 : 0;
                    const width = max > 0 ? (item.count / max) * 100 : 0;
                    const label = labels[item.status] || item.status;
                    const color = colors[item.status] || 'bg-gray-400';

                    return (
                      <div key={item.status} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-700">{label}</span>
                          <span className="text-gray-500">
                            {item.count} · {percent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full ${color} transition-all`}
                            style={{ width: `${width || 4}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

