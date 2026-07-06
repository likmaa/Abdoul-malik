import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-violet-electric mb-4">404</h1>
          <h2 className="text-3xl font-bold text-black-deep mb-2">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mb-6">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-violet-electric hover:bg-violet-700 text-white px-6 py-3">
              Retour à l&apos;accueil
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="px-6 py-3">
              Voir les produits
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

