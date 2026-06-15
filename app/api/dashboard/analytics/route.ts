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
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    let startDate: Date;
    let endDate: Date;
    let prevStart: Date;
    let prevEnd: Date;

    const isYearly = monthName.toLowerCase() === "yearly";

    if (isYearly) {
      startDate = new Date(year, 0, 1, 0, 0, 0, 0);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      prevStart = new Date(year - 1, 0, 1, 0, 0, 0, 0);
      prevEnd = new Date(year - 1, 11, 31, 23, 59, 59, 999);
    } else {
      const monthIndex = MONTH_NAMES.indexOf(monthName);
      const safeMonth = monthIndex === -1 ? new Date().getMonth() : monthIndex;

      startDate = new Date(year, safeMonth, 1, 0, 0, 0, 0);
      endDate = new Date(year, safeMonth + 1, 0, 23, 59, 59, 999);

      // Previous month
      const prevMonth = safeMonth === 0 ? 11 : safeMonth - 1;
      const prevYear = safeMonth === 0 ? year - 1 : year;
      prevStart = new Date(prevYear, prevMonth, 1, 0, 0, 0, 0);
      prevEnd = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59, 999);
    }


    // Dates for daily checks
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0,0,0,0);
    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23,59,59,999);

    // Dates for yearly charts
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

    // Execute all independent queries in parallel to optimize latency waterfall
    const [
      orderStatusGroups,
      ticketStatusGroups,
      userStatusGroups,
      prevOrders,
      prevUsers,
      prevTickets,
      currentMonthUsers,
      monthAggregate,
      allTimeAggregate,
      todayAggregate,
      yesterdayAggregate,
      prevMonthAggregate,
      rawEarnings,
      rawUsers,
      monthStatusCounts,
      platformGroups,
      recentOrders,
      recentTickets
    ] = await Promise.all([
      // 1. Order status groups (current month)
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { deletedAt: null, createdAt: { gte: startDate, lte: endDate } }
      }),
      // 2. Ticket status groups (current month)
      prisma.ticket.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { createdAt: { gte: startDate, lte: endDate } }
      }),
      // 3. User status groups (all-time)
      prisma.user.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      // 4. Prev period orders
      prisma.order.count({ where: { deletedAt: null, createdAt: { gte: prevStart, lte: prevEnd } } }),
      // 5. Prev period users
      prisma.user.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
      // 6. Prev period tickets
      prisma.ticket.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
      // 7. Current period users
      prisma.user.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
      // 8. Month revenue
      prisma.order.aggregate({
        where: { paymentStatus: "2", deletedAt: null, createdAt: { gte: startDate, lte: endDate } },
        _sum: { amount: true }
      }),
      // 9. All time revenue
      prisma.order.aggregate({
        where: { paymentStatus: "2", deletedAt: null },
        _sum: { amount: true }
      }),
      // 10. Today revenue
      prisma.order.aggregate({
        where: { paymentStatus: "2", deletedAt: null, createdAt: { gte: todayStart } },
        _sum: { amount: true }
      }),
      // 11. Yesterday revenue
      prisma.order.aggregate({
        where: { paymentStatus: "2", deletedAt: null, createdAt: { gte: yesterdayStart, lte: yesterdayEnd } },
        _sum: { amount: true }
      }),
      // 12. Prev month revenue
      prisma.order.aggregate({
        where: { paymentStatus: "2", deletedAt: null, createdAt: { gte: prevStart, lte: prevEnd } },
        _sum: { amount: true }
      }),
      // 13. Raw earnings (yearly)
      prisma.$queryRaw<{ month: number; earnings: number }[]>`
        SELECT 
          EXTRACT(MONTH FROM "created_at")::integer AS month, 
          SUM(amount)::double precision AS earnings
        FROM "orders"
        WHERE "payment_status" = '2' 
          AND "deleted_at" IS NULL 
          AND "created_at" >= ${yearStart} 
          AND "created_at" <= ${yearEnd}
        GROUP BY EXTRACT(MONTH FROM "created_at")
      `,
      // 14. Raw users (yearly)
      prisma.$queryRaw<{ month: number; count: number }[]>`
        SELECT 
          EXTRACT(MONTH FROM "createdAt")::integer AS month, 
          COUNT(*)::integer AS count
        FROM "User"
        WHERE "createdAt" >= ${yearStart} 
          AND "createdAt" <= ${yearEnd}
        GROUP BY EXTRACT(MONTH FROM "createdAt")
      `,
      // 15. Month status counts (revenue sources)
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { deletedAt: null, createdAt: { gte: startDate, lte: endDate } }
      }),
      // 16. Platform groups (top products). Grouped by raw item name; name
      // variants (quantity/price suffixes, "Updated" labels, etc.) are merged
      // into their base product in JS below, so no take limit here.
      prisma.orderDetail.groupBy({
        by: ["itemName"],
        _count: { id: true },
        where: {
          AND: [
            { itemName: { not: null } },
            { itemName: { notIn: ["NULL", "", "null"] } },
            { itemName: { not: { contains: "free" } } },
            { itemName: { not: { contains: "Free" } } }
          ]
        },
        orderBy: { _count: { id: "desc" } },
      }),
      // 17. Recent orders
      prisma.order.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
      // 18. Recent tickets
      prisma.ticket.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      })
    ]);

    // Format stats values
    const getStatusCount = (groups: any[], status: string) => groups.find(g => g.status === status)?._count.id ?? 0;
    const getStatusSum = (groups: any[]) => groups.reduce((acc, g) => acc + g._count.id, 0);

    const openTickets = getStatusCount(ticketStatusGroups, "Open");
    const awaitingTickets = getStatusCount(ticketStatusGroups, "Awaiting Reply");
    const closedTickets = getStatusCount(ticketStatusGroups, "Closed");
    
    const totalOrders = getStatusSum(orderStatusGroups);
    const pendingOrders = getStatusCount(orderStatusGroups, "1");
    const completeOrders = getStatusCount(orderStatusGroups, "2");
    
    const totalUsers = getStatusSum(userStatusGroups);
    const activeUsers = getStatusCount(userStatusGroups, "active");

    const currentMonthTickets = openTickets + awaitingTickets + closedTickets;

    // Format revenue values
    const monthlyRevenue = monthAggregate._sum.amount ?? 0;
    const allTimeRevenue = allTimeAggregate._sum.amount ?? 0;
    const todayRevenue = todayAggregate._sum.amount ?? 0;
    const yesterdayRevenue = yesterdayAggregate._sum.amount ?? 0;
    const prevMonthRevenue = prevMonthAggregate._sum.amount ?? 0;

    // Format earnings chart data
    const earningsData = MONTH_NAMES.map((m, i) => {
      const monthNum = i + 1;
      const found = rawEarnings.find(r => Number(r.month) === monthNum);
      return {
        month: m.slice(0, 3).toUpperCase(),
        earnings: Math.round(Number(found?.earnings ?? 0)),
      };
    });

    // Format users chart data
    const usersData = MONTH_NAMES.map((m, i) => {
      const monthNum = i + 1;
      const found = rawUsers.find(r => Number(r.month) === monthNum);
      return {
        month: m.slice(0, 3).toUpperCase(),
        users: Number(found?.count ?? 0),
      };
    });

    // Format revenue sources breakdown
    const total = monthStatusCounts.reduce((s, c) => s + c._count.id, 0) || 1;
    const statusCount = (s: string) => monthStatusCounts.find(c => c.status === s)?._count.id ?? 0;
    const revenueSources = [
      { name: "Complete",  value: Math.round((statusCount("2") / total) * 100), color: "#7c3aed" },
      { name: "Pending",   value: Math.round((statusCount("1") / total) * 100), color: "#f59e0b" },
      { name: "Cancelled", value: Math.round((statusCount("4") / total) * 100), color: "#ef4444" },
      { name: "Processing",value: Math.round((statusCount("5") / total) * 100), color: "#3b82f6" },
    ].filter(s => s.value > 0);
    if (revenueSources.length === 0) {
      revenueSources.push({ name: "No Orders", value: 100, color: "#e2e8f0" });
    }

    // Format top selling products.
    // The same product is stored under many free-text item names (quantity /
    // price suffixes, stray "Updated" labels, newline noise, "Reviews-" prefixes),
    // e.g. "Google Reviews" and "Google Reviews Updated\nQuantity: 5 x ...".
    // Normalize each name to its base product so all variants merge into one row.
    const formatProductName = (platform: string | null) => {
      if (!platform) return "Unknown";
      const p = platform.replace(/\s+/g, " ").trim(); // drop newline noise
      return /reviews?$/i.test(p) ? p : `${p} Reviews`;
    };

    const normalizeProductName = (raw: string | null) => {
      let s = (raw ?? "").replace(/\s+/g, " ").trim(); // collapse newlines/spaces
      s = s.replace(/^reviews-\s*/i, "");              // drop leading "Reviews-"
      s = s.split(/quantity/i)[0];                     // cut quantity/price suffix
      s = s.replace(/\bupdated\b/i, "");               // drop stray "Updated"
      s = s.replace(/\s+/g, " ").trim();
      return formatProductName(s || raw);
    };

    // Merge groups by normalized product name, then take the top 4.
    const mergedProducts = new Map<string, number>();
    for (const p of platformGroups) {
      const name = normalizeProductName(p.itemName);
      mergedProducts.set(name, (mergedProducts.get(name) ?? 0) + p._count.id);
    }
    const sortedProducts = Array.from(mergedProducts.entries())
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);
    const maxSales = sortedProducts[0]?.sales ?? 1;

    // Resolve product images by matching normalized names to Product titles.
    const searchNames = Array.from(new Set(sortedProducts.map(p => p.name)));
    const products = searchNames.length
      ? await prisma.product.findMany({
          where: { title: { in: searchNames } },
          select: { title: true, media: true },
        })
      : [];
    const getProductImage = (name: string) => {
      const target = name.trim().toLowerCase();
      return products.find(p => p.title?.trim().toLowerCase() === target)?.media ?? null;
    };

    const topProducts = sortedProducts.map(p => ({
      name: p.name,
      sales: p.sales,
      max: maxSales,
      icon: platformIcon(p.name),
      image: getProductImage(p.name),
    }));

    return NextResponse.json({
      stats: { openTickets, awaitingTickets, closedTickets, totalOrders, pendingOrders, completeOrders, totalUsers, activeUsers },
      changes: {
        revenue: pct(monthlyRevenue, prevMonthRevenue),
        orders: pct(totalOrders, prevOrders),
        users: pct(currentMonthUsers, prevUsers),
        tickets: pct(currentMonthTickets, prevTickets),
        todayRevenue: pct(todayRevenue, yesterdayRevenue),
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
