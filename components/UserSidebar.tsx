/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Globe,
  LayoutDashboard,
  User,
  Package,
  ReceiptText,
  Headphones,
  Handshake,
  Zap,
  LogOut,
  ChevronsLeft, 
} from "lucide-react";

type MenuItem = { label: string; href: string; icon: React.ElementType; badge?: string };
type MenuSection = { title: string | null; items: MenuItem[] };

const menuSections: MenuSection[] = [
  {
    title: "Main Menu",
    items: [
      { label: "Visit Site", href: "/", icon: Globe },
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "My Account",
    items: [
      { label: "Account Details", href: "/dashboard/account", icon: User },
      { label: "Orders", href: "/dashboard/orders", icon: Package, badge: "2" },
      { label: "Invoices", href: "/dashboard/invoices", icon: ReceiptText, badge: "114" },
    ],
  },
  {
    title: "Help Centre",
    items: [
      { label: "Support", href: "/dashboard/support", icon: Headphones, badge: "1" },
      { label: "Affiliate", href: "/dashboard/affiliate", icon: Handshake },
    ],
  },
];

const ADMIN_ROLES = ["ADMIN", "admin", "MANAGER", "manager", "SEO", "DEVELOPER", "TESTER"];

// Add a prop interface so the parent layout can control the toggle
interface UserSidebarProps {
  onToggle?: () => void; 
}

export default function UserSidebar({ onToggle }: UserSidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const role = session?.user?.role ?? "";
  const isAdmin = status === "authenticated" && ADMIN_ROLES.includes(role);
  const initials = session?.user?.name?.charAt(0)?.toUpperCase() ?? "U";

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 min-h-screen bg-[#fafafa] border-r border-gray-200 flex flex-col shrink-0">
      
     {/* Logo & Toggle Button Container */}
      <div className="px-5 py-6 flex items-center justify-between">
        <Link href="/">
          <img
            src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
            alt="GetReviews.Buzz"
            className="w-[140px] h-auto"
          />
        </Link>
        
        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          aria-label="Toggle Sidebar"
        >
          <ChevronsLeft size={20} /> {/* <-- Updated icon here */}
        </button>
      </div>
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-6 text-sm pb-5">

        {isAdmin && (
          <div>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm bg-purple-100 border border-purple-200 text-purple-700 hover:bg-purple-200 transition font-medium"
            >
              <Zap size={18} />
              <span className="flex-1">Admin Dashboard</span>
              <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
                {role}
              </span>
            </Link>
          </div>
        )}

        {menuSections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const IconComponent = item.icon;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        active
                          ? "bg-yellow-100 text-yellow-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent size={18} />
                      <span className="flex-1">{item.label}</span>
                      
                      {item.badge && (
                        <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                          active ? "bg-yellow-200 text-yellow-800" : "bg-gray-200 text-gray-600"
                        }`}>
                          {item.badge}
                        </span>
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
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 rounded-md bg-white border border-gray-200 shadow-sm px-3 py-3 mb-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-xs font-bold text-white shadow-inner">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gray-800">{session?.user?.name ?? "User"}</p>
            <p className="truncate text-[10px] text-gray-500">{session?.user?.email ?? ""}</p>
            {role && (
              <p className="truncate text-[10px] text-yellow-600 font-semibold uppercase mt-0.5">{role}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}