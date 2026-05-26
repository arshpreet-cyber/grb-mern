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

function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdfdfd;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fdfdfd;padding:20px 0">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#ffffff;border:1px solid #dcdcdc;overflow:hidden">
      
      <tr>
        <td align="center" style="padding:22px 20px;background:#ebebeb;border-bottom:1px solid #dcdcdc">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <div style="font-size:16px;color:#f5a623;line-height:1;margin-bottom:2px">★ ★ ★ ★</div>
                <div style="font-size:24px;font-weight:bold;color:#333333;font-style:italic;font-family:'Georgia',serif">
                  Get <span style="color:#222222;font-style:normal;font-weight:900">Reviews</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr><td style="padding:30px 25px;background:#ffffff">${content}</td></tr>
      
      <tr>
        <td style="padding:0 25px 35px;background:#ffffff;text-align:center;font-family:Arial,sans-serif">
          <p style="margin:0 0 8px;font-size:10px;color:#888888;letter-spacing:0.5px">
            <a href="#" style="color:#888888;text-decoration:none">PRIVACY STATEMENT</a> | 
            <a href="#" style="color:#888888;text-decoration:none">TERMS OF SERVICE</a> | 
            <a href="#" style="color:#888888;text-decoration:none">ABOUT</a>
          </p>
          <p style="margin:0 0 16px;font-size:10px;color:#aaaaaa;letter-spacing:0.2px">©2026 GET REVIEWS BUZZ. ALL RIGHTS RESERVED.</p>
          
          <table cellpadding="0" cellspacing="0" align="center"><tr>
            <td style="padding:0 4px"><a href="https://facebook.com" style="display:inline-block;width:24px;height:24px;background:#1877f2;border-radius:50%;text-align:center;line-height:24px;color:#ffffff;text-decoration:none;font-size:12px;font-weight:bold">f</a></td>
            <td style="padding:0 4px"><a href="https://twitter.com" style="display:inline-block;width:24px;height:24px;background:#000000;border-radius:50%;text-align:center;line-height:24px;color:#ffffff;text-decoration:none;font-size:11px;font-weight:bold">𝕏</a></td>
            <td style="padding:0 4px"><a href="https://instagram.com" style="display:inline-block;width:24px;height:24px;background:#e4405f;border-radius:50%;text-align:center;line-height:24px;color:#ffffff;text-decoration:none;font-size:11px;font-weight:bold">📸</a></td>
            <td style="padding:0 4px"><a href="https://wa.me" style="display:inline-block;width:24px;height:24px;background:#25d366;border-radius:50%;text-align:center;line-height:24px;color:#ffffff;text-decoration:none;font-size:12px">💬</a></td>
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
      <td style="padding:12px 14px;border-bottom:1px solid #e8e8e8;font-size:14px;color:#333">${i.platform} Reviews</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e8e8e8;text-align:center;font-size:14px;color:#333">${i.qty}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e8e8e8;text-align:center;font-size:14px;color:#333">$${i.pricePerUnit}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e8e8e8;text-align:right;font-size:14px;color:#333">$${i.pricePerUnit * i.qty}</td>
    </tr>`).join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dcdcdc;margin:16px 0">
    <thead>
      <tr style="background:#ffffff">
        <th style="padding:12px 14px;text-align:left;font-size:13px;color:#333;font-weight:600;border-bottom:1px solid #dcdcdc">Product Name</th>
        <th style="padding:12px 14px;text-align:center;font-size:13px;color:#333;font-weight:600;border-bottom:1px solid #dcdcdc">Quantity</th>
        <th style="padding:12px 14px;text-align:center;font-size:13px;color:#333;font-weight:600;border-bottom:1px solid #dcdcdc">Amount Per Item</th>
        <th style="padding:12px 14px;text-align:right;font-size:13px;color:#333;font-weight:600;border-bottom:1px solid #dcdcdc">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function paymentDetails(total: number, amountPaid: number) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dcdcdc;margin:16px 0">
    <thead>
      <tr><th colspan="2" style="padding:12px 14px;text-align:center;font-size:16px;color:#1a6fe0;font-weight:700;border-bottom:1px solid #dcdcdc;background:#ffffff">Payment Details</th></tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#333;border-bottom:1px solid #e8e8e8">Total:</td>
        <td style="padding:10px 14px;font-size:14px;text-align:right;font-weight:500;border-bottom:1px solid #e8e8e8">$${total}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:#333">Amount Paid :</td>
        <td style="padding:10px 14px;font-size:14px;text-align:right;font-weight:500">${amountPaid > 0 ? `$${amountPaid}` : "0"}</td>
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
    <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#222">There is an order in your account that is unpaid. Have you experienced any issues while making your payment? Not to worry!</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dcdcdc;margin-bottom:16px">
      <tr><td style="padding:12px 14px;text-align:center;font-size:14px;font-weight:600;color:#222;background:#ffffff">Order No. - ${payload.orderNumber}</td></tr>
    </table>
    ${orderTable(payload.items)}
    ${paymentDetails(payload.total, 0)}
    <p style="margin:24px 0 4px;font-size:14px;color:#222">Best Regards,</p>
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
  items?: Array<{ platform: string; qty: number; pricePerUnit: number }>;
  total: number;
}) {
  const content = `
    <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#222">New order has been placed successfully.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dcdcdc;margin-bottom:16px">
      <tr><td style="padding:12px 14px;text-align:center;font-size:14px;font-weight:600;color:#222;background:#ffffff">Order No. - ${payload.orderNumber}</td></tr>
    </table>
    ${payload.items ? orderTable(payload.items) : ""}
    ${paymentDetails(payload.total, payload.total)}
    <p style="margin:24px 0 4px;font-size:14px;color:#222">Best Regards,</p>
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
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dcdcdc;margin:16px 0">
      <tr><td style="padding:14px 14px 6px;text-align:center"><p style="font-size:15px;margin:0;font-weight:600;color:#222">To complete the payment please click on desired payment method.</p></td></tr>
      <tr>
        <td style="padding:14px;text-align:center">
          <a href="${payload.payUrl}" style="display:inline-block;padding:12px 28px;background:#f2f2f2;border:1px solid #ccc;color:#003087;text-decoration:none;font-size:15px;font-weight:bold;border-radius:4px;margin-right:10px">PayPal</a>
          <a href="${payload.payUrl}" style="display:inline-block;padding:12px 28px;background:#f2f2f2;border:1px solid #ccc;color:#222;text-decoration:none;font-size:14px;font-weight:bold;border-radius:4px">Credit / Debit Card</a>
        </td>
      </tr>
    </table>`
    : "";

  const content = `
    <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#222">There is an order in your account that is unpaid. Have you experienced any issues while making your payment? Not to worry!</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dcdcdc;margin-bottom:16px">
      <tr><td style="padding:12px 14px;text-align:center;font-size:14px;font-weight:600;color:#222;background:#ffffff">Order No. - ${payload.orderNumber}</td></tr>
    </table>
    ${orderTable(payload.items)}
    ${paymentDetails(payload.total, 0)}
    ${payButtons}
    <p style="margin:24px 0 4px;font-size:14px;color:#222">Best Regards,</p>
    <p style="margin:0;font-size:14px;font-weight:bold;color:#222">Team Get Reviews Buzz</p>
  `;
  return {
    subject: `Your order #${payload.orderNumber} is unpaid — complete your payment`,
    html: emailWrapper(content),
  };
}

const STATUS_LABELS: Record<string, { label: string; color: string; message: string }> = {
  "1": { label: "Pending",     color: "#f59e0b", message: "Your order has been received and is pending review." },
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
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dcdcdc;margin-bottom:20px">
      <tr><td style="padding:12px 14px;text-align:center;font-size:14px;font-weight:600;color:#222;background:#ffffff">Order No. - ${payload.orderNumber}</td></tr>
      <tr>
        <td style="padding:16px 14px;text-align:center">
          <span style="display:inline-block;padding:8px 24px;background:${s.color};color:#fff;border-radius:20px;font-size:15px;font-weight:700;letter-spacing:0.5px">${s.label}</span>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 4px;font-size:14px;color:#444">If you have any questions, feel free to reply to this email or contact our support team.</p>
    <p style="margin:24px 0 4px;font-size:14px;color:#222">Best Regards,</p>
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