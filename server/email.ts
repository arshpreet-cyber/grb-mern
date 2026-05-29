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

const SITE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://getreviews.buzz";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? process.env.EMAIL_FROM ?? "";

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

// ─── EVT-0001: Admin – New User Registration ─────────────────────────────────
export function buildRegistrationAdminEmail(payload: { name: string; email: string }) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">New user has been registered on Get Reviews Buzz.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin:16px 0">
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;width:100px">Name :</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:600;border-bottom:1px solid #f0f0f0">${payload.name}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555">Email :</td>
        <td style="padding:10px 14px;font-size:14px"><a href="mailto:${payload.email}" style="color:#1a6fe0">${payload.email}</a></td>
      </tr>
    </table>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/admin/users" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:5px;font-size:14px;font-weight:600">View Users</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: "New User Registration – Get Reviews Buzz",
    html: emailWrapper(content),
  };
}

// ─── EVT-0002: User – Welcome / Email Verified ───────────────────────────────
export function buildWelcomeEmail(payload: { name: string }) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hello <strong>${payload.name}</strong>!</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">Welcome to Get Reviews Buzz. Your account has been created successfully.</p>
    <p style="margin:0 0 20px;font-size:14px;color:#555">You can now log in and start managing your reviews and orders from your dashboard.</p>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">Go to Dashboard</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: "Welcome to Get Reviews Buzz!",
    html: emailWrapper(content),
  };
}

// ─── EVT-0003: User – Unpaid Order Reminder ──────────────────────────────────
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

// ─── EVT-0004: User – Payment Successful ─────────────────────────────────────
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

// ─── EVT-0005: Admin – New Subscription ──────────────────────────────────────
export function buildSubscriptionAdminEmail(payload: { email: string; orderNumber?: string }) {
  const content = `
    <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#333">Hey, Admin!</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">New subscription has been activated.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin:16px 0">
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;width:120px">Email :</td>
        <td style="padding:10px 14px;font-size:14px;border-bottom:1px solid #f0f0f0"><a href="mailto:${payload.email}" style="color:#1a6fe0">${payload.email}</a></td>
      </tr>
      ${payload.orderNumber ? `<tr><td style="padding:10px 14px;font-size:14px;color:#555">Order # :</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:600">${payload.orderNumber}</td></tr>` : ""}
    </table>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: "New Subscription – Get Reviews Buzz",
    html: emailWrapper(content),
  };
}

// ─── EVT-0006 to 0011: User – Order Status Change ────────────────────────────
const STATUS_LABELS: Record<string, { label: string; color: string; message: string }> = {
  "1": { label: "Pending",    color: "#f59e0b", message: "Your order has been received and is pending review." },
  "2": { label: "Processing", color: "#3b82f6", message: "Great news! We are currently processing your order." },
  "3": { label: "Completed",  color: "#10b981", message: "Your order has been completed successfully. Thank you for choosing Get Reviews Buzz!" },
  "4": { label: "Hold",       color: "#f97316", message: "Your order has been placed on hold. Our team will reach out to you shortly." },
  "5": { label: "Cancelled",  color: "#ef4444", message: "Your order has been cancelled. Please contact us if you have any questions." },
  "6": { label: "Refunded",   color: "#8b5cf6", message: "A refund has been initiated for your order. Please allow 5–7 business days for it to reflect." },
  "7": { label: "Failed",     color: "#dc2626", message: "Unfortunately, your order has failed. Please contact our support team for assistance." },
};

