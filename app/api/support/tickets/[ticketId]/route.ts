import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmailNotification, buildTicketHoldEmail, buildTicketEscalatedEmail, buildTicketClosedEmail } from "@/server/email";

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
      include: { user: { select: { name: true, email: true } } },
    });

    // Send status-change emails when ticket status is updated
    if ("status" in updates && ticket.email) {
      const recipientEmail = ticket.email;
      const name = ticket.name ?? ticket.user?.name;
      const ticketNum = ticket.ticketNumber ?? ticketId;
      const subject = ticket.subject ?? undefined;

      if (updates.status === "Hold") {
        const { subject: s, html } = buildTicketHoldEmail({ name, ticketNumber: ticketNum, subject });
        sendEmailNotification({ to: recipientEmail, subject: s, text: `Ticket ${ticketNum} is now on hold.`, html })
          .catch((err) => console.error("[ticket hold email]", err.message));
      } else if (updates.status === "Escalated") {
        const { subject: s, html } = buildTicketEscalatedEmail({ name, ticketNumber: ticketNum, subject });
        sendEmailNotification({ to: recipientEmail, subject: s, text: `Ticket ${ticketNum} has been escalated.`, html })
          .catch((err) => console.error("[ticket escalated email]", err.message));
      } else if (updates.status === "Closed") {
        const { subject: s, html } = buildTicketClosedEmail({ name, ticketNumber: ticketNum, subject });
        sendEmailNotification({ to: recipientEmail, subject: s, text: `Ticket ${ticketNum} has been closed.`, html })
          .catch((err) => console.error("[ticket closed email]", err.message));
      }
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Failed to update ticket", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

// DELETE /api/support/tickets/[ticketId] — permanently removes the ticket.
// Threads cascade-delete via the TicketThread → Ticket relation.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    await prisma.ticket.delete({ where: { ticketId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete ticket", error);
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
