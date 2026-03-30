"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface WishlistContextType {
  showWishlistNotification: (message: string) => void;
  notificationMessage: string;
  isNotificationVisible: boolean;
  hideNotification: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const showWishlistNotification = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const hideNotification = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <WishlistContext.Provider value={{ 
      showWishlistNotification, 
      notificationMessage: message, 
      isNotificationVisible: visible,
      hideNotification
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistNotification() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlistNotification must be used within a WishlistProvider");
  }
  return context;
}
