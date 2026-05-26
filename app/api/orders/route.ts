import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const filter = searchParams.get("filter") ?? "all";
    const search = searchParams.get("search") ?? "";

    const statusMap: Record<string, object> = {
      all:        { deletedAt: null },
      paid:       { deletedAt: null, paymentStatus: "2" },
      pending:    { deletedAt: null, status: "1" },
      processing: { deletedAt: null, status: "2" },
      unpaid:     { deletedAt: null, paymentStatus: "1" },
      completed:  { deletedAt: null, status: "3" },
      deleted:    { deletedAt: { not: null } },
    };

    const where: any = { ...(statusMap[filter] ?? { deletedAt: null }) };

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { itemName: { contains: search, mode: "insensitive" } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json(orders);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
