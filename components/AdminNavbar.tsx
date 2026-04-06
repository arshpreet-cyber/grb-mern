"use client";

import { signOut } from "next-auth/react";

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-4 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition text-sm">
            🔔
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-1">
              9+
            </span>
          </button>

          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition text-sm">
            ⚙
          </button>

          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 ml-1">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <div className="text-xs leading-4">
              <p className="font-semibold text-slate-800">Sourabh D.</p>
              <p className="text-slate-400">Administrator</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="ml-1 text-slate-400 hover:text-slate-600 transition text-xs"
              title="Logout"
            >
              ⏻
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
