'use client';
import React, { createContext, useContext, useState } from 'react';

type WishlistContextType = {
  wishlistItems: any[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      isInWishlist: () => false,
      clearWishlist: () => {},
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
