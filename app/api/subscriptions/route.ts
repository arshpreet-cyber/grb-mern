import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        user: { email: session.user.email },
        isRecurring: 1,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        paymentId: true, 
        amount: true,
        currency: true,
        createdAt: true, // Used for Order Date
        updatedAt: true, // Fetched to calculate Renewal Date
      },
    });

    // Transform database rows into the structure expected by your UI
    const subscriptions = orders.map((o) => {
      // Calculate renewal date: 30 days after updatedAt
      let renewalDateStr = "—";
      if (o.updatedAt) {
        const rDate = new Date(o.updatedAt);
        rDate.setDate(rDate.getDate() + 30); 
        renewalDateStr = rDate.toLocaleDateString("en-GB").replace(/\//g, "-");
      }

      return {
        id: o.id,
        orderNo: o.orderNumber ?? `ORD-${o.id.toString().substring(0, 7)}`,
        paymentId: o.paymentId ?? "—",
        amount: o.amount != null ? `${o.currency ?? "$"}${o.amount}` : "—",
        orderDate: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-") : "—",
        renewalDate: renewalDateStr,
        duration: "30 Days",
      };
    });

    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}