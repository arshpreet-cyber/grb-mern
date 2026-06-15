import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { syncMessageToZoho, syncZohoThreadsToLocal } from "@/server/services/zohoSync";

export const maxDuration = 60;

// GET /api/support/tickets/[ticketId]/messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;

    // Pull the latest conversation from Zoho on demand so imported tickets and
    // new email replies show up. Best-effort — never block the message list.
    await syncZohoThreadsToLocal(ticketId).catch((e) =>
      console.error("[messages] Zoho thread pull failed:", e)
    );

    const messages = await prisma.ticketThread.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Failed to load messages", error);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

// POST /api/support/tickets/[ticketId]/messages
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const body = await req.json();
    const { content, agentId, direction, media } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const message = await prisma.ticketThread.create({
      data: {
        ticketId,
        agentId: agentId ?? null,
        content: content.trim(),
        media: media ?? null,
        direction: typeof direction === "string" ? direction : "1",
      },
    });

    // Update ticket status flags based on who replied.
    // direction "1" = customer (unread for admin, repliedStatus=1),
    // direction "2" = admin (read, repliedStatus=2). Mirrors the legacy replied_status.
    const isAdminReply = String(message.direction) === "2";
    await prisma.ticket.update({
      where: { ticketId },
      data: {
        readStatus: isAdminReply ? 2 : 1,
        repliedStatus: isAdminReply ? 2 : 1,
        repliedAt: new Date(),
      },
    }).catch(err => console.error("[API] Failed to update ticket status:", err));

    // Sync message to Zoho Desk in the background (non-blocking)
    syncMessageToZoho(ticketId, content.trim(), !!agentId).catch((err) => {
      console.error("[API] Background Zoho message sync failed:", ticketId, err);
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Failed to create message", error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}
