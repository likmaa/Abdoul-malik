'use client';

import { motion } from 'framer-motion';

interface MobileFiltersButtonProps {
  onClick: () => void;
  activeFiltersCount: number;
}

export function MobileFiltersButton({ onClick, activeFiltersCount }: MobileFiltersButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed top-20 right-4 z-40 lg:hidden bg-violet-electric text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 min-w-[44px] min-h-[44px]"
      whileTap={{ scale: 0.95 }}
      aria-label="Ouvrir les filtres"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      <span className="font-medium text-sm">Filtres</span>
      {activeFiltersCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white text-violet-electric text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5"
        >
          {activeFiltersCount}
        </motion.span>
      )}
    </motion.button>
  );
}


