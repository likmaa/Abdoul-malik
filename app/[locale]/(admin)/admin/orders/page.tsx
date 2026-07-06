'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Badge } from '@/frontend/components/ui/Badge';
import { Button } from '@/frontend/components/ui/Button';
import { useAuth } from '@/frontend/hooks/useAuth';
import { FileDownloadIcon } from '@/admin-panel/components/admin/AdminIcons';

interface Order {
  id: string;
  users: {
    id: string;
    email: string;
    name: string | null;
    role?: string | null;
  };
  totalTTC: number;
  status: string;
  createdAt: string;
  order_items: Array<{
    quantity: number;
  }>;
  shippingAddress?: any;
  paymentMethod?: string | null;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  PENDING: 'En attente',
  PAID: 'Payée',
  PROCESSING: 'En traitement',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée',
};

type StatusFilter = 'all' | keyof typeof statusLabels;

export default function AdminOrdersPage() {
  const { permissions, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const params = new URLSearchParams();
        if (filterStatus !== 'all') params.append('status', filterStatus);
        if (searchTerm) params.append('search', searchTerm);

        const response = await fetch(`/api/admin/orders?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [filterStatus, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getCountryLabel = (order: Order) => {
    const address = order.shippingAddress as any;
    if (!address) return '';
    if (address.country && address.city) {
      return `${address.country} · ${address.postalCode ?? ''} ${address.city}`.trim();
    }
    if (address.country) return address.country;
    return '';
  };

  const handleDeleteOrder = async (orderId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/delete`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
        setDeleteOrderId(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h2>
          <p className="text-gray-600 mt-1">
            {orders.length} commande(s) trouvée(s)
          </p>
        </div>
        {permissions.canExportData && (
          <Button
            variant="outline"
            onClick={() => {
              window.open('/api/admin/export?type=orders&format=csv', '_blank');
            }}
          >
            <span className="flex items-center gap-2">
              <FileDownloadIcon />
              <span>Exporter CSV</span>
            </span>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recherche
                </label>
                <input
                  type="text"
                  placeholder="ID, client, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="block text-sm font-medium text-gray-700">
                  Statut
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1 rounded-full text-xs md:text-sm border transition-colors ${filterStatus === 'all'
                        ? 'bg-violet-electric text-white border-violet-electric'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Tous
                  </button>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilterStatus(value as StatusFilter)}
                      className={`px-3 py-1 rounded-full text-xs md:text-sm border transition-colors ${filterStatus === value
                          ? 'bg-violet-electric text-white border-violet-electric'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {filterStatus !== 'all' && (
              <p className="text-xs text-gray-500">
                Filtre actif : {statusLabels[filterStatus as keyof typeof statusLabels]}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-electric mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des commandes...</p>
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
                      Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Articles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total TTC
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
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Aucune commande trouvée
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const itemsCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900 font-mono">
                              {order.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-900">
                                  {order.users.name || 'Client'}
                                </div>
                                {order.users.role === 'B2B_CUSTOMER' && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                                    B2B
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{order.users.email}</div>
                              {getCountryLabel(order) && (
                                <div className="text-xs text-gray-400">
                                  {getCountryLabel(order)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {formatDate(order.createdAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {itemsCount} article{itemsCount > 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {(order.totalTTC / 100).toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status as keyof typeof statusColors]
                                }`}
                            >
                              {statusLabels[order.status as keyof typeof statusLabels]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/orders/${order.id}`}
                                className="text-violet-electric hover:text-violet-700"
                              >
                                Voir →
                              </Link>
                              {user?.role === 'ADMIN' && (
                                <button
                                  onClick={() => setDeleteOrderId(order.id)}
                                  className="text-red-600 hover:text-red-800 ml-2"
                                  title="Supprimer"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la commande <strong className="font-mono">{deleteOrderId}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteOrderId(null)}
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDeleteOrder(deleteOrderId)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

