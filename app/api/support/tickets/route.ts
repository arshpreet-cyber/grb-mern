import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { syncTicketToZoho } from "@/server/services/zohoSync";

// GET /api/support/tickets?userId=xxx
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") || undefined;
    const tickets = await prisma.ticket.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Failed to load tickets", error);
    return NextResponse.json({ error: "Failed to load tickets" }, { status: 500 });
  }
}

// POST /api/support/tickets
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, assignedTo, name, email, phone, subject, query, ticketType } = body;

    if (!userId || !subject || !query) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;

    const ticket = await prisma.ticket.create({
      data: {
        id: randomUUID(),
        ticketNumber,
        userId,
        assignedTo: assignedTo ?? null,
        name: name ?? null,
        email: email ?? null,
        phone: phone ?? null,
        subject,
        query,
        ticketType: typeof ticketType === "number" ? ticketType : 1,
        title: subject,
        status: "Open",
        readStatus: 1,
        repliedStatus: 1,
        userReadStatus: 1,
      },
    });

    // Sync to Zoho Desk in the background (non-blocking)
    syncTicketToZoho(ticket.ticketId).catch((err) => {
      console.error("[API] Background Zoho sync failed for ticket:", ticket.ticketId, err);
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Failed to create ticket", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
