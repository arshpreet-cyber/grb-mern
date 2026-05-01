"use client";

import HomeNavbar from "@/components/layout/HomeNavbar";
import HomeFooter from "@/components/layout/HomeFooter";
import SideCart from "@/components/cart/SideCart";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />
      <SideCart />
      <main className="flex-grow">{children}</main>
      <HomeFooter />
    </div>
  );
}
