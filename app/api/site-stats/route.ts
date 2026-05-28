import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [ordersDelivered, activeUsers] = await Promise.all([
      prisma.order.count({ where: { status: "3", deletedAt: null } }),
      prisma.user.count({ where: { role: "USER" as any } }),
    ]);

    return NextResponse.json(
      { ordersDelivered, activeUsers, clientSatisfaction: 95, yearsOfGrowth: 7 },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
