import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { createZohoInvoice } from "@/lib/zoho-billing";
import { sendEmailNotification, buildOrderCreatedEmail } from "@/server/email";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, paymentMethod } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.pricePerUnit * item.qty,
      0
    );

    const orderNumber = Date.now().toString();
    const tokenCode = crypto
      .createHash("sha256")
      .update(orderNumber + (process.env.NEXTAUTH_SECRET ?? ""))
      .digest("hex");

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { email: true, name: true },
    });

    const pmMap: Record<string, string> = { card: "2", paypal: "4", razorpay: "3", zoho: "5" };

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: parseInt(session.user.id),
        email: user?.email,
        firstName: user?.name?.split(" ")[0] ?? "",
        lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
        amount: Math.round(total * 100) / 100,
        currency: "USD",
        symbol: "$",
        paymentStatus: "1",
        status: "1",
        paymentMethod: pmMap[paymentMethod] ?? "2",
        tokenCode,
        orderDetails: {
          create: items.map((item: any) => ({
            itemName: item.platform,
            itemId: item.id,
            quantity: item.qty,
            amount: item.pricePerUnit,
            platform: item.platform,
            type: item.type,
            image: item.image,
          })),
        },
      },
    });

    // Send order confirmation email immediately after order is saved
    if (user?.email) {
      const emailContent = buildOrderCreatedEmail({
        name: user.name ?? "Customer",
        email: user.email,
        orderNumber,
        items: items.map((item: any) => ({
          platform: item.platform,
          qty: item.qty,
          pricePerUnit: item.pricePerUnit,
        })),
        total: Math.round(total * 100) / 100,
      });
      const devEmail = process.env.DEV_EMAIL;
      const recipients = devEmail ? `${user.email},${devEmail}` : user.email;
      sendEmailNotification({
        to: recipients,
        subject: emailContent.subject,
        text: `Order #${orderNumber} received. Total: $${total.toFixed(2)}`,
        html: emailContent.html,
      }).catch((err) => console.error("[Order Email]", err.message));
    }

    // Use SITE_URL env var (set on Vercel to production domain) with fallbacks
    const appUrl = (
      process.env.SITE_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.NEXTAUTH_URL ??
      ""
    ).replace(/\/$/, "").replace("http://localhost:3000", "https://grb-mern-gilt.vercel.app");

    const callbackUrl = `${appUrl}/api/orders/payment-callback?orderId=${order.id}&tokenCode=${tokenCode}`;

    const paymentBaseUrl = (process.env.PAYMENT_URL ?? "").replace(/\/$/, "");

    let payUrl = "";
    if (paymentMethod === "paypal") {
      payUrl = `${process.env.PAYPAL_PAYMENT_URL}?orderno=${order.id}&tokenCode=${tokenCode}&return_url=${encodeURIComponent(callbackUrl)}&success_url=${encodeURIComponent(callbackUrl)}&redirect_url=${encodeURIComponent(callbackUrl)}`;
    } else if (paymentMethod === "razorpay") {
      // PHP grb_payment fetches order via /api/order/{orderno} then handles Razorpay
      payUrl = `${paymentBaseUrl}/grb/payment?orderno=${order.id}`;
    } else {
      payUrl = `${paymentBaseUrl}?orderno=${order.id}&tokenCode=${tokenCode}`;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { payUrl },
    });

    // Create Zoho Books invoice silently in background for all orders
    createZohoInvoice({
      email: user?.email ?? "",
      name: user?.name ?? "",
      orderNumber,
      items: items.map((item: any) => ({
        platform: item.platform,
        pricePerUnit: item.pricePerUnit,
        qty: item.qty,
        type: item.type,
      })),
    }).catch((err) => console.error("[Zoho Invoice]", err.message));

    return NextResponse.json({ payUrl, orderId: order.id });
  } catch (err: any) {
    console.error("[orders/create]", err);
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}
