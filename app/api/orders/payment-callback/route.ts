import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildOrderPaidEmail, ADMIN_EMAIL, buildSubscriptionAdminEmail } from "@/server/email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const tokenCode = searchParams.get("tokenCode");
  const paymentId = searchParams.get("paymentId") ?? searchParams.get("payment_id") ?? null;

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "").replace(/\/$/, "");

  if (!orderId || !tokenCode) {
    return NextResponse.redirect(`${appUrl}/dashboard/orders`);
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderDetails: true },
    });

    if (!order) {
      return NextResponse.redirect(`${appUrl}/dashboard/orders`);
    }

    // Verify tokenCode — derived from orderNumber + NEXTAUTH_SECRET
    const expected = crypto
      .createHash("sha256")
      .update((order.orderNumber ?? orderId) + (process.env.NEXTAUTH_SECRET ?? ""))
      .digest("hex");

    if (tokenCode !== expected) {
      return NextResponse.redirect(`${appUrl}/dashboard/orders`);
    }

    // Already marked paid — just redirect
    if (order.paymentStatus === "2") {
      return NextResponse.redirect(`${appUrl}/order/${orderId}/details`);
    }

    // Mark as paid
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "2",
        paymentId: paymentId ?? null,
      },
    });

    // Send payment confirmation email
    if (order.email) {
      const emailContent = buildOrderPaidEmail({
        name: `${order.firstName ?? ""} ${order.lastName ?? ""}`.trim() || "Customer",
        email: order.email,
        orderNumber: order.orderNumber ?? orderId,
        items: order.orderDetails.map((d) => ({
          platform: d.platform ?? d.itemName ?? "",
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
        text: `Payment confirmed for order #${order.orderNumber}.`,
        html: emailContent.html,
      }).catch((err) => console.error("[payment-callback email]", err.message));
    }

    return NextResponse.redirect(`${appUrl}/order/${orderId}/details`);
  } catch (err: any) {
    console.error("[payment-callback]", err.message);
    return NextResponse.redirect(`${appUrl}/dashboard/orders`);
  }
}
