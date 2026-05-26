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

const SITE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://grb-mern-gilt.vercel.app";

function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e0e0e0;border-radius:4px;overflow:hidden">
      <!-- Logo -->
      <tr>
        <td align="center" style="padding:24px 32px 16px;background:#ffffff;border-bottom:1px solid #eeeeee">
          <a href="${SITE_URL}" style="display:inline-block;text-decoration:none">
            <img src="${SITE_URL}/icons/logo.png" alt="Get Reviews Buzz" width="180" height="67" style="display:block;max-width:180px;height:auto" />
          </a>
        </td>
      </tr>
      <!-- Content -->
      <tr><td style="padding:24px 32px">${content}</td></tr>
      <!-- Footer -->
      <tr>
        <td style="padding:16px 32px;background:#fafafa;border-top:1px solid #eeeeee;text-align:center">
          <p style="margin:0 0 8px;font-size:11px;color:#aaa">
            <a href="${SITE_URL}/privacy-policy" style="color:#aaa;text-decoration:none">Privacy Statement</a> &nbsp;|&nbsp;
            <a href="${SITE_URL}/terms-conditions" style="color:#aaa;text-decoration:none">Terms of Service</a> &nbsp;|&nbsp;
            <a href="${SITE_URL}/about-us" style="color:#aaa;text-decoration:none">About</a>
          </p>
          <p style="margin:0 0 10px;font-size:10px;color:#ccc">&copy;${new Date().getFullYear()} GET REVIEWS BUZZ. All Rights Reserved.</p>
          <table cellpadding="0" cellspacing="0" align="center"><tr>
            <td style="padding:0 4px"><a href="https://www.facebook.com/getreviews.buzz" style="display:inline-block;text-decoration:none"><img src="${SITE_URL}/icons/social-facebook.png" alt="Facebook" width="18" height="18" style="display:block" /></a></td>
            <td style="padding:0 4px"><a href="https://x.com/GetReviewsBuzz" style="display:inline-block;text-decoration:none"><img src="${SITE_URL}/icons/social-twitter.png" alt="Twitter" width="18" height="18" style="display:block" /></a></td>
            <td style="padding:0 4px"><a href="https://www.instagram.com/getreviews.buzz/" style="display:inline-block;text-decoration:none"><img src="${SITE_URL}/icons/social-instagram.png" alt="Instagram" width="18" height="18" style="display:block" /></a></td>
            <td style="padding:0 4px"><a href="https://www.pinterest.com/getreviewsbuzz/" style="display:inline-block;text-decoration:none"><img src="${SITE_URL}/icons/social-pinterest.png" alt="Pinterest" width="18" height="18" style="display:block" /></a></td>
          </tr></table>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function orderTable(items: Array<{ platform: string; qty: number; pricePerUnit: number }>) {
  const rows = items.map((i) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:14px">${i.platform}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:14px">${i.qty}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:14px">$${i.pricePerUnit.toFixed(2)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:14px">$${(i.pricePerUnit * i.qty).toFixed(2)}</td>
    </tr>`).join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin:16px 0">
    <thead>
      <tr style="background:#f8f8f8">
        <th style="padding:10px 14px;text-align:left;font-size:13px;color:#555;font-weight:600;border-bottom:1px solid #e8e8e8">Product Name</th>
        <th style="padding:10px 14px;text-align:center;font-size:13px;color:#555;font-weight:600;border-bottom:1px solid #e8e8e8">Quantity</th>
        <th style="padding:10px 14px;text-align:center;font-size:13px;color:#555;font-weight:600;border-bottom:1px solid #e8e8e8">Amount Per Item</th>
        <th style="padding:10px 14px;text-align:right;font-size:13px;color:#555;font-weight:600;border-bottom:1px solid #e8e8e8">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function paymentDetails(total: number, amountPaid: number) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin:16px 0">
    <thead>
      <tr><th colspan="2" style="padding:10px 14px;text-align:center;font-size:15px;color:#1a6fe0;font-weight:700;border-bottom:1px solid #e8e8e8;background:#f8fbff">Payment Details</th></tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0">Total:</td>
        <td style="padding:10px 14px;font-size:14px;text-align:right;font-weight:600;border-bottom:1px solid #f0f0f0">$${total.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555">Amount Paid :</td>
        <td style="padding:10px 14px;font-size:14px;text-align:right;font-weight:600">${amountPaid > 0 ? `$${amountPaid.toFixed(2)}` : "0"}</td>
      </tr>
    </tbody>
  </table>`;
}

export function buildOrderCreatedEmail(payload: {
  name: string;
  email?: string;
  orderNumber: string;
  items: Array<{ platform: string; qty: number; pricePerUnit: number }>;
  total: number;
}) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">This order has been successfully generated and ready to pay.</p>
    <p style="margin:0 0 6px;font-size:14px;color:#444">Name : <strong>${payload.name}</strong></p>
    <p style="margin:0 0 18px;font-size:14px;color:#444">Email : <a href="mailto:${payload.email ?? ""}" style="color:#1a6fe0">${payload.email ?? ""}</a></p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin-bottom:4px">
    <tr><td style="padding:10px 14px;text-align:center;font-size:14px;font-weight:600;color:#333;background:#fafafa;border-bottom:1px solid #e8e8e8">Order No. - ${payload.orderNumber}</td></tr>
    </table>
    ${orderTable(payload.items)}
    ${paymentDetails(payload.total, 0)}
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: "New order has been generated!",
    html: emailWrapper(content),
  };
}

