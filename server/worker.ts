import "dotenv/config";
import { boss, initQueue } from "./queue.ts";
import { sendEmailNotification, buildTicketCreatedEmail, buildTicketReplyEmail } from "./email.ts";
import { createZohoTicket, addZohoTicketReply, isZohoConfigured } from "./services/zohoService.ts";
import prisma from "../lib/prisma.ts";

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
          await sendEmailNotification({ to: email, subject: payload.subject, text: payload.text });
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
      
      if (!isZohoConfigured()) {
        console.log("Zoho is not configured. Skipping sync for job", job.id);
        continue;
      }
      
      try {
        if (data.type === "ticket.created") {
          const { ticketId, subject, query, email, name, phone } = data;
          
          const zohoTicketId = await createZohoTicket({
            subject: subject || "New Ticket",
            description: query,
            contact: {
              email: email || "mohit@adaired",
              firstName: name,
              phone: phone
            }
          });

          await prisma.ticket.update({
            where: { ticketId },
            data: { zohoTicketId }
          });
          
          console.log(`Synced ticket ${ticketId} to Zoho Desk with ID ${zohoTicketId}`);
        } else if (data.type === "ticket.message") {
          const { ticketId, message, isAgent } = data;
          
          const ticket = await prisma.ticket.findUnique({
            where: { ticketId }
          });
          
          if (ticket?.zohoTicketId) {
            await addZohoTicketReply(ticket.zohoTicketId, message, isAgent);
            console.log(`Synced message for ticket ${ticketId} to Zoho Desk`);
          } else {
            console.warn(`Ticket ${ticketId} does not have a zohoTicketId. Cannot sync message.`);
          }
        }
      } catch (error) {
        console.error("Error in ticket sync worker:", error);
        throw error;
      }
    }
  });

  console.log("pg-boss workers started for email and ticket sync queues.");
}

startWorkers().catch((err) => {
  console.error("Failed to start pg-boss workers", err);
});
