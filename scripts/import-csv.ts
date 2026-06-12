import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs";

// Initialize Prisma
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DIRECT_URL or DATABASE_URL environment variable must be set.");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// CSV Parser handling quotes and multi-line fields (memory optimized)
function parseCsvFile(filePath: string): string[][] {
  const content = fs.readFileSync(filePath, "utf-8");
  const len = content.length;
  const rows: string[][] = [];
  let fields: string[] = [];
  let inQuotes = false;
  let fieldStart = 0;
  let fieldHasQuotes = false;

  for (let i = 0; i < len; i++) {
    const char = content[i];

    if (char === '"') {
      if (inQuotes && content[i + 1] === '"') {
        fieldHasQuotes = true;
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      let fieldVal = content.substring(fieldStart, i);
      if (fieldVal.startsWith('"') && fieldVal.endsWith('"')) {
        fieldVal = fieldVal.substring(1, fieldVal.length - 1);
      }
      if (fieldHasQuotes) {
        fieldVal = fieldVal.replace(/""/g, '"');
      }
      fields.push(fieldVal);
      fieldStart = i + 1;
      fieldHasQuotes = false;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      let fieldVal = content.substring(fieldStart, i);
      if (fieldVal.startsWith('"') && fieldVal.endsWith('"')) {
        fieldVal = fieldVal.substring(1, fieldVal.length - 1);
      }
      if (fieldHasQuotes) {
        fieldVal = fieldVal.replace(/""/g, '"');
      }
      fields.push(fieldVal);
      
      rows.push(fields);
      fields = [];
      
      if (char === '\r' && content[i + 1] === '\n') {
        i++;
      }
      fieldStart = i + 1;
      fieldHasQuotes = false;
    }
  }

  if (fieldStart < len) {
    let fieldVal = content.substring(fieldStart);
    if (fieldVal.startsWith('"') && fieldVal.endsWith('"')) {
      fieldVal = fieldVal.substring(1, fieldVal.length - 1);
    }
    if (fieldHasQuotes) {
      fieldVal = fieldVal.replace(/""/g, '"');
    }
    fields.push(fieldVal);
    rows.push(fields);
  }

  return rows;
}

// Helpers
function parseDate(str: string | null | undefined): Date {
  if (!str || str === "NULL" || str.startsWith("0000-00-00")) {
    return new Date();
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
}

function parseOptionalDate(str: string | null | undefined): Date | null {
  if (!str || str === "NULL" || str.startsWith("0000-00-00") || str.trim() === "") {
    return null;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function cleanString(str: string | null | undefined): string | null {
  if (str === undefined || str === null) return null;
  const trimmed = str.trim();
  if (trimmed === "" || trimmed.toUpperCase() === "NULL") return null;
  return trimmed;
}

function parseRole(roleStr: string | null | undefined): string {
  const r = cleanString(roleStr);
  if (!r) return "USER";
  switch (r) {
    case "1": return "USER";
    case "2": return "ADMIN";
    case "6": return "MANAGER";
    case "7": return "SEO";
    case "8": return "DEVELOPER";
    case "12": return "TESTER";
    case "13": return "TESTER";
    default: return "USER";
  }
}

function parseStatus(statusStr: string | null | undefined): string {
  const s = cleanString(statusStr);
  if (!s) return "passive";
  return ["1", "active"].includes(s.toLowerCase()) ? "active" : "passive";
}

async function main() {
  console.log("🚀 Starting database clear & bulk CSV import...");

  // 1. Truncate existing tables in dependency order
  console.log("🧹 Clearing existing database tables...");
  await prisma.ticketThread.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.orderDetail.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✅ Database tables cleared successfully!");

  // 2. Import Users
  console.log("\n👤 Parsing users CSV...");
  const userRows = parseCsvFile("c:\\Users\\mohit.kumar\\Downloads\\users (1).csv");
  const userHeaders = userRows[0];
  console.log(`Parsed ${userRows.length - 1} rows from users CSV.`);
  
  const usersToInsert = [];
  const seenUserEmails = new Set<string>();
  const seenUserIds = new Set<number>();

  for (let i = 1; i < userRows.length; i++) {
    const r = userRows[i];
    if (r.length < userHeaders.length) continue;
    
    const id = parseInt(r[userHeaders.indexOf("id")]);
    const name = cleanString(r[userHeaders.indexOf("name")]) || 
                 cleanString(r[userHeaders.indexOf("first_name")] + " " + r[userHeaders.indexOf("last_name")]);
    const email = cleanString(r[userHeaders.indexOf("email")])?.toLowerCase();
    const password = cleanString(r[userHeaders.indexOf("password")]);
    const phone = cleanString(r[userHeaders.indexOf("phone")]);
    const role = parseRole(r[userHeaders.indexOf("role")]);
    const status = parseStatus(r[userHeaders.indexOf("status")]);
    const createdAt = parseDate(r[userHeaders.indexOf("created_at")]);
    const updatedAt = parseDate(r[userHeaders.indexOf("updated_at")]);
    
    if (!email || isNaN(id)) {
      continue;
    }

    if (seenUserEmails.has(email) || seenUserIds.has(id)) {
      continue;
    }
    seenUserEmails.add(email);
    seenUserIds.add(id);
    
    usersToInsert.push({
      id,
      name,
      email,
      password,
      phone,
      role: role as any,
      status,
      createdAt,
      updatedAt
    });
  }

  console.log(`Inserting ${usersToInsert.length} unique users into the database...`);
  for (let j = 0; j < usersToInsert.length; j += 1000) {
    const chunk = usersToInsert.slice(j, j + 1000);
    await prisma.user.createMany({ data: chunk });
  }
  console.log("✅ Users successfully imported!");

  // 3. Import Orders
  console.log("\n📦 Parsing orders CSV...");
  const orderRows = parseCsvFile("c:\\Users\\mohit.kumar\\Downloads\\orders (1).csv");
  const orderHeaders = orderRows[0];
  console.log(`Parsed ${orderRows.length - 1} rows from orders CSV.`);

  const ordersToInsert = [];
  const seenOrderIds = new Set<number>();

  for (let i = 1; i < orderRows.length; i++) {
    const r = orderRows[i];
    if (r.length < orderHeaders.length) continue;
    
    const id = parseInt(r[orderHeaders.indexOf("id")]);
    const isOrderApi = parseInt(r[orderHeaders.indexOf("is_order_api")]) || 1;
    const orderNumber = cleanString(r[orderHeaders.indexOf("order_number")]);
    const userIdStr = cleanString(r[orderHeaders.indexOf("user_id")]);
    const userId = userIdStr ? parseInt(userIdStr) : null;
    const paymentId = cleanString(r[orderHeaders.indexOf("payment_id")]);
    const subscriptionId = cleanString(r[orderHeaders.indexOf("subscription_id")]);
    const rzpaySubscriptionId = cleanString(r[orderHeaders.indexOf("rzpay_subscription_id")]);
    const itemName = cleanString(r[orderHeaders.indexOf("item_name")]);
    const itemId = cleanString(r[orderHeaders.indexOf("item_id")]);
    const isRecurringStr = cleanString(r[orderHeaders.indexOf("is_recurring")]);
    const isRecurring = isRecurringStr ? parseInt(isRecurringStr) : null;
    const zohoInvoiceId = cleanString(r[orderHeaders.indexOf("zoho_invoice_id")]);
    const zohoRecurringInvoiceId = cleanString(r[orderHeaders.indexOf("zoho_recurring_invoice_id")]);
    const firstName = cleanString(r[orderHeaders.indexOf("first_name")]);
    const lastName = cleanString(r[orderHeaders.indexOf("last_name")]);
    const currency = cleanString(r[orderHeaders.indexOf("currency")]);
    const symbol = cleanString(r[orderHeaders.indexOf("symbol")]);
    const amountStr = cleanString(r[orderHeaders.indexOf("amount")]);
    const amount = amountStr ? parseFloat(amountStr) : null;
    const bitcoinAmount = cleanString(r[orderHeaders.indexOf("bitcoin_amount")]);
    const bitcoinsReceived = cleanString(r[orderHeaders.indexOf("bitcoins_received")]);
    const couponId = cleanString(r[orderHeaders.indexOf("coupon_id")]);
    const coupon = cleanString(r[orderHeaders.indexOf("coupon")]);
    const couponDiscountStr = cleanString(r[orderHeaders.indexOf("coupon_discount")]);
    const couponDiscount = couponDiscountStr ? parseInt(couponDiscountStr) : null;
    const email = cleanString(r[orderHeaders.indexOf("email")]);
    const billingCountry = cleanString(r[orderHeaders.indexOf("billing_country")]);
    const billingStateCode = cleanString(r[orderHeaders.indexOf("billing_state_code")]);
    const billingCity = cleanString(r[orderHeaders.indexOf("billing_city")]);
    const billingStreet = cleanString(r[orderHeaders.indexOf("billing_street")]);
    const billingZip = cleanString(r[orderHeaders.indexOf("billing_zip")]);
    const shippingStateCode = cleanString(r[orderHeaders.indexOf("shipping_state_code")]);
    const shippingCountry = cleanString(r[orderHeaders.indexOf("shipping_country")]);
    const shippingCity = cleanString(r[orderHeaders.indexOf("shipping_city")]);
    const shippingStreet = cleanString(r[orderHeaders.indexOf("shipping_street")]);
    const shippingZip = cleanString(r[orderHeaders.indexOf("shipping_zip")]);
    const payUrl = cleanString(r[orderHeaders.indexOf("pay_url")]);
    const subscriptionUrl = cleanString(r[orderHeaders.indexOf("subscription_url")]);
    const sessionData = cleanString(r[orderHeaders.indexOf("session_data")]);
    const status = cleanString(r[orderHeaders.indexOf("status")]) || "1";
    const detailsFilled = r[orderHeaders.indexOf("details_filled")] === "1" || r[orderHeaders.indexOf("details_filled")] === "true";
    const detailsFilledAt = parseOptionalDate(r[orderHeaders.indexOf("details_filled_at")]);
    const reminderEmailSent = r[orderHeaders.indexOf("reminder_email_sent")] === "1" || r[orderHeaders.indexOf("reminder_email_sent")] === "true";
    const bitcoinAddress = cleanString(r[orderHeaders.indexOf("bitcoin_address")]);
    const binancePrepayId = cleanString(r[orderHeaders.indexOf("binance_prepayId")]);
    const expiryStr = cleanString(r[orderHeaders.indexOf("expiry")]);
    const expiry = expiryStr ? parseFloat(expiryStr) : null;
    const paymentStatus = cleanString(r[orderHeaders.indexOf("payment_status")]) || "1";
    const paymentMethod = cleanString(r[orderHeaders.indexOf("payment_method")]) || "1";
    const workStatusStr = cleanString(r[orderHeaders.indexOf("work_status")]);
    const workStatus = workStatusStr ? parseInt(workStatusStr) : null;
    const assignedUserId = cleanString(r[orderHeaders.indexOf("assigned_user_id")]);
    const duedate = parseOptionalDate(r[orderHeaders.indexOf("duedate")]);
    const paymentDate = parseOptionalDate(r[orderHeaders.indexOf("payment_date")]);
    const stripeSessionId = cleanString(r[orderHeaders.indexOf("stripe_session_id")]);
    const createdAt = parseDate(r[orderHeaders.indexOf("created_at")]);
    const updatedAt = parseDate(r[orderHeaders.indexOf("updated_at")]);
    const completedOn = parseOptionalDate(r[orderHeaders.indexOf("completed_on")]);
    const deletedAt = parseOptionalDate(r[orderHeaders.indexOf("deleted_at")]);
    const assignedDate = parseOptionalDate(r[orderHeaders.indexOf("assigned_date")]);
    const purchaseType = cleanString(r[orderHeaders.indexOf("purchase_type")]);
    const isRenewal = r[orderHeaders.indexOf("is_renewal")] === "1" || r[orderHeaders.indexOf("is_renewal")] === "true";
    const isAutoEntry = r[orderHeaders.indexOf("is_auto_entry")] === "1" || r[orderHeaders.indexOf("is_auto_entry")] === "true";
    const parentOrderIdStr = cleanString(r[orderHeaders.indexOf("parent_order_id")]);
    const parentOrderId = parentOrderIdStr ? parseInt(parentOrderIdStr) : null;
    const paidCountStr = cleanString(r[orderHeaders.indexOf("paid_count")]);
    const paidCount = paidCountStr ? parseInt(paidCountStr) : null;
    
    if (isNaN(id)) {
      continue;
    }
    if (seenOrderIds.has(id)) {
      continue;
    }
    seenOrderIds.add(id);
    
    ordersToInsert.push({
      id,
      isOrderApi,
      orderNumber,
      userId: (userId && !isNaN(userId)) ? userId : null,
      paymentId,
      subscriptionId,
      rzpaySubscriptionId,
      itemName,
      itemId,
      isRecurring,
      zohoInvoiceId,
      zohoRecurringInvoiceId,
      firstName,
      lastName,
      currency,
      symbol,
      amount,
      bitcoinAmount,
      bitcoinsReceived,
      couponId,
      coupon,
      couponDiscount,
      email,
      billingCountry,
      billingStateCode,
      billingCity,
      billingStreet,
      billingZip,
      shippingStateCode,
      shippingCountry,
      shippingCity,
      shippingStreet,
      shippingZip,
      payUrl,
      subscriptionUrl,
      sessionData,
      status,
      detailsFilled,
      detailsFilledAt,
      reminderEmailSent,
      bitcoinAddress,
      binancePrepayId,
      expiry,
      paymentStatus,
      paymentMethod,
      workStatus,
      assignedUserId,
      duedate,
      paymentDate,
      stripeSessionId,
      createdAt,
      updatedAt,
      completedOn,
      deletedAt,
      assignedDate,
      purchaseType,
      isRenewal,
      isAutoEntry,
      parentOrderId,
      paidCount
    });
  }

  console.log(`Inserting ${ordersToInsert.length} unique orders into the database...`);
  for (let j = 0; j < ordersToInsert.length; j += 1000) {
    const chunk = ordersToInsert.slice(j, j + 1000);
    await prisma.order.createMany({ data: chunk });
  }
  console.log("✅ Orders successfully imported!");

  // 4. Import OrderDetails
  console.log("\n📝 Parsing order details CSV...");
  const detailRows = parseCsvFile("c:\\Users\\mohit.kumar\\Downloads\\order_details (1).csv");
  const detailHeaders = detailRows[0];
  console.log(`Parsed ${detailRows.length - 1} rows from order details CSV.`);

  const detailsToInsert = [];
  const seenDetailIds = new Set<number>();

  for (let i = 1; i < detailRows.length; i++) {
    const r = detailRows[i];
    if (r.length < detailHeaders.length) continue;
    
    const id = parseInt(r[detailHeaders.indexOf("id")]);
    const orderId = parseInt(r[detailHeaders.indexOf("order_id")]);
    const itemName = cleanString(r[detailHeaders.indexOf("item_name")]);
    const bannerTitle = cleanString(r[detailHeaders.indexOf("banner_title")]);
    const itemId = cleanString(r[detailHeaders.indexOf("item_id")]);
    const amountStr = cleanString(r[detailHeaders.indexOf("amount")]);
    const amount = amountStr ? parseFloat(amountStr) : null;
    const quantityStr = cleanString(r[detailHeaders.indexOf("quantity")]);
    const quantity = quantityStr ? parseInt(quantityStr) : null;
    const reviewData = cleanString(r[detailHeaders.indexOf("review_data")]);
    const createdAt = parseDate(r[detailHeaders.indexOf("created_at")]);
    const updatedAt = parseDate(r[detailHeaders.indexOf("updated_at")]);
    const deletedAt = parseOptionalDate(r[detailHeaders.indexOf("deleted_at")]);
    const productType = cleanString(r[detailHeaders.indexOf("product_type")]);
    
    if (isNaN(id) || isNaN(orderId)) {
      continue;
    }
    if (seenDetailIds.has(id)) {
      continue;
    }
    seenDetailIds.add(id);
    
    detailsToInsert.push({
      id,
      orderId,
      itemName,
      bannerTitle,
      itemId,
      amount,
      quantity,
      reviewData,
      createdAt,
      updatedAt,
      deletedAt,
      productType
    });
  }

  console.log(`Inserting ${detailsToInsert.length} unique order details into the database...`);
  for (let j = 0; j < detailsToInsert.length; j += 1000) {
    const chunk = detailsToInsert.slice(j, j + 1000);
    await prisma.orderDetail.createMany({ data: chunk });
  }
  console.log("✅ Order details successfully imported!");

  console.log("\n📊 Verification Statistics:");
  const finalUserCount = await prisma.user.count();
  const finalOrderCount = await prisma.order.count();
  const finalDetailCount = await prisma.orderDetail.count();
  
  console.log(`- Final Users in DB: ${finalUserCount} (CSV unique: ${usersToInsert.length})`);
  console.log(`- Final Orders in DB: ${finalOrderCount} (CSV unique: ${ordersToInsert.length})`);
  console.log(`- Final Order Details in DB: ${finalDetailCount} (CSV unique: ${detailsToInsert.length})`);
  
  console.log("\n⭐ Bulk CSV import completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Fatal error during import:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
