"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import SideCart from "@/components/SideCart";
import { usePathname } from "next/navigation";

function CartWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showCart = pathname === "/buy-reviews" || pathname === "/cart";
  return (
    <>
      {children}
      {showCart && <SideCart />}
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <CartWrapper>{children}</CartWrapper>
      </CartProvider>
    </SessionProvider>
  );
}
