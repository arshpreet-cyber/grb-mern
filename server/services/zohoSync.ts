/**
 * Zoho Desk synchronization helpers.
 *
 * These functions can be called directly (bypassing the pg-boss queue)
 * from Next.js API routes, or queued via the background worker.
 */
import {
  createZohoTicket,
  addZohoTicketReply,
  isZohoConfigured,
  isZohoEmailConfigured,
  getZohoAccessToken,
  sendZohoTicketEmail,
  getZohoTicketThreads,
  getZohoTicketComments,
} from "./zohoService.ts";
import prisma from "../../lib/prisma.ts";

const ZOHO_ORG_ID = process.env.ZOHO_ORG_ID;
const ZOHO_DESK_URL = "https://desk.zoho.in/api/v1";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "mohit@adaired.org";
const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

/**
 * Sync a single local ticket to Zoho Desk.
 * Creates the ticket in Zoho and stores the Zoho ID back in our DB.
 * After syncing, sends email notification to admin (and optionally user).
 * Returns the zohoTicketId if successful, null otherwise.
 */
export async function syncTicketToZoho(ticketId: string): Promise<string | null> {
  if (!isZohoConfigured()) {
    console.log(`[ZOHO-SYNC] Zoho is not configured. Skipping sync for ticket ${ticketId}`);
    return null;
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!ticket) {
      console.error(`[ZOHO-SYNC] Ticket not found: ${ticketId}`);
      return null;
    }

    // Already synced
    if (ticket.zohoTicketId) {
      console.log(`[ZOHO-SYNC] Ticket ${ticketId} already synced with Zoho ID: ${ticket.zohoTicketId}`);
      return ticket.zohoTicketId;
    }

    // Determine best email to use — prefer ticket.email, fallback to user.email
    const email = ticket.email || ticket.user?.email || "noreply@grb-app.com";
    const name = ticket.name || ticket.user?.name || "Customer";

    const result = await createZohoTicket({
      subject: ticket.subject || ticket.title || "Support Ticket",
      description: ticket.query || "No description provided.",
      contact: {
        email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || name.split(" ")[0],
        phone: ticket.phone || undefined,
      },
    });

    // Store the Zoho ticket ID and use Zoho's ticket number as our ticketNumber
    await prisma.ticket.update({
      where: { ticketId },
      data: {
        zohoTicketId: result.zohoTicketId,
        ticketNumber: result.zohoTicketNumber,
      },
    });

    console.log(`[ZOHO-SYNC] ✅ Ticket ${ticketId} synced to Zoho Desk — Zoho ID: ${result.zohoTicketId}, Ticket #${result.zohoTicketNumber}`);

    // Send email notifications after successful sync
    await sendTicketCreatedEmails({
      zohoTicketId: result.zohoTicketId,
      zohoTicketNumber: result.zohoTicketNumber,
      ticketId,
      subject: ticket.subject || ticket.title || "Support Ticket",
      query: ticket.query || "",
      customerName: name,
      customerEmail: email,
    });

    return result.zohoTicketId;
  } catch (error) {
    console.error(`[ZOHO-SYNC] ❌ Failed to sync ticket ${ticketId}:`, error);
    return null;
  }
}

/**
 * Send email notifications when a new ticket is created.
 * - Sends notification to admin via Zoho Desk sendReply (so replies go back to Zoho)
 * - Falls back to nodemailer if Zoho email isn't configured
 */
