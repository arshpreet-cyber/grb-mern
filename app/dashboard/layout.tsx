"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import UserSidebar from "@/components/UserSidebar";
import { 
  ChevronsRight, 
  Search, 
  Sun, 
  Moon, 
  MessageSquareText, 
  Bell, 
  User, 
  LogOut 
} from "lucide-react";

import Wrapper from "@/components/Wrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Wrapper>
      <div className="flex min-h-screen bg-[#f5f6fa]">
        {isSidebarOpen && (
          <UserSidebar onToggle={() => setIsSidebarOpen(false)} />
        )}
        
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-4 z-10 mx-6 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-50 rounded-[15px] px-5 py-4 transition-all">
            <div className="flex items-center justify-between gap-4">
              
              {/* Left: Sidebar Toggle + Search */}
              <div className="flex items-center gap-3 w-full max-w-sm">
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition shrink-0"
                    aria-label="Open Sidebar"
                  >
                    <ChevronsRight size={20} />
                  </button>
                )}
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="search"
                    placeholder="Search here.."
                    className="w-full rounded-full bg-slate-50 border border-slate-100 py-2.5 pl-12 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-100 transition"
                  />
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                {/* <div className="hidden sm:flex gap-1 items-center bg-slate-50 rounded-full p-1 border border-slate-100 shadow-inner">
                  <button className="flex items-center justify-center h-8 w-8 bg-black text-white rounded-full shadow-sm"><Sun size={16} /></button>
                  <button className="flex items-center justify-center h-8 w-8 text-slate-400 hover:text-slate-700 transition"><Moon size={16} /></button>
                </div> */}

                <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-slate-600 hover:bg-slate-50 transition">
                  <MessageSquareText size={18} />
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-slate-600 hover:bg-slate-50 transition">
                  <Bell size={18} />
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                {/* Profile Dropdown: Only rendered after mounting */}
                {isMounted && (
                  <div className="relative ml-1" ref={dropdownRef}>
                    <div 
                      className="flex items-center gap-3 cursor-pointer select-none pl-1"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                      {/* User Avatar */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-inner">
                        {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                      
                      {/* Added: User Name */}
                      <span className="hidden sm:block text-[15px] font-medium text-slate-800 pr-1">
                        {session?.user?.name ?? "User"}
                      </span>
                    </div>

                    <div className={`absolute right-0 top-full pt-2 w-48 transition-all duration-200 z-[9999] ${isProfileOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                      <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                        <Link href="/dashboard/account" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                          <User size={16} className="text-slate-400" /> Account Details
                        </Link>
                        <div className="h-px w-full bg-slate-100 my-1"></div>
                        <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium">
                          <LogOut size={16} className="text-red-500" /> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>     
            <footer className="bg-[#111111] text-center text-sm text-[#FFFFFF] py-4">
              Copyright &copy; {new Date().getFullYear()} GetReviews. All rights reserved.
            </footer> 
        </div>
      </div>
    </Wrapper>
  );
}