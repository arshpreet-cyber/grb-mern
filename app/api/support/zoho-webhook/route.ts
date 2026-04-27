import { NextRequest, NextResponse } from "next/server";
import { syncZohoThreadsToLocal } from "@/server/services/zohoSync";
import prisma from "@/lib/prisma";

/**
 * POST /api/support/zoho-webhook
 * 
 * Webhook endpoint for Zoho Desk notifications.
 * Configure in Zoho Desk → Setup → Developer Space → Webhooks → Notifications
 * 
 * When Zoho Desk receives an email reply or a new comment is added,
 * it calls this webhook, and we sync the threads to our local DB.
 * 
 * Expected payload from Zoho:
 * {
 *   "ticketId": "258322000000384102",
 *   "eventType": "ticket_comment_add" | "ticket_thread_add" | "ticket_update",
 *   ...
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[ZOHO-WEBHOOK] Received:", JSON.stringify(body).substring(0, 500));

    const zohoTicketId = body.ticketId || body.ticket?.id;

    if (!zohoTicketId) {
      console.log("[ZOHO-WEBHOOK] No ticketId in payload, skipping");
      return NextResponse.json({ ok: true, message: "No ticket ID" });
    }

    // Find our local ticket by zohoTicketId
    const ticket = await prisma.ticket.findFirst({
      where: { zohoTicketId: String(zohoTicketId) },
      select: { ticketId: true },
    });

    if (!ticket) {
      console.log(`[ZOHO-WEBHOOK] No local ticket found for Zoho ID ${zohoTicketId}`);
      return NextResponse.json({ ok: true, message: "Ticket not found locally" });
    }

    // Sync threads from Zoho to local DB
    const imported = await syncZohoThreadsToLocal(ticket.ticketId);
    console.log(`[ZOHO-WEBHOOK] Synced ${imported} new messages for ticket ${ticket.ticketId}`);

    return NextResponse.json({ ok: true, imported });
  } catch (error) {
    console.error("[ZOHO-WEBHOOK] Error processing webhook:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

/**
 * GET /api/support/zoho-webhook
 * Health check for the webhook endpoint.
 */
export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/support/zoho-webhook",
    description: "Zoho Desk webhook for ticket thread synchronization",
  });
}
