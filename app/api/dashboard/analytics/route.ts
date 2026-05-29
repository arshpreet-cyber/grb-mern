import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function platformIcon(name: string) {
  const n = (name ?? "").toLowerCase();
  if (n.includes("google")) return "google";
  if (n.includes("trust")) return "trustpilot";
  if (n.includes("glass")) return "glassdoor";
  return "google";
}

function pct(current: number, prev: number): string {
  if (prev === 0) return current > 0 ? "+100%" : "0%";
  const change = ((current - prev) / prev) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monthName = searchParams.get("month") || MONTH_NAMES[new Date().getMonth()];
    const year = new Date().getFullYear();
    const monthIndex = MONTH_NAMES.indexOf(monthName);
    const safeMonth = monthIndex === -1 ? new Date().getMonth() : monthIndex;

    const startDate = new Date(year, safeMonth, 1);
    const endDate = new Date(year, safeMonth + 1, 0, 23, 59, 59, 999);

    // Previous month
    const prevMonth = safeMonth === 0 ? 11 : safeMonth - 1;
    const prevYear = safeMonth === 0 ? year - 1 : year;
    const prevStart = new Date(prevYear, prevMonth, 1);
    const prevEnd = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59, 999);

    // ── Stats (current month) ──
    const [
      openTickets, awaitingTickets, closedTickets,
      totalOrders, pendingOrders, completeOrders,
      totalUsers, activeUsers,
    ] = await Promise.all([
      prisma.ticket.count({ where: { status: "Open", createdAt: { gte: startDate, lte: endDate } } }),
      prisma.ticket.count({ where: { status: "Awaiting Reply", createdAt: { gte: startDate, lte: endDate } } }),
      prisma.ticket.count({ where: { status: "Closed", createdAt: { gte: startDate, lte: endDate } } }),
      prisma.order.count({ where: { deletedAt: null, createdAt: { gte: startDate, lte: endDate } } }),
      prisma.order.count({ where: { deletedAt: null, status: "1", createdAt: { gte: startDate, lte: endDate } } }),
      prisma.order.count({ where: { deletedAt: null, status: "3", createdAt: { gte: startDate, lte: endDate } } }),
      prisma.user.count(),
      prisma.user.count({ where: { status: "active" } }),
    ]);

    // ── Stats (prev month for % change) ──
    const [prevOrders, prevUsers, prevTickets] = await Promise.all([
      prisma.order.count({ where: { deletedAt: null, createdAt: { gte: prevStart, lte: prevEnd } } }),
      prisma.user.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
      prisma.ticket.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
    ]);
    const currentMonthUsers = await prisma.user.count({ where: { createdAt: { gte: startDate, lte: endDate } } });
    const currentMonthTickets = openTickets + awaitingTickets + closedTickets;

    // ── Revenue ──
    const [monthPaidOrders, allPaidOrders] = await Promise.all([
      prisma.order.findMany({
        where: { paymentStatus: "2", deletedAt: null, createdAt: { gte: startDate, lte: endDate } },
        select: { amount: true },
      }),
      prisma.order.findMany({
        where: { paymentStatus: "2", deletedAt: null },
        select: { amount: true },
      }),
    ]);
    const monthlyRevenue = monthPaidOrders.reduce((s, o) => s + (o.amount ?? 0), 0);
    const allTimeRevenue = allPaidOrders.reduce((s, o) => s + (o.amount ?? 0), 0);
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayPaid = await prisma.order.findMany({
      where: { paymentStatus: "2", deletedAt: null, createdAt: { gte: todayStart } },
      select: { amount: true },
    });
    const todayRevenue = todayPaid.reduce((s, o) => s + (o.amount ?? 0), 0);

    // Prev month revenue for % change
    const prevMonthPaid = await prisma.order.findMany({
      where: { paymentStatus: "2", deletedAt: null, createdAt: { gte: prevStart, lte: prevEnd } },
      select: { amount: true },
    });
    const prevMonthRevenue = prevMonthPaid.reduce((s, o) => s + (o.amount ?? 0), 0);

    // ── Earnings chart (full year, all paid orders) ──
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59);
    const yearOrders = await prisma.order.findMany({
      where: { paymentStatus: "2", deletedAt: null, createdAt: { gte: yearStart, lte: yearEnd } },
      select: { amount: true, createdAt: true },
    });
    const earningsData = MONTH_NAMES.map((m, i) => ({
      month: m.slice(0, 3).toUpperCase(),
      earnings: Math.round(yearOrders.filter(o => new Date(o.createdAt).getMonth() === i).reduce((s, o) => s + (o.amount ?? 0), 0)),
    }));

    // ── Users chart (full year, new signups per month) ──
    const yearUsers = await prisma.user.findMany({
      where: { createdAt: { gte: yearStart, lte: yearEnd } },
      select: { createdAt: true },
    });
    const usersData = MONTH_NAMES.map((m, i) => ({
      month: m.slice(0, 3).toUpperCase(),
      users: yearUsers.filter(u => new Date(u.createdAt).getMonth() === i).length,
    }));

    // ── Revenue sources (order status breakdown for selected month) ──
    const allMonthOrders = await prisma.order.findMany({
      where: { deletedAt: null, createdAt: { gte: startDate, lte: endDate } },
      select: { status: true },
    });
    const total = allMonthOrders.length || 1;
    const statusCount = (s: string) => allMonthOrders.filter(o => o.status === s).length;
    const revenueSources = [
      { name: "Complete",  value: Math.round((statusCount("3") / total) * 100), color: "#7c3aed" },
      { name: "Pending",   value: Math.round((statusCount("1") / total) * 100), color: "#f59e0b" },
      { name: "Cancelled", value: Math.round((statusCount("5") / total) * 100), color: "#ef4444" },
      { name: "Processing",value: Math.round((statusCount("2") / total) * 100), color: "#3b82f6" },
    ].filter(s => s.value > 0);
    if (revenueSources.length === 0) {
      revenueSources.push({ name: "No Orders", value: 100, color: "#e2e8f0" });
    }

    // ── Top products (from OrderDetail, group by platform) ──
    const platformGroups = await prisma.orderDetail.groupBy({
      by: ["platform"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 4,
    });
    const maxSales = platformGroups[0]?._count.id ?? 1;
    const topProducts = platformGroups.map(p => ({
      name: p.platform ? `${p.platform} Reviews` : "Unknown",
      sales: p._count.id,
      max: maxSales,
      icon: platformIcon(p.platform ?? ""),
    }));

    // ── Recent orders & tickets ──
    const [recentOrders, recentTickets] = await Promise.all([
      prisma.order.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.ticket.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return NextResponse.json({
      stats: { openTickets, awaitingTickets, closedTickets, totalOrders, pendingOrders, completeOrders, totalUsers, activeUsers },
      changes: {
        revenue: pct(monthlyRevenue, prevMonthRevenue),
        orders: pct(totalOrders, prevOrders),
        users: pct(currentMonthUsers, prevUsers),
        tickets: pct(currentMonthTickets, prevTickets),
      },
      revenue: { today: todayRevenue, monthly: monthlyRevenue, yearly: 0, allTime: allTimeRevenue },
      recentOrders,
      recentTickets,
      charts: { earningsData, usersData, revenueSources, topProducts },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
