import nodemailer from "nodemailer";

const isSecure = process.env.SMTP_SECURE === "true";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.example.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: isSecure,
  requireTLS: !isSecure, // enforce STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  },
  tls: {
    rejectUnauthorized: false,
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
const ASSET_BASE_URL = !SITE_URL.includes("localhost") ? SITE_URL : "https://getreviews.buzz";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? process.env.EMAIL_FROM ?? "";

export function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:30px 0">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e0e0e0;border-radius:4px;overflow:hidden">
      <!-- Logo -->
      <tr>
        <td align="center" style="padding:24px 32px 16px;background:#ebebeb;border-bottom:1px solid #eeeeee">
          <a href="${SITE_URL}" style="display:inline-block;text-decoration:none">
            <img src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png" alt="Get Reviews Buzz" width="180" height="67" style="display:block;max-width:180px;height:auto" />
          </a>
        </td>
      </tr>
      <!-- Content -->
      <tr><td style="padding:24px 32px;background:#ffffff">${content}</td></tr>
      <!-- Footer -->
      <tr>
        <td style="padding:16px 32px;background:#ffffff;border-top:1px solid #eeeeee;text-align:center">
          <p style="margin:0 0 8px;font-size:11px;color:#aaa;font-weight:bold;letter-spacing:0.5px">
            <a href="${SITE_URL}/privacy-policy" style="color:#aaa;text-decoration:none">PRIVACY STATEMENT</a> &nbsp;|&nbsp;
            <a href="${SITE_URL}/terms-conditions" style="color:#aaa;text-decoration:none">TERMS OF SERVICE</a> &nbsp;|&nbsp;
            <a href="${SITE_URL}/about-us" style="color:#aaa;text-decoration:none">ABOUT</a>
          </p>
          <p style="margin:0 0 10px;font-size:10px;color:#ccc;letter-spacing:0.5px">&copy;${new Date().getFullYear()} GET REVIEWS BUZZ. ALL RIGHTS RESERVED.</p>
          <table cellpadding="0" cellspacing="0" align="center"><tr>
            <td style="padding:0 4px"><a href="https://www.facebook.com/getreviews.buzz" style="display:inline-block;text-decoration:none"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="22" height="22" style="display:block" /></a></td>
            <td style="padding:0 4px"><a href="https://x.com/GetReviewsBuzz" style="display:inline-block;text-decoration:none"><img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" alt="Twitter" width="22" height="22" style="display:block" /></a></td>
            <td style="padding:0 4px"><a href="https://www.instagram.com/getreviews.buzz/" style="display:inline-block;text-decoration:none"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="22" height="22" style="display:block" /></a></td>
            <td style="padding:0 4px"><a href="https://api.whatsapp.com/send?phone=13068025402" style="display:inline-block;text-decoration:none"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" width="22" height="22" style="display:block" /></a></td>
          </tr></table>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

export function buildUnifiedOrderTable(payload: {
  orderNumber: string;
  items?: Array<{ platform: string; qty: number; pricePerUnit: number }>;
  total: number;
  amountPaid: number;
}) {
  const hasItems = payload.items && payload.items.length > 0;
  
  const formatVal = (val: number) => {
    return val % 1 === 0 ? val.toFixed(0) : val.toFixed(2);
  };

  let rowsHtml = "";
  if (hasItems) {
    rowsHtml = payload.items!.map((i) => `
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;text-align:left;color:#333">${i.platform}</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;text-align:center;font-size:14px;color:#333">${i.qty}</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;text-align:center;font-size:14px;color:#333">$${formatVal(i.pricePerUnit)}</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;text-align:center;font-size:14px;color:#333">$${formatVal(i.pricePerUnit * i.qty)}</td>
      </tr>`).join("");
  } else {
    rowsHtml = `
      <tr>
        <td colspan="4" style="padding:16px;border:1px solid #e0e0e0;font-size:14px;text-align:center;color:#666;font-style:italic">
          Order details are available in your customer dashboard.
        </td>
      </tr>`;
  }

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;width:100%;margin:16px 0;font-family:Arial,sans-serif;background:#ffffff">
      <!-- Order No Header -->
      <tr style="background:#ffffff">
        <td colspan="4" align="center" style="padding:14px;border:1px solid #e0e0e0;font-size:14px;font-weight:700;color:#333">
          Order No. - ${payload.orderNumber}
        </td>
      </tr>
      
      <!-- Table Columns Header -->
      <tr style="background:#ffffff">
        <th style="padding:10px 14px;text-align:center;font-size:13px;color:#333;font-weight:700;border:1px solid #e0e0e0;width:45%">Product Name</th>
        <th style="padding:10px 14px;text-align:center;font-size:13px;color:#333;font-weight:700;border:1px solid #e0e0e0;width:15%">Quantity</th>
        <th style="padding:10px 14px;text-align:center;font-size:13px;color:#333;font-weight:700;border:1px solid #e0e0e0;width:20%">Amount Per Item</th>
        <th style="padding:10px 14px;text-align:center;font-size:13px;color:#333;font-weight:700;border:1px solid #e0e0e0;width:20%">Amount</th>
      </tr>
      
      <!-- Products List -->
      ${rowsHtml}
      
      <!-- Payment Details Heading -->
      <tr style="background:#ffffff">
        <td colspan="4" align="center" style="padding:14px;border:1px solid #e0e0e0;font-size:16px;font-weight:700;color:#0f56b3">
          Payment Details
        </td>
      </tr>
      
      <!-- Total Row -->
      <tr style="background:#ffffff">
        <td colspan="3" style="padding:12px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:700;color:#333;text-align:center">Total:</td>
        <td style="padding:12px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:700;color:#333;text-align:center">$${formatVal(payload.total)}</td>
      </tr>
      
      <!-- Amount Paid Row -->
      <tr style="background:#ffffff">
        <td colspan="3" style="padding:12px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:700;color:#333;text-align:center">Amount Paid:</td>
        <td style="padding:12px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:700;color:#333;text-align:center">${payload.amountPaid > 0 ? `$${formatVal(payload.amountPaid)}` : "0"}</td>
      </tr>
    </table>
  `;
}

// ─── EVT-0001: Admin – New User Registration ─────────────────────────────────
export function buildRegistrationAdminEmail(payload: { name: string; email: string }) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">New user has been registered on Get Reviews Buzz.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555;width:100px">Name :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:600;color:#333">${payload.name}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Email :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#333"><a href="mailto:${payload.email}" style="color:#1a6fe0">${payload.email}</a></td>
      </tr>
    </table>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/admin/users" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:5px;font-size:14px;font-weight:600">View</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: "New User Registration – Get Reviews Buzz",
    html: emailWrapper(content),
  };
}

// ─── EVT-0002: User – Email Verification ─────────────────────────────────────
export function buildWelcomeEmail(payload: { name: string; verifyUrl?: string }) {
  const verifyLink = payload.verifyUrl ?? `${SITE_URL}/dashboard`;
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hello!</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">Please click the button below to verify your email address and activate your account.</p>
    <p style="margin:20px 0">
      <a href="${verifyLink}" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">Verify Email Address</a>
    </p>
    <p style="margin:0 0 16px;font-size:13px;color:#888">If you did not create an account, no further action is required.</p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: "Verify your email – Get Reviews Buzz",
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
  paymentUrls?: { paypal: string; card: string; razorpay: string };
}) {
  const urls = payload.paymentUrls;
  const payButtons = urls
    ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr><td style="padding:12px 14px"><p style="font-size:15px;margin:0;line-height:28px;padding:5px 0;color:#000">To complete the payment, choose a payment method below.</p></td></tr>
      <tr>
        <td style="padding:8px 14px">
          <a href="${urls.paypal}" style="padding:14px 20px;background:#FFC439;border-radius:5px;display:inline-block;color:#003087;text-decoration:none;font-size:14px;font-weight:700">
            Pay with PayPal
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 14px">
          <a href="${urls.card}" style="padding:14px 20px;background:#1a1a1a;border-radius:5px;display:inline-block;color:#fff;text-decoration:none;font-size:14px;font-weight:600">
            💳 Pay with Debit / Credit Card
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 14px 14px">
          <a href="${urls.razorpay}" style="padding:14px 20px;background:#072654;border-radius:5px;display:inline-block;color:#fff;text-decoration:none;font-size:14px;font-weight:600">
            ⚡ Pay with Razorpay
          </a>
        </td>
      </tr>
    </table>`
    : payload.payUrl
    ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr><td style="padding:12px 14px"><p style="font-size:15px;margin:0;line-height:28px;padding:5px 0;color:#000">To complete the payment please click the button below.</p></td></tr>
      <tr>
        <td style="padding:12px 14px">
          <a href="${payload.payUrl}" style="padding:14px 20px;background:#000;border-radius:5px;display:inline-block;color:#fff;text-decoration:none;font-size:14px;font-weight:600">
            💳 Pay Now
          </a>
        </td>
      </tr>
    </table>`
    : "";

  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">There is an order in your account that is unpaid. Have you experienced any issues while making your payment? Not to worry!</p>
    <p style="margin:0 0 6px;font-size:14px;color:#444">Name : <strong>${payload.name}</strong></p>
    <p style="margin:0 0 18px;font-size:14px;color:#444">Email : <a href="mailto:${payload.email ?? ""}" style="color:#1a6fe0">${payload.email ?? ""}</a></p>
    ${buildUnifiedOrderTable({
      orderNumber: payload.orderNumber,
      items: payload.items,
      total: payload.total,
      amountPaid: 0
    })}
    ${payButtons}
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
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
    ${buildUnifiedOrderTable({
      orderNumber: payload.orderNumber,
      items: payload.items,
      total: payload.total,
      amountPaid: payload.total
    })}
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
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
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555;width:120px">Email :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#333"><a href="mailto:${payload.email}" style="color:#1a6fe0">${payload.email}</a></td>
      </tr>
      ${payload.orderNumber ? `<tr><td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Order # :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:600;color:#333">${payload.orderNumber}</td></tr>` : ""}
    </table>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
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
    <p style="margin:0 0 20px;font-size:15px;color:#333;line-height:1.5">Status of your order Order No. - ${payload.orderNumber} has been changed to ${s.label}.</p>
    ${payload.total !== undefined ? buildUnifiedOrderTable({
      orderNumber: payload.orderNumber,
      items: payload.items,
      total: payload.total,
      amountPaid: isPaid ? (payload.amountPaid ?? payload.total) : (payload.amountPaid ?? 0)
    }) : ""}
    <p style="margin:20px 0 4px;font-size:15px;color:#333">Best regards,</p>
    <p style="margin:0;font-size:15px;font-weight:bold;color:#000">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Status of your order Order No. - ${payload.orderNumber} has been changed to ${s.label}`,
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
  paymentUrls?: { paypal: string; card: string; razorpay: string };
}) {
  const urls = payload.paymentUrls;
  const payButtons = urls ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr><td style="padding:12px 14px"><p style="font-size:15px;margin:0;line-height:28px;padding:5px 0;color:#000">Choose a payment method to complete your order.</p></td></tr>
      <tr>
        <td style="padding:8px 14px">
          <a href="${urls.paypal}" style="padding:14px 20px;background:#FFC439;border-radius:5px;display:inline-block;color:#003087;text-decoration:none;font-size:14px;font-weight:700">
            Pay with PayPal
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 14px">
          <a href="${urls.card}" style="padding:14px 20px;background:#1a1a1a;border-radius:5px;display:inline-block;color:#fff;text-decoration:none;font-size:14px;font-weight:600">
            💳 Pay with Debit / Credit Card
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 14px 14px">
          <a href="${urls.razorpay}" style="padding:14px 20px;background:#072654;border-radius:5px;display:inline-block;color:#fff;text-decoration:none;font-size:14px;font-weight:600">
            ⚡ Pay with Razorpay
          </a>
        </td>
      </tr>
    </table>` : "";

  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">This order has been successfully generated and ready to pay.</p>
    <p style="margin:0 0 6px;font-size:14px;color:#444">Name : <strong>${payload.name}</strong></p>
    <p style="margin:0 0 18px;font-size:14px;color:#444">Email : <a href="mailto:${payload.email ?? ""}" style="color:#1a6fe0">${payload.email ?? ""}</a></p>
    ${buildUnifiedOrderTable({
      orderNumber: payload.orderNumber,
      items: payload.items,
      total: payload.total,
      amountPaid: 0
    })}
    ${payButtons}
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
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
    <p style="margin:0 0 20px;font-size:15px;color:#333">Thank you for submitting the ticket. Our team will soon come to you.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555;width:120px">Ticket # :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:600;font-family:monospace;color:#333">${payload.ticketNumber}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Subject :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#333">${payload.subject}</td>
      </tr>
    </table>
    <p style="margin:0 0 20px;font-size:14px;color:#555">You can view and track the status of your ticket from your dashboard.</p>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/dashboard/tickets" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">View My Tickets</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
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
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555;width:120px">Ticket # :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:600;font-family:monospace;color:#333">${payload.ticketNumber}</td>
      </tr>
      ${payload.subject ? `<tr><td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Subject :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#333">${payload.subject}</td></tr>` : ""}
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Status :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px"><span style="display:inline-block;padding:4px 14px;background:#fff3e8;color:#f97316;border-radius:20px;font-weight:700;font-size:13px;border:1px solid #fbd5b0">Hold</span></td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:#555">Our team is reviewing your ticket and may require additional information. We will be in touch soon.</p>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/dashboard/tickets" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">View My Tickets</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
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
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555;width:120px">Ticket # :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:600;font-family:monospace;color:#333">${payload.ticketNumber}</td>
      </tr>
      ${payload.subject ? `<tr><td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Subject :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#333">${payload.subject}</td></tr>` : ""}
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Status :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px"><span style="display:inline-block;padding:4px 14px;background:#ede9fe;color:#7c3aed;border-radius:20px;font-weight:700;font-size:13px;border:1px solid #c4b5fd">Escalated</span></td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:#555">A senior support agent will be handling your case and will respond to you shortly. We appreciate your patience.</p>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/dashboard/tickets" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">View My Tickets</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
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
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
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
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555;width:100px">Name :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:600;color:#333">${payload.name}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Email :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#333"><a href="mailto:${payload.email}" style="color:#1a6fe0">${payload.email}</a></td>
      </tr>
    </table>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/admin/orders/${payload.orderId}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:5px;font-size:14px;font-weight:600">View Order Details →</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
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
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
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
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;margin:16px 0;background:#ffffff">
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555;width:120px">Ticket # :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;font-weight:600;font-family:monospace;color:#333">${payload.ticketNumber}</td>
      </tr>
      ${payload.subject ? `<tr><td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Subject :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#333">${payload.subject}</td></tr>` : ""}
      <tr>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px;color:#555">Status :</td>
        <td style="padding:10px 14px;border:1px solid #e0e0e0;font-size:14px"><span style="display:inline-block;padding:4px 14px;background:#f3f4f6;color:#6b7280;border-radius:20px;font-weight:700;font-size:13px;border:1px solid #d1d5db">Closed</span></td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:#555">We hope your issue has been resolved. If you need further assistance, feel free to open a new ticket at any time.</p>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/dashboard/support" style="display:inline-block;padding:12px 24px;background:#FFCE2E;color:#000;text-decoration:none;border-radius:5px;font-size:14px;font-weight:700">Open New Ticket</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Ticket ${payload.ticketNumber} has been Closed`,
    html: emailWrapper(content),
  };
}

