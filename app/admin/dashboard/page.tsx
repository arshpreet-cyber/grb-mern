"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  TicketCheck,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CalendarDays,
  Activity,
  Package,
  CreditCard,
  Headphones,
} from "lucide-react";

/* ─── Types ─── */
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
  createdAt: string;
  user?: { name: string; email: string };
}

interface Ticket {
  id: string;
  ticketId: string;
  title: string;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
}

/* ─── Hardcoded chart data (replace with API later) ─── */
const earningsData = [
  { month: "Jan", earnings: 12400, orders: 186 },
  { month: "Feb", earnings: 18200, orders: 225 },
  { month: "Mar", earnings: 15800, orders: 198 },
  { month: "Apr", earnings: 21400, orders: 267 },
  { month: "May", earnings: 19600, orders: 245 },
  { month: "Jun", earnings: 24800, orders: 312 },
  { month: "Jul", earnings: 22100, orders: 289 },
];

const weeklyData = [
  { day: "Mon", value: 3200 },
  { day: "Tue", value: 4100 },
  { day: "Wed", value: 3800 },
  { day: "Thu", value: 5200 },
  { day: "Fri", value: 4900 },
  { day: "Sat", value: 6100 },
  { day: "Sun", value: 3400 },
];

const revenueSources = [
  { name: "Completed", value: 42, color: "#7c3aed" },
  { name: "Pending", value: 28, color: "#f59e0b" },
  { name: "Cancelled", value: 18, color: "#ef4444" },
  { name: "Refunded", value: 12, color: "#6b7280" },
];