async function sendTicketCreatedEmails(opts: {
  zohoTicketId: string;
  zohoTicketNumber: string;
  ticketId: string;
  subject: string;
  query: string;
  customerName: string;
  customerEmail: string;
}) {
  const ticketUrl = `${APP_URL}/admin/tickets/${opts.ticketId}`;

  // Build HTML email for admin
  const adminHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h2 style="color: #fff; margin: 0; font-size: 20px;">🎫 New Support Ticket #${opts.zohoTicketNumber}</h2>
      </div>
      <div style="background: #ffffff; padding: 24px 32px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="color: #475569; margin: 0 0 16px;"><strong>From:</strong> ${opts.customerName} (${opts.customerEmail})</p>
        <p style="color: #475569; margin: 0 0 8px;"><strong>Subject:</strong> ${opts.subject}</p>
        <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #334155; margin: 0; white-space: pre-wrap;">${opts.query}</p>
        </div>
        <a href="${ticketUrl}" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 8px;">View Ticket in Dashboard</a>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
          <strong>Reply to this email</strong> to respond directly — your reply will be added to the ticket automatically.
        </p>
      </div>
    </div>
  `;

  // Try sending via Zoho Desk sendReply first (replies go back to Zoho)
  if (isZohoEmailConfigured()) {
    const sent = await sendZohoTicketEmail({
      zohoTicketId: opts.zohoTicketId,
      to: ADMIN_EMAIL,
      cc: opts.customerEmail,
      contentHtml: adminHtml,
    });
    if (sent) {
      console.log(`[ZOHO-EMAIL] ✅ Notification sent to admin ${ADMIN_EMAIL} and CC'd ${opts.customerEmail}`);
      return;
    }
    console.log("[ZOHO-EMAIL] sendReply failed, falling back to SMTP...");
  }

  // Fallback: send via nodemailer/SMTP
  try {
    const { sendEmailNotification } = await import("../email.ts");
    
    // Notify admin
    await sendEmailNotification({
      to: ADMIN_EMAIL,
      subject: `[Ticket #${opts.zohoTicketNumber}] ${opts.subject}`,
      text: `New support ticket from ${opts.customerName} (${opts.customerEmail})\n\nSubject: ${opts.subject}\n\n${opts.query}\n\nView ticket: ${ticketUrl}`,
      html: adminHtml,
    });
    console.log(`[EMAIL] ✅ Admin notification sent to ${ADMIN_EMAIL}`);

    // Notify user
    const userHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h2 style="color: #fff; margin: 0; font-size: 20px;">🎫 Ticket #${opts.zohoTicketNumber} Created</h2>
        </div>
        <div style="background: #ffffff; padding: 24px 32px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="color: #475569;">Hello ${opts.customerName},</p>
          <p style="color: #475569;">Your support ticket has been created successfully. Our team will respond shortly.</p>
          <p style="color: #475569; margin: 0 0 8px;"><strong>Subject:</strong> ${opts.subject}</p>
          <p style="color: #475569;"><strong>Ticket Number:</strong> #${opts.zohoTicketNumber}</p>
          <a href="${APP_URL}/dashboard/tickets/${opts.ticketId}" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 8px;">View Your Ticket</a>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
            You can also <strong>reply to this email</strong> to add a message to your ticket.
          </p>
        </div>
      </div>
    `;

    await sendEmailNotification({
      to: opts.customerEmail,
      subject: `[Ticket #${opts.zohoTicketNumber}] ${opts.subject} — We received your request`,
      text: `Hello ${opts.customerName},\n\nYour ticket #${opts.zohoTicketNumber} has been created.\nSubject: ${opts.subject}\n\nOur team will respond shortly.\n\nView your ticket: ${APP_URL}/dashboard/tickets/${opts.ticketId}`,
      html: userHtml,
    });
    console.log(`[EMAIL] ✅ User notification sent to ${opts.customerEmail}`);
  } catch (err) {
    console.error("[EMAIL] ❌ Failed to send email notification:", err);
  }
}

/**
 * Send email notification when an agent replies to a ticket.
 * Notifies the customer that there's a new response.
 */
export async function sendReplyNotificationEmail(opts: {
  ticketId: string;
  content: string;
  isAgent: boolean;
}): Promise<void> {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId: opts.ticketId },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!ticket || !ticket.zohoTicketId) return;

    const customerEmail = ticket.email || ticket.user?.email;
    const customerName = ticket.name || ticket.user?.name || "Customer";
    const ticketNumber = ticket.ticketNumber || ticket.ticketId;

    // Determine who to notify based on who sent the message
    const notifyEmail = opts.isAgent ? customerEmail : ADMIN_EMAIL;
    const notifyName = opts.isAgent ? customerName : "Admin";
    const senderLabel = opts.isAgent ? "Support Team" : customerName;

    if (!notifyEmail) return;

    const replyHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h2 style="color: #fff; margin: 0; font-size: 20px;">💬 New Reply on Ticket #${ticketNumber}</h2>
        </div>
        <div style="background: #ffffff; padding: 24px 32px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="color: #475569;">Hello ${notifyName},</p>
          <p style="color: #475569;"><strong>${senderLabel}</strong> replied to ticket <strong>#${ticketNumber}</strong>:</p>
          <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
            <p style="color: #334155; margin: 0; white-space: pre-wrap;">${opts.content}</p>
          </div>
          <a href="${APP_URL}/${opts.isAgent ? 'dashboard' : 'admin'}/tickets/${opts.ticketId}" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 8px;">View Conversation</a>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
            Reply to this email to respond directly.
          </p>
        </div>
      </div>
    `;

    // Try Zoho Desk sendReply first
    if (isZohoEmailConfigured()) {
      const sent = await sendZohoTicketEmail({
        zohoTicketId: ticket.zohoTicketId,
        to: notifyEmail,
        contentHtml: replyHtml,
      });
      if (sent) return;
    }

    // Fallback: SMTP
    try {
      const { sendEmailNotification } = await import("../email.ts");
      await sendEmailNotification({
        to: notifyEmail,
        subject: `[Ticket #${ticketNumber}] New reply from ${senderLabel}`,
        text: `${senderLabel} replied to ticket #${ticketNumber}:\n\n${opts.content}\n\nView conversation: ${APP_URL}/${opts.isAgent ? 'dashboard' : 'admin'}/tickets/${opts.ticketId}`,
        html: replyHtml,
      });
    } catch (err) {
      console.error("[EMAIL] ❌ Failed to send reply notification:", err);
    }
  } catch (error) {
    console.error("[EMAIL] Error in sendReplyNotificationEmail:", error);
  }
}

