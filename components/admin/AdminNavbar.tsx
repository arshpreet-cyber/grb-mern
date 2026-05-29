"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  ChevronsRight, 
  User, 
  LogOut, 
  Search, 
  Sun, 
  Moon, 
  MessageSquareText, 
  Bell 
} from "lucide-react";
import { useTheme } from "next-themes";

export default function AdminNavbar({ onToggle }: { onToggle?: () => void }) {
  const { data: session } = useSession();

  // State to manage dropdown open/close
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [orderNotifications, setOrderNotifications] = useState<any[]>([]);
  const [ticketNotifications, setTicketNotifications] = useState<any[]>([]);

  // Theme support
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const isDarkMode = mounted && theme === "dark";
  const toggleDarkMode = () => setTheme(isDarkMode ? "light" : "dark");

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setIsMessageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch recent data for notifications
  useEffect(() => {
    fetch("/api/dashboard/analytics")
      .then((r) => r.json())
      .then((data) => {
        if (data.recentOrders) {
            const orders = data.recentOrders.slice(0, 3).map((o: any) => ({
                id: o.id,
                type: 'order',
                title: `New Order #${o.orderNumber}`,
                desc: `Amount: $${o.amount} • ${o.user?.name || 'Guest'}`,
                time: o.createdAt
            }));
            setOrderNotifications(orders);
        }
        if (data.recentTickets) {
            const tickets = data.recentTickets.slice(0, 3).map((t: any) => ({
                id: t.id,
                type: 'ticket',
                title: `New Ticket #${t.ticketId}`,
                desc: t.title,
                time: t.createdAt
            }));
            setTicketNotifications(tickets);
        }
      })
      .catch(() => {});
  }, []);

  // Dynamic user data logic
  const userName = mounted ? (session?.user?.name || "User") : "User";
  const userInitials = userName.charAt(0).toUpperCase();
  const userRole = mounted ? ((session?.user as any)?.role || "Admin") : "Admin"; 
  const userImage = mounted ? session?.user?.image : undefined;

  return (
    <header className="sticky top-4 z-40 mx-6 bg-white dark:bg-[#1a1f2c] shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] border border-slate-50 dark:border-slate-800 rounded-[15px] px-5 py-4 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Toggle + Pill-shaped Search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onToggle}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition shrink-0"
            aria-label="Toggle Sidebar"
          >
            <ChevronsRight size={20} />
          </button>

          <div className="relative hidden sm:block flex-1 min-w-0">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white"
              size={18}
            />
            <input
              type="search"
              placeholder="Search here.."
              className="w-full rounded-full bg-[#f4f5f7] dark:bg-[#252b3b] py-2.5 pl-12 pr-4 text-sm text-slate-700 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition"
            />
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="relative flex items-center gap-3">

          {/* Theme Toggle */}
          <div className="hidden sm:flex relative items-center bg-[#f4f5f7] dark:bg-[#252b3b] rounded-full p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] w-[74px] h-[40px]">
            {/* Sliding Active Background */}
            <div 
              className="absolute left-1 top-1 h-8 w-8 rounded-full bg-black shadow-md transition-transform duration-300 ease-out"
              style={{ transform: isDarkMode ? 'translateX(34px)' : 'translateX(0)' }}
            />
            <button 
              onClick={() => { if(isDarkMode) toggleDarkMode(); }}
              className={`relative z-10 flex h-full w-1/2 items-center justify-center transition-colors duration-300 ${!isDarkMode ? 'text-white' : 'text-slate-500 dark:text-white hover:text-slate-800 dark:hover:text-white'}`}
            >
              <Sun size={15} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => { if(!isDarkMode) toggleDarkMode(); }}
              className={`relative z-10 flex h-full w-1/2 items-center justify-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-500 dark:text-white hover:text-slate-800 dark:hover:text-white'}`}
            >
              <Moon size={15} strokeWidth={2.5} />
            </button>
          </div>

          {/* Messages Section Wrapper */}
          <div ref={messageRef}>
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f5f7] dark:bg-[#252b3b] text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none"
              onClick={() => setIsMessageOpen(!isMessageOpen)}
            >
              <MessageSquareText size={18} />
              {ticketNotifications.length > 0 && <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1a1f2c]"></span>}
            </button>

            {/* Message Dropdown */}
            <div
              className={`absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] transition-all duration-200 ease-in-out z-50 ${
                isMessageOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div className="flex flex-col rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="text-[13px] font-bold text-slate-800 dark:text-white">Messages & Tickets</h3>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{ticketNotifications.length} New</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {ticketNotifications.length > 0 ? (
                    ticketNotifications.map((notif) => (
                      <div key={notif.id} className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                            <MessageSquareText size={14} />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#111827] dark:text-white">{notif.title}</p>
                            <p className="text-[12px] text-slate-500 dark:text-white mt-0.5">{notif.desc}</p>
                            <p className="text-[10px] text-slate-400 dark:text-white mt-1.5 font-medium">{new Date(notif.time).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-500 dark:text-white text-[13px]">
                      No new messages
                    </div>
                  )}
                </div>
                <Link href="/admin/tickets" onClick={() => setIsMessageOpen(false)} className="block text-center px-4 py-2.5 text-[12px] font-bold text-[#285FF5] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-t border-slate-50 dark:border-slate-800">
                  View All Tickets
                </Link>
              </div>
            </div>
          </div>

          {/* Notification Section Wrapper */}
          <div ref={notificationRef}>
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f5f7] dark:bg-[#252b3b] text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell size={18} />
              {orderNotifications.length > 0 && <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1a1f2c]"></span>}
            </button>

            {/* Notification Dropdown */}
            <div
              className={`absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] transition-all duration-200 ease-in-out z-50 ${
                isNotificationOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div className="flex flex-col rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="text-[13px] font-bold text-slate-800 dark:text-white">Alerts</h3>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{orderNotifications.length} New</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {orderNotifications.length > 0 ? (
                    orderNotifications.map((notif) => (
                      <div key={notif.id} className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                            <Bell size={14} />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#111827] dark:text-white">{notif.title}</p>
                            <p className="text-[12px] text-slate-500 dark:text-white mt-0.5">{notif.desc}</p>
                            <p className="text-[10px] text-slate-400 dark:text-white mt-1.5 font-medium">{new Date(notif.time).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-500 dark:text-white text-[13px]">
                      No new alerts
                    </div>
                  )}
                </div>
                <Link href="/admin/dashboard" onClick={() => setIsNotificationOpen(false)} className="block text-center px-4 py-2.5 text-[12px] font-bold text-[#285FF5] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-t border-slate-50 dark:border-slate-800">
                  View All Activity
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Section Wrapper - attached the ref here */}
          <div className="relative ml-1" ref={dropdownRef}>
            
            {/* The Trigger Element - Now using onClick to toggle state */}
            <div 
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {userImage ? (
                <img 
                  src={userImage} 
                  alt="Avatar" 
                  className="h-10 w-10 rounded-full object-cover border border-slate-100 shrink-0"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-inner">
                  {userInitials}
                </div>
              )}

              <div className="text-sm leading-4 hidden md:block pr-2">
                <p className="font-semibold text-slate-800 dark:text-white">{userName}</p>
                <p className="hidden text-slate-400 dark:text-white uppercase text-[10px] font-semibold mt-0.5">
                    {userRole}
                </p>
              </div>
            </div>

            {/* The Dropdown Menu - Visibility controlled by state instead of group-hover */}
            <div 
              className={`absolute right-0 top-full pt-2 w-52 transition-all duration-200 ease-in-out z-50 ${
                isProfileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div className="flex flex-col rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] p-1.5 shadow-xl">
                <Link 
                  href="/dashboard/account" 
                  onClick={() => setIsProfileOpen(false)} // Close when clicking link
                  className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <User size={16} className="text-slate-400 dark:text-white" />
                  Account Details
                </Link>
                
                <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-1"></div>
                
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left font-medium"
                >
                  <LogOut size={16} className="text-red-500 dark:text-red-400" />
                  Logout
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
