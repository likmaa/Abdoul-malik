'use client';

import { useEffect } from 'react';
import { Button } from '@/frontend/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur pour le debugging
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="w-24 h-24 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-black-deep mb-2">
            Une erreur est survenue
          </h1>
          <p className="text-gray-600 mb-4">
            Désolé, quelque chose s&apos;est mal passé. Veuillez réessayer.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 mb-6">
              Code d&apos;erreur: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-violet-electric hover:bg-violet-700 text-white px-6 py-3"
          >
            Réessayer
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="px-6 py-3"
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    </div>
  );
}