// ─── Password Reset ───────────────────────────────────────────────────────────
export function buildPasswordResetEmail(payload: { name: string; resetUrl: string }) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hi <strong>${payload.name}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">We received a request to reset your password. Click the button below to set a new password.</p>
    <p style="margin:20px 0">
      <a href="${payload.resetUrl}" style="display:inline-block;padding:12px 28px;background:#000;color:#fff;text-decoration:none;border-radius:5px;font-size:14px;font-weight:600">Reset Password →</a>
    </p>
    <p style="margin:0 0 16px;font-size:13px;color:#888">This link expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.</p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: "Reset your password – Get Reviews Buzz",
    html: emailWrapper(content),
  };
}

export function buildTicketReplyEmail(payload: {
  name?: string | null;
  ticketNumber: string;
  message: string;
}) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hello <strong>${payload.name ?? "Customer"}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">A reply has been added to ticket <strong>#${payload.ticketNumber}</strong>:</p>
    <div style="background:#ffffff;border:1px solid #e0e0e0;padding:16px;margin:16px 0;border-radius:4px">
      <p style="color:#333;margin:0;white-space:pre-wrap;font-size:14px">${payload.message}</p>
    </div>
    <p style="margin:20px 0">
      <a href="${SITE_URL}/dashboard/tickets" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:5px;font-size:14px;font-weight:600">Log In to Support Area →</a>
    </p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Update on ticket ${payload.ticketNumber}`,
    text: `Hello ${payload.name ?? "Customer"},\n\nA reply has been added to ticket ${payload.ticketNumber}:\n\n${payload.message}\n\nLog in to your support area to continue the conversation.`,
    html: emailWrapper(content),
  };
}

export function buildOtpEmail(payload: { code: string }) {
  const content = `
    <p style="margin:0 0 14px;font-size:15px;color:#333">Hello!</p>
    <p style="margin:0 0 20px;font-size:15px;color:#333">Verify your email to complete your registration. Use the code below inside the app. It will expire in 10 minutes.</p>
    <div style="background:#ffffff;border:1px solid #e0e0e0;border-radius:6px;padding:24px;text-align:center;letter-spacing:8px;font-size:32px;font-weight:700;color:#111;margin:20px auto;max-width:240px">${payload.code}</div>
    <p style="margin:20px 0 4px;font-size:13px;color:#999">If you did not request this code, you can safely ignore this email.</p>
    <p style="margin:20px 0 4px;font-size:14px;color:#444">Best regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: "Verify your email – Get Reviews Buzz",
    html: emailWrapper(content),
  };
}

export { ADMIN_EMAIL };
