"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import UserSidebar from "@/components/dashboard/UserSidebar";
import UserNavbar from "@/components/dashboard/UserNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
      <div className="flex min-h-screen bg-[#f5f6fa] dark:bg-[#0f1117] transition-colors">
        {isSidebarOpen && (
          <UserSidebar onToggle={() => setIsSidebarOpen(false)} />
        )}
        
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <UserNavbar onToggle={!isSidebarOpen ? () => setIsSidebarOpen(true) : undefined} />
          <main className="flex-1 p-6 overflow-auto">{children}</main>     
            <footer className="bg-[#111111] text-center text-sm text-[#FFFFFF] py-4">
              Copyright &copy; {new Date().getFullYear()} GetReviews. All rights reserved.
            </footer> 
        </div>
      </div>
  );
}