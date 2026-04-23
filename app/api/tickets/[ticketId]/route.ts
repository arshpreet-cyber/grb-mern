import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await context.params;
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId },
      include: { user: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket detail:", error);
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await context.params;
    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.status) updateData.status = body.status;
    if (body.readStatus) updateData.readStatus = body.readStatus;
    if (body.repliedStatus) updateData.repliedStatus = body.repliedStatus;
    if (body.userReadStatus) updateData.userReadStatus = body.userReadStatus;
    if (body.assignedTo) updateData.assignedTo = body.assignedTo;
    if (body.adminReplyAt) updateData.adminReplyAt = new Date(body.adminReplyAt);
    if (body.lastThreadId) updateData.lastThreadId = body.lastThreadId;

    const ticket = await prisma.ticket.update({
      where: { ticketId },
      data: updateData,
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
