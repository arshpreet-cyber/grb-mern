"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import StoreProvider from "./StoreProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </StoreProvider>
    </SessionProvider>
  );
}
