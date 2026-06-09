import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

const STATUS_MAP: Record<string, object> = {
  all:        { deletedAt: null },
  paid:       { deletedAt: null, paymentStatus: "2" },
  pending:    { deletedAt: null, status: { in: ["1", "3", "4"] } },
  processing: { deletedAt: null, status: "3" },
  unpaid:     { deletedAt: null, paymentStatus: "1" },
  completed:  { deletedAt: null, status: "2" },
  deleted:    { deletedAt: { not: null } },
};

function buildWhere(
  filter: string,
  search: string,
  isAdmin: boolean,
  userId: number,
  userEmail: string | null | undefined
) {
  const where: any = { ...(STATUS_MAP[filter] ?? { deletedAt: null }) };

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

    const isAdmin = (session.user as any).role?.toUpperCase() === "ADMIN";
    const userId = parseInt(session.user.id);
    const userEmail = session.user.email;

    const { searchParams } = req.nextUrl;
    const filter = searchParams.get("filter") ?? "all";
    const search = searchParams.get("search") ?? "";
    const countsOnly = searchParams.get("countsOnly") === "1";

    // --- Counts-only mode: return counts for every tab in one round-trip ---
    if (countsOnly) {
      const keys = Object.keys(STATUS_MAP);
      const countResults = await Promise.all(
        keys.map((k) =>
          prisma.order.count({
            where: buildWhere(k, "", isAdmin, userId, userEmail),
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

    const where = buildWhere(filter, search, isAdmin, userId, userEmail);

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

    return NextResponse.json({
      orders,
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

