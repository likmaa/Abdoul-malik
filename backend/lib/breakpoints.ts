/**
 * Breakpoints Tailwind CSS utilisés dans le projet
 * 
 * Ces breakpoints définissent les points de rupture pour le responsive design
 */

export const BREAKPOINTS = {
  /**
   * Petits mobiles (640px et plus)
   * Utilisé pour les ajustements sur très petits écrans
   */
  sm: 640,
  
  /**
   * Tablettes (768px et plus)
   * Utilisé pour les ajustements sur tablettes en mode portrait
   */
  md: 768,
  
  /**
   * Desktop (1024px et plus) - TRANSITION PRINCIPALE
   * Point de rupture principal entre mobile et desktop
   * - Mobile: < 1024px (lg)
   * - Desktop: ≥ 1024px (lg)
   */
  lg: 1024,
  
  /**
   * Grands écrans (1280px et plus)
   * Utilisé pour les ajustements sur grands écrans desktop
   */
  xl: 1280,
  
  /**
   * Très grands écrans (1536px et plus)
   * Utilisé pour les ajustements sur très grands écrans
   */
  '2xl': 1536,
} as const;

/**
 * Logique de responsivité du projet
 */
export const RESPONSIVE_LOGIC = {
  /**
   * Mobile: < 1024px (lg)
   * - Bottom Navigation visible
   * - Header simplifié (MobileHeader)
   * - Hero masqué
   * - 2 colonnes pour produits
   * - Filtres via modal
   */
  mobile: {
    max: BREAKPOINTS.lg - 1,
    classes: {
      hide: 'lg:hidden',
      show: 'hidden lg:block',
      grid: 'grid-cols-2',
    },
  },
  
  /**
   * Desktop: ≥ 1024px (lg)
   * - Header complet visible
   * - Bottom Navigation masquée
   * - Hero visible
   * - 3-4 colonnes pour produits
   * - Filtres inline
   */
  desktop: {
    min: BREAKPOINTS.lg,
    classes: {
      hide: 'hidden lg:flex',
      show: 'lg:block',
      grid: 'lg:grid-cols-4',
    },
  },
} as const;

/**
 * Hook pour détecter si on est sur mobile (utilisable côté client)
 */
export const isMobile = (width: number): boolean => {
  return width < BREAKPOINTS.lg;
};

/**
 * Hook pour détecter si on est sur desktop (utilisable côté client)
 */
export const isDesktop = (width: number): boolean => {
  return width >= BREAKPOINTS.lg;
};


