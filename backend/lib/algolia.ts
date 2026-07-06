import { algoliasearch } from 'algoliasearch';
import { env } from './env';

// Nom d'index par défaut pour les produits
export const ALGOLIA_PRODUCTS_INDEX = 'products';

type AlgoliaClients = {
  client: any;
  productsIndex: any;
};

let cached: AlgoliaClients | null = null;

export function getAlgoliaClients(): AlgoliaClients {
  if (cached) return cached;

  const appId = env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const adminKey = env.ALGOLIA_ADMIN_API_KEY;

  if (!appId || !adminKey) {
    if (env.NODE_ENV !== 'production') {
      console.warn(
        '[Algolia] Variables NEXT_PUBLIC_ALGOLIA_APP_ID ou ALGOLIA_ADMIN_API_KEY manquantes. Algolia est désactivé.'
      );
    }

    cached = {
      client: null,
      productsIndex: null,
    };

    return cached;
  }

  try {
    const client = algoliasearch(appId, adminKey);
    // Dans Algolia v5, on n'utilise plus initIndex sur le client de base.
    // L'index est spécifié lors des appels de méthode sur le client.
    cached = { client, productsIndex: null };
  } catch (error) {
    console.error('[Algolia] Erreur d\'initialisation:', error);
    cached = { client: null, productsIndex: null };
  }

  return cached;
}

export function isAlgoliaEnabled(): boolean {
  const { client } = getAlgoliaClients();
  return !!client;
}


