import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await context.params;
    const messages = await prisma.ticketThread.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching ticket messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await context.params;
    const body = await req.json();
    const { content, agentId, direction, media } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const message = await prisma.ticketThread.create({
      data: {
        ticketId,
        content: content.trim(),
        agentId: agentId ?? null,
        direction: direction ?? "1",
        media: media ?? null,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating ticket message:", error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}
