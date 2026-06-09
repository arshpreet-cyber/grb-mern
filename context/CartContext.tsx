"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  platform: string;
  icon: string;
  image: string;
  type: "one-time" | "subscribe";
  qty: number;
  pricePerUnit: number;
};

type CartCtx = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDbProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setDbProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products in CartContext:", err);
      }
    }
    fetchDbProducts();
  }, []);

  const getProductIdentifier = (cartItemId: string) => {
    const patterns = ["-onetime", "-monthly", "-subscribe", "-one-time"];
    for (const pattern of patterns) {
      const idx = cartItemId.indexOf(pattern);
      if (idx !== -1) {
        return cartItemId.substring(0, idx);
      }
    }
    return cartItemId;
  };

  const getResolvedImage = (item: CartItem) => {
    if (dbProducts.length === 0) return item.image;
    const identifier = getProductIdentifier(item.id);
    const dbProduct = dbProducts.find(
      (p) => p.id?.toString() === identifier || p.slug === identifier
    );
    return dbProduct?.image || item.image;
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("grb_cart");
      setItems(saved ? JSON.parse(saved) : []);
    } catch {
      setItems([]);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("grb_cart", JSON.stringify(items));
  }, [hasHydrated, items]);

  const MIN_QTY = 5;

  const addItem = (item: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const identifier = getProductIdentifier(item.id);
      const dbProduct = dbProducts.find(
        (p) => p.id?.toString() === identifier || p.slug === identifier
      );
      const resolvedImage = dbProduct?.image || item.image;

      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, image: resolvedImage, qty: MIN_QTY }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty < MIN_QTY) {
      alert(`Minimum quantity is ${MIN_QTY}.`);
      return;
    }
    setItems((p) => p.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const itemsWithLatestImages = items.map((item) => ({
    ...item,
    image: getResolvedImage(item),
  }));

  const total = itemsWithLatestImages.reduce((sum, i) => sum + i.pricePerUnit * i.qty, 0);
  const count = itemsWithLatestImages.length;

  return (
    <CartContext.Provider value={{ items: itemsWithLatestImages, addItem, removeItem, updateQty, clearCart, isOpen, openCart, closeCart, toggleCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
