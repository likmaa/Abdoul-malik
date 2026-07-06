'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MobileProductCard } from './MobileProductCard';

interface Product {
  id: number | string;
  name: string;
  creator: string;
  category: string;
  image: string;
  price: number;
}

interface MobileProductCarouselProps {
  products: Product[];
  onViewProduct?: (product: Product) => void;
}

export function MobileProductCarousel({ 
  products, 
  onViewProduct 
}: MobileProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isUserInteractingRef = useRef(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollSpeedRef = useRef(0.3); // Vitesse de défilement (pixels par frame)

  // Dupliquer les produits pour créer un effet infini (6 copies pour plus de fluidité)
  const duplicatedProducts = [...products, ...products, ...products, ...products, ...products, ...products];

  // Fonction pour obtenir la largeur totale d'une carte avec gap
  const getCardTotalWidth = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    const cardWidth = window.innerWidth - 32; // 100vw - 2rem (32px de padding)
    const gap = 12; // gap-3 = 12px
    return cardWidth + gap;
  }, []);

  // Fonction pour obtenir la largeur d'une série complète
  const getSingleSetWidth = useCallback(() => {
    return products.length * getCardTotalWidth();
  }, [products.length, getCardTotalWidth]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || products.length === 0) return;

    const getCardTotalWidth = () => {
      if (typeof window === 'undefined') return 0;
      const cardWidth = window.innerWidth - 32;
      const gap = 12;
      return cardWidth + gap;
    };

    const getSingleSetWidth = () => {
      return products.length * getCardTotalWidth();
    };

    // Initialiser la position au milieu (début de la 3ème série)
    const initializePosition = () => {
      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth > 0) {
        container.scrollLeft = singleSetWidth * 2;
      }
    };

    // Attendre que le DOM soit prêt
    const initTimeout = setTimeout(initializePosition, 300);

    // Gérer la boucle infinie lors du scroll
    const handleScroll = () => {
      if (!container) return;

      // Marquer que l'utilisateur interagit
      isUserInteractingRef.current = true;
      
      // Annuler le timeout précédent
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }

      // Réactiver l'auto-scroll après 2 secondes d'inactivité
      pauseTimeoutRef.current = setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 2000);

      // Gérer la boucle infinie
      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth <= 0) return;

      const { scrollLeft } = container;

      // Si on est dans la première série, sauter à la troisième (sans animation)
      if (scrollLeft < singleSetWidth * 0.5) {
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = scrollLeft + singleSetWidth * 2;
        setTimeout(() => {
          if (container) container.style.scrollBehavior = 'smooth';
        }, 50);
      }
      // Si on est dans la dernière série, revenir à la troisième (sans animation)
      else if (scrollLeft > singleSetWidth * 4.5) {
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = scrollLeft - singleSetWidth * 2;
        setTimeout(() => {
          if (container) container.style.scrollBehavior = 'smooth';
        }, 50);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    // Défilement infini continu avec requestAnimationFrame
    const animate = () => {
      if (!container || isUserInteractingRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const currentScroll = container.scrollLeft;
      const newScroll = currentScroll + scrollSpeedRef.current;
      
      container.scrollLeft = newScroll;

      // Gérer la boucle infinie
      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth > 0) {
        if (container.scrollLeft > singleSetWidth * 4.5) {
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = container.scrollLeft - singleSetWidth * 2;
          setTimeout(() => {
            if (container) container.style.scrollBehavior = 'smooth';
          }, 50);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Démarrer l'animation après l'initialisation
    const startTimeout = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 1000);

    // Gérer le resize avec debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (container) {
          const singleSetWidth = getSingleSetWidth();
          if (singleSetWidth > 0) {
            // Réinitialiser la position au milieu
            container.style.scrollBehavior = 'auto';
            container.scrollLeft = singleSetWidth * 2;
            setTimeout(() => {
              if (container) container.style.scrollBehavior = 'smooth';
            }, 50);
          }
        }
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(startTimeout);
      clearTimeout(resizeTimeout);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [products]);

  if (products.length === 0) return null;

  return (
    <div className="lg:hidden w-full overflow-hidden">
      {/* Container scrollable avec défilement infini automatique */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          scrollBehavior: 'smooth',
        }}
      >
        {duplicatedProducts.map((product, index) => (
          <motion.div
            key={`${product.id}-${index}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index % products.length) * 0.03 }}
            className="flex-shrink-0"
            style={{
              width: 'calc(100vw - 2rem)',
              minWidth: 'calc(100vw - 2rem)',
            }}
          >
            <MobileProductCard
              id={String(product.id)}
              name={product.name}
              price={product.price}
              image={product.image}
              creator={product.creator}
              category={product.category}
              onViewProduct={() => onViewProduct?.(product)}
            />
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

