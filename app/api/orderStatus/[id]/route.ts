import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildOrderPaidEmail } from "@/server/email";

/**
 * Called by payments.adaired.com (PHP grb_success / grb_cancel) to update order payment status.
 *
 * GET /api/orderStatus/{id}?status=2&payment_id=xxx&subscription_id=xxx&api_token=xxx
 *   status 1 = pending/cancelled, 2 = paid, 3 = halted/refunded
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(req.url);
  const apiToken = searchParams.get("api_token");

  if (!apiToken || apiToken !== process.env.GRB_API_TOKEN) {
    return NextResponse.json({ message: "error", error: "Unauthorized" }, { status: 401 });
  }

  const { id: idStr } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) {
    return NextResponse.json({ message: "error", error: "Invalid ID" }, { status: 400 });
  }

  const status         = searchParams.get("status")          ?? "1";
  const paymentId      = searchParams.get("payment_id")      ?? null;
  const subscriptionId = searchParams.get("subscription_id") ?? null;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderDetails: true },
  });

  if (!order) {
    return NextResponse.json({ message: "error", error: "Order not found" }, { status: 404 });
  }

  const wasAlreadyPaid = order.paymentStatus === "2";

  await prisma.order.update({
    where: { id },
    data: {
      paymentStatus:  status,
      paymentId:      paymentId      ?? order.paymentId,
      subscriptionId: subscriptionId ?? order.subscriptionId,
    },
  });

  // Send payment confirmed email once
  if (status === "2" && !wasAlreadyPaid && order.email) {
    const emailContent = buildOrderPaidEmail({
      name:        `${order.firstName ?? ""} ${order.lastName ?? ""}`.trim() || "Customer",
      email:       order.email,
      orderNumber: order.orderNumber ?? String(id),
      items:       order.orderDetails.map((d) => ({
        platform:     d.platform ?? d.itemName ?? "",
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
    }).catch((err) => console.error("[orderStatus email]", err.message));
  }

  return NextResponse.json({ message: "success" });
}
