import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") ?? "";
    // staff=1 → only assignable staff (admins + managers), for the ticket "Assign To" dropdown.
    const staffOnly = searchParams.get("staff") === "1";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (staffOnly) {
      where.role = { in: ["ADMIN", "MANAGER"] };
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: staffOnly ? { name: "asc" } : { createdAt: "desc" },
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true },
    });

    return NextResponse.json(users);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const user = await prisma.user.update({ where: { id: parseInt(id) }, data });
    return NextResponse.json(user);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
