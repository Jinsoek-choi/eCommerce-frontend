"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistItem {
  productId: number;
  productName: string;
  mainImg?: string;
  sellPrice: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.productId === item.productId);
      if (exists) return prev;
      const updated = [...prev, item];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => {
      const updated = prev.filter((p) => p.productId !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
