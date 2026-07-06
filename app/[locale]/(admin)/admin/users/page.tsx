'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { FileDownloadIcon } from '@/admin-panel/components/admin/AdminIcons';

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
  };
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'CUSTOMER' as const,
    vatNumber: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error('Erreur lors du chargement');

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      setShowCreateModal(false);
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'CUSTOMER',
        vatNumber: '',
      });
      fetchUsers();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      fetchUsers();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'MANAGER':
        return 'bg-yellow-100 text-yellow-800';
      case 'B2B_CUSTOMER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const makeB2B = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'B2B_CUSTOMER' }),
      });
      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour du rôle');
      }
      fetchUsers();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la mise à jour du rôle',
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
          <p className="text-gray-600 mt-1">Gérer les utilisateurs de la plateforme</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              window.open('/api/admin/export?type=users&format=csv', '_blank');
            }}
          >
            <span className="flex items-center gap-2">
              <FileDownloadIcon />
              <span>Exporter CSV</span>
            </span>
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Ajouter un utilisateur
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Rechercher par email ou nom..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
            />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
            >
              <option value="">Tous les rôles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="CUSTOMER">Client</option>
              <option value="B2B_CUSTOMER">B2B</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Chargement...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Aucun utilisateur trouvé</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commandes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vérifié</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.name || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user._count.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isEmailVerified ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-gray-400">✗</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2 items-center flex-wrap">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="text-violet-electric hover:text-violet-700"
                          >
                            Modifier
                          </Link>
                          {user.role !== 'B2B_CUSTOMER' && (
                            <button
                              onClick={() => makeB2B(user.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Passer en B2B
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Précédent
          </Button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {page} sur {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Créer un utilisateur</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Création...' : 'Créer'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

