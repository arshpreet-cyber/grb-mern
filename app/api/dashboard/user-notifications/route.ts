import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt((session.user as any).id, 10);
    const userEmail = session.user.email;

    // Get user's recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        OR: [
          { userId },
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Get user's recent tickets
    const recentTickets = await prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      recentOrders,
      recentTickets,
    });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
