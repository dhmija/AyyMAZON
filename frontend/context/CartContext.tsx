"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchCart } from "@/lib/cart";

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
  updateCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      const data = await fetchCart();
      if (data) {
        const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error("Failed to refresh cart count:", error);
    }
  }, []);

  const updateCartCount = (count: number) => {
    setCartCount(count);
  };

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
