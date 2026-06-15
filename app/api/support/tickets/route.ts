import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { syncTicketToZoho } from "@/server/services/zohoSync";
import { sendEmailNotification, buildTicketCreatedEmail } from "@/server/email";

// GET /api/support/tickets?userId=xxx  OR  ?countOnly=true
export async function GET(req: NextRequest) {
  try {
    const userIdRaw = req.nextUrl.searchParams.get("userId");
    const userId = userIdRaw ? parseInt(userIdRaw) : undefined;
    const countOnly = req.nextUrl.searchParams.get("countOnly") === "true";

    // Fast path: just return the total count for sidebar badge
    if (countOnly) {
      const count = await prisma.ticket.count({
        where: userId ? { userId } : undefined,
      });
      return NextResponse.json({ count });
    }

    const include = {
      user: { select: { name: true, email: true } },
      threads: {
        orderBy: { createdAt: "desc" as const },
        take: 1,
        select: { direction: true, createdAt: true, id: true },
      },
    };
    const sortByActivity = (list: any[]) =>
      list.sort((a, b) => {
        const aTime = a.threads.length > 0 ? a.threads[0].createdAt.getTime() : a.createdAt.getTime();
        const bTime = b.threads.length > 0 ? b.threads[0].createdAt.getTime() : b.createdAt.getTime();
        return bTime - aTime;
      });

    // User dashboard view: return a plain array (unchanged contract).
    if (userId) {
      const tickets = await prisma.ticket.findMany({
        where: { userId }, include, orderBy: { createdAt: "desc" }, take: 200,
      });
      return NextResponse.json(sortByActivity(tickets));
    }

    // Admin view: server-side filter + per-tab counts over the whole table.
    const filter = req.nextUrl.searchParams.get("filter") ?? "all";
    const customerReplied = { OR: [{ repliedStatus: { not: 2 } }, { repliedStatus: null }] };

    const [all, open, awaiting, closed, pending] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: "Open" } }),
      prisma.ticket.count({ where: customerReplied as any }),
      prisma.ticket.count({ where: { status: "Closed" } }),
      prisma.ticket.count({ where: { status: "Pending" } }),
    ]);
    const counts = { all, open, awaiting, closed, pending };

    let where: any = {};
    if (filter === "open") where = { status: "Open" };
    else if (filter === "closed") where = { status: "Closed" };
    else if (filter === "pending") where = { status: "Pending" };
    else if (filter === "awaiting") where = customerReplied;

    const tickets = await prisma.ticket.findMany({
      where, include, orderBy: { createdAt: "desc" }, take: 200,
    });

    return NextResponse.json({ tickets: sortByActivity(tickets), counts });
  } catch (error) {
    console.error("Failed to load tickets", error);
    return NextResponse.json({ error: "Failed to load tickets" }, { status: 500 });
  }
}

// POST /api/support/tickets
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId: userIdRaw, assignedTo, name, email, phone, subject, query, ticketType, media } = body;
    const userId = parseInt(userIdRaw);

    if (!userId || !subject || !query) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        userId,
        assignedTo: assignedTo ?? null,
        name: name ?? null,
        email: email ?? null,
        phone: phone ?? null,
        subject,
        query,
        media: media ?? null,
        ticketType: typeof ticketType === "number" ? ticketType : 1,
        title: subject,
        status: "Open",
        readStatus: 1,
        repliedStatus: 1,
        userReadStatus: 1,
      },
    });

    // Zoho sync handles email notifications (including Zoho ticket number)

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
