'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isEmailVerified: boolean;
  vatNumber: string | null;
  createdAt: string;
  _count: {
    orders: number;
    addresses: number;
  };
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'CUSTOMER' as const,
    vatNumber: '',
    isEmailVerified: false,
    password: '',
  });

  useEffect(() => {
    fetchUser();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${id}`);
      if (!response.ok) throw new Error('Utilisateur non trouvé');
      
      const data = await response.json();
      setUser(data.user);
      setFormData({
        email: data.user.email,
        name: data.user.name || '',
        role: data.user.role,
        vatNumber: data.user.vatNumber || '',
        isEmailVerified: data.user.isEmailVerified,
        password: '',
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData: any = {
        email: formData.email,
        name: formData.name || undefined,
        role: formData.role,
        vatNumber: formData.vatNumber || undefined,
        isEmailVerified: formData.isEmailVerified,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      router.push('/admin/users');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Utilisateur non trouvé</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/users"
              className="text-gray-500 hover:text-gray-700"
            >
              ← Retour
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Modifier l'utilisateur</h2>
          </div>
          <p className="text-gray-600 mt-1">Email: {user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations Générales
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rôle *
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    >
                      <option value="CUSTOMER">Client</option>
                      <option value="B2B_CUSTOMER">Client B2B</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro TVA (pour B2B)
                    </label>
                    <input
                      type="text"
                      value={formData.vatNumber}
                      onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isEmailVerified"
                      checked={formData.isEmailVerified}
                      onChange={(e) => setFormData({ ...formData, isEmailVerified: e.target.checked })}
                      className="w-4 h-4 text-violet-electric border-gray-300 rounded focus:ring-violet-electric"
                    />
                    <label htmlFor="isEmailVerified" className="text-sm text-gray-700">
                      Email vérifié
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Changer le mot de passe
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe (laisser vide pour ne pas changer)
                  </label>
                  <input
                    type="password"
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 8 caractères
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Statistiques
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commandes</span>
                    <span className="font-medium text-gray-900">{user._count.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adresses</span>
                    <span className="font-medium text-gray-900">{user._count.addresses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inscrit le</span>
                    <span className="font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full">
                  Annuler
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

