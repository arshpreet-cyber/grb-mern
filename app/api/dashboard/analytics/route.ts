import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get ticket counts by status
    const openTickets = await prisma.ticket.count({ where: { status: "Open" } });
    const awaitingTickets = await prisma.ticket.count({ where: { status: "Awaiting Reply" } });
    const closedTickets = await prisma.ticket.count({ where: { status: "Closed" } });

    // Get order counts by status
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: "Pending" } });
    const completeOrders = await prisma.order.count({ where: { status: "Complete" } });

    // Get user counts
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { status: "active" } });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    });

    // Get recent tickets
    const recentTickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    });

    // Get revenue data
    const revenue = await prisma.revenue.findFirst({ orderBy: { createdAt: "desc" } });

    // ── Mock chart data (replace with real aggregations when ready) ──
    const charts = {
      earningsData: [
        { month: "JAN", earnings: 2100 },
        { month: "FEB", earnings: 1800 },
        { month: "MAR", earnings: 2400 },
        { month: "APR", earnings: 2200 },
        { month: "MAY", earnings: 1900 },
        { month: "JUN", earnings: 2000 },
        { month: "JUL", earnings: 3200 },
        { month: "AUG", earnings: 3800 },
        { month: "SEP", earnings: 3100 },
        { month: "OCT", earnings: 2800 },
        { month: "NOV", earnings: 2500 },
        { month: "DEC", earnings: 2900 },
      ],
      usersData: [
        { month: "JAN", users: 310 },
        { month: "FEB", users: 420 },
        { month: "MAR", users: 390 },
        { month: "APR", users: 530 },
        { month: "MAY", users: 610 },
        { month: "JUN", users: 740 },
        { month: "JUL", users: 680 },
        { month: "AUG", users: 820 },
        { month: "SEP", users: 950 },
        { month: "OCT", users: 1040 },
        { month: "NOV", users: 1120 },
        { month: "DEC", users: 1250 },
      ],
      revenueSources: [
        { name: "Completed", value: 42, color: "#7c3aed" },
        { name: "Pending",   value: 28, color: "#f59e0b" },
        { name: "Cancelled", value: 18, color: "#ef4444" },
        { name: "Refunded",  value: 12, color: "#d1d5db" },
      ],
      topProducts: [
        { name: "Google Reviews", sales: 1245, max: 1500, color: "bg-[#AF670F]", icon: "google" },
        { name: "Google Local Guide Reviews", sales: 1245, max: 1500, color: "bg-[#AF670F]", icon: "google" },
        { name: "TrustPilot Reviews", sales: 987, max: 1500, color: "#00b67a", icon: "trustpilot" },
        { name: "Glassdoor Reviews", sales: 856, max: 1500, color: "#0caa41", icon: "glassdoor" },
      ],
    };

    return NextResponse.json({
      stats: {
        openTickets,
        awaitingTickets,
        closedTickets,
        totalOrders,
        pendingOrders,
        completeOrders,
        totalUsers,
        activeUsers,
      },
      recentOrders,
      recentTickets,
      charts,
      revenue: revenue || {
        today: 3842.0,
        monthly: 128950.0,
        yearly: 987430.0,
        allTime: 1597473.0,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
