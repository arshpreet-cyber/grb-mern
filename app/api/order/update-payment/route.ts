import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildOrderPaidEmail } from "@/server/email";

/**
 * Called by payments.localseobuzz.com (PHP PayPal grbSuccess) after payment capture.
 *
 * POST /api/order/update-payment
 * Body: { api_token, order_id, payment_status, payment_id, subscription_id }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ message: "error", error: "Invalid body" }, { status: 400 });
    }

    const { api_token, order_id, payment_status, payment_id, subscription_id } = body;

    const validTokens = [process.env.BULK_API_TOKEN, process.env.GRB_API_TOKEN].filter(Boolean);
    if (!api_token || !validTokens.includes(api_token)) {
      return NextResponse.json({ message: "error", error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(order_id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "error", error: "Invalid order_id" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderDetails: true },
    });

    if (!order) {
      return NextResponse.json({ message: "error", error: "Order not found" }, { status: 404 });
    }

    const wasAlreadyPaid = order.paymentStatus === "2";
    const newStatus      = String(payment_status ?? "2");

    await prisma.order.update({
      where: { id },
      data: {
        paymentStatus:  newStatus,
        paymentId:      payment_id      ? String(payment_id)      : order.paymentId,
        subscriptionId: subscription_id ? String(subscription_id) : order.subscriptionId,
      },
    });

    if (newStatus === "2" && !wasAlreadyPaid && order.email) {
      const emailContent = buildOrderPaidEmail({
        name:        `${order.firstName ?? ""} ${order.lastName ?? ""}`.trim() || "Customer",
        email:       order.email,
        orderNumber: order.orderNumber ?? String(id),
        items:       order.orderDetails.map((d) => ({
          platform:     d.itemName ?? "",
          qty:          d.quantity ?? 1,
          pricePerUnit: d.amount   ?? 0,
        })),
        total: order.amount ?? 0,
      });
      const devEmail   = process.env.DEV_EMAIL;
      const recipients = devEmail ? `${order.email},${devEmail}` : order.email;
      sendEmailNotification({
        to:      recipients,
        subject: emailContent.subject,
        text:    `Payment confirmed for order #${order.orderNumber}.`,
        html:    emailContent.html,
      }).catch((err) => console.error("[order/update-payment email]", err.message));
    }

    return NextResponse.json({ message: "success" });
  } catch (err: any) {
    console.error("[order/update-payment]", err);
    return NextResponse.json({ message: "error", error: err.message }, { status: 500 });
  }
}
