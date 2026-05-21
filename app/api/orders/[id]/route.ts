import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildOrderStatusEmail } from "@/server/email";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const allowed = ["status", "paymentStatus", "completedOn", "workStatus", "deletedAt"];
    const data: any = {};
    for (const key of allowed) {
      if (key in body) data[key] = body[key];
    }

    const order = await prisma.order.update({
      where: { id },
      data,
      include: { user: { select: { name: true, email: true } } },
    });

    if ("status" in body) {
      const email = order.email ?? order.user?.email;
      const name = order.firstName
        ? `${order.firstName} ${order.lastName ?? ""}`.trim()
        : (order.user?.name ?? "Customer");

      if (email) {
        const { subject, html } = buildOrderStatusEmail({
          name,
          email,
          orderNumber: order.orderNumber ?? order.id,
          status: body.status,
        });
        sendEmailNotification({ to: email, subject, text: `Your order #${order.orderNumber ?? order.id} status has changed to ${body.status}.`, html }).catch(() => {});
      }
    }

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderDetails: true },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}
