"use client";

import { useState, Suspense } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

import Wrapper from "@/components/Wrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Wrapper>
      <div className="flex min-h-screen bg-[#f5f6fa]">
        <Suspense fallback={<div className="w-64 bg-[#0f1117]" />}>
          <AdminSidebar />
        </Suspense>
        
        <div className="flex flex-1 flex-col min-w-0">
          <AdminNavbar onToggle={!isSidebarOpen ? () => setIsSidebarOpen(true) : undefined} />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </Wrapper>
  );
}
