import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  "1": "Bitcoin", "2": "Razorpay", "3": "Stripe",
  "4": "PayPal", "5": "Bank Transfer", "6": "Binance",
};

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
        itemName: true,
        amount: true,
        currency: true,
        paymentMethod: true,
        duedate: true,
      },
    });

    const plans = orders.map((o) => ({
      id: o.orderNumber ?? o.id,
      product: o.itemName ?? "—",
      details: o.amount != null ? `${o.currency ?? "$"}${o.amount}/Monthly` : "—",
      duration: "30 Days",
      renewalDate: o.duedate ? new Date(o.duedate).toLocaleDateString("en-GB") : "—",
      method: PAYMENT_METHOD_LABEL[o.paymentMethod ?? ""] ?? o.paymentMethod ?? "—",
    }));

    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
