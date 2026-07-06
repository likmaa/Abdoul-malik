'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/frontend/components/ui/Card';

type B2BRequest = {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  vatNumber: string;
  city: string;
  country: string;
  sector: string;
  annualVolume: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
};

export default function AdminB2BRequestsPage() {
  const [requests, setRequests] = useState<B2BRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch('/api/admin/b2b/requests');
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des demandes B2B');
        }
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erreur inattendue lors du chargement',
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchRequests();
  }, []);

  async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/b2b/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du statut');
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur inattendue lors de la mise à jour',
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-height-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-electric mx-auto mb-4" />
          <p className="text-gray-600">Chargement des demandes B2B...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Demandes B2B</h2>
        <p className="text-gray-600 mt-1">
          Suivi des demandes d&apos;ouverture de compte grossiste.
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">
              Aucune demande B2B pour le moment. Les demandes reçues via la page &quot;Be
              Pro&quot; apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Entreprise
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Secteur
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Volume annuel
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Reçue le
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{req.companyName}</div>
                      <div className="text-xs text-gray-500">TVA : {req.vatNumber}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-900">{req.email}</div>
                      <div className="text-xs text-gray-500">{req.phone}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-900">{req.sector}</div>
                      <div className="text-xs text-gray-500">
                        {req.city}, {req.country}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                      {req.annualVolume}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          req.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : req.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {req.status === 'PENDING'
                          ? 'En attente'
                          : req.status === 'APPROVED'
                          ? 'Approuvée'
                          : 'Refusée'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                      {new Date(req.createdAt).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => updateStatus(req.id, 'APPROVED')}
                        disabled={updatingId === req.id || req.status === 'APPROVED'}
                        className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
                      >
                        Approuver
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(req.id, 'REJECTED')}
                        disabled={updatingId === req.id || req.status === 'REJECTED'}
                        className="px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
                      >
                        Refuser
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


