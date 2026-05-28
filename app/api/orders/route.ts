import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = (session.user as any).role?.toUpperCase() === "ADMIN";
    const userId = session.user.id;
    const userEmail = session.user.email;

    const { searchParams } = req.nextUrl;
    const filter = searchParams.get("filter") ?? "all";
    const search = searchParams.get("search") ?? "";

    const statusMap: Record<string, object> = {
      all:        { deletedAt: null },
      paid:       { deletedAt: null, paymentStatus: "2" },
      pending:    { deletedAt: null, status: { in: ["1", "2", "4"] } },
      processing: { deletedAt: null, status: "2" },
      unpaid:     { deletedAt: null, paymentStatus: "1" },
      completed:  { deletedAt: null, status: "3" },
      deleted:    { deletedAt: { not: null } },
    };

    const where: any = { ...(statusMap[filter] ?? { deletedAt: null }) };

    // Non-admins only see their own orders (by userId OR email)
    if (!isAdmin) {
      where.OR = [
        { userId },
        ...(userEmail ? [{ email: userEmail }] : []),
      ];
    }

    if (search) {
      const searchConditions = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { itemName: { contains: search, mode: "insensitive" } },
      ];
      // Merge search with existing OR (user scope) using AND
      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          { OR: searchConditions },
        ];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json(orders);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
