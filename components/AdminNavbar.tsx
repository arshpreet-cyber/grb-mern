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

export default function AdminNavbar({ onToggle }: { onToggle?: () => void }) {
  const { data: session } = useSession();

  // State to manage dropdown open/close
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dynamic user data logic
  const userName = session?.user?.name || "User";
  const userInitials = userName.charAt(0).toUpperCase();
  const userRole = (session?.user as any)?.role || "Admin"; 
  const userImage = session?.user?.image;

  return (
    <header className="sticky top-4 z-10 mx-6 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-50 rounded-[15px] px-5 py-4 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Toggle + Pill-shaped Search */}
        <div className="flex items-center gap-3 w-full max-w-sm">
          {onToggle && (
            <button
              onClick={onToggle}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition shrink-0"
              aria-label="Open Sidebar"
            >
              <ChevronsRight size={20} />
            </button>
          )}
          
          <div className="relative w-full">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" 
              size={18} 
            />
            <input
              type="search"
              placeholder="Search here.."
              className="w-full rounded-full bg-slate-50 border border-slate-100 py-2.5 pl-12 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-100 transition"
            />
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <div className="hidden sm:flex gap-1 items-center bg-slate-50 rounded-full p-1 border border-slate-100 shadow-inner">
            <button className="flex items-center justify-center h-8 w-8 bg-black text-white rounded-full shadow-sm">
              <Sun size={16} />
            </button>
            <button className="flex items-center justify-center h-8 w-8 text-slate-400 hover:text-slate-700 transition">
              <Moon size={16} />
            </button>
          </div>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-slate-600 hover:bg-slate-50 transition">
            <MessageSquareText size={18} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-slate-600 hover:bg-slate-50 transition">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

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
                <p className="font-semibold text-slate-800">{userName}</p>
                <p className="hidden text-slate-400 uppercase text-[10px] font-semibold mt-0.5">
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
              <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                <Link 
                  href="/dashboard/account" 
                  onClick={() => setIsProfileOpen(false)} // Close when clicking link
                  className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  <User size={16} className="text-slate-400" />
                  Account Details
                </Link>
                
                <div className="h-px w-full bg-slate-100 my-1"></div>
                
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left font-medium"
                >
                  <LogOut size={16} className="text-red-500" />
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