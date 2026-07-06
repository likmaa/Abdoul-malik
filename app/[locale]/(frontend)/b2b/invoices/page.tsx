'use client';

import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { BoxIcon } from '@/admin-panel/components/admin/AdminIcons';

// Données mockées - à remplacer par des appels API
const mockInvoices = [
  {
    id: 'INV-2024-001',
    orderId: 'ORD-B2B-1001',
    date: '2024-11-25',
    amount: 49900,
    status: 'paid',
    downloadUrl: '#',
  },
  {
    id: 'INV-2024-002',
    orderId: 'ORD-B2B-1002',
    date: '2024-11-24',
    amount: 119900,
    status: 'paid',
    downloadUrl: '#',
  },
  {
    id: 'INV-2024-003',
    orderId: 'ORD-B2B-1003',
    date: '2024-11-23',
    amount: 249900,
    status: 'pending',
    downloadUrl: '#',
  },
];

export default function B2BInvoicesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mes Factures</h2>
        <p className="text-gray-600 mt-1">
          Téléchargez et consultez toutes vos factures
        </p>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {mockInvoices.map((invoice) => (
          <Card key={invoice.id} hover>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-mono font-semibold text-gray-900">
                      {invoice.id}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Commande: {invoice.orderId}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(invoice.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {(invoice.amount / 100).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>
                    <p className="text-xs text-gray-500">HT</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // TODO: Télécharger la facture
                      window.open(invoice.downloadUrl, '_blank');
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <BoxIcon className="w-4 h-4" />
                      <span>Télécharger</span>
                    </span>
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

