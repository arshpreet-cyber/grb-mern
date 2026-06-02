import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildOrderPaidEmail } from "@/server/email";

const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.NEXTAUTH_URL ??
  ""
).replace(/\/$/, "").replace("http://localhost:3000", "https://grb-mern-gilt.vercel.app");

async function markOrderPaid(orderId: string, tokenCode: string, paymentId: string | null) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
    include: { orderDetails: true },
  });
  if (!order) return null;

  const expected = crypto
    .createHash("sha256")
    .update((order.orderNumber ?? orderId) + (process.env.NEXTAUTH_SECRET ?? ""))
    .digest("hex");

  if (tokenCode !== expected) return "invalid_token";

  if (order.paymentStatus !== "2") {
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { paymentStatus: "2", paymentId: paymentId ?? null },
    });

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
  }

  return order.id;
}

// Browser redirect from payment gateway (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const tokenCode = searchParams.get("tokenCode");
  const paymentId =
    searchParams.get("paymentId") ??
    searchParams.get("payment_id") ??
    searchParams.get("PayerID") ??
    null;

  if (!orderId || !tokenCode) {
    return NextResponse.redirect(`${SITE_URL}/dashboard/orders`);
  }

  try {
    const result = await markOrderPaid(orderId, tokenCode, paymentId);
    if (!result || result === "invalid_token") {
      return NextResponse.redirect(`${SITE_URL}/dashboard/orders`);
    }
    return NextResponse.redirect(`${SITE_URL}/order/${orderId}/details`);
  } catch (err: any) {
    console.error("[payment-callback GET]", err.message);
    return NextResponse.redirect(`${SITE_URL}/dashboard/orders`);
  }
}

// Server-to-server callback from payment gateway (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) ?? Object.fromEntries(new URL(req.url).searchParams);
    const orderId = body.orderId ?? body.order_id;
    const tokenCode = body.tokenCode ?? body.token_code;
    const paymentId = body.paymentId ?? body.payment_id ?? null;

    if (!orderId || !tokenCode) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const result = await markOrderPaid(orderId, tokenCode, paymentId);
    if (!result) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (result === "invalid_token") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[payment-callback POST]", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
