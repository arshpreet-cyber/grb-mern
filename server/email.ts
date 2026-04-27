import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.example.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  },
});

export async function sendEmailNotification(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const from = process.env.EMAIL_FROM ?? "[EMAIL_ADDRESS]";

  if (!options.to) {
    throw new Error("Email recipient is required.");
  }

  return transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}

export function buildTicketCreatedEmail(payload: {
  name?: string | null;
  ticketNumber: string;
  subject: string;
}) {
  return {
    subject: `Ticket created: ${payload.ticketNumber}`,
    text: `Hello ${payload.name ?? "Customer"},\n\nYour ticket ${payload.ticketNumber} has been created successfully. Subject: ${payload.subject}. We will follow up shortly.`,
  };
}

export function buildTicketReplyEmail(payload: {
  name?: string | null;
  ticketNumber: string;
  message: string;
}) {
  return {
    subject: `Update on ticket ${payload.ticketNumber}`,
    text: `Hello ${payload.name ?? "Customer"},\n\nA reply has been added to ticket ${payload.ticketNumber}:\n\n${payload.message}\n\nLog in to your support area to continue the conversation.`,
  };
}
