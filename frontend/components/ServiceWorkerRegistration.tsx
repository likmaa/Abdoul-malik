'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Service worker désactivé temporairement pour résoudre les conflits en production
    /*
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker enregistré avec succès:', registration.scope);
        })
        .catch((error) => {
          console.log('Échec de l\'enregistrement du Service Worker:', error);
        });
    }
    */
  }, []);

  return null;
}