/* ─── Status badge ─── */
const statusConfig: Record<string, { bg: string; text: string }> = {
  Complete: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Completed: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Pending: { bg: "bg-amber-50", text: "text-amber-700" },
  Processing: { bg: "bg-blue-50", text: "text-blue-700" },
  Cancelled: { bg: "bg-red-50", text: "text-red-700" },
  Open: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Closed: { bg: "bg-slate-100", text: "text-slate-600" },
  "Awaiting Reply": { bg: "bg-amber-50", text: "text-amber-700" },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    bg: "bg-slate-100",
    text: "text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${config.bg} ${config.text}`}
    >
      {status}
    </span>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  label,
  value,
  change,
  changeType,
  icon: Icon,
  iconBg,
}: {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ElementType;
  iconBg: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <div className="mt-2 flex items-center gap-1">
            {changeType === "up" ? (
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
            )}
            <span
              className={`text-xs font-semibold ${changeType === "up" ? "text-emerald-600" : "text-red-600"}`}
            >
              {change}
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      {/* Decorative accent */}
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-slate-50 opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    openTickets: 0,
    awaitingTickets: 0,
    closedTickets: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completeOrders: 0,
    totalUsers: 0,
    activeUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [revenue, setRevenue] = useState<Revenue>({
    today: 0,
    monthly: 0,
    yearly: 0,
    allTime: 0,
  });
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch("/api/dashboard/analytics", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.recentOrders) setRecentOrders(data.recentOrders);
        if (data.recentTickets) setRecentTickets(data.recentTickets);
        if (data.revenue) setRevenue(data.revenue);
      })
      .catch(() => {
        // API unavailable — dashboard renders with default values
      });

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Welcome back! Here&apos;s your business overview.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-600">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`$${revenue.allTime >= 1000 ? `${(revenue.allTime / 1000).toFixed(1)}k` : revenue.allTime.toFixed(0)}`}
          change="12.5%"
          changeType="up"
          icon={DollarSign}
          iconBg="bg-linear-to-br from-violet-500 to-purple-600"
        />
        <StatCard
          label="Monthly Revenue"
          value={`$${revenue.monthly.toLocaleString()}`}
          change="8.2%"
          changeType="up"
          icon={TrendingUp}
          iconBg="bg-linear-to-br from-sky-500 to-blue-600"
        />
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="3.1%"
          changeType="up"
          icon={Users}
          iconBg="bg-linear-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change="2.4%"
          changeType="down"
          icon={ShoppingCart}
          iconBg="bg-linear-to-br from-amber-500 to-orange-600"
        />
      </div>

      {/* ─── Ticket Stats ─── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Open Tickets",
            value: stats.openTickets,
            icon: TicketCheck,
            color: "text-emerald-600",
            iconBg: "bg-emerald-100",
            border: "border-emerald-100",
          },
          {
            label: "Awaiting Reply",
            value: stats.awaitingTickets,
            icon: Clock,
            color: "text-amber-600",
            iconBg: "bg-amber-100",
            border: "border-amber-100",
          },
          {
            label: "Closed Tickets",
            value: stats.closedTickets,
            icon: CheckCircle2,
            color: "text-slate-600",
            iconBg: "bg-slate-100",
            border: "border-slate-100",
          },
        ].map((c) => (
          <div
            key={c.label}
            className={`flex items-center gap-4 rounded-2xl border ${c.border} bg-white p-5 shadow-sm`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.iconBg}`}
            >
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-500">
                {c.label}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {c.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        {/* Earnings Area Chart */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Revenue Overview
              </h2>
              <p className="text-xs text-slate-400">
                Monthly earnings & order trends
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                <span className="text-xs text-slate-500">Earnings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                <span className="text-xs text-slate-500">Orders</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="gEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    padding: "10px 14px",
                  }}
                  formatter={(value, name) => [
                    name === "earnings"
                      ? `$${Number(value).toLocaleString()}`
                      : value,
                    name === "earnings" ? "Revenue" : "Orders",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#gEarnings)"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#gOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Breakdown Pie */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="mb-2">
            <h2 className="text-base font-bold text-slate-900">
              Order Breakdown
            </h2>
            <p className="text-xs text-slate-400">By order status</p>
          </div>
          <div className="flex items-center justify-center h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueSources}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {revenueSources.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [`${value}%`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5 mt-2">
            {revenueSources.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1 text-sm text-slate-600">
                  {item.name}
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Revenue Summary + Weekly Chart ─── */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Revenue Summary Cards */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-5">
            Revenue Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Today",
                value: `$${revenue.today.toFixed(2)}`,
                icon: Activity,
                gradient:
                  "bg-linear-to-br from-violet-50 to-purple-50 border-violet-100",
                iconColor: "text-violet-600",
              },
              {
                label: "This Month",
                value: `$${revenue.monthly.toLocaleString()}`,
                icon: CreditCard,
                gradient:
                  "bg-linear-to-br from-sky-50 to-cyan-50 border-sky-100",
                iconColor: "text-sky-600",
              },
              {
                label: "This Year",
                value: `$${(revenue.yearly / 1000).toFixed(1)}k`,
                icon: TrendingUp,
                gradient:
                  "bg-linear-to-br from-emerald-50 to-teal-50 border-emerald-100",
                iconColor: "text-emerald-600",
              },
              {
                label: "All Time",
                value: `$${(revenue.allTime / 1000).toFixed(0)}k`,
                icon: DollarSign,
                gradient:
                  "bg-linear-to-br from-amber-50 to-orange-50 border-amber-100",
                iconColor: "text-amber-600",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border p-4 ${item.gradient}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {item.label}
                  </p>
                </div>
                <p className="text-xl font-bold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Weekly Sales
              </h2>
              <p className="text-xs text-slate-400">Last 7 days performance</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={32}>
                <defs>
                  <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [
                    `$${Number(value).toLocaleString()}`,
                    "Sales",
                  ]}
                />
                <Bar dataKey="value" fill="url(#gBar)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Recent Orders & Tickets ─── */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
                <Package className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Orders
                </h2>
                <p className="text-xs text-slate-400">Latest transactions</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 transition">
              <Eye className="h-3.5 w-3.5" />
              View all
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.length > 0 ? (
              recentOrders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    {o.user?.name?.charAt(0)?.toUpperCase() ?? "#"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {o.orderNumber}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {o.user?.name ?? o.user?.email ?? "—"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-slate-900">
                      ${o.amount.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {o.status && (
                    <StatusBadge status={o.status} />
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 py-12">
                <Package className="h-8 w-8 text-slate-200" />
                <p className="text-sm text-slate-400">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <Headphones className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Tickets
                </h2>
                <p className="text-xs text-slate-400">Support requests</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 transition">
              <Eye className="h-3.5 w-3.5" />
              View all
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentTickets.length > 0 ? (
              recentTickets.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    {t.user?.name?.charAt(0)?.toUpperCase() ?? "#"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {t.ticketId}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{t.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-slate-400">
                      {new Date(t.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {t.status && (
                    <StatusBadge status={t.status} />
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 py-12">
                <Headphones className="h-8 w-8 text-slate-200" />
                <p className="text-sm text-slate-400">No tickets yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Quick Stats Footer ─── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Pending Orders",
            value: stats.pendingOrders,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Complete Orders",
            value: stats.completeOrders,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Active Users",
            value: stats.activeUsers,
            icon: Activity,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            label: "Today's Revenue",
            value: `$${revenue.today.toFixed(2)}`,
            icon: DollarSign,
            color: "text-sky-600",
            bg: "bg-sky-50",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-4 shadow-sm"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg}`}
            >
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="text-lg font-bold text-slate-900">
                {typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
