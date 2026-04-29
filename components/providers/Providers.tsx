"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import SideCart from "@/components/cart/SideCart";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
const pathname = usePathname();

  const isHiddenRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
  return (
    <SessionProvider>
      <CartProvider>
        {children}
       {!isHiddenRoute && <SideCart />}
      </CartProvider>
    </SessionProvider>
  );
}
