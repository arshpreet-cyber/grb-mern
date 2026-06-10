"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Open by default on desktop, closed on mobile
  useEffect(() => {
    if (window.innerWidth >= 1024) setIsSidebarOpen(true);
  }, []);

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#f5f6fa] dark:bg-[#0f1117]">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Suspense fallback={<div className="fixed inset-y-0 left-0 z-50 w-64 h-screen bg-[#fafafa] dark:bg-[#0f1117] border-r border-gray-200 dark:border-slate-800 hidden lg:block" />}>
        <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(false)} />
      </Suspense>

      <div className={`flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "lg:pl-64" : "lg:pl-0"
      }`}>
        <AdminNavbar onToggle={() => setIsSidebarOpen((v) => !v)} isOpen={isSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
