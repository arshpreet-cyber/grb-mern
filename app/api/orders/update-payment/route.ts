import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildOrderPaidEmail } from "@/server/email";

export async function POST(req: NextRequest) {
  const { api_token, order_id, payment_id, subscription_id } = await req.json();

  if (api_token !== process.env.BULK_API_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({ where: { id: order_id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await prisma.order.update({
    where: { id: order_id },
    data: {
      paymentStatus: "2",
      paymentId: payment_id ?? null,
      subscriptionId: subscription_id ?? null,
    },
  });

  // Send payment confirmed email silently
  if (order.email) {
    const emailContent = buildOrderPaidEmail({
      name: order.firstName ?? "Customer",
      orderNumber: order.orderNumber ?? order_id,
      total: order.amount ?? 0,
    });
    sendEmailNotification({
      to: order.email,
      subject: emailContent.subject,
      text: `Payment confirmed for order #${order.orderNumber}. Total: $${order.amount}`,
      html: emailContent.html,
    }).catch((err) => console.error("[Payment Email]", err.message));
  }

  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order/${order_id}/details`;
  return NextResponse.json({ success: true, redirectUrl });
}
