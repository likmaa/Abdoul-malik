'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { Badge } from '@/frontend/components/ui/Badge';

interface OrderItem {
  id: string;
  quantity: number;
  priceHT: number;
  vatRate: number;
  products: {
    id: string;
    name: any;
    sku: string;
    images: string[];
  } | null;
}

interface Address {
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string | null;
}

interface Order {
  id: string;
  status: string;
  totalHT: number;
  totalTTC: number;
  vatAmount: number;
  shippingCost: number;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  createdAt: string;
  updatedAt: string;
  users: {
    name: string | null;
    email: string;
  };
  order_items: OrderItem[];
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

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [refundData, setRefundData] = useState({
    amount: '',
    reason: '',
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/orders/${id}`);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || 'Erreur lors du chargement de la commande');
        }
        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la commande');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchOrder();
    }
  }, [id]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-electric mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la commande...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Link href="/admin/orders" className="text-violet-electric hover:underline text-sm">
          ← Retour à la liste des commandes
        </Link>
        <div className="text-center py-12">
          <p className="text-gray-600">
            {error || "Commande introuvable ou erreur lors du chargement."}
          </p>
        </div>
      </div>
    );
  }

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingRefund(true);

    try {
      const response = await fetch(`/api/admin/orders/${id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: refundData.amount ? Math.round(parseFloat(refundData.amount) * 100) : undefined,
          reason: refundData.reason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors du remboursement');
      }

      const data = await response.json();
      alert(data.message);
      setShowRefundModal(false);
      setRefundData({ amount: '', reason: '' });
      // TODO: Recharger les données de la commande
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors du remboursement');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour du statut');
      }

      const data = await response.json();
      setOrder(data.order);
      setShowStatusModal(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const canRefund =
    order.status !== 'REFUNDED' &&
    order.status !== 'CANCELLED' &&
    order.status === 'PAID';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="text-gray-500 hover:text-gray-700"
            >
              ← Retour
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Commande {order.id}</h2>
          </div>
          <p className="text-gray-600 mt-1">
            Créée le {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[order.status as keyof typeof statusColors]
              }`}
          >
            {statusLabels[order.status as keyof typeof statusLabels]}
          </span>
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowStatusModal(!showStatusModal)}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? 'Mise à jour...' : 'Modifier le statut'}
            </Button>

            {showStatusModal && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                {Object.entries(statusLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => handleStatusUpdate(value)}
                    disabled={value === order.status}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${value === order.status ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Articles de la commande
              </h3>
              <div className="space-y-4">
                {order.order_items.map((item) => {
                  const productName =
                    typeof item.products?.name === 'object'
                      ? item.products.name.fr || item.products.name.en || 'Produit'
                      : item.products?.name || 'Produit';
                  const sku = item.products?.sku || '—';
                  const image =
                    item.products?.images?.[0] ||
                    'https://via.placeholder.com/100x100.png?text=Produit';
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
                    >
                      <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={image}
                          alt={productName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{productName}</p>
                        <p className="text-sm text-gray-500">SKU: {sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                        <p className="font-semibold text-gray-900">
                          {((item.priceHT * item.quantity * (1 + item.vatRate)) / 100).toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Adresse de livraison
              </h3>
              {order.shippingAddress ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">
                    {order.shippingAddress.firstName}{' '}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.postalCode}{' '}
                    {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2">Tél: {order.shippingAddress.phone}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Aucune adresse de livraison renseignée.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">
                  {order.users.name || order.users.email}
                </p>
                <p className="text-gray-600">{order.users.email}</p>
                {order.shippingAddress?.phone && (
                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Résumé de la commande
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total HT</span>
                  <span className="font-medium text-gray-900">
                    {(order.totalHT / 100).toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TVA</span>
                  <span className="font-medium text-gray-900">
                    {(order.vatAmount / 100).toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-medium text-gray-900">
                      {(order.shippingCost / 100).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total TTC</span>
                  <span className="text-xl font-bold text-violet-electric">
                    {(order.totalTTC / 100).toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                </div>
              </div>
              {canRefund && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => setShowRefundModal(true)}
                  >
                    Effectuer un remboursement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de remboursement */}
      {
        showRefundModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Effectuer un remboursement</h3>
              <form onSubmit={handleRefund} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant (€) - Laisser vide pour remboursement total
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={(order.totalTTC / 100).toFixed(2)}
                    value={refundData.amount}
                    onChange={(e) => setRefundData({ ...refundData, amount: e.target.value })}
                    placeholder={`Max: ${(order.totalTTC / 100).toFixed(2)}€`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Montant total: {(order.totalTTC / 100).toFixed(2)}€
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raison du remboursement *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={refundData.reason}
                    onChange={(e) => setRefundData({ ...refundData, reason: e.target.value })}
                    placeholder="Ex: Produit défectueux, demande client, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={isProcessingRefund}
                  >
                    {isProcessingRefund ? 'Traitement...' : 'Confirmer le remboursement'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowRefundModal(false);
                      setRefundData({ amount: '', reason: '' });
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
}

