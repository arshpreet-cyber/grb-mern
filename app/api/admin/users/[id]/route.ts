import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            amount: true,
            currency: true,
            symbol: true,
            status: true,
            paymentStatus: true,
            paymentMethod: true,
            createdAt: true,
            detailsFilled: true,
          },
        },
        tickets: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            ticketId: true,
            ticketNumber: true,
            subject: true,
            status: true,
            createdAt: true,
            threads: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { direction: true, createdAt: true, id: true },
            },
          },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
