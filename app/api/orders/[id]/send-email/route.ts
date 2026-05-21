import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildUnpaidReminderEmail } from "@/server/email";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { type } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderDetails: true, user: { select: { name: true, email: true } } },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const email = order.email ?? order.user?.email;
    if (!email) return NextResponse.json({ error: "No email on this order" }, { status: 400 });

    const name = order.firstName
      ? `${order.firstName} ${order.lastName ?? ""}`.trim()
      : (order.user?.name ?? "Customer");

    if (type === "unpaid") {
      const items = order.orderDetails.map(d => ({
        platform: d.platform ?? d.itemName ?? "Review",
        qty: d.quantity ?? 1,
        pricePerUnit: d.amount ?? 0,
      }));
      const total = items.reduce((s, i) => s + i.pricePerUnit * i.qty, 0);
      const { subject, html } = buildUnpaidReminderEmail({
        name,
        email,
        orderNumber: order.orderNumber ?? order.id,
        items,
        total,
        payUrl: order.payUrl ?? null,
      });

      await sendEmailNotification({ to: email, subject, text: `Your order #${order.orderNumber} is unpaid. Please complete your payment.`, html });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
