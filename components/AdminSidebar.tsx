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
      { label: "User Dashboard", href: "/dashboard", icon: "👤" },
      { label: "Dashboard", href: "/admin/dashboard", icon: "▣" },
      { label: "Clear Cache", href: "/admin/cache", icon: "↺" },
    ],
  },
  {
    title: "Pages",
    items: [
      { label: "Pages", href: "/admin/pages", icon: "📄" },
      { label: "Header & Footer", href: "/admin/pages/header-footer", icon: "⊟" },
      { label: "Menu", href: "/admin/pages/menu", icon: "≡" },
      { label: "Header & Footer Scripts", href: "/admin/pages/scripts", icon: "💻" },
      { label: "File Editor", href: "/admin/pages/editor", icon: "📝" },
      { label: "Modules", href: "/admin/pages/modules", icon: "🧩" },
      { label: "Affiliates", href: "/admin/pages/affiliates", icon: "🤝" },
    ],
  },
  {
    title: "Packages",
    items: [
      { label: "Product Packages Lists", href: "/admin/packages/products", icon: "📦" },
    ],
  },
  {
    title: "Orders",
    items: [
      { label: "Upload Excel for Order", href: "/admin/orders/upload", icon: "📤" },
    ],
  },
  {
    title: "Products",
    items: [
      { label: "Products", href: "/admin/products", icon: "🛍️" },
      { label: "Products Pricing Rules", href: "/admin/products/pricing", icon: "💲" },
      { label: "Coupons", href: "/admin/products/coupons", icon: "🏷️" },
      { label: "Custom Forms", href: "/admin/products/forms", icon: "🧾" },
    ],
  },
  {
    title: "Staff Management",
    items: [
      { label: "Create Staff User", href: "/admin/staff/create", icon: "➕" },
      { label: "View Staff Members", href: "/admin/staff", icon: "👥" },
    ],
  },
  {
    title: "Order Management",
    items: [
      { label: "Orders Management", href: "/admin/orders", icon: "📋" },
      { label: "Order Assignments", href: "/admin/orders/assignments", icon: "📌" },
      { label: "Orders", href: "/admin/orders/list", icon: "🗂️" },
    ],
  },
  {
    title: "User",
    items: [
      { label: "Account Details", href: "/admin/account", icon: "⚙️" },
      { label: "Users", href: "/admin/users", icon: "👤" },
      { label: "Reports", href: "/admin/reports", icon: "📊" },
      { label: "Reminder", href: "/admin/reminder", icon: "🔔" },
      { label: "Media", href: "/admin/media", icon: "🖼️" },
      { label: "Blogs", href: "/admin/blogs", icon: "✍️" },
      { label: "FAQs", href: "/admin/faqs", icon: "❓" },
      { label: "Tickets", href: "/admin/tickets", icon: "🎧", badge: "207" },
      { label: "Testimonials", href: "/admin/testimonials", icon: "💬", badge: "7" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "⚙️" },
      { label: "Logs", href: "/admin/logs", icon: "📜" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const initials = session?.user?.name?.charAt(0)?.toUpperCase() ?? "A";

  return (
    <aside className="min-h-screen w-64 bg-[#0f1117] text-slate-300 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold shadow-lg">G</div>
          <div>
            <p className="text-sm font-semibold text-white tracking-tight">GetReviews</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {menuSections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">{section.title}</p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                        isActive ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }`}>
                      <span className="text-sm w-5 text-center">{item.icon}</span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-violet-600 px-1.5 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout + User */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-3 mb-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{session?.user?.name ?? "Admin"}</p>
            <p className="truncate text-[10px] text-slate-500">{session?.user?.email ?? ""}</p>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-red-400 transition">
          <span className="text-sm w-5 text-center">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
