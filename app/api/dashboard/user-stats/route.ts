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
    const userEmail = session.user.email;

    // Match orders by userId OR by email (covers guest/imported orders)
    const orderWhere = (extra?: object) => ({
      deletedAt: null,
      OR: [
        { userId },
        ...(userEmail ? [{ email: userEmail }] : []),
      ],
      ...extra,
    });

    const [totalOrders, pendingOrders, openTickets, activeSubscriptions] = await Promise.all([
      // All orders for this user
      prisma.order.count({ where: orderWhere() }),

      // In-progress orders: Pending (1) + Processing (2) + On Hold (4)
      prisma.order.count({ where: orderWhere({ status: { in: ["1", "2", "4"] } }) }),

      // Open tickets (Open + Pending + Awaiting Reply)
      prisma.ticket.count({
        where: {
          userId,
          status: { in: ["Open", "Pending", "Awaiting Reply"] },
        },
      }),

      // Recurring/subscription orders not cancelled or refunded
      prisma.order.count({
        where: orderWhere({ isRecurring: 1, status: { notIn: ["5", "6"] } }),
      }),
    ]);

    return NextResponse.json({ totalOrders, pendingOrders, openTickets, activeSubscriptions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
