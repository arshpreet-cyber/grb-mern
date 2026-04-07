/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

type MenuItem = { label: string; href: string; icon: string; badge?: string };
type MenuSection = { title: string | null; items: MenuItem[] };

const menuSections: MenuSection[] = [
  {
    title: null,
    items: [
      { label: "Visit Site", href: "/", icon: "🌐" },
      { label: "Dashboard", href: "/dashboard", icon: "▣" },
    ],
  },
  {
    title: "My Account",
    items: [
      { label: "Account Details", href: "/dashboard/account", icon: "👤" },
      { label: "Orders", href: "/dashboard/orders", icon: "📦", badge: "2" },
      { label: "Invoices", href: "/dashboard/invoices", icon: "🧾", badge: "114" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Support", href: "/dashboard/support", icon: "🎧", badge: "1" },
      { label: "Affiliate", href: "/dashboard/affiliate", icon: "🤝" },
    ],
  },
];

const ADMIN_ROLES = ["ADMIN", "admin", "MANAGER", "manager", "SEO", "DEVELOPER", "TESTER"];

export default function UserSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Get role from session — handle both typed and untyped
  const role = session?.user?.role ?? "";
  const isAdmin = status === "authenticated" && ADMIN_ROLES.includes(role);
  const initials = session?.user?.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <aside className="min-h-screen w-64 bg-[#0f1117] text-slate-300 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <Link href="/">
          <img
            src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
            alt="GetReviews.Buzz"
            style={{ width: "150px", height: "auto" }}
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-5">

        {/* Admin Dashboard — shown when role is not USER */}
        {isAdmin && (
          <Link href="/admin/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition font-medium">
            <span className="text-base">⚡</span>
            <span className="flex-1">Admin Dashboard</span>
            <span className="text-[9px] bg-violet-500 text-white px-1.5 py-0.5 rounded-full font-bold uppercase">{role}</span>
          </Link>
        )}

        {menuSections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">{section.title}</p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                        isActive ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }`}>
                      <span className="text-base w-5 text-center">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-3 mb-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{session?.user?.name ?? "User"}</p>
            <p className="truncate text-[10px] text-slate-500">{session?.user?.email ?? ""}</p>
            {role && (
              <p className="truncate text-[10px] text-violet-400 font-semibold uppercase">{role}</p>
            )}
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-red-400 transition">
          <span className="text-base">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