export function buildOrderStatusEmail(payload: {
  name: string;
  email?: string;
  orderNumber: string;
  status: string;
  items?: Array<{ platform: string; qty: number; pricePerUnit: number }>;
  total?: number;
  amountPaid?: number;
}) {
  const s = STATUS_LABELS[payload.status] ?? { label: payload.status, color: "#6b7280", message: "Your order status has been updated." };
  const isPaid = ["3"].includes(payload.status);
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hi <strong>${payload.name}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">Status of your order <strong>Order No. - ${payload.orderNumber}</strong> has been changed to <strong style="color:${s.color}">${s.label}</strong>.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin-bottom:16px">
      <tr>
        <td style="padding:14px;text-align:center">
          <span style="display:inline-block;padding:8px 28px;background:${s.color};color:#fff;border-radius:20px;font-size:15px;font-weight:700;letter-spacing:0.5px">${s.label}</span>
        </td>
      </tr>
    </table>
    ${payload.items && payload.items.length > 0 ? orderTable(payload.items) : ""}
    ${payload.total !== undefined ? paymentDetails(payload.total, isPaid ? (payload.amountPaid ?? payload.total) : (payload.amountPaid ?? 0)) : ""}
    <p style="margin:16px 0 4px;font-size:14px;color:#444">${s.message}</p>
    <p style="margin:0 0 4px;font-size:14px;color:#444">If you have any questions, feel free to reply to this email or contact our support team.</p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Your order #${payload.orderNumber} status is now: ${s.label}`,
    html: emailWrapper(content),
  };
}

// ─── EVT-0003 (unpaid order creation email) ───────────────────────────────────
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

// ─── EVT-0012: User – Ticket Thank You ───────────────────────────────────────
export function buildTicketCreatedEmail(payload: {
  name?: string | null;
  email?: string | null;
  ticketNumber: string;
  subject: string;
}) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hi <strong>${payload.name ?? "Customer"}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">Thank you for submitting a ticket. Our team will soon get back to you.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin:16px 0">
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;width:120px">Ticket # :</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:600;font-family:monospace;border-bottom:1px solid #f0f0f0">${payload.ticketNumber}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555">Subject :</td>
        <td style="padding:10px 14px;font-size:14px">${payload.subject}</td>
      </tr>
    </table>
    <p style="margin:0 0 20px;font-size:14px;color:#555">You can view and track the status of your ticket from your dashboard.</p>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/dashboard/tickets" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">View My Tickets</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Ticket Received: ${payload.ticketNumber}`,
    html: emailWrapper(content),
  };
}

// ─── EVT-0013: User – Ticket On Hold ─────────────────────────────────────────
export function buildTicketHoldEmail(payload: {
  name?: string | null;
  ticketNumber: string;
  subject?: string;
}) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hi <strong>${payload.name ?? "Customer"}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">The status of your support ticket has been updated to <strong style="color:#f97316">Hold</strong>.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin:16px 0">
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;width:120px">Ticket # :</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:600;font-family:monospace;border-bottom:1px solid #f0f0f0">${payload.ticketNumber}</td>
      </tr>
      ${payload.subject ? `<tr><td style="padding:10px 14px;font-size:14px;color:#555">Subject :</td>
        <td style="padding:10px 14px;font-size:14px">${payload.subject}</td></tr>` : ""}
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-top:1px solid #f0f0f0">Status :</td>
        <td style="padding:10px 14px;font-size:14px"><span style="display:inline-block;padding:4px 14px;background:#fff3e8;color:#f97316;border-radius:20px;font-weight:700;font-size:13px;border:1px solid #fbd5b0">Hold</span></td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:#555">Our team is reviewing your ticket and may require additional information. We will be in touch soon.</p>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/dashboard/tickets" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">View My Tickets</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Ticket ${payload.ticketNumber} is now On Hold`,
    html: emailWrapper(content),
  };
}

// ─── EVT-0014: User – Ticket Escalated ───────────────────────────────────────
export function buildTicketEscalatedEmail(payload: {
  name?: string | null;
  ticketNumber: string;
  subject?: string;
}) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hi <strong>${payload.name ?? "Customer"}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">Your support ticket has been escalated to our senior team for priority handling.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin:16px 0">
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;width:120px">Ticket # :</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:600;font-family:monospace;border-bottom:1px solid #f0f0f0">${payload.ticketNumber}</td>
      </tr>
      ${payload.subject ? `<tr><td style="padding:10px 14px;font-size:14px;color:#555">Subject :</td>
        <td style="padding:10px 14px;font-size:14px">${payload.subject}</td></tr>` : ""}
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-top:1px solid #f0f0f0">Status :</td>
        <td style="padding:10px 14px;font-size:14px"><span style="display:inline-block;padding:4px 14px;background:#ede9fe;color:#7c3aed;border-radius:20px;font-weight:700;font-size:13px;border:1px solid #c4b5fd">Escalated</span></td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:#555">A senior support agent will be handling your case and will respond to you shortly. We appreciate your patience.</p>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/dashboard/tickets" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">View My Tickets</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Ticket ${payload.ticketNumber} has been Escalated`,
    html: emailWrapper(content),
  };
}

