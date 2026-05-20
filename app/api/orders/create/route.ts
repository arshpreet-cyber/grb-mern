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
      where: { id: session.user.id },
      select: { email: true, name: true },
    });

    const pmMap: Record<string, string> = { card: "2", paypal: "4", razorpay: "3", zoho: "5" };

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
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

    let payUrl = "";
    if (paymentMethod === "paypal") {
      payUrl = `${process.env.PAYPAL_PAYMENT_URL}?orderno=${order.id}`;
    } else if (paymentMethod === "razorpay") {
      payUrl = `${process.env.PAYMENT_URL}stripe?orderno=${order.id}&tokenCode=${tokenCode}`;
    } else if (paymentMethod === "zoho") {
      try {
        const zohoUrl = await createZohoInvoice({
          email: user?.email ?? "",
          name: user?.name ?? "",
          orderNumber,
          items: items.map((item: any) => ({
            platform: item.platform,
            pricePerUnit: item.pricePerUnit,
            qty: item.qty,
            type: item.type,
          })),
          returnPaymentUrl: true,
        });
        payUrl = zohoUrl as string;
      } catch (err: any) {
        console.error("[Zoho Invoice]", err.message);
        return NextResponse.json({ error: `Zoho payment failed: ${err.message}` }, { status: 502 });
      }
    } else {
      payUrl = `${process.env.PAYMENT_URL}?orderno=${order.id}&tokenCode=${tokenCode}`;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { payUrl },
    });

    // For non-Zoho payments, create Zoho Books invoice silently in background
    if (paymentMethod !== "zoho") createZohoInvoice({
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

    // Send order confirmation email silently
    if (user?.email) {
      const emailContent = buildOrderCreatedEmail({
        name: user.name?.split(" ")[0] ?? "Customer",
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

    return NextResponse.json({ payUrl, orderId: order.id });
  } catch (err: any) {
    console.error("[orders/create]", err);
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}
