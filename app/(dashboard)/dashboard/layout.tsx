"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import UserSidebar from "@/components/dashboard/UserSidebar";
import UserNavbar from "@/components/dashboard/UserNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
    <div className="flex min-h-screen bg-[#f5f6fa] dark:bg-[#0f1117] transition-colors">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <UserSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <UserNavbar onToggle={() => setIsSidebarOpen((v) => !v)} isOpen={isSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        <footer className="bg-[#111111] text-center text-sm text-white py-4">
          Copyright &copy; {new Date().getFullYear()} GetReviews. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
