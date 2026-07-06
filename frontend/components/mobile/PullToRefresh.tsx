'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const opacity = useTransform(springY, [0, threshold], [0, 1]);
  const scale = useTransform(springY, [0, threshold], [0.5, 1]);

  useEffect(() => {
    if (disabled || isRefreshing) return;

    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let isPulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Vérifier si on est en haut de la page
      if (container.scrollTop === 0) {
        touchStartY = e.touches[0].clientY;
        isPulling = true;
        startY.current = touchStartY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;

      const currentTouchY = e.touches[0].clientY;
      const deltaY = currentTouchY - touchStartY;

      if (deltaY > 0 && container.scrollTop === 0) {
        e.preventDefault();
        const distance = Math.min(deltaY * 0.5, threshold * 1.5);
        currentY.current = distance;
        setPullDistance(distance);
        y.set(distance);
      } else {
        isPulling = false;
        y.set(0);
        setPullDistance(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      isPulling = false;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        y.set(threshold);
        
        try {
          await onRefresh();
        } catch (error) {
          console.error('Erreur lors du rafraîchissement:', error);
        } finally {
          setIsRefreshing(false);
          y.set(0);
          setPullDistance(0);
        }
      } else {
        y.set(0);
        setPullDistance(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, isRefreshing, pullDistance, threshold, y, onRefresh]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-auto">
      {/* Indicateur de pull to refresh */}
      <motion.div
        style={{ y: springY, opacity, scale }}
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2 py-4">
          {isRefreshing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-3 border-violet-electric border-t-transparent rounded-full"
              />
              <span className="text-sm text-violet-electric font-medium">Actualisation...</span>
            </>
          ) : (
            <>
              <svg
                className="w-8 h-8 text-violet-electric"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              <span className="text-sm text-violet-electric font-medium">
                {pullDistance >= threshold ? 'Relâchez pour actualiser' : 'Tirez pour actualiser'}
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Contenu */}
      <motion.div
        style={{ y: springY }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}