/**
 * Sync a message/reply from a local ticket to Zoho Desk as a comment.
 * Also sends email notification to the other party.
 */
export async function syncMessageToZoho(ticketId: string, content: string, isAgent: boolean = false): Promise<boolean> {
  if (!isZohoConfigured()) {
    console.log(`[ZOHO-SYNC] Zoho is not configured. Skipping message sync.`);
    return false;
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId },
    });

    if (!ticket) {
      console.error(`[ZOHO-SYNC] Ticket not found: ${ticketId}`);
      return false;
    }

    // If ticket isn't synced to Zoho yet, sync it first
    let zohoTicketId = ticket.zohoTicketId;
    if (!zohoTicketId) {
      console.log(`[ZOHO-SYNC] Ticket ${ticketId} not yet in Zoho. Syncing ticket first...`);
      zohoTicketId = await syncTicketToZoho(ticketId);
      if (!zohoTicketId) {
        console.error(`[ZOHO-SYNC] Could not sync ticket ${ticketId} to Zoho. Message sync aborted.`);
        return false;
      }
    }

    await addZohoTicketReply(zohoTicketId, content, isAgent);
    console.log(`[ZOHO-SYNC] ✅ Message synced for ticket ${ticketId} to Zoho Desk`);

    // Send email notification to the other party
    sendReplyNotificationEmail({ ticketId, content, isAgent }).catch((err) => {
      console.error("[EMAIL] Background reply notification failed:", err);
    });

    return true;
  } catch (error) {
    console.error(`[ZOHO-SYNC] ❌ Failed to sync message for ticket ${ticketId}:`, error);
    return false;
  }
}

/**
 * Sync all local tickets that don't have a zohoTicketId yet.
 * Returns { synced, failed, skipped } counts.
 */
