"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar"; // <-- Swapped to AdminSidebar
import { useSession, signOut } from "next-auth/react";
import { ChevronsRight } from "lucide-react"; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  
  // Track if sidebar is open
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">
      
      {/* Conditionally render the Admin Sidebar */}
      {isSidebarOpen && (
        <AdminSidebar onToggle={() => setIsSidebarOpen(false)} />
      )}
      
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Search bar & re-open button */}
            <div className="flex items-center gap-3 w-full max-w-sm">
              
              {/* Show the "Open" button ONLY when the sidebar is hidden */}
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Open Sidebar"
                >
                  <ChevronsRight size={20} />
                </button>
              )}

              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
                <input 
                  type="search" 
                  placeholder="Search admin..."
                  className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-8 pr-4 text-sm text-gray-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition" 
                />
              </div>
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-2">
              <button className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition text-sm">
                🔔
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  3
                </span>
              </button>
              
              <div className="flex items-center gap-2.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 ml-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-xs font-bold text-white">
                  {session?.user?.name?.charAt(0)?.toUpperCase() ?? "A"}
                </div>
                <div className="text-xs leading-4 hidden sm:block">
                  <p className="font-semibold text-gray-800">{session?.user?.name ?? "Admin"}</p>
                  <p className="text-gray-400 uppercase text-[10px] font-semibold mt-0.5">
                    {session?.user?.role ?? "ADMIN"}
                  </p>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="ml-2 text-gray-400 hover:text-red-500 transition text-xs" 
                  title="Logout"
                >
                  ⏻
                </button>
              </div>
            </div>
            
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}