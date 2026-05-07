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
  onToggle?: () => void; 
}

export default function UserSidebar({ onToggle }: UserSidebarProps) {
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
    <aside className="w-[260px] min-h-screen bg-white border-r border-gray-100 flex flex-col shrink-0 font-sans">
      
      {/* Logo & Toggle Button Container */}
      <div className="px-5 py-6 flex items-center justify-between">
        <Link href="/">
          <img
            src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
            alt="GetReviews.Buzz"
            className="w-[140px] h-auto"
          />
        </Link>
        
        <button 
          onClick={onToggle}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
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
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors font-medium"
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
              <p className="text-[10px] font-[600] tracking-widest text-gray-400 uppercase mb-3 px-1">
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
                            ? "bg-[#FCF8EC] text-[#D8A720] font-[500]"
                            : "text-gray-600 hover:bg-gray-50 font-[400]"
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
                            ? "bg-[#FCF8EC] text-[#D8A720]" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {IconComponent && (
                            <IconComponent size={18} strokeWidth={isParentActive ? 2 : 1.5} />
                          )}
                          <span className="text-[13px] font-[500]">{item.label}</span>
                        </div>
                        {isOpen ? (
                          <ChevronUp size={16} className={isParentActive ? "text-[#D8A720]" : "text-gray-400"} />
                        ) : (
                          <ChevronDown size={16} className={isParentActive ? "text-[#D8A720]" : "text-gray-400"} />
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
                                  isSubActive ? "text-black font-semibold" : "text-gray-400 hover:text-gray-700 font-[400]"
                                }`}
                              >
                                <span className={`absolute left-[24px] w-[3px] h-[3px] rounded-full transition-colors ${
                                  isSubActive ? "bg-black" : "bg-gray-300 group-hover:bg-gray-400"
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
                      <div className="mx-4 mt-5 mb-4 border-t border-gray-100"></div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <ul className="space-y-1 mt-1">
          <li>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} strokeWidth={1.5} />
              <span className="font-[500] text-[13px]">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}