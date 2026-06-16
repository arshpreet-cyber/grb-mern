// Zoho data center (.com / .in / .eu ...). Defaults to .com to match the account.
const ZOHO_DC = process.env.ZOHO_DC || "com";
const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL ?? `https://accounts.zoho.${ZOHO_DC}`;
const ZOHO_API_BASE = process.env.ZOHO_API_BASE_URL ?? `https://books.zoho.${ZOHO_DC}/api/v3`;
// Zoho Books has its own organization id, separate from Zoho Desk's org id.
const ZOHO_ORG_ID = () => process.env.ZOHO_BOOKS_ORG_ID ?? process.env.ZOHO_ORG_ID ?? "";

async function parseJson(res: Response, label: string): Promise<any> {
  const text = await res.text();
  if (!text) throw new Error(`${label}: empty response (HTTP ${res.status})`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label}: invalid JSON — ${text.slice(0, 200)}`);
  }
}

async function getAccessToken(): Promise<string> {
  const res = await fetch(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    }),
  });
  const data = await parseJson(res, "Zoho token");
  if (!data.access_token) {
    throw new Error(`Zoho token error: ${data.error ?? JSON.stringify(data)}`);
  }
  return data.access_token;
}

function authHeader(token: string) {
  return { Authorization: `Zoho-oauthtoken ${token}`, "Content-Type": "application/json" };
}

function orgUrl(path: string) {
  return `${ZOHO_API_BASE}${path}?organization_id=${ZOHO_ORG_ID()}`;
}

// Always create a fresh contact per order so each invoice has zero prior balance.
// Reusing a contact causes Zoho to aggregate all outstanding invoices and show
// a combined balance, which confuses the customer on the payment page.
async function createOrderContact(
  token: string,
  email: string,
  name: string
): Promise<string> {
  const createRes = await fetch(orgUrl("/contacts"), {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({
      contact_name: name || email,
      email,
    }),
  });
  const createData = await parseJson(createRes, "Zoho create contact");
  if (!createData.contact?.contact_id) {
    throw new Error(`Zoho create contact failed: ${JSON.stringify(createData)}`);
  }
  return createData.contact.contact_id;
}

// Replace "Reviews" with "Reputation Management" for invoice display
function invoiceItemName(platform: string): string {
  return platform.replace(/Reviews?/i, "Reputation Management").trim();
}

// Look up the Zoho invoice for an order (matched on reference_number =
// orderNumber) and return its PDF bytes, or null if there is no invoice.
export async function getZohoInvoicePdf(orderNumber: string): Promise<ArrayBuffer | null> {
  if (!process.env.ZOHO_REFRESH_TOKEN || !ZOHO_ORG_ID()) return null;

  const token = await getAccessToken();
  const listUrl = `${ZOHO_API_BASE}/invoices?organization_id=${ZOHO_ORG_ID()}&reference_number=${encodeURIComponent(orderNumber)}`;
  const listRes = await fetch(listUrl, { headers: authHeader(token) });
  const listData = await parseJson(listRes, "Zoho list invoices");

  const invoiceId = listData.invoices?.[0]?.invoice_id;
  if (!invoiceId) return null;

  const pdfUrl = `${ZOHO_API_BASE}/invoices/${invoiceId}?organization_id=${ZOHO_ORG_ID()}&accept=pdf`;
  const pdfRes = await fetch(pdfUrl, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  if (!pdfRes.ok) return null;
  return await pdfRes.arrayBuffer();
}

export async function createZohoInvoice(params: {
  email: string;
  name: string;
  orderNumber: string;
  items: Array<{ platform: string; pricePerUnit: number; qty: number; type: string }>;
  returnPaymentUrl?: boolean;
}): Promise<string | void> {
  const token = await getAccessToken();
  const contactId = await createOrderContact(token, params.email, params.name);

  const lineItems = params.items.map((item) => ({
    name: invoiceItemName(item.platform),
    description: item.type === "subscribe" ? "Monthly Subscription" : "One-time purchase",
    rate: item.pricePerUnit,
    quantity: item.qty,
  }));

  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 5);
  const ymd = (d: Date) => d.toISOString().slice(0, 10);

  const res = await fetch(orgUrl("/invoices"), {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({
      customer_id: contactId,
      reference_number: params.orderNumber,
      date: ymd(today),
      due_date: ymd(due),
      payment_terms: 5,
      payment_terms_label: "Due in 5 days",
      line_items: lineItems,
      payment_options: {
        payment_gateways: [
          {
            configured: true,
            additional_field1: "standard",
            gateway_name: "paypal",
          },
        ],
      },
    }),
  });
  const data = await parseJson(res, "Zoho create invoice");
  const invoiceId = data.invoice?.invoice_id;
  if (!invoiceId) {
    throw new Error(`Zoho create invoice failed: ${JSON.stringify(data)}`);
  }

  // Always move the invoice out of Draft so it shows as "Due" (and the payment
  // link is active). Best-effort — don't fail invoice creation if this hiccups.
  try {
    const sentRes = await fetch(orgUrl(`/invoices/${invoiceId}/status/sent`), {
      method: "POST",
      headers: authHeader(token),
    });
    await parseJson(sentRes, "Zoho mark invoice sent");
  } catch (e) {
    console.error("[Zoho Invoice] mark sent failed:", (e as Error).message);
  }

  if (params.returnPaymentUrl) {
    // Fetch full invoice to get all payment URL fields
    const fullRes = await fetch(orgUrl(`/invoices/${invoiceId}`), {
      headers: authHeader(token),
    });
    const fullData = await parseJson(fullRes, "Zoho get invoice");
    const inv = fullData.invoice;

    // Prefer the most direct payment URL; fall back to invoice_url
    const payUrl =
      inv?.payment_options?.payment_url ||
      inv?.online_payment_url ||
      inv?.invoice_url ||
      data.invoice?.invoice_url;

    if (!payUrl) throw new Error("Zoho did not return a payment URL for this invoice.");
    return payUrl as string;
  }
}

// Record a payment against the order's invoice so Zoho Books shows it as Paid.
// Matched on reference_number = orderNumber. No-op if not found or already paid.
export async function markZohoInvoicePaid(params: {
  orderNumber: string;
  amount?: number;
  paymentId?: string;
}): Promise<void> {
  if (!process.env.ZOHO_REFRESH_TOKEN || !ZOHO_ORG_ID()) return;

  const token = await getAccessToken();
  const listUrl = `${ZOHO_API_BASE}/invoices?organization_id=${ZOHO_ORG_ID()}&reference_number=${encodeURIComponent(params.orderNumber)}`;
  const listData = await parseJson(await fetch(listUrl, { headers: authHeader(token) }), "Zoho list invoices");

  const inv = listData.invoices?.[0];
  if (!inv) {
    console.error(`[Zoho Invoice] No invoice found for order ${params.orderNumber} to mark paid.`);
    return;
  }
  if (inv.status === "paid") return;

  const amount = params.amount ?? inv.balance ?? inv.total;
  if (!amount || amount <= 0) return;

  const payRes = await fetch(orgUrl("/customerpayments"), {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({
      customer_id: inv.customer_id,
      payment_mode: "banktransfer",
      amount,
      date: new Date().toISOString().slice(0, 10),
      reference_number: params.paymentId ?? params.orderNumber,
      invoices: [{ invoice_id: inv.invoice_id, amount_applied: amount }],
    }),
  });
  const payData = await parseJson(payRes, "Zoho record payment");
  if (payData.code !== 0 && !payData.payment) {
    throw new Error(`Zoho record payment failed: ${JSON.stringify(payData).slice(0, 200)}`);
  }
}
