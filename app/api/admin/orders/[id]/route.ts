import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderDetails: true, user: { select: { name: true, email: true } } },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
