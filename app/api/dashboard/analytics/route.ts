import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get ticket counts by status
    const openTickets = await prisma.ticket.count({
      where: { status: "Open" },
    });

    const awaitingTickets = await prisma.ticket.count({
      where: { status: "Awaiting Reply" },
    });

    const closedTickets = await prisma.ticket.count({
      where: { status: "Closed" },
    });

    // Get order counts by status
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { status: "Pending" },
    });
    const completeOrders = await prisma.order.count({
      where: { status: "Complete" },
    });

    // Get user counts
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { status: "active" },
    });

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
    const revenue = await prisma.revenue.findFirst({
      orderBy: { createdAt: "desc" },
    });

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
      revenue: revenue || {
        today: 350.0,
        monthly: 3895.0,
        yearly: 55357.0,
        allTime: 1597473.0,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
