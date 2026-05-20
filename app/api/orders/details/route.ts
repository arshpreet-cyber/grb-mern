import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, notes, items } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderDetails: true },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Save notes and mark details as filled
    await prisma.order.update({
      where: { id: orderId },
      data: {
        notes,
        detailsFilled: true,
        detailsFilledAt: new Date(),
      },
    });

    // Save profile URL per item
    if (items?.length) {
      await Promise.all(
        items.map((item: { id: string; profileUrl: string }) =>
          prisma.orderDetail.update({
            where: { id: item.id },
            data: { profileUrl: item.profileUrl },
          })
        )
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[orders/details]", err);
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}
