"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const menuSections = [
  {
    title: "Main Menu",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: "▣" },
      { label: "User Dashboard", href: "/admin/users", icon: "◉" },
      { label: "Clear Cache", href: "/admin/cache", icon: "↺" },
    ],
  },
  {
    title: "Pages",
    items: [
      { label: "Pages", href: "/admin/pages", icon: "⊞" },
      { label: "Header & Footer", href: "/admin/pages/header-footer", icon: "⊟" },
      { label: "Menu", href: "/admin/pages/menu", icon: "≡" },
      { label: "Modules", href: "/admin/pages/modules", icon: "⊕" },
      { label: "Affiliates", href: "/admin/pages/affiliates", icon: "⇄" },
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Products", href: "/admin/products", icon: "◈" },
      { label: "Pricing Rules", href: "/admin/products/pricing", icon: "$" },
      { label: "Coupons", href: "/admin/products/coupons", icon: "%" },
      { label: "Orders Upload", href: "/admin/orders/upload", icon: "↑" },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Account", href: "/admin/account", icon: "⚙" },
      { label: "Finance", href: "/admin/finance", icon: "◎" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-64 bg-[#0f1117] text-slate-300 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold shadow-lg">
            G
          </div>
          <div>
            <p className="text-sm font-semibold text-white tracking-tight">GetReviews</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                        isActive
                          ? "bg-white/10 text-white font-medium"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }`}
                    >
                      <span className="w-4 text-center text-xs opacity-70">{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                      )}
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
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">Admin User</p>
            <p className="truncate text-[10px] text-slate-500">admin@getreviews.buzz</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="shrink-0 text-slate-500 hover:text-slate-300 transition text-xs"
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
