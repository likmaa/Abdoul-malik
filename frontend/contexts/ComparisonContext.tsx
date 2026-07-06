'use client';
import React, { createContext, useContext, useState } from 'react';

type ComparisonContextType = {
  items: any[];
  addToCompare: (product: any) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
};

export const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<any[]>([]);

  return (
    <ComparisonContext.Provider value={{
      items,
      addToCompare: () => {},
      removeFromCompare: () => {},
      isInCompare: () => false,
      clearCompare: () => {},
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
