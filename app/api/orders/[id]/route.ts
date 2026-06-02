import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildOrderStatusEmail } from "@/server/email";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } | any }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Safely handles both Next.js Promise parameters or normal params objects
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const body = await req.json();
    const allowed = ["status", "paymentStatus", "completedOn", "workStatus", "deletedAt"];
    const data: any = {};
    for (const key of allowed) {
      if (key in body) data[key] = body[key];
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data,
      include: { orderDetails: true, user: { select: { name: true, email: true } } },
    });

    if ("status" in body) {
      const email = order.email ?? order.user?.email;
      const name = order.firstName
        ? `${order.firstName} ${order.lastName ?? ""}`.trim()
        : (order.user?.name ?? "Customer");

      if (email) {
        const items = (order.orderDetails ?? []).map((d) => ({
          platform: d.platform ?? d.itemName ?? "Review",
          qty: d.quantity ?? 1,
          pricePerUnit: d.amount ?? 0,
        }));
        const total = order.amount ?? 0;
        const isPaid = order.paymentStatus === "2";
        const { subject, html } = buildOrderStatusEmail({
          name,
          email,
          orderNumber: order.orderNumber ?? order.id,
          status: body.status,
          items,
          total,
          amountPaid: isPaid ? total : 0,
        });
        sendEmailNotification({
          to: email,
          subject,
          text: `Your order #${order.orderNumber ?? order.id.toString()} status has changed.`,
          html,
        }).catch((err) => console.error("[status-email]", err.message));
      } else {
        console.warn("[status-email] No email found for order", id);
      }
    }

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } | any }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Fetch the order along with its relations
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { 
        orderDetails: true,
        user: { select: { name: true, email: true } } 
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 🛡️ SECURITY SAFEGUARD FIX:
    // If user is NOT an Admin, enforce they can ONLY view their own profile orders.
    // (Note: Adjust 'session.user.role' depending on your next-auth setup variable)
    const isAdmin = (session.user as any).role === "ADMIN" || (session.user as any).role === "admin";
    
    if (!isAdmin && order.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized access to order" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}