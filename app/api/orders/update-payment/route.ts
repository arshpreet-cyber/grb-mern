import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildOrderPaidEmail, buildSubscriptionAdminEmail, ADMIN_EMAIL } from "@/server/email";

export async function POST(req: NextRequest) {
  const { api_token, order_id, payment_id, subscription_id } = await req.json();

  if (api_token !== process.env.BULK_API_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: parseInt(order_id) },
    include: { orderDetails: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await prisma.order.update({
    where: { id: parseInt(order_id) },
    data: {
      paymentStatus: "2",
      paymentId: payment_id ?? null,
      subscriptionId: subscription_id ?? null,
    },
  });

  // Send payment confirmed email silently
  if (order.email) {
    const emailContent = buildOrderPaidEmail({
      name: `${order.firstName ?? ""} ${order.lastName ?? ""}`.trim() || "Customer",
      email: order.email ?? "",
      orderNumber: order.orderNumber ?? order_id,
      items: order.orderDetails.map((d) => ({
        platform: d.itemName ?? "",
        qty: d.quantity ?? 1,
        pricePerUnit: d.amount ?? 0,
      })),
      total: order.amount ?? 0,
    });
    const devEmail = process.env.DEV_EMAIL;
    const recipients = devEmail ? `${order.email},${devEmail}` : order.email;
    sendEmailNotification({
      to: recipients,
      subject: emailContent.subject,
      text: `Payment confirmed for order #${order.orderNumber}. Total: $${order.amount}`,
      html: emailContent.html,
    }).catch((err) => console.error("[Payment Email]", err.message));
  }

  // EVT-0005: notify admin if this is a subscription payment
  if (subscription_id && order.email && ADMIN_EMAIL) {
    const subEmail = buildSubscriptionAdminEmail({ email: order.email, orderNumber: order.orderNumber ?? order_id });
    sendEmailNotification({ to: ADMIN_EMAIL, subject: subEmail.subject, text: `New subscription: ${order.email}`, html: subEmail.html })
      .catch((err) => console.error("[subscription email]", err.message));
  }

  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order/${order_id}/details`;
  return NextResponse.json({ success: true, redirectUrl });
}