export async function syncAllUnsyncedTickets(): Promise<{ synced: number; failed: number; skipped: number; total: number }> {
  if (!isZohoConfigured()) {
    return { synced: 0, failed: 0, skipped: 0, total: 0 };
  }

  const unsyncedTickets = await prisma.ticket.findMany({
    where: { zohoTicketId: null },
    include: { user: { select: { email: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  const result = { synced: 0, failed: 0, skipped: 0, total: unsyncedTickets.length };

  for (const ticket of unsyncedTickets) {
    // Skip tickets that have no usable email at all
    const email = ticket.email || ticket.user?.email;
    if (!email) {
      console.log(`[ZOHO-SYNC] Skipping ticket ${ticket.ticketId} — no email available`);
      result.skipped++;
      continue;
    }

    const zohoId = await syncTicketToZoho(ticket.ticketId);
    if (zohoId) {
      result.synced++;

      // Also sync all threads/messages for this ticket
      const threads = await prisma.ticketThread.findMany({
        where: { ticketId: ticket.ticketId },
        orderBy: { createdAt: "asc" },
      });

      for (const thread of threads) {
        if (thread.content) {
          try {
            await addZohoTicketReply(zohoId, thread.content, !!thread.agentId);
          } catch (err) {
            console.error(`[ZOHO-SYNC] Failed to sync thread ${thread.id} for ticket ${ticket.ticketId}:`, err);
          }
          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    } else {
      result.failed++;
    }

    // Small delay between tickets to avoid Zoho rate limits
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`[ZOHO-SYNC] Bulk sync complete: ${result.synced} synced, ${result.failed} failed, ${result.skipped} skipped out of ${result.total}`);
  return result;
}

/**
 * Sync threads/comments FROM Zoho Desk back to local DB.
 * This pulls any new replies (e.g. from email) that were added in Zoho
 * and creates corresponding TicketThread entries locally.
 */
export async function syncZohoThreadsToLocal(ticketId: string): Promise<number> {
  if (!isZohoConfigured()) return 0;

  try {
    const ticket = await prisma.ticket.findUnique({ where: { ticketId } });
    if (!ticket?.zohoTicketId) return 0;

    // Get existing local threads to avoid duplicates
    const localThreads = await prisma.ticketThread.findMany({
      where: { ticketId },
      select: { content: true, createdAt: true },
    });

    // Normalize content for dedup comparison:
    // strips HTML, collapses whitespace, lowercases, removes trailing punctuation
    const normalize = (text: string) =>
      text
        .replace(/<[^>]*>/g, "")        // strip HTML
        .replace(/&nbsp;/gi, " ")       // decode &nbsp;
        .replace(/&amp;/gi, "&")        // decode &amp;
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")           // collapse whitespace
        .trim()
        .toLowerCase();

    // Build set of existing normalized content
    const existingContents = new Set<string>();
    for (const t of localThreads) {
      const n = normalize(t.content || "");
      if (n) existingContents.add(n);
    }

    // Also add the ticket's original query/description to avoid importing it back
    if (ticket.query) {
      existingContents.add(normalize(ticket.query));
    }

    // Helper: check if content already exists locally
    const isDuplicate = (rawContent: string): boolean => {
      const n = normalize(rawContent);
      if (!n) return true; // empty = skip
      if (existingContents.has(n)) return true;

      // Also check if any existing content contains this or vice versa
      // (handles cases where Zoho truncates or wraps content differently)
      for (const existing of existingContents) {
        if (existing.includes(n) || n.includes(existing)) return true;
      }

      return false;
    };

    let imported = 0;

    // Only import email threads (actual email replies) — NOT comments
    // Comments are what WE create via addZohoTicketReply, so pulling them back would duplicate
    const zohoThreads = await getZohoTicketThreads(ticket.zohoTicketId);

    for (const thread of zohoThreads) {
      const rawContent = thread.plainText || thread.summary || "";
      if (!rawContent.trim()) continue;

      // Skip threads that came from our API (channel = "WEB" or "API")
      // Only import threads from EMAIL channel (actual email replies)
      if (thread.channel !== "EMAIL") continue;

      if (isDuplicate(rawContent)) continue;

      // direction: "in" = from customer, "out" = from agent
      const isFromAgent = thread.direction === "out";
      const direction = isFromAgent ? "2" : "1";

      await prisma.ticketThread.create({
        data: {
          ticketId,
          content: rawContent.trim(),
          direction,
          agentId: isFromAgent ? "zoho-agent" : null,
        },
      });

      existingContents.add(normalize(rawContent));
      imported++;
    }

    if (imported > 0) {
      console.log(`[ZOHO-SYNC] ✅ Imported ${imported} new email replies from Zoho for ticket ${ticketId}`);
    }

    return imported;
  } catch (error) {
    console.error(`[ZOHO-SYNC] Error syncing Zoho threads to local for ${ticketId}:`, error);
    return 0;
  }
}

/**
 * Sync Zoho threads for ALL tickets that have a zohoTicketId.
 * Call periodically to pull in email replies from Zoho.
 */
export async function syncAllZohoThreadsToLocal(): Promise<{ ticketsChecked: number; messagesImported: number }> {
  if (!isZohoConfigured()) return { ticketsChecked: 0, messagesImported: 0 };

  const syncedTickets = await prisma.ticket.findMany({
    where: { zohoTicketId: { not: null } },
    select: { ticketId: true },
    orderBy: { updatedAt: "desc" },
    take: 50, // Check most recently updated tickets
  });

  let totalImported = 0;

  for (const ticket of syncedTickets) {
    const imported = await syncZohoThreadsToLocal(ticket.ticketId);
    totalImported += imported;
    // Rate limit
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return { ticketsChecked: syncedTickets.length, messagesImported: totalImported };
}

/**
 * Fetch all tickets from Zoho Desk for a given contact email.
 * Useful for verifying sync from the Zoho side.
 */
export async function getZohoTicketsForContact(email: string): Promise<any[]> {
  if (!isZohoConfigured()) return [];

  try {
    const token = await getZohoAccessToken();
    const response = await fetch(
      `${ZOHO_DESK_URL}/tickets/search?email=${encodeURIComponent(email)}&limit=50`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          orgId: ZOHO_ORG_ID!,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`[ZOHO-SYNC] Failed to search Zoho tickets for ${email}: ${response.status}`, text);
      return [];
    }

    const data = (await response.json()) as any;
    return data.data || [];
  } catch (error) {
    console.error(`[ZOHO-SYNC] Error fetching Zoho tickets for ${email}:`, error);
    return [];
  }
}
