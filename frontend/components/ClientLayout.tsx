'use client';

import { useState, useEffect } from 'react';
import { PageLoader } from './PageLoader';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Masquer le loader plus rapidement pour une meilleure UX
    const minDisplayTime = 300; // Temps minimum d'affichage (300ms)
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    };

    // Si la page est déjà chargée
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      // Attendre le chargement complet
      window.addEventListener('load', handleLoad);
      
      // Fallback : masquer après un délai maximum (réduit à 1.5s)
      const fallbackTimer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  return (
    <>
      <PageLoader isLoading={isLoading} />
      {children}
    </>
  );
}

