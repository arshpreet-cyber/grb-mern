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

export function buildOrderCreatedEmail(payload: {
  name: string;
  orderNumber: string;
  items: Array<{ platform: string; qty: number; pricePerUnit: number }>;
  total: number;
}) {
  const rows = payload.items.map(
    (i) => `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${i.platform}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${i.qty}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">$${(i.pricePerUnit * i.qty).toFixed(2)}</td>
    </tr>`
  ).join("");

  return {
    subject: `Order Received #${payload.orderNumber} – GetReviews`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333">
      <div style="background:#fcd535;padding:24px 32px">
        <h1 style="margin:0;font-size:22px;color:#111">Order Received</h1>
      </div>
      <div style="padding:28px 32px">
        <p>Hi ${payload.name},</p>
        <p>Thank you for your order! We've received it and will begin processing once your payment is confirmed.</p>
        <p><strong>Order #${payload.orderNumber}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f8f8f8">
              <th style="padding:8px 12px;text-align:left">Item</th>
              <th style="padding:8px 12px;text-align:center">Qty</th>
              <th style="padding:8px 12px;text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:10px 12px;font-weight:bold;text-align:right">Total</td>
              <td style="padding:10px 12px;font-weight:bold;text-align:right;color:#28a745">$${payload.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="color:#666;font-size:13px">If you have any questions, reply to this email or contact our support team.</p>
        <p>Thanks,<br><strong>GetReviews Team</strong></p>
      </div>
    </div>`,
  };
}

export function buildOrderPaidEmail(payload: {
  name: string;
  orderNumber: string;
  total: number;
}) {
  return {
    subject: `Payment Confirmed #${payload.orderNumber} – GetReviews`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333">
      <div style="background:#28a745;padding:24px 32px">
        <h1 style="margin:0;font-size:22px;color:#fff">Payment Confirmed</h1>
      </div>
      <div style="padding:28px 32px">
        <p>Hi ${payload.name},</p>
        <p>Great news! Your payment for order <strong>#${payload.orderNumber}</strong> has been confirmed.</p>
        <p style="font-size:22px;font-weight:bold;color:#28a745">$${payload.total.toFixed(2)} received</p>
        <p>Our team is now processing your order and will get started right away. You can track your order status from your dashboard.</p>
        <p>Thanks,<br><strong>GetReviews Team</strong></p>
      </div>
    </div>`,
  };
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
