/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Globe, LayoutDashboard, RefreshCw, FileText, PanelTopDashed, Menu, Code, FileEdit, Blocks, Handshake, Package, Upload, ShoppingBag, CircleDollarSign, Tag, ReceiptText, UserPlus, Users, Clipboard, Settings, User, BarChart, Bell, Image as ImageIcon, PenTool, HelpCircle, Headphones, MessageSquare, History, LogOut, ChevronsLeft, ChevronDown,
} from "lucide-react";

type MenuChild = { label: string; href: string };

type MenuItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  children?: MenuChild[];
};

type MenuSection = { title: string | null; items: MenuItem[] };

const menuSections: MenuSection[] = [
  {
    title: null,
    items: [
      { label: "Visit Site", href: "/", icon: Globe },
      { label: "User Dashboard", href: "/dashboard", icon: User },
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Clear Cache", href: "/admin/cache", icon: RefreshCw },
    ],
  },
  {
    title: "Pages",
    items: [
      { label: "Pages", href: "/admin/pages", icon: FileText },
      { label: "Header & Footer", href: "/admin/pages/header-footer", icon: PanelTopDashed },
      { label: "Menu", href: "/admin/pages/menu", icon: Menu },
      { label: "Header & Footer Scripts", href: "/admin/pages/scripts", icon: Code },
      { label: "File Editor", href: "/admin/pages/editor", icon: FileEdit },
      { label: "Modules", href: "/admin/pages/modules", icon: Blocks },
      { label: "Affiliates", href: "/admin/pages/affiliates", icon: Handshake },
    ],
  },
  {
    title: "Packages",
    items: [
      { label: "Product Packages Lists", href: "/admin/packages/products", icon: Package },
    ],
  },
  {
    title: "Orders",
    items: [
      { label: "Upload Excel for Order", href: "/admin/orders/upload", icon: Upload },
    ],
  },
  {
    title: "Products",
    items: [
      { label: "Products", href: "/admin/products", icon: ShoppingBag },
      { label: "Products Pricing Rules", href: "/admin/products/pricing", icon: CircleDollarSign },
      { label: "Coupons", href: "/admin/coupons", icon: Tag },
      { label: "Custom Forms", href: "/admin/products/forms", icon: ReceiptText },
    ],
  },
  {
    title: "Staff Management",
    items: [
      { label: "Create Staff User", href: "/admin/staff/create", icon: UserPlus },
      { label: "View Staff Members", href: "/admin/staff", icon: Users },
    ],
  },
  {
    title: "Order Management",
    items: [
      { label: "Orders Management", href: "/admin/orders", icon: Clipboard },
    ],
  },
  {
    title: "User",
    items: [
      { label: "Account Details", href: "/admin/account", icon: Settings },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Reports", href: "/admin/reports", icon: BarChart },
      { label: "Reminder", href: "/admin/reminder", icon: Bell },
      {
        label: "Media",
        icon: ImageIcon,
        children: [
          { label: "Upload New Media", href: "/admin/media?tab=new" },
          { label: "All Media", href: "/admin/media?tab=all" },
        ],
      },
      { label: "Blogs", href: "/admin/blogs", icon: PenTool },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
      { label: "Tickets", href: "/admin/tickets", icon: Headphones, badge: "207" },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare, badge: "7" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Logs", href: "/admin/logs", icon: History },
    ],
  },
];

interface AdminSidebarProps {
  onToggle?: () => void;
}

export default function AdminSidebar({ onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const role = session?.user?.role ?? "ADMIN";
  const initials = session?.user?.name?.charAt(0)?.toUpperCase() ?? "A";
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenMenus((previous) => {
      const next = { ...previous };
      menuSections.forEach((section) => {
        section.items.forEach((item) => {
          if (item.children?.some((child) => child.href === currentUrl)) {
            next[item.label] = true;
          }
        });
      });
      return next;
    });
  }, [currentUrl]);

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
        <button
          onClick={onToggle}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          aria-label="Collapse Sidebar"
        >
          <ChevronsLeft size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-6 text-sm pb-5">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isChildActive = item.children?.some((child) => child.href === currentUrl) ?? false;
                const isActive = item.href ? pathname === item.href : isChildActive;
                const isOpen = openMenus[item.label] ?? isChildActive;
                const IconComponent = item.icon;

                // Render Dropdown item
                if (item.children?.length) {
                  return (
                    <li key={item.label} className="space-y-1">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenus((previous) => ({
                            ...previous,
                            [item.label]: !isOpen,
                          }))
                        }
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-yellow-100 text-yellow-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <IconComponent size={18} />
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform text-gray-400 ${isOpen ? "rotate-180" : ""}`} 
                        />
                      </button>

                      {isOpen && (
                        <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-3">
                          {item.children.map((child) => {
                            const isCurrentChild = child.href === currentUrl;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                                  isCurrentChild
                                    ? "bg-yellow-50 text-yellow-700 font-medium"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                }`}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                }

                // Render Standard link item
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href!}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-yellow-100 text-yellow-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent size={18} />
                      <span className="flex-1">{item.label}</span>
                      
                      {item.badge && (
                        <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                          isActive ? "bg-yellow-200 text-yellow-800" : "bg-gray-200 text-gray-600"
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
            <p className="truncate text-xs font-semibold text-gray-800">{session?.user?.name ?? "Admin"}</p>
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