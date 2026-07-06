'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/frontend/hooks/useAuth';
import { Card, CardContent, CardHeader } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Rediriger si non authentifié (dans useEffect pour éviter les erreurs SSR)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?callbackUrl=/profile');
    }
  }, [isAuthenticated, authLoading, router]);

  // Afficher un loader pendant la vérification de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-electric mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Ne rien afficher si non authentifié (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors du changement de mot de passe');
        setIsLoading(false);
        return;
      }

      setSuccess('Mot de passe modifié avec succès !');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
      setIsLoading(false);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérer vos informations personnelles</p>
        </div>

        {/* Informations utilisateur */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Informations</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <p className="text-gray-900">{user?.name || 'Non défini'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-violet-100 text-violet-800">
                {user?.role}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Mot de passe
              </h2>
              {!isChangingPassword && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Modifier le mot de passe
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isChangingPassword ? (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    {success}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mot de passe actuel *
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nouveau mot de passe *
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    placeholder="Au moins 8 caractères"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 8 caractères
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirmer le nouveau mot de passe *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    placeholder="Répétez le nouveau mot de passe"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setError('');
                      setSuccess('');
                    }}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-gray-600 text-sm">
                Cliquez sur "Modifier le mot de passe" pour changer votre mot de passe.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <Link href="/">
            <Button variant="outline">← Retour à l'accueil</Button>
          </Link>
          {user?.role === 'ADMIN' || user?.role === 'MANAGER' ? (
            <Link href="/admin">
              <Button variant="primary">Panel Admin</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

