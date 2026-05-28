"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  CalendarDays,
  ChevronDown,
  MoreVertical,
  ArrowUpRight,
  Eye,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import DataTable, { Column, StatusPill } from "@/components/ui/DataTable";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/status-labels";

// Types
interface Stats {
  openTickets: number;
  awaitingTickets: number;
  closedTickets: number;
  totalOrders: number;
  pendingOrders: number;
  completeOrders: number;
  totalUsers: number;
  activeUsers: number;
}

interface Revenue {
  today: number;
  monthly: number;
  yearly: number;
  allTime: number;
}

interface Order {
  id: string;
  orderNumber: string;
  amount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  subscriptionId?: string | null;
  completedOn?: string | null;
  workStatus?: number | null;
  createdAt: string;
  user?: { name: string; email: string };
  paymentId?: string;
}

interface Ticket {
  id: string;
  ticketId: string;
  title: string;
  status: string;
  readStatus?: number | null;
  createdAt: string;
  updatedAt?: string;
  user?: { name: string; email: string };
}

// Helper for Stat Card
function StatCard({ title, value, change, bg, text, pillBg, isDown, href }: { title: string; value: string | number; change: string; bg: string; text: string; pillBg: string; isDown?: boolean; href?: string }) {
  // Extracting the tailwind background class to derive a dark mode background
  const darkBg = "dark:bg-slate-800/40";
  
  const content = (
    <div className={`relative overflow-hidden rounded-[16px] bg-white dark:bg-[#1a1f2c] border border-[#f0f0f0] dark:border-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all hover:shadow-md ${href ? 'cursor-pointer hover:border-gray-300 dark:hover:border-slate-600' : ''}`}>
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between">
          <p className={`text-[14px] font-semibold ${text}`}>{title}</p>
          <button className="text-gray-400 dark:text-white hover:text-gray-600 dark:text-white dark:hover:text-slate-300 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
        <p className="mt-3 text-[30px] font-bold text-[#111827] dark:text-white">{value}</p>
      </div>
      <div className={`px-5 py-3 flex items-center justify-between ${bg} ${darkBg}`}>
        <span className="text-[12px] text-gray-500 dark:text-white font-medium tracking-wide">vs last month</span>
        <div className={`flex items-center gap-1.5 rounded-[6px] px-2.5 py-0.5 text-white ${pillBg}`}>
          {isDown ? <TrendingDown size={14} strokeWidth={2.5} /> : <TrendingUp size={14} strokeWidth={2.5} />}
          <span className="text-[14px] font-medium tracking-wide">{change}</span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PM_LABELS: Record<string, string> = {
  "1": "Card", "2": "Stripe", "3": "Razorpay", "4": "PayPal", "5": "Pay by Card",
};
const PM_COLORS: Record<string, string> = {
  "1": "bg-gray-700", "2": "bg-indigo-600", "3": "bg-blue-500", "4": "bg-blue-700", "5": "bg-gray-700",
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const [stats, setStats] = useState<Stats>({
    openTickets: 0, awaitingTickets: 0, closedTickets: 0,
    totalOrders: 0, pendingOrders: 0, completeOrders: 0,
    totalUsers: 0, activeUsers: 0
  });
  
  const [revenue, setRevenue] = useState<Revenue>({ today: 0, monthly: 0, yearly: 0, allTime: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  
  const [charts, setCharts] = useState({
    earningsData: [] as any[],
    usersData: [] as any[],
    revenueSources: [] as any[],
    topProducts: [] as any[]
  });

  const [changes, setChanges] = useState({ revenue: "—", orders: "—", users: "—", tickets: "—" });

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const isFirst = initialLoading;
    if (!isFirst) setLoadingData(true);
    fetch(`/api/dashboard/analytics?month=${encodeURIComponent(selectedMonth)}`)
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.revenue) setRevenue(data.revenue);
        if (data.recentOrders) setRecentOrders(data.recentOrders);
        if (data.recentTickets) setRecentTickets(data.recentTickets);
        if (data.charts) setCharts(data.charts);
        if (data.changes) setChanges(data.changes);
      })
      .catch(() => {})
      .finally(() => { setInitialLoading(false); setLoadingData(false); });
  }, [selectedMonth]);

  // Columns for Tickets
  const ticketColumns: Column<Ticket>[] = [
    { key: "ticketId", header: "Ticket ID", render: (r) => <span className="text-gray-600 dark:text-white font-medium text-[15px]">#{r.ticketId}</span> },
    { key: "title", header: "Subject", render: (r) => <span className="text-[#111827] dark:text-white font-medium text-[15px]">{r.title || "No Subject"}</span> },
    { key: "status", header: "Status", render: (r) => (
      <StatusPill value={r.status || "Pending"} colorMap={{
        "Complete": "border-[#bbf7d0] text-[#16a34a] bg-[#f0fdf4] dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
        "Completed": "border-[#bbf7d0] text-[#16a34a] bg-[#f0fdf4] dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
        "Solved": "border-[#bbf7d0] text-[#16a34a] bg-[#f0fdf4] dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
        "Pending": "border-[#fecaca] text-[#dc2626] bg-[#fef2f2] dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400",
        "In Progress": "border-[#fef08a] text-[#ca8a04] bg-[#fefce8] dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400"
      }} />
    ) },
    { key: "createdAt", header: "Created On", render: (r) => <span className="text-gray-600 dark:text-white text-[15px] font-medium">{new Date(r.createdAt).toLocaleDateString()}</span> },
    { key: "updatedAt", header: "Recent Update", render: (r) => <span className="text-gray-600 dark:text-white text-[15px] font-medium">{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : new Date(r.createdAt).toLocaleDateString()}</span> },
    { key: "action", header: "Action", render: (r) => (
      <Link href={`/admin/tickets/${r.ticketId}`} className="bg-[#15368B] cursor-pointer text-white px-4 py-1 rounded-md text-[15px] font-normal transition shadow-sm inline-block">View</Link>
    ) }
  ];

  // Columns for Orders
  const orderColumns: Column<Order>[] = [
    { key: "orderNumber", header: "# Order No", render: (r) => (
      <Link href={`/admin/orders/${r.id}`} className="font-semibold text-violet-600 dark:text-violet-400 hover:underline font-mono text-[13px]">
        {r.orderNumber || r.id.substring(0, 8)}
      </Link>
    ) },
    { key: "user", header: "User", render: (r) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-[#111827] dark:text-white font-semibold text-[13px]">{r.user?.name || "Unknown"}</span>
        <span className="text-gray-500 dark:text-white/50 text-[11px]">{r.user?.email || "—"}</span>
      </div>
    ) },
    { key: "paymentId", header: "Payment ID", render: (r) => <span className="text-gray-600 dark:text-white text-[13px] font-mono">{r.paymentId ? r.paymentId.slice(0, 12) + "…" : "—"}</span> },
    { key: "amount", header: "Amount", render: (r) => <span className="text-[#111827] dark:text-white font-bold text-[14px]">${r.amount}</span> },
    { key: "paymentMethod", header: "Method", render: (r) => {
      const pm = r.paymentMethod ?? "";
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${PM_COLORS[pm] ?? "bg-gray-500"}`}>
          {PM_LABELS[pm] ?? "—"}
        </span>
      );
    } },
    { key: "createdAt", header: "Order Date", render: (r) => (
      <div className="flex flex-col text-gray-600 dark:text-white gap-0.5">
        <span className="text-[13px] font-medium">{new Date(r.createdAt).toLocaleDateString()}</span>
        <span className="text-[11px] text-gray-400 dark:text-white/30">{new Date(r.createdAt).toLocaleTimeString()}</span>
      </div>
    ) },
    { key: "adminStatus", header: "Status", render: (r) => (
      <StatusPill value={orderStatusLabel(r.status)} colorMap={{
        "Pending":    "border-[#fef08a] text-[#ca8a04] bg-[#fefce8] dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400",
        "Processing": "border-[#bfdbfe] text-[#2563eb] bg-[#eff6ff] dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400",
        "Complete":   "border-[#bbf7d0] text-[#16a34a] bg-[#f0fdf4] dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
        "On Hold":    "border-[#fed7aa] text-[#ea580c] bg-[#fff7ed] dark:border-orange-900/50 dark:bg-orange-900/20 dark:text-orange-400",
        "Cancelled":  "border-[#fecaca] text-[#dc2626] bg-[#fef2f2] dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400",
        "Refund":     "border-[#e9d5ff] text-[#7c3aed] bg-[#f5f3ff] dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-400",
      }} />
    ) },
    { key: "paymentStatus", header: "Payment", render: (r) => (
      <StatusPill value={paymentStatusLabel(r.paymentStatus)} colorMap={{
        "Unpaid":      "border-[#fecaca] text-[#dc2626] bg-[#fef2f2] dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400",
        "Paid":        "border-[#bbf7d0] text-[#16a34a] bg-[#f0fdf4] dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
        "Unconfirmed": "border-[#fef08a] text-[#ca8a04] bg-[#fefce8] dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400",
        "Cancelled":   "border-[#e2e8f0] text-[#64748b] bg-[#f8fafc] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
      }} />
    ) },
    { key: "completedOn", header: "Completed On", render: (r) => (
      <span className="text-gray-500 dark:text-white/50 text-[12px]">
        {r.completedOn ? new Date(r.completedOn).toLocaleDateString() : "—"}
      </span>
    ) },
    { key: "action", header: "", render: (r) => (
      <Link href={`/admin/orders/${r.id}`} className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition">
        <Eye size={12} /> View
      </Link>
    ) },
  ];

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-violet-600 animate-spin" />
          <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 min-h-screen">
      {/* Month-change overlay — no blur, just a small indicator */}
      {loadingData && (
        <div className="fixed top-4 right-4 z-100 bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-2.5">
          <Loader2 className="h-4 w-4 text-violet-600 animate-spin" />
          <span className="text-sm font-semibold text-gray-700 dark:text-white">Updating...</span>
        </div>
      )}
      {/* Hello Banner */}
      <div className="relative rounded-[20px] bg-gradient-to-r from-[#e9f9eb] via-[#f2fae5] to-[#fcf5d5] dark:from-[#0d1a11] dark:via-[#111f0a] dark:to-[#1f1a0a] px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-[#e5f5e8] dark:border-[#1a2f1a] transition-colors">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[40px] font-medium text-[#111827] dark:text-white tracking-tight">
              Hello! {mounted ? (session?.user?.name || "Admin") : "Admin"}
            </h1>
            <p className="mt-1.5 text-[18px] text-black dark:text-white/80 font-medium ">
              Manage your business metrics and customer interactions in one place.
            </p>
          </div>
          <div className="relative">
            <div 
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="flex items-center gap-3 rounded-lg bg-[#111827] dark:bg-slate-900 px-5 py-3 text-white dark:text-white shadow-md cursor-pointer hover:bg-black dark:hover:bg-slate-800 transition shrink-0 border border-transparent dark:border-slate-800"
            >
              <CalendarDays className="h-4 w-4 text-gray-300 dark:text-white" />
              <span className="text-[16px] font-regular">{selectedMonth}</span>
              <ChevronDown className={`h-4 w-4 ml-2 text-gray-400 dark:text-white transition-transform ${isMonthDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Month Dropdown */}
            {isMonthDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsMonthDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-slate-800 p-3 z-20 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-3 gap-2">
                    {MONTHS.map((month) => (
                      <button
                        key={month}
                        onClick={() => {
                          setSelectedMonth(month);
                          setIsMonthDropdownOpen(false);
                        }}
                        className={`flex items-center justify-center rounded-xl py-3 text-[13px] font-semibold transition-all ${
                          selectedMonth === month 
                            ? "bg-[#111827] text-white dark:bg-violet-600 dark:text-white shadow-lg scale-105" 
                            : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {month.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-gray-50 dark:border-slate-800 pt-2 text-center">
                    <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Select Month • 2026</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={`$${revenue.allTime.toLocaleString()}`} change={changes.revenue} bg="bg-[#FCF3E8]" pillBg="bg-[#AF670F]" text="text-[#AF670F]" href="/admin/orders" />
        <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} change={changes.orders} bg="bg-[#F2F6FE]" pillBg="bg-[#285FF5]" text="text-[#285FF5]" href="/admin/orders" />
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} change={changes.users} bg="bg-[#EEFAEB]" pillBg="bg-[#54CE12]" text="text-[#54CE12]" href="/admin/users" />
        <StatCard title="Total Tickets" value={(stats.openTickets + stats.closedTickets + stats.awaitingTickets).toLocaleString()} change={changes.tickets} bg="bg-[#F4EBFE]" pillBg="bg-[#9B52F0]" text="text-[#9B52F0]" isDown href="/admin/tickets" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        {/* Earnings Overview */}
        <div className="rounded-[16px] bg-white dark:bg-[#1a1f2c] border border-[#f0f0f0] dark:border-slate-800 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-colors">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#111827] dark:text-white">Earnings Overview</h2>
            <Link href="/admin/orders" className="text-[14px] font-bold text-gray-400 dark:text-white/50 uppercase tracking-widest hover:text-gray-600 dark:hover:text-white transition-colors underline underline-offset-[3px]">VIEW DETAILS</Link>
          </div>
          <div className="h-72 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.earningsData}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-slate-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600, letterSpacing: "0.05em" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }} tickFormatter={(v) => `${v / 1000}k`} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", background: "#1e293b", color: "#fff", fontSize: 13, padding: "10px 16px" }}
                  itemStyle={{ color: "#fff", fontWeight: "bold" }}
                  labelStyle={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}
                  formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}.00`, ""]}
                  cursor={{ stroke: "#818cf8", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#818cf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEarnings)" activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff", fill: "#6366f1" }} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Overview */}
        <div className="rounded-[16px] bg-white dark:bg-[#1a1f2c] border border-[#f0f0f0] dark:border-slate-800 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col transition-colors">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#111827] dark:text-white">Order Overview</h2>
            <Link href="/admin/orders" className="text-[14px] font-bold text-gray-400 dark:text-white/50 uppercase tracking-widest hover:text-gray-600 dark:hover:text-white transition-colors underline underline-offset-[3px]">VIEW DETAILS</Link>
          </div>
          <div className="flex-1 flex flex-row items-center justify-center gap-6 md:gap-10">
            <div className="h-52 w-52 relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.revenueSources} innerRadius={68} outerRadius={95} paddingAngle={2} dataKey="value" strokeWidth={0}>
                    {charts.revenueSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-400 dark:text-white/50 font-semibold uppercase tracking-wider">Total Orders</span>
                <span className="text-[24px] font-black text-[#111827] dark:text-white mt-0.5">{stats.totalOrders.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              {charts.revenueSources.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[13px] font-semibold text-gray-600 dark:text-white/70">{item.name}</span>
                  </div>
                  <span className="text-[16px] font-black text-[#111827] dark:text-white pl-[22px] mt-0.5">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        {/* Users Overview */}
        <div className="rounded-[16px] bg-white dark:bg-[#1a1f2c] border border-[#f0f0f0] dark:border-slate-800 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-colors">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#111827] dark:text-white">Users Overview</h2>
            <Link href="/admin/users" className="text-[14px] font-bold text-gray-400 dark:text-white/50 uppercase tracking-widest hover:text-gray-600 dark:hover:text-white transition-colors underline underline-offset-[3px]">VIEW DETAILS</Link>
          </div>
          <div className="h-72 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.usersData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-slate-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }} tickFormatter={(v) => `${v / 1000}k`} dx={-10} />
                <RechartsTooltip 
                   cursor={{ fill: "currentColor", opacity: 0.1 }} 
                   contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", background: "#1e293b", color: "#fff", fontSize: 12 }} 
                />
                <Bar dataKey="users" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Product */}
        <div className="rounded-[16px] bg-white dark:bg-[#1a1f2c] border border-[#f0f0f0] dark:border-slate-800 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-colors">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#111827] dark:text-white">Top Selling Product</h2>
            <Link href="/admin/products" className="text-[14px] font-bold text-gray-400 dark:text-white/50 uppercase tracking-widest hover:text-gray-600 dark:hover:text-white transition-colors underline underline-offset-[3px]">VIEW DETAILS</Link>
          </div>
          <div className="space-y-8">
            {charts.topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className="h-14 w-14 shrink-0 bg-[#FFF8F1] dark:bg-slate-900/50 rounded-xl flex items-center justify-center border border-[#FFECD6]/50 dark:border-slate-800 transition-colors">
                  {p.icon === "google" && (
                    <svg className="w-7 h-7" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  {p.icon === "trustpilot" && (
                    <svg className="w-7 h-7" viewBox="0 0 24 24">
                      <path fill="#00b67a" d="M24 9.45h-8.82L12 0 9.18 9.45H0l7.14 5.25-2.73 9.3 7.59-5.73 7.59 5.73-2.73-9.3z" />
                      <path fill="#005128" d="M12 17.25l7.59 5.73-2.73-9.3L12 17.25z" />
                    </svg>
                  )}
                  {p.icon === "glassdoor" && (
                    <svg className="w-7 h-7" viewBox="0 0 24 24">
                      <path fill="#0caa41" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" />
                      <path fill="#0caa41" d="M10 8h4v8h-4z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2.5">
                    <p className="text-[15px] font-medium text-[#94a3b8] dark:text-slate-400 truncate tracking-tight">{p.name}</p>
                    <p className="text-[16px] font-bold text-[#111827] dark:text-white tracking-tight">{p.sales.toLocaleString()}</p>
                  </div>
                  <div className="h-[3px] w-full bg-[#f1f5f9] dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-[#AF670F]`} style={{ width: `${(p.sales / Math.max(p.max, 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables */}
      <DataTable<Ticket>
        title="Recent Ticket"
        headerRight={<Link href="/admin/tickets" className="text-[14px] font-bold text-gray-400 dark:text-white/50 uppercase tracking-widest hover:text-gray-600 dark:hover:text-white transition-colors underline underline-offset-[3px]">VIEW ALL</Link>}
        data={recentTickets}
        columns={ticketColumns}
        rowClassName={(t) => {
          const isUnread = t.readStatus === 1;
          return isUnread ? "bg-amber-50/50 dark:bg-amber-900/20" : "";
        }}
      />

      <DataTable<Order>
        title="Recent Order Details"
        headerRight={<Link href="/admin/orders" className="text-[14px] font-bold text-gray-400 dark:text-white/50 uppercase tracking-widest hover:text-gray-600 dark:hover:text-white transition-colors underline underline-offset-[3px]">VIEW ALL ORDERS</Link>}
        data={recentOrders}
        columns={orderColumns}
      />
    </div>
  );
}
