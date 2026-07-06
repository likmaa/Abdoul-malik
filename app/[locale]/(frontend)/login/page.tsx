'use client';

export const dynamic = 'force-dynamic';

import { useState, Suspense, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Rediriger automatiquement si l'utilisateur est déjà connecté
  useEffect(() => {
    if (session?.user) {
      const userRole = session.user.role;
      if (userRole === 'ADMIN' || userRole === 'MANAGER') {
        router.push('/admin');
      } else if (callbackUrl && callbackUrl !== '/') {
        router.push(callbackUrl);
      } else {
        router.push('/');
      }
    }
  }, [session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
        setIsLoading(false);
      } else {
        // Redirection après succès :
        // - si un callbackUrl est présent (ex: accès à une page protégée) on le respecte
        // - sinon, on envoie par défaut vers /admin (les rôles non autorisés seront bloqués par le middleware / layout)
        const target =
          callbackUrl && callbackUrl !== '/'
            ? callbackUrl
            : '/admin';

        router.push(target);
        router.refresh();
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img
              src="/logo.webp"
              alt="eJS MARKET"
              className="h-12 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connexion
          </h1>
          <p className="text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-violet-electric border-gray-300 rounded focus:ring-violet-electric"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Se souvenir de moi
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-violet-electric hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-violet-electric hover:underline font-medium">
                  Créer un compte
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">
                Vous êtes un professionnel ?
              </p>
              <Link href="/register?type=b2b">
                <Button variant="outline" className="w-full">
                  Créer un compte B2B
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-electric"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

