'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Badge } from '@/frontend/components/ui/Badge';

// Données mockées - à remplacer par des appels API
const mockOrder = {
  id: 'ORD-B2B-1001',
  customer: {
    companyName: 'Tech Solutions SARL',
    email: 'contact@techsolutions.fr',
  },
  status: 'SHIPPED',
  totalHT: 42415, // Prix B2B avec remise
  totalTTC: 50900,
  vatAmount: 8485,
  shippingCost: 0,
  discount: 15,
  shippingAddress: {
    company: 'Tech Solutions SARL',
    addressLine1: '123 Rue de la République',
    city: 'Paris',
    postalCode: '75001',
    country: 'FR',
    phone: '+33 1 23 45 67 89',
  },
  items: [
    {
      id: '1',
      productId: '2',
      name: 'PlayStation 5',
      sku: 'SON-PS5-0001',
      quantity: 1,
      priceHT: 42415, // Prix B2B
      vatRate: 0.2,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=100',
    },
  ],
  trackingNumber: 'TRACK-123456',
  createdAt: '2024-11-25T10:30:00Z',
};

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

export default function B2BOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const order = mockOrder; // TODO: Récupérer depuis l'API avec l'id

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/b2b/orders"
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
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
                  >
                    <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                      <p className="font-semibold text-gray-900">
                        {((item.priceHT * item.quantity * (1 + item.vatRate)) / 100).toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </p>
                      <p className="text-xs text-gray-500">Prix B2B HT</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Adresse de livraison
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">{order.shippingAddress.company}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>
                  {order.shippingAddress.postalCode} {order.shippingAddress.city}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="mt-2">Tél: {order.shippingAddress.phone}</p>
                )}
              </div>
              {order.trackingNumber && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Numéro de suivi: {order.trackingNumber}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
                  <span className="text-gray-600">Remise B2B ({order.discount}%)</span>
                  <span className="font-medium text-green-600">
                    -{((order.totalHT * order.discount) / (100 - order.discount) / 100).toLocaleString('fr-FR', {
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
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-violet-electric text-white rounded-lg hover:bg-violet-700 transition-colors">
                  📄 Télécharger la facture
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  📦 Suivre l'expédition
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

