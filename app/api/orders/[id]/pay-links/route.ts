import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

// Returns the three method-specific payment-gateway URLs for an existing
// unpaid order, so the dashboard "Pay Now" dropdown can offer the same
// PayPal / Card / Razorpay choices as the cart.
export async function GET(req: NextRequest, { params }: { params: { id: string } | any }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, userId: true, email: true, tokenCode: true, payUrl: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const isAdmin = (session.user as any).role?.toUpperCase() === "ADMIN";
    const ownsOrder =
      order.userId === parseInt(session.user.id) ||
      (!!order.email && order.email === session.user.email);
    if (!isAdmin && !ownsOrder) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // tokenCode is normally stored; fall back to parsing it out of the saved payUrl.
    const tokenCode =
      order.tokenCode ??
      order.payUrl?.match(/tokenCode=([^&]+)/)?.[1] ??
      "";

    const paymentBaseUrl = (process.env.PAYMENT_URL ?? "").replace(/\/$/, "");
    const paypalBase = (process.env.PAYPAL_PAYMENT_URL ?? "").replace(/\/$/, "");
    const razorpayUrl = (process.env.RAZORPAY_PAYMENT_URL ?? `${paymentBaseUrl}/grb/stripe`).replace(/\/$/, "");

    const q = `orderno=${order.id}&tokenCode=${tokenCode}`;
    return NextResponse.json({
      paypal: `${paypalBase}?${q}`,
      card: `${paypalBase}?${q}&funding=card`,
      razorpay: `${razorpayUrl}?${q}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}
