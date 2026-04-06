"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import CartButton from "@/components/CartButton";

export default function HomeNavbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-bold text-sm shadow">G</div>
          <span className="text-lg font-bold text-slate-900">GetReviews<span className="text-violet-600">.buzz</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link href="#services" className="hover:text-violet-600 transition">Services</Link>
          <Link href="/buy-reviews" className="hover:text-violet-600 transition">Buy Reviews</Link>
          <Link href="#pricing" className="hover:text-violet-600 transition">Pricing</Link>
          <Link href="#how-it-works" className="hover:text-violet-600 transition">How It Works</Link>
          <Link href="#faq" className="hover:text-violet-600 transition">FAQ</Link>
        </nav>

        <div className="flex items-center gap-3">
          <CartButton />
          {status === "loading" ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
          ) : session ? (
            // Logged in — show user name + dashboard + logout
            <div className="flex items-center gap-3">
              <Link href="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100 transition">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {session.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                {session.user?.name ?? "Dashboard"}
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                Logout
              </button>
            </div>
          ) : (
            // Not logged in — show Login + Get Started
            <>
              <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 transition px-4 py-2">
                Login
              </Link>
              <Link href="/register" className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition">
                Get Started →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
