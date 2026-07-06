'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  priceHT: number;
  vatRate: number;
  quantity: number;
  image?: string;
}

const CART_STORAGE_KEY = 'ej-store-cart';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          setCart(JSON.parse(stored));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.productId === item.productId);
      
      if (existingItem) {
        return prevCart.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      
      return [...prevCart, { ...item, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const itemsCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  
  const totalHT = useMemo(() => 
    cart.reduce(
      (sum, item) => sum + item.priceHT * item.quantity,
      0
    ),
    [cart]
  );
  
  const totalVAT = useMemo(() => 
    cart.reduce(
      (sum, item) => sum + item.priceHT * item.vatRate * item.quantity,
      0
    ),
    [cart]
  );
  
  const totalTTC = useMemo(() => totalHT + totalVAT, [totalHT, totalVAT]);

  return {
    cart,
    itemsCount,
    totalHT,
    totalVAT,
    totalTTC,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoaded,
  };
}