// ─── EVT-0015: User – Order Information Required ─────────────────────────────
export function buildOrderInfoRequiredEmail(payload: {
  name: string;
  orderNumber: string;
  detailsUrl: string;
}) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hi <strong>${payload.name}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">Thank you for placing your order <strong>#${payload.orderNumber}</strong> with us.</p>
    <p style="margin:0 0 20px;font-size:14px;color:#555">We noticed that the required order details are still missing. To start working on your order, please share the necessary information at your earliest convenience.</p>
    <p style="margin:0 0 20px;font-size:14px;color:#555">Kindly click on the button below to fill out the details form:</p>
    <p style="margin:20px 0">
      <a href="${payload.detailsUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:5px;font-size:14px;font-weight:600">Fill Order Details →</a>
    </p>
    <p style="margin:16px 0 4px;font-size:14px;color:#555">If you have any questions or need help, feel free to reach out — we're happy to assist.</p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Order #${payload.orderNumber} – Information Required`,
    html: emailWrapper(content),
  };
}

// ─── EVT-0016: Admin – User Submitted Order Details ──────────────────────────
export function buildUserSubmittedDetailsAdminEmail(payload: {
  name: string;
  email: string;
  orderNumber: string;
  orderId: string;
}) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Order <strong>#${payload.orderNumber}</strong> details have been submitted by the user.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin:16px 0">
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;width:100px">Name :</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:600;border-bottom:1px solid #f0f0f0">${payload.name}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555">Email :</td>
        <td style="padding:10px 14px;font-size:14px"><a href="mailto:${payload.email}" style="color:#1a6fe0">${payload.email}</a></td>
      </tr>
    </table>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/admin/orders/${payload.orderId}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:5px;font-size:14px;font-weight:600">View Order Details →</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Order #${payload.orderNumber} – Details Submitted by User`,
    html: emailWrapper(content),
  };
}

// ─── EVT-0017: User – Contact Us Confirmation ────────────────────────────────
export function buildContactConfirmationEmail(payload: { email: string }) {
  const firstName = payload.email.split("@")[0];
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hi <strong>${firstName}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">Thank you for contacting Get Reviews Buzz. We have received your message and will get back to you shortly.</p>
    <p style="margin:0 0 16px;font-size:14px;color:#555">Our team typically responds within 24 hours. If your matter is urgent, please reach out to us directly.</p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: "We received your message – Get Reviews Buzz",
    html: emailWrapper(content),
  };
}

// ─── EVT-0018: User – Ticket Closed ──────────────────────────────────────────
export function buildTicketClosedEmail(payload: {
  name?: string | null;
  ticketNumber: string;
  subject?: string;
}) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hi <strong>${payload.name ?? "Customer"}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">Your support ticket has been <strong>closed</strong>.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin:16px 0">
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;width:120px">Ticket # :</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:600;font-family:monospace;border-bottom:1px solid #f0f0f0">${payload.ticketNumber}</td>
      </tr>
      ${payload.subject ? `<tr><td style="padding:10px 14px;font-size:14px;color:#555">Subject :</td>
        <td style="padding:10px 14px;font-size:14px">${payload.subject}</td></tr>` : ""}
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#555;border-top:1px solid #f0f0f0">Status :</td>
        <td style="padding:10px 14px;font-size:14px"><span style="display:inline-block;padding:4px 14px;background:#f3f4f6;color:#6b7280;border-radius:20px;font-weight:700;font-size:13px;border:1px solid #d1d5db">Closed</span></td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:#555">We hope your issue has been resolved. If you need further assistance, feel free to open a new ticket at any time.</p>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/dashboard/support" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">Open New Ticket</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Ticket ${payload.ticketNumber} has been Closed`,
    html: emailWrapper(content),
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

export { ADMIN_EMAIL };
