/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  AlertCircle, 
  UserCircle, 
  LogOut, 
  ChevronsLeft, 
  ChevronDown, 
  ChevronUp, 
  Zap 
} from "lucide-react";

type SubMenuItem = { label: string; href: string };

type MenuItem = { 
  label: string; 
  href?: string; 
  icon: React.ElementType; 
  id?: string;
  subItems?: SubMenuItem[];
  hasDivider?: boolean;
};

type MenuSection = { title: string | null; items: MenuItem[] };

const menuSections: MenuSection[] = [
  {
    title: "MAIN MENU",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { 
        label: "My Orders", 
        icon: Package, 
        id: "orders",
        subItems: [
          { label: "One-Time Orders", href: "/dashboard/orders" },
          { label: "Subscriptions", href: "/dashboard/orders/subscriptions" },
        ],
        hasDivider: true
      },
    ],
  },
  {
    title: "HELP CENTRE",
    items: [
      { 
        label: "Support", 
        icon: AlertCircle, 
        id: "support",
        subItems: [
          { label: "New Ticket", href: "/dashboard/support" },
          { label: "My Tickets", href: "/dashboard/tickets" },
        ]
      },
      { 
        label: "Administration", 
        icon: UserCircle, 
        id: "administration",
        subItems: [
          { label: "Account Management", href: "/dashboard/account" },
          // { label: "Finance", href: "/dashboard/admin/finance" },
        ]
      },
    ],
  },
];

const ADMIN_ROLES = ["ADMIN", "admin", "MANAGER", "manager", "SEO", "DEVELOPER", "TESTER"];

interface UserSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function UserSidebar({ isOpen = true, onToggle }: UserSidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const role = session?.user?.role ?? "";
  const isAdmin = status === "authenticated" && ADMIN_ROLES.includes(role);

  const isActive = (href: string) => pathname === href;

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 w-[260px] h-screen overflow-y-auto flex flex-col shrink-0 font-sans bg-white dark:bg-[#0f1117] border-r border-gray-100 dark:border-slate-800 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      
      {/* Logo & Toggle Button Container */}
      <div className="px-5 py-6 flex items-center justify-between">
        <Link href="/">
          <img
            src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
            alt="GetReviews.Buzz"
            className="w-[140px] h-auto dark:brightness-0 dark:invert transition-all"
          />
        </Link>
        
        <button 
          onClick={onToggle}
          className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Toggle Sidebar"
        >
          <ChevronsLeft size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-6 text-sm pb-5">

        {isAdmin && (
          <div>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors font-medium"
            >
              <Zap size={18} strokeWidth={1.5} />
              <span className="flex-1">Admin Dashboard</span>
              <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
                {role}
              </span>
            </Link>
          </div>
        )}

        {menuSections.map((section, si) => (
          <div key={si} className={si === menuSections.length - 1 ? "mb-2" : "mb-6"}>
            {section.title && (
              <p className="text-[10px] font-[600] tracking-widest text-gray-400 dark:text-slate-500 uppercase mb-3 px-1">
                {section.title}
              </p>
            )}
            
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = item.href ? isActive(item.href) : false;
                const IconComponent = item.icon as any;
                const isOpen = item.id ? openMenus[item.id] : false;
                
                // Check if any sub-item is active to highlight parent
                const isParentActive = item.subItems?.some((sub) => isActive(sub.href)) ?? false;

                return (
                  <li key={item.label} className="relative">
                    
                    {/* Render standard Link if there's no sub-menu */}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-colors ${
                          active
                            ? "bg-[#FCF8EC] dark:bg-yellow-900/20 text-[#D8A720] dark:text-yellow-400 font-[500]"
                            : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 font-[400]"
                        }`}
                      >
                        {IconComponent && (
                          <IconComponent size={18} strokeWidth={active ? 2 : 1.5} />
                        )}
                        <span className="flex-1 text-[13px]">{item.label}</span>
                      </Link>
                    ) : (
                      
                      /* Render Accordion Button if it has sub-items */
                      <button
                        onClick={() => item.id && toggleMenu(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                          isParentActive 
                            ? "bg-[#FCF8EC] dark:bg-yellow-900/20 text-[#D8A720] dark:text-yellow-400" 
                            : "text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {IconComponent && (
                            <IconComponent size={18} strokeWidth={isParentActive ? 2 : 1.5} />
                          )}
                          <span className="text-[13px] font-[500]">{item.label}</span>
                        </div>
                        {isOpen ? (
                          <ChevronUp size={16} className={isParentActive ? "text-[#D8A720] dark:text-yellow-400" : "text-gray-400 dark:text-slate-500"} />
                        ) : (
                          <ChevronDown size={16} className={isParentActive ? "text-[#D8A720] dark:text-yellow-400" : "text-gray-400 dark:text-slate-500"} />
                        )}
                      </button>
                    )}

                    {/* Render Sub-items */}
                    {item.subItems && isOpen && (
                      <ul className="mt-1 mb-2 space-y-3.5 pb-1 pt-2">
                        {item.subItems.map((sub) => {
                          const isSubActive = isActive(sub.href);
                          return (
                            <li key={sub.label}>
                              <Link 
                                href={sub.href} 
                                className={`group flex items-center relative pl-[46px] pr-3 text-[13px] transition-colors ${
                                  isSubActive ? "text-black dark:text-white font-semibold" : "text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 font-[400]"
                                }`}
                              >
                                <span className={`absolute left-[24px] w-[3px] h-[3px] rounded-full transition-colors ${
                                  isSubActive ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-slate-700 group-hover:bg-gray-400 dark:group-hover:bg-slate-500"
                                }`}></span>
                                {sub.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {/* Section Divider */}
                    {item.hasDivider && (
                      <div className="mx-4 mt-5 mb-4 border-t border-gray-100 dark:border-slate-800"></div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

      </nav>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 shadow-sm px-3 py-3 mb-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white shadow-inner">
            {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gray-800 dark:text-white">{session?.user?.name ?? "User"}</p>
            <p className="truncate text-[10px] text-gray-400 dark:text-slate-500">{session?.user?.email ?? ""}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}