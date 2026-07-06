'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  isLoading: boolean;
}

export function PageLoader({ isLoading }: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Logo avec animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <div className="relative w-20 h-20">
                <img
                  src="/logo.webp"
                  alt="eJS MARKET"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>

            {/* Spinner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="w-12 h-12 border-4 border-violet-electric/20 border-t-violet-electric rounded-full animate-spin"></div>
            </motion.div>

            {/* Texte de chargement */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <p className="text-sm font-medium text-gray-600">Chargement...</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

