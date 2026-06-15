import { NextRequest, NextResponse } from "next/server";
import { syncAllUnsyncedTickets, syncTicketToZoho, syncAllZohoThreadsToLocal, pullTicketsFromZoho } from "@/server/services/zohoSync";
import { isZohoConfigured, isZohoEmailConfigured } from "@/server/services/zohoService";
import prisma from "@/lib/prisma";

// Allow longer execution for the paginated Zoho pull.
export const maxDuration = 60;

// GET /api/support/zoho-sync — Get sync status
export async function GET() {
  try {
    const configured = isZohoConfigured();
    const emailConfigured = isZohoEmailConfigured();

    const totalTickets = await prisma.ticket.count();
    const syncedTickets = await prisma.ticket.count({
      where: { zohoTicketId: { not: null } },
    });
    const unsyncedTickets = totalTickets - syncedTickets;

    // List unsynced tickets with basic info
    const unsyncedList = await prisma.ticket.findMany({
      where: { zohoTicketId: null },
      select: {
        ticketId: true,
        ticketNumber: true,
        subject: true,
        email: true,
        name: true,
        createdAt: true,
        user: { select: { email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      zohoConfigured: configured,
      zohoEmailConfigured: emailConfigured,
      adminEmail: process.env.ADMIN_EMAIL || "mohit@adaired.org",
      totalTickets,
      syncedTickets,
      unsyncedTickets,
      unsyncedList: unsyncedList.map((t) => ({
        ticketId: t.ticketId,
        ticketNumber: t.ticketNumber,
        subject: t.subject,
        email: t.email || t.user?.email || null,
        name: t.name || t.user?.name || null,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error("Failed to get sync status", error);
    return NextResponse.json({ error: "Failed to get sync status" }, { status: 500 });
  }
}

// POST /api/support/zoho-sync — Trigger sync
// Body: { action: "sync-all" } or { action: "sync-one", ticketId: "xxx" } or { action: "pull-threads" }
export async function POST(req: NextRequest) {
  try {
    if (!isZohoConfigured()) {
      return NextResponse.json(
        { error: "Zoho Desk is not configured. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ORG_ID, and ZOHO_DEPARTMENT_ID in .env" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { action, ticketId } = body;

    if (action === "sync-one" && ticketId) {
      const zohoTicketId = await syncTicketToZoho(ticketId);
      if (zohoTicketId) {
        return NextResponse.json({ success: true, zohoTicketId });
      } else {
        return NextResponse.json({ success: false, error: "Failed to sync ticket" }, { status: 500 });
      }
    }

    if (action === "sync-all") {
      const result = await syncAllUnsyncedTickets();
      return NextResponse.json({ success: true, ...result });
    }

    // Pull email replies and comments from Zoho → local DB
    if (action === "pull-threads") {
      const result = await syncAllZohoThreadsToLocal();
      return NextResponse.json({ success: true, ...result });
    }

    // Pull tickets FROM Zoho Desk → local DB (import new + refresh existing)
    if (action === "pull-tickets") {
      const maxPages = typeof body.maxPages === "number" ? body.maxPages : undefined;
      const result = await pullTicketsFromZoho({ maxPages });
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: "Invalid action. Use 'sync-all', 'sync-one', 'pull-threads', or 'pull-tickets'" }, { status: 400 });
  } catch (error) {
    console.error("Zoho sync endpoint error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

