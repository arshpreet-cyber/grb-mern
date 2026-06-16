import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

const STATUS_MAP: Record<string, object> = {
  all:          {},
  paid:         { deletedAt: null, paymentStatus: "2" },
  pending:      { deletedAt: null, status: "1" },
  processing:   { deletedAt: null, status: "5" },
  unpaid:       { deletedAt: null, paymentStatus: "1" },
  completed:    { deletedAt: null, status: "2" },
  hold:         { deletedAt: null, status: "3" },
  subscription: { deletedAt: null, OR: [
    { isRecurring: 1 },
    { subscriptionId: { not: null } },
    { rzpaySubscriptionId: { not: null } },
  ]},
  deleted:      { deletedAt: { not: null } },
};

function buildWhere(
  filter: string,
  search: string,
  showAll: boolean,
  userId: number,
  userEmail: string | null | undefined
) {
  const where: any = { ...(STATUS_MAP[filter] ?? { deletedAt: null }) };

  if (!showAll) {
    where.OR = [
      { userId },
      ...(userEmail ? [{ email: userEmail }] : []),
    ];
    // Regular users must never see soft-deleted orders, so keep deletedAt: null.
  }

  if (search) {
    const searchConditions = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { itemName: { contains: search, mode: "insensitive" } },
    ];
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

  return where;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ADMIN and MANAGER can view every order in the admin Order Management view.
    const role = (session.user as any).role?.toUpperCase();
    const canViewAllOrders = role === "ADMIN" || role === "MANAGER";
    const userId = parseInt(session.user.id);
    const userEmail = session.user.email;

    const { searchParams } = req.nextUrl;
    const filter = searchParams.get("filter") ?? "all";
    const search = searchParams.get("search") ?? "";
    const countsOnly = searchParams.get("countsOnly") === "1";
    const adminView = searchParams.get("adminView") === "1" || searchParams.get("adminView") === "true";
    const showAll = canViewAllOrders && adminView;

    // --- Counts-only mode: return counts for every tab in one round-trip ---
    if (countsOnly) {
      const keys = Object.keys(STATUS_MAP);
      const countResults = await Promise.all(
        keys.map((k) =>
          prisma.order.count({
            where: buildWhere(k, "", showAll, userId, userEmail),
          })
        )
      );
      const counts: Record<string, number> = {};
      keys.forEach((k, i) => { counts[k] = countResults[i]; });
      return NextResponse.json({ counts });
    }

    // --- Paginated list mode ---
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "25", 10) || 25));

    // --- Subscription siblings mode: fetch all orders sharing the same orderNumber ---
    const exactOrderNumber = searchParams.get("exactOrderNumber");
    if (exactOrderNumber && showAll) {
      const siblings = await prisma.order.findMany({
        where: { orderNumber: exactOrderNumber },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      });
      return NextResponse.json({ orders: siblings, total: siblings.length });
    }

    const where = buildWhere(filter, search, showAll, userId, userEmail);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.order.count({ where }),
    ]);

    // Batch fetch sibling counts for the returned orders
    const orderNumbers = Array.from(new Set(
      orders.filter(o => o.orderNumber && (o.isRecurring === 1 || o.subscriptionId || o.rzpaySubscriptionId))
            .map(o => o.orderNumber as string)
    ));

    const siblingCounts: Record<string, number> = {};
    if (orderNumbers.length > 0) {
      const counts = await prisma.order.groupBy({
        by: ['orderNumber'],
        where: { orderNumber: { in: orderNumbers } },
        _count: { id: true }
      });
      for (const c of counts) {
        if (c.orderNumber) siblingCounts[c.orderNumber] = c._count.id;
      }
    }

    const ordersWithCounts = orders.map(o => {
      let count = 0;
      if (o.orderNumber && siblingCounts[o.orderNumber]) {
        count = siblingCounts[o.orderNumber] - 1; // Exclude self
      }
      return { ...o, siblingCount: Math.max(0, count) };
    });

    return NextResponse.json({
      orders: ordersWithCounts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

