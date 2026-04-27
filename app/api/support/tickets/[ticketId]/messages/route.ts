import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { syncMessageToZoho } from "@/server/services/zohoSync";

// GET /api/support/tickets/[ticketId]/messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
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
