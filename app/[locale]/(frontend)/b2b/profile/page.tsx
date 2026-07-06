'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

// Données mockées - à remplacer par des appels API
const mockProfile = {
  companyName: 'Tech Solutions SARL',
  email: 'contact@techsolutions.fr',
  vatNumber: 'FR12345678901',
  phone: '+33 1 23 45 67 89',
  address: {
    street: '123 Rue de la République',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
  },
  paymentTerms: '30 jours',
  discountRate: 15,
};

export default function B2BProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Appel API pour mettre à jour le profil
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profil Entreprise</h2>
        <p className="text-gray-600 mt-1">Gérez les informations de votre entreprise</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations Entreprise */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations Entreprise
                </h3>
                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Modifier
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de TVA Intracommunautaire *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={formData.vatNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, vatNumber: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                      placeholder="FR12345678901"
                    />
                  ) : (
                    <p className="text-gray-900 font-mono">{formData.vatNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conditions Commerciales */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Conditions Commerciales
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conditions de Paiement
                  </label>
                  <p className="text-gray-900">{formData.paymentTerms}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Contactez-nous pour modifier
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux de Remise B2B
                  </label>
                  <p className="text-2xl font-bold text-violet-electric">
                    {formData.discountRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Remise appliquée automatiquement sur vos commandes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <Button type="submit" variant="primary">
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setFormData(mockProfile);
              }}
            >
              Annuler
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