export function buildOrderPaidEmail(payload: {
  name: string;
  email?: string;
  orderNumber: string;
  items?: Array<{ platform: string; qty: number; pricePerUnit: number }>
  total: number;
}) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">New order has been placed successfully.</p>
    <p style="margin:0 0 6px;font-size:14px;color:#444">Name : <strong>${payload.name}</strong></p>
    <p style="margin:0 0 18px;font-size:14px;color:#444">Email : <a href="mailto:${payload.email ?? ""}" style="color:#1a6fe0">${payload.email ?? ""}</a></p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin-bottom:4px">
      <tr><td style="padding:10px 14px;text-align:center;font-size:14px;font-weight:600;color:#333;background:#fafafa;border-bottom:1px solid #e8e8e8">Order No. - ${payload.orderNumber}</td></tr>
    </table>
    ${payload.items ? orderTable(payload.items) : ""}
    ${paymentDetails(payload.total, payload.total)}
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: "New order has been placed successfully!",
    html: emailWrapper(content),
  };
}

export function buildUnpaidReminderEmail(payload: {
  name: string;
  email?: string;
  orderNumber: string;
  items: Array<{ platform: string; qty: number; pricePerUnit: number }>;
  total: number;
  payUrl: string | null;
}) {
  const payButtons = payload.payUrl
    ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin:16px 0">
      <tr><td colspan="4" style="padding:10px 14px"><p style="font-size:15px;margin:0;line-height:28px;padding:5px 0;color:#000">To complete the payment please click the button below.</p></td></tr>
      <tr>
        <td style="padding:12px 14px">
          <a href="${payload.payUrl}"
             style="padding:14px 20px;background:#000;border-radius:5px;display:inline-block;color:#fff;text-decoration:none;font-size:14px;font-weight:600">
            💳 Pay with Debit / Credit Card
          </a>
        </td>
      </tr>
    </table>`
    : "";

  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">There is an order in your account that is unpaid. Have you experienced any issues while making your payment? Not to worry!</p>
    <p style="margin:0 0 6px;font-size:14px;color:#444">Name : <strong>${payload.name}</strong></p>
    <p style="margin:0 0 18px;font-size:14px;color:#444">Email : <a href="mailto:${payload.email ?? ""}" style="color:#1a6fe0">${payload.email ?? ""}</a></p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin-bottom:4px">
      <tr><td style="padding:10px 14px;text-align:center;font-size:14px;font-weight:600;color:#333;background:#fafafa;border-bottom:1px solid #e8e8e8">Order No. - ${payload.orderNumber}</td></tr>
    </table>
    ${orderTable(payload.items)}
    ${paymentDetails(payload.total, 0)}
    ${payButtons}
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Your order #${payload.orderNumber} is unpaid — complete your payment`,
    html: emailWrapper(content),
  };
}

const STATUS_LABELS: Record<string, { label: string; color: string; message: string }> = {
  "1": { label: "Pending",    color: "#f59e0b", message: "Your order has been received and is pending review." },
  "2": { label: "Processing", color: "#3b82f6", message: "Great news! We are currently processing your order." },
  "3": { label: "Complete",   color: "#10b981", message: "Your order has been completed successfully. Thank you for choosing Get Reviews Buzz!" },
  "4": { label: "On Hold",    color: "#f97316", message: "Your order has been placed on hold. Our team will reach out to you shortly." },
  "5": { label: "Cancelled",  color: "#ef4444", message: "Your order has been cancelled. Please contact us if you have any questions." },
  "6": { label: "Refund",     color: "#8b5cf6", message: "A refund has been initiated for your order. Please allow 5–7 business days for it to reflect." },
};

export function buildOrderStatusEmail(payload: {
  name: string;
  email?: string;
  orderNumber: string;
  status: string;
}) {
  const s = STATUS_LABELS[payload.status] ?? { label: payload.status, color: "#6b7280", message: "Your order status has been updated." };
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hi <strong>${payload.name}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">${s.message}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin-bottom:20px">
      <tr><td style="padding:10px 14px;text-align:center;font-size:14px;font-weight:600;color:#333;background:#fafafa;border-bottom:1px solid #e8e8e8">Order No. - ${payload.orderNumber}</td></tr>
      <tr>
        <td style="padding:16px 14px;text-align:center">
          <span style="display:inline-block;padding:8px 24px;background:${s.color};color:#fff;border-radius:20px;font-size:15px;font-weight:700;letter-spacing:0.5px">${s.label}</span>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 4px;font-size:14px;color:#444">If you have any questions, feel free to reply to this email or contact our support team.</p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Your order #${payload.orderNumber} status is now: ${s.label}`,
    html: emailWrapper(content),
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