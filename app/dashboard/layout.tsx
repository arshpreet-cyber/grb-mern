"use client";

import UserSidebar from "@/components/UserSidebar";
import { useSession, signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">
      <UserSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
              <input type="search" placeholder="Search..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-4 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
            </div>
            <div className="flex items-center gap-2">
              <button className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition text-sm">
                🔔
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">1</span>
              </button>
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 ml-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                  {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <div className="text-xs leading-4">
                  <p className="font-semibold text-slate-800">{session?.user?.name ?? "User"}</p>
                  <p className="text-slate-400">Member</p>
                </div>
                <button onClick={() => signOut({ callbackUrl: "/login" })}
                  className="ml-1 text-slate-400 hover:text-red-500 transition text-xs" title="Logout">⏻</button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
