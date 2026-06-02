import "dotenv/config";
import { boss, initQueue } from "./queue.ts";
import { sendEmailNotification, buildTicketCreatedEmail, buildTicketReplyEmail } from "./email.ts";
import { syncTicketToZoho, syncMessageToZoho, syncAllZohoThreadsToLocal } from "./services/zohoSync.ts";
import { isZohoConfigured } from "./services/zohoService.ts";

async function startWorkers() {
  await initQueue();

  await boss.work("support-email-queue", async (jobs: any) => {
    // pg-boss 9+ passes an array of jobs by default if batchSize > 1, but by default it's an array with 1 job, or a single job.
    // However, the standard signature for a single job is `async ([job])` or `async (job)` depending on configuration.
    // Let's handle it as a single job for simplicity if it's not an array, or the first element if it is.
    const jobArray = Array.isArray(jobs) ? jobs : [jobs];

    for (const job of jobArray) {
      const data = job.data as any;
      const { type, ticketId, name, email, subject, message } = data;

      if (!email) {
        console.error("Missing recipient email for notification job", job.id);
        continue;
      }

      try {
        if (type === "ticket.created") {
          const payload = buildTicketCreatedEmail({
            name,
            ticketNumber: ticketId,
            subject: subject ?? "Support ticket created",
          });
          await sendEmailNotification({ to: email, subject: payload.subject, text: `Ticket ${ticketId} created.`, html: payload.html });
        } else if (type === "ticket.message") {
          const payload = buildTicketReplyEmail({
            name,
            ticketNumber: ticketId,
            message: message ?? "A new reply has been posted.",
          });
          await sendEmailNotification({ to: email, subject: payload.subject, text: payload.text });
        }
      } catch (err) {
        console.error("Email job failed", job.id, err);
        throw err;
      }
    }
  });

  await boss.work("support-ticket-sync-queue", async (jobs: any) => {
    const jobArray = Array.isArray(jobs) ? jobs : [jobs];

    for (const job of jobArray) {
      console.log("Processing ticket sync job", job.id, job.data);
      const data = job.data as any;
      
      try {
        if (data.type === "ticket.created") {
          const { ticketId } = data;
          await syncTicketToZoho(ticketId);
        } else if (data.type === "ticket.message") {
          const { ticketId, message, isAgent } = data;
          await syncMessageToZoho(ticketId, message, isAgent);
        }
      } catch (error) {
        console.error("Error in ticket sync worker:", error);
        throw error;
      }
    }
  });

  console.log("pg-boss workers started for email and ticket sync queues.");

  // Start periodic Zoho → local thread sync (every 2 minutes)
  // This catches email replies made in Zoho Desk that need to appear locally
  if (isZohoConfigured()) {
    const SYNC_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
    
    async function runPeriodicSync() {
      try {
        const result = await syncAllZohoThreadsToLocal();
        if (result.messagesImported > 0) {
          console.log(`[PERIODIC-SYNC] Imported ${result.messagesImported} new messages from Zoho (checked ${result.ticketsChecked} tickets)`);
        }
      } catch (err) {
        console.error("[PERIODIC-SYNC] Error:", err);
      }
    }

    // Run first sync after 30 seconds (let server settle)
    setTimeout(() => {
      runPeriodicSync();
      // Then run every 2 minutes
      setInterval(runPeriodicSync, SYNC_INTERVAL_MS);
    }, 30_000);

    console.log("Zoho → local periodic sync scheduled (every 2 minutes).");
  }
}

startWorkers().catch((err) => {
  console.error("Failed to start pg-boss workers", err);
});
