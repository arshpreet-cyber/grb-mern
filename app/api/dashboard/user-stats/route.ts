import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [totalOrders, pendingOrders, openTickets, activeSubscriptions] = await Promise.all([
      prisma.order.count({ where: { userId, deletedAt: null } }),
      prisma.order.count({ where: { userId, status: "1", deletedAt: null } }),
      prisma.ticket.count({ where: { userId, status: "Open" } }),
      prisma.order.count({ where: { userId, isRecurring: 1, status: { notIn: ["5", "6"] }, deletedAt: null } }),
    ]);

    return NextResponse.json({ totalOrders, pendingOrders, openTickets, activeSubscriptions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
