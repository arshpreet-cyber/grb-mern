"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ChevronsRight,
  ChevronsLeft,
  User,
  LogOut,
  Sun,
  Moon,
  MessageSquareText,
  Bell
} from "lucide-react";
import { useTheme } from "next-themes";

export default function UserNavbar({ onToggle, isOpen }: { onToggle?: () => void; isOpen?: boolean }) {
  const { data: session } = useSession();
  void isOpen;

  // State to manage dropdown open/close
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [orderNotifications, setOrderNotifications] = useState<any[]>([]);
  const [ticketNotifications, setTicketNotifications] = useState<any[]>([]);
  const [ordersRead, setOrdersRead] = useState(false);
  const [ticketsRead, setTicketsRead] = useState(false);

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

  // Fetch recent data for notifications (User POV)
  useEffect(() => {
    fetch("/api/dashboard/user-notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.recentOrders) {
            const orders = data.recentOrders.slice(0, 3).map((o: any) => ({
                id: o.id,
                type: 'order',
                title: `Order #${o.orderNumber} Update`,
                desc: `Status: ${o.status} • Amount: $${o.amount}`,
                time: o.createdAt
            }));
            setOrderNotifications(orders);
        }
        if (data.recentTickets) {
            const tickets = data.recentTickets.slice(0, 3).map((t: any) => ({
                id: t.id,
                ticketId: t.ticketId,
                type: 'ticket',
                title: `Ticket #${t.ticketNumber ?? t.ticketId}`,
                desc: t.title || t.subject || "Support ticket",
                time: t.createdAt,
                unread: t.userReadStatus === 1,
            }));
            setTicketNotifications(tickets);
        }
      })
      .catch(() => {});
  }, []);

  // Dynamic user data logic
  const userName = mounted ? (session?.user?.name || "User") : "User";
  const userInitials = userName.charAt(0).toUpperCase();
  const userRole = mounted ? ((session?.user as any)?.role || "Customer") : "Customer"; 
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
            {isOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
          </button>
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
              onClick={() => {
                const opening = !isMessageOpen;
                setIsMessageOpen(opening);
                if (opening && !ticketsRead) {
                  setTicketsRead(true);
                  ticketNotifications.forEach((t) => {
                    if (t.unread && t.ticketId) {
                      fetch(`/api/support/tickets/${t.ticketId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userReadStatus: 0 }),
                      }).catch(() => {});
                    }
                  });
                }
              }}
            >
              <MessageSquareText size={18} />
              {ticketNotifications.some((t) => t.unread) && !ticketsRead && <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1a1f2c]"></span>}
            </button>

            {/* Message Dropdown */}
            <div
              className={`absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] transition-all duration-200 ease-in-out z-50 ${
                isMessageOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div className="flex flex-col rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="text-[13px] font-bold text-slate-800 dark:text-white">Tickets</h3>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{ticketNotifications.length} Recent</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {ticketNotifications.length > 0 ? (
                    ticketNotifications.map((notif) => (
                      <Link key={notif.id} href={`/dashboard/tickets/${notif.ticketId}`} onClick={() => setIsMessageOpen(false)} className="block px-4 py-3 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-yellow-950/40 text-amber-600 dark:text-yellow-400">
                            <MessageSquareText size={14} />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#111827] dark:text-white">{notif.title}</p>
                            <p className="text-[12px] text-slate-500 dark:text-white mt-0.5">{notif.desc}</p>
                            <p className="text-[10px] text-slate-400 dark:text-white mt-1.5 font-medium">{new Date(notif.time).toLocaleString()}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-500 dark:text-white text-[13px]">
                      No tickets found
                    </div>
                  )}
                </div>
                <Link href="/dashboard/tickets" onClick={() => setIsMessageOpen(false)} className="block text-center px-4 py-2.5 text-[12px] font-bold text-[#285FF5] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-t border-slate-50 dark:border-slate-800">
                  View My Tickets
                </Link>
              </div>
            </div>
          </div>

          {/* Notification Section Wrapper */}
          <div ref={notificationRef}>
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f5f7] dark:bg-[#252b3b] text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none"
              onClick={() => {
                const opening = !isNotificationOpen;
                setIsNotificationOpen(opening);
                if (opening) setOrdersRead(true);
              }}
            >
              <Bell size={18} />
              {orderNotifications.length > 0 && !ordersRead && <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1a1f2c]"></span>}
            </button>

            {/* Notification Dropdown */}
            <div
              className={`absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] transition-all duration-200 ease-in-out z-50 ${
                isNotificationOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div className="flex flex-col rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="text-[13px] font-bold text-slate-800 dark:text-white">Order Alerts</h3>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{orderNotifications.length} Recent</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {orderNotifications.length > 0 ? (
                    orderNotifications.map((notif) => (
                      <Link key={notif.id} href={`/dashboard/orders/${notif.id}`} onClick={() => setIsNotificationOpen(false)} className="block px-4 py-3 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
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
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-500 dark:text-white text-[13px]">
                      No new alerts
                    </div>
                  )}
                </div>
                <Link href="/dashboard/orders" onClick={() => setIsNotificationOpen(false)} className="block text-center px-4 py-2.5 text-[12px] font-bold text-[#285FF5] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-t border-slate-50 dark:border-slate-800">
                  View All Orders
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Section Wrapper */}
          <div className="relative ml-1" ref={dropdownRef}>
            
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-400 via-[#fc0] to-yellow-500 text-sm font-bold text-slate-900 shadow-inner">
                  {userInitials}
                </div>
              )}

              <div className="text-sm leading-4 hidden md:block pr-2">
                <p className="font-semibold text-slate-800 dark:text-white">{userName}</p>
                <p className="text-slate-400 dark:text-white uppercase text-[10px] font-semibold mt-0.5">
                    {userRole}
                </p>
              </div>
            </div>

            <div 
              className={`absolute right-0 top-full pt-2 w-52 transition-all duration-200 ease-in-out z-50 ${
                isProfileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div className="flex flex-col rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a1f2c] p-1.5 shadow-xl">
                <Link 
                  href="/dashboard/account" 
                  onClick={() => setIsProfileOpen(false)}
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
