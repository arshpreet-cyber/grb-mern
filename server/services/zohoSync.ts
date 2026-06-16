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
  getZohoTickets,
  getZohoThreadDetail,
} from "./zohoService.ts";
import prisma from "../../lib/prisma.ts";

const ZOHO_ORG_ID = process.env.ZOHO_ORG_ID;
const ZOHO_DC = process.env.ZOHO_DC || "com";
const ZOHO_DESK_URL = process.env.ZOHO_DESK_URL || `https://desk.zoho.${ZOHO_DC}/api/v1`;
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
  const { sendEmailNotification, emailWrapper } = await import("../email.ts");

  // Build HTML email for admin
  const adminContent = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">🎫 New Support Ticket <strong>#${opts.zohoTicketNumber}</strong></p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555;width:100px">From :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:600;color:#333">${opts.customerName} (${opts.customerEmail})</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Subject :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#333">${opts.subject}</td>
      </tr>
    </table>
    <div style="background:#ffffff;border:1px solid #e0e0e0;padding:16px;margin:16px 0;border-radius:4px">
      <p style="color:#333;margin:0;white-space:pre-wrap;font-size:14px">${opts.query}</p>
    </div>
    <p style="margin:20px 0">
      <a href="${ticketUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:5px;font-size:14px;font-weight:600;font-family:Arial,sans-serif">View Ticket in Dashboard →</a>
    </p>
    <p style="margin:16px 0 4px;font-size:13px;color:#888">
      <strong>Reply to this email</strong> to respond directly — your reply will be added to the ticket automatically.
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  const adminHtml = emailWrapper(adminContent);

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
    // Notify admin
    await sendEmailNotification({
      to: ADMIN_EMAIL,
      subject: `[Ticket #${opts.zohoTicketNumber}] ${opts.subject}`,
      text: `New support ticket from ${opts.customerName} (${opts.customerEmail})\n\nSubject: ${opts.subject}\n\n${opts.query}\n\nView ticket: ${ticketUrl}`,
      html: adminHtml,
    });
    console.log(`[EMAIL] ✅ Admin notification sent to ${ADMIN_EMAIL}`);

    // Notify user
    const userContent = `
      <p style="margin:0 0 14px;font-size:15px;color:#333">Hello <strong>${opts.customerName}</strong>,</p>
      <p style="margin:0 0 20px;font-size:15px;color:#333">Your support ticket has been created successfully. Our team will respond shortly.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
        <tr>
          <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555;width:120px">Ticket # :</td>
          <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:600;color:#333;font-family:monospace">${opts.zohoTicketNumber}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Subject :</td>
          <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#333">${opts.subject}</td>
        </tr>
      </table>
      <p style="margin:20px 0">
        <a href="${APP_URL}/dashboard/tickets/${opts.ticketId}" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">View Your Ticket →</a>
      </p>
      <p style="margin:16px 0 4px;font-size:13px;color:#888">
        You can also <strong>reply to this email</strong> to add a message to your ticket.
      </p>
      <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
      <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
    `;
    const userHtml = emailWrapper(userContent);

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

    const { sendEmailNotification, emailWrapper } = await import("../email.ts");

    const replyContent = `
      <p style="margin:0 0 14px;font-size:15px;color:#333">Hello <strong>${notifyName}</strong>,</p>
      <p style="margin:0 0 20px;font-size:15px;color:#333"><strong>${senderLabel}</strong> replied to ticket <strong>#${ticketNumber}</strong>:</p>
      <div style="background:#ffffff;border:1px solid #e0e0e0;padding:16px;margin:16px 0;border-radius:4px">
        <p style="color:#333;margin:0;white-space:pre-wrap;font-size:14px">${opts.content}</p>
      </div>
      <p style="margin:20px 0">
        <a href="${APP_URL}/${opts.isAgent ? 'dashboard' : 'admin'}/tickets/${opts.ticketId}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; font-size: 14px; font-weight: 600; font-family: Arial, sans-serif">View Conversation →</a>
      </p>
      <p style="margin:16px 0 4px;font-size:13px;color:#888">
        Reply to this email to respond directly.
      </p>
      <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
      <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
    `;
    const replyHtml = emailWrapper(replyContent);

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

    const stripHtml = (h: string) =>
      h.replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|tr|li|h[1-6]|table)>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">").replace(/&#39;/g, "'").replace(/&quot;/gi, '"')
        .replace(/[ \t]+/g, " ")
        .replace(/[ \t]*\n[ \t]*/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    for (const thread of zohoThreads) {
      // Only import email threads (actual conversation) — not comments/API threads.
      if (thread.channel !== "EMAIL") continue;

      // The list endpoint only has a summary; fetch the thread for full content.
      const detail = await getZohoThreadDetail(ticket.zohoTicketId, String(thread.id));
      await new Promise((r) => setTimeout(r, 120)); // rate limit
      const rawContent = (
        detail?.plainText ||
        (detail?.content ? stripHtml(detail.content) : "") ||
        thread.summary ||
        ""
      ).trim();
      if (!rawContent) continue;

      if (isDuplicate(rawContent)) continue;

      // direction: "in" = from customer, "out" = from agent
      const isFromAgent = thread.direction === "out";
      const direction = isFromAgent ? "2" : "1";

      await prisma.ticketThread.create({
        data: {
          ticketId,
          content: rawContent,
          direction,
          agentId: isFromAgent ? "zoho-agent" : null,
          ...(thread.createdTime ? { createdAt: new Date(thread.createdTime) } : {}),
        },
      });

      existingContents.add(normalize(rawContent));
      imported++;
    }

    // Set repliedStatus from the most recent email thread direction so the list's
    // "Replied Status" is accurate (out = agent/admin → 2, in = customer → 1).
    const emailThreads = zohoThreads.filter((t: any) => t.channel === "EMAIL" && t.createdTime);
    if (emailThreads.length) {
      emailThreads.sort((a: any, b: any) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
      const isAgentLast = emailThreads[0].direction === "out";
      await prisma.ticket
        .update({ where: { ticketId }, data: { repliedStatus: isAgentLast ? 2 : 1, readStatus: isAgentLast ? 2 : 1 } })
        .catch(() => {});
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
    where: { 
      zohoTicketId: { not: null },
      status: { notIn: ["Closed", "Closed/Resolved"] }
    },
    select: { ticketId: true },
    orderBy: { updatedAt: "desc" },
    take: 30, // Most recently active tickets (the cron refreshes their records first,
              // so a fresh customer reply lands here and its threads get pulled).
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

/**
 * One-time backfill: our local `ticketId` already holds the Zoho ticket id
 * (e.g. 822654000003360001), but `zohoTicketId` was left null during migration.
 * Copying it links every existing ticket to Zoho so thread/reply sync works.
 * Idempotent and safe to call repeatedly.
 */
export async function backfillZohoTicketIds(): Promise<number> {
  // Only numeric ticketIds are Zoho ids; cuid-style local ids are excluded.
  const updated = await prisma.$executeRawUnsafe(
    `UPDATE "Ticket" SET "zohoTicketId" = "ticket_id"
     WHERE "zohoTicketId" IS NULL AND "ticket_id" ~ '^[0-9]+$'`
  );
  if (updated) console.log(`[ZOHO-SYNC] Backfilled zohoTicketId on ${updated} tickets`);
  return updated as unknown as number;
}

// Map a Zoho Desk status to one of our local status options.
function mapZohoStatus(status: string | undefined | null): string {
  if (!status) return "Open";
  const s = status.trim().toLowerCase();
  if (s === "on hold" || s === "hold") return "Hold";
  if (s === "closed") return "Closed";
  if (s === "escalated") return "Escalated";
  if (s === "open") return "Open";
  // Pass through anything else (e.g. "Pending", "Answered") capitalized as-is.
  return status;
}

// Resolve the userId for an imported Zoho ticket. Matches an existing user by
// email, otherwise creates a lightweight placeholder user (per chosen policy).
const userIdCache = new Map<string, number>();
async function resolveUserId(email: string | null, name: string | null): Promise<number> {
  const key = (email || "zoho-import").toLowerCase();
  const cached = userIdCache.get(key);
  if (cached) return cached;

  if (email) {
    const normalized = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalized } });
    if (existing) {
      userIdCache.set(key, existing.id);
      return existing.id;
    }
    const created = await prisma.user.create({
      data: { email: normalized, name: name || normalized, role: "USER", status: "passive" },
    });
    userIdCache.set(key, created.id);
    return created.id;
  }

  // No email at all — bucket under a single system import user.
  const sysEmail = "zoho-import@getreviews.buzz";
  const sys =
    (await prisma.user.findUnique({ where: { email: sysEmail } })) ??
    (await prisma.user.create({ data: { email: sysEmail, name: "Zoho Import", role: "USER", status: "passive" } }));
  userIdCache.set(key, sys.id);
  return sys.id;
}

/**
 * Pull tickets FROM Zoho Desk into the local DB.
 *
 * Upserts by `ticketId` (= the Zoho ticket id), so existing tickets are updated
 * in place (no duplicates) and genuinely-new Zoho tickets are imported. Sorted by
 * most-recently-modified, and bounded by maxPages to stay within function limits —
 * call repeatedly (or via cron) to walk further back.
 */
export async function pullTicketsFromZoho(opts?: {
  maxPages?: number;
  pageSize?: number;
}): Promise<{ imported: number; updated: number; fetched: number; pages: number }> {
  if (!isZohoConfigured()) {
    console.log("[ZOHO-SYNC] Zoho not configured. Skipping pull.");
    return { imported: 0, updated: 0, fetched: 0, pages: 0 };
  }

  // Make sure existing tickets are linked first.
  await backfillZohoTicketIds().catch((e) => console.error("[ZOHO-SYNC] backfill failed:", e));

  const pageSize = Math.min(100, Math.max(1, opts?.pageSize ?? 100));
  const maxPages = Math.max(1, opts?.maxPages ?? 5);

  let imported = 0;
  let updated = 0;
  let fetched = 0;
  let pages = 0;

  for (let page = 0; page < maxPages; page++) {
    const from = page * pageSize + 1;
    const tickets = await getZohoTickets(from, pageSize, "-modifiedTime");
    if (!tickets.length) break;
    pages++;
    fetched += tickets.length;

    // Batched to stay within serverless time limits (per-ticket queries against a
    // remote DB are too slow): one lookup for existing, createMany for new, and
    // updates only when a status actually changed.
    const ids = tickets.map((z: any) => String(z.id));
    const existingRows = await prisma.ticket.findMany({
      where: { ticketId: { in: ids } },
      select: { ticketId: true, status: true },
    });
    const existingMap = new Map(existingRows.map((t) => [t.ticketId, t.status]));
    const news = tickets.filter((z: any) => !existingMap.has(String(z.id)));

    if (news.length) {
      // Resolve users for new tickets in batch.
      const emailToName = new Map<string, string>();
      for (const z of news) {
        const email = (z.email || z.contact?.email || "").trim().toLowerCase();
        if (email && !emailToName.has(email)) {
          const nm = [z.contact?.firstName, z.contact?.lastName].filter(Boolean).join(" ").trim() || z.contactName || email;
          emailToName.set(email, nm);
        }
      }
      const emails = [...emailToName.keys()];
      const userMap = new Map<string, number>();
      if (emails.length) {
        const found = await prisma.user.findMany({ where: { email: { in: emails } }, select: { id: true, email: true } });
        for (const u of found) userMap.set(u.email, u.id);
        const missing = emails.filter((e) => !userMap.has(e));
        if (missing.length) {
          await prisma.user.createMany({
            data: missing.map((e) => ({ email: e, name: emailToName.get(e) || e, role: "USER", status: "passive" })) as any,
            skipDuplicates: true,
          });
          const created = await prisma.user.findMany({ where: { email: { in: missing } }, select: { id: true, email: true } });
          for (const u of created) userMap.set(u.email, u.id);
        }
      }
      const sysId = await resolveUserId(null, null); // bucket for null-email tickets

      const rows = news.map((z: any) => {
        const email = (z.email || z.contact?.email || "").trim().toLowerCase() || null;
        const name = email ? (emailToName.get(email) || email) : "Zoho Customer";
        const subject = z.subject || "Support Ticket";
        return {
          ticketId: String(z.id),
          zohoTicketId: String(z.id),
          userId: (email && userMap.get(email)) || sysId,
          subject,
          title: subject,
          query: z.description || "",
          status: mapZohoStatus(z.status),
          email,
          name,
          ticketNumber: z.ticketNumber ? String(z.ticketNumber) : null,
          readStatus: 1,
          repliedStatus: 1,
          ...(z.createdTime ? { createdAt: new Date(z.createdTime) } : {}),
        };
      });
      const res = await prisma.ticket.createMany({ data: rows as any, skipDuplicates: true });
      imported += res.count;
    }

    // Refresh status for existing tickets only when it changed.
    for (const z of tickets) {
      const zid = String(z.id);
      if (!existingMap.has(zid)) continue;
      const newStatus = mapZohoStatus(z.status);
      if (existingMap.get(zid) !== newStatus) {
        try {
          await prisma.ticket.update({ where: { ticketId: zid }, data: { status: newStatus } });
          updated++;
        } catch (err) {
          console.error(`[ZOHO-SYNC] Failed to update ticket ${zid}:`, err);
        }
      }
    }

    if (tickets.length < pageSize) break; // reached the last page
    await new Promise((resolve) => setTimeout(resolve, 250)); // rate limit
  }

  console.log(`[ZOHO-SYNC] Pull complete: ${imported} imported, ${updated} updated, ${fetched} fetched across ${pages} pages`);
  return { imported, updated, fetched, pages };
}
