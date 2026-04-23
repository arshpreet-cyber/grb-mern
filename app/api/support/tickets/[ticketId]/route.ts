import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/support/tickets/[ticketId]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Failed to load ticket", error);
    return NextResponse.json({ error: "Failed to load ticket" }, { status: 500 });
  }
}

// PATCH /api/support/tickets/[ticketId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const updates = await req.json();
    const ticket = await prisma.ticket.update({
      where: { ticketId },
      data: updates,
    });
    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Failed to update ticket", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
