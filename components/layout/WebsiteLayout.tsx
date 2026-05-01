"use client";

import HomeNavbar from "@/components/layout/HomeNavbar";
import HomeFooter from "@/components/layout/HomeFooter";
import SideCart from "@/components/cart/SideCart";
import AdminToolbar from "@/components/admin/AdminToolbar";

import { useSearchParams } from "next/navigation";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  if (isEditMode) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <main className="flex-grow">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminToolbar />
      <HomeNavbar />
      <SideCart />
      <main className="flex-grow">{children}</main>
      <HomeFooter />
    </div>
  );
}
