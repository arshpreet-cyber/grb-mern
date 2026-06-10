import 'dotenv/config';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new Pool({ connectionString: databaseUrl });

// State-machine CSV parser handling newlines in quotes, escaped quotes ("")
function parseCSV(content: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          field += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field);
        field = '';
      } else if (char === '\n' || char === '\r') {
        row.push(field);
        field = '';
        if (row.length > 0 && !(row.length === 1 && row[0] === '')) {
          result.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
      } else {
        field += char;
      }
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    result.push(row);
  }
  return result;
}

// Data conversion helpers
function parseDate(val: string | null | undefined): Date | null {
  if (!val || val.toUpperCase() === 'NULL' || val === '0000-00-00 00:00:00' || val.trim() === '') {
    return null;
  }
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date;
}

function parseFloatVal(val: string | null | undefined): number | null {
  if (!val || val.toUpperCase() === 'NULL' || val.trim() === '') return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}

function parseIntVal(val: string | null | undefined): number | null {
  if (!val || val.toUpperCase() === 'NULL' || val.trim() === '') return null;
  const num = parseInt(val, 10);
  return isNaN(num) ? null : num;
}

function parseBoolVal(val: string | null | undefined): boolean {
  if (!val || val.toUpperCase() === 'NULL' || val.trim() === '') return false;
  return val === '1' || val.toLowerCase() === 'true' || val === '1.0';
}

function parseRole(val: string | null | undefined): string {
  if (!val) return 'USER';
  const roleStr = val.toUpperCase();
  const validRoles = ['ADMIN', 'MANAGER', 'SEO', 'DEVELOPER', 'TESTER', 'USER'];
  if (validRoles.includes(roleStr)) return roleStr;
  return 'USER';
}

async function batchInsert(client: any, tableName: string, columns: string[], rows: any[][], batchSize = 500) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const placeholders: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    for (const row of batch) {
      const rowPlaceholders: string[] = [];
      for (const val of row) {
        rowPlaceholders.push(`$${paramIndex++}`);
        values.push(val);
      }
      placeholders.push(`(${rowPlaceholders.join(', ')})`);
    }
    
    const query = `
      INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')})
      VALUES ${placeholders.join(', ')}
    `;
    await client.query(query, values);
  }
}

async function main() {
  const client = await pool.connect();
  try {
    console.log('--- Starting DB Import ---');

    // 1. Back up active admins in DB
    console.log('Backing up active admin credentials...');
    const adminRes = await client.query('SELECT * FROM "User"');
    const existingAdmins = adminRes.rows;
    console.log(`Saved ${existingAdmins.length} active users from DB.`);

    // 2. Clear tables (cascading order)
    console.log('Clearing old database tables...');
    // Drop foreign key constraint first so we can load orphan details without matching orders
    await client.query('ALTER TABLE "OrderDetail" DROP CONSTRAINT IF EXISTS "OrderDetail_orderId_fkey"');
    await client.query('TRUNCATE TABLE "OrderDetail" CASCADE');
    await client.query('TRUNCATE TABLE "Order" CASCADE');
    await client.query('TRUNCATE TABLE "User" CASCADE');
    console.log('Tables cleared successfully.');

    // Paths
    const usersCsvPath = 'c:/Users/mohit.kumar/Downloads/users.csv';
    const ordersCsvPath = 'c:/Users/mohit.kumar/Downloads/orders.csv';
    const orderDetailsCsvPath = 'c:/Users/mohit.kumar/Downloads/order_details.csv';

    // 3. Load and parse Users
    console.log('Parsing users.csv...');
    const usersData = parseCSV(fs.readFileSync(usersCsvPath, 'utf8'));
    const userHeaders = usersData[0];
    const userRows = usersData.slice(1);

    const uIdIdx = userHeaders.indexOf('id');
    const uFirstNameIdx = userHeaders.indexOf('first_name');
    const uLastNameIdx = userHeaders.indexOf('last_name');
    const uNameIdx = userHeaders.indexOf('name');
    const uEmailIdx = userHeaders.indexOf('email');
    const uPasswordIdx = userHeaders.indexOf('password');
    const uPhoneIdx = userHeaders.indexOf('phone');
    const uRoleIdx = userHeaders.indexOf('role');
    const uStatusIdx = userHeaders.indexOf('status');
    const uCreatedAtIdx = userHeaders.indexOf('created_at');
    const uUpdatedAtIdx = userHeaders.indexOf('updated_at');

    const insertedEmails = new Set<string>();
    const insertedUserIds = new Set<number>();
    const usersToInsert: any[][] = [];

    // Map rows
    for (const row of userRows) {
      if (row.length < 2) continue;
      const rawId = parseIntVal(row[uIdIdx]);
      let email = (row[uEmailIdx] || '').trim().toLowerCase();
      if (!rawId || !email) continue;

      if (insertedEmails.has(email)) {
        console.warn(`Skipping duplicate email: ${email}`);
        continue;
      }

      let name = (row[uNameIdx] || '').trim();
      if (!name) {
        name = `${row[uFirstNameIdx] || ''} ${row[uLastNameIdx] || ''}`.trim();
      }
      let password = row[uPasswordIdx];
      let phone = row[uPhoneIdx];
      let role = parseRole(row[uRoleIdx]);
      let status = row[uStatusIdx] || 'passive';
      let createdAt = parseDate(row[uCreatedAtIdx]) || new Date();
      let updatedAt = parseDate(row[uUpdatedAtIdx]) || new Date();

      // Overwrite with active admin credentials if matches email
      const matchedAdmin = existingAdmins.find(a => a.email.toLowerCase() === email);
      if (matchedAdmin) {
        console.log(`Preserving current credentials for admin: ${email} (mapping to original ID ${rawId})`);
        name = matchedAdmin.name || name;
        password = matchedAdmin.password || password;
        phone = matchedAdmin.phone || phone;
        role = matchedAdmin.role || role;
        status = matchedAdmin.status || status;
        createdAt = matchedAdmin.createdAt || createdAt;
        updatedAt = matchedAdmin.updatedAt || updatedAt;
      }

      insertedEmails.add(email);
      insertedUserIds.add(rawId);

      usersToInsert.push([
        rawId,
        name || null,
        email,
        password || null,
        phone || null,
        role,
        status,
        createdAt,
        updatedAt
      ]);
    }

    // Insert missing admins if they weren't in users.csv (e.g. Gursimranpreet)
    for (const admin of existingAdmins) {
      const adminEmail = admin.email.toLowerCase();
      if (!insertedEmails.has(adminEmail)) {
        const nextId = Math.max(...Array.from(insertedUserIds), 0) + 1;
        console.log(`Adding missing admin to database: ${admin.email} (assigning ID ${nextId})`);
        insertedEmails.add(adminEmail);
        insertedUserIds.add(nextId);
        usersToInsert.push([
          nextId,
          admin.name,
          adminEmail,
          admin.password,
          admin.phone,
          admin.role,
          admin.status,
          admin.createdAt,
          admin.updatedAt
        ]);
      }
    }

    console.log(`Inserting ${usersToInsert.length} users...`);
    await batchInsert(client, 'User', ['id', 'name', 'email', 'password', 'phone', 'role', 'status', 'createdAt', 'updatedAt'], usersToInsert, 1000);
    console.log('Users inserted successfully.');

    // 4. Load and parse Orders
    console.log('Parsing orders.csv...');
    const ordersData = parseCSV(fs.readFileSync(ordersCsvPath, 'utf8'));
    const orderHeaders = ordersData[0];
    const orderRows = ordersData.slice(1);

    const oIdIdx = orderHeaders.indexOf('id');
    const oIsOrderApiIdx = orderHeaders.indexOf('is_order_api');
    const oOrderNumberIdx = orderHeaders.indexOf('order_number');
    const oUserIdIdx = orderHeaders.indexOf('user_id');
    const oPaymentIdIdx = orderHeaders.indexOf('payment_id');
    const oSubscriptionIdIdx = orderHeaders.indexOf('subscription_id');
    const oRzpaySubscriptionIdIdx = orderHeaders.indexOf('rzpay_subscription_id');
    const oItemNameIdx = orderHeaders.indexOf('item_name');
    const oItemIdIdx = orderHeaders.indexOf('item_id');
    const oIsRecurringIdx = orderHeaders.indexOf('is_recurring');
    const oFirstNameIdx = orderHeaders.indexOf('first_name');
    const oLastNameIdx = orderHeaders.indexOf('last_name');
    const oCurrencyIdx = orderHeaders.indexOf('currency');
    const oSymbolIdx = orderHeaders.indexOf('symbol');
    const oAmountIdx = orderHeaders.indexOf('amount');
    const oCouponIdIdx = orderHeaders.indexOf('coupon_id');
    const oCouponIdx = orderHeaders.indexOf('coupon');
    const oCouponDiscountIdx = orderHeaders.indexOf('coupon_discount');
    const oEmailIdx = orderHeaders.indexOf('email');
    const oBillingCountryIdx = orderHeaders.indexOf('billing_country');
    const oBillingCityIdx = orderHeaders.indexOf('billing_city');
    const oBillingStreetIdx = orderHeaders.indexOf('billing_street');
    const oBillingZipIdx = orderHeaders.indexOf('billing_zip');
    const oShippingCountryIdx = orderHeaders.indexOf('shipping_country');
    const oShippingCityIdx = orderHeaders.indexOf('shipping_city');
    const oShippingStreetIdx = orderHeaders.indexOf('shipping_street');
    const oShippingZipIdx = orderHeaders.indexOf('shipping_zip');
    const oPayUrlIdx = orderHeaders.indexOf('pay_url');
    const oStatusIdx = orderHeaders.indexOf('status');
    const oDetailsFilledIdx = orderHeaders.indexOf('details_filled');
    const oDetailsFilledAtIdx = orderHeaders.indexOf('details_filled_at');
    const oPaymentStatusIdx = orderHeaders.indexOf('payment_status');
    const oPaymentMethodIdx = orderHeaders.indexOf('payment_method');
    const oWorkStatusIdx = orderHeaders.indexOf('work_status');
    const oDuedateIdx = orderHeaders.indexOf('duedate');
    const oPaymentDateIdx = orderHeaders.indexOf('payment_date');
    const oCreatedAtIdx = orderHeaders.indexOf('created_at');
    const oUpdatedAtIdx = orderHeaders.indexOf('updated_at');
    const oCompletedOnIdx = orderHeaders.indexOf('completed_on');
    const oDeletedAtIdx = orderHeaders.indexOf('deleted_at');
    const oPurchaseTypeIdx = orderHeaders.indexOf('purchase_type');
    const oIsRenewalIdx = orderHeaders.indexOf('is_renewal');

    const insertedOrderNumbers = new Set<string>();
    const insertedOrderIds = new Set<number>();
    const ordersToInsert: any[][] = [];

    for (const row of orderRows) {
      if (row.length < 2) continue;
      const orderId = parseIntVal(row[oIdIdx]);
      if (!orderId) continue;

      let orderNumber = (row[oOrderNumberIdx] || '').trim();
      if (orderNumber) {
        if (insertedOrderNumbers.has(orderNumber)) {
          orderNumber = `${orderNumber}-${orderId}`;
        }
        insertedOrderNumbers.add(orderNumber);
      }

      const csvUserId = parseIntVal(row[oUserIdIdx]);
      const validUserId = csvUserId && insertedUserIds.has(csvUserId) ? csvUserId : null;

      const amount = parseFloatVal(row[oAmountIdx]);
      const paymentMethod = row[oPaymentMethodIdx] || '1';
      const status = row[oStatusIdx] || '1';
      const paymentStatus = row[oPaymentStatusIdx] || '1';
      const createdAt = parseDate(row[oCreatedAtIdx]) || new Date();
      const date = createdAt;
      const updatedAt = parseDate(row[oUpdatedAtIdx]) || new Date();

      const billingCity = row[oBillingCityIdx] || null;
      const billingCountry = row[oBillingCountryIdx] || null;
      const billingStreet = row[oBillingStreetIdx] || null;
      const billingZip = row[oBillingZipIdx] || null;

      const completedOn = parseDate(row[oCompletedOnIdx]);
      const coupon = row[oCouponIdx] || null;
      const couponDiscount = parseIntVal(row[oCouponDiscountIdx]);
      const couponId = row[oCouponIdIdx] || null;
      const currency = row[oCurrencyIdx] || null;
      const deletedAt = parseDate(row[oDeletedAtIdx]);
      const detailsFilled = parseBoolVal(row[oDetailsFilledIdx]);
      const detailsFilledAt = parseDate(row[oDetailsFilledAtIdx]);
      const duedate = parseDate(row[oDuedateIdx]);
      const email = row[oEmailIdx] || null;
      const firstName = row[oFirstNameIdx] || null;
      const isOrderApi = parseIntVal(row[oIsOrderApiIdx]) ?? 1;
      const isRecurring = parseIntVal(row[oIsRecurringIdx]);
      const isRenewal = parseBoolVal(row[oIsRenewalIdx]);
      const itemId = row[oItemIdIdx] || null;
      const itemName = row[oItemNameIdx] || null;
      const lastName = row[oLastNameIdx] || null;
      const paymentDate = parseDate(row[oPaymentDateIdx]);
      const paymentId = row[oPaymentIdIdx] || null;
      const purchaseType = row[oPurchaseTypeIdx] || null;
      const rzpaySubscriptionId = row[oRzpaySubscriptionIdIdx] || null;
      const shippingCity = row[oShippingCityIdx] || null;
      const shippingCountry = row[oShippingCountryIdx] || null;
      const shippingStreet = row[oShippingStreetIdx] || null;
      const shippingZip = row[oShippingZipIdx] || null;
      const subscriptionId = row[oSubscriptionIdIdx] || null;
      const symbol = row[oSymbolIdx] || null;
      const workStatus = parseIntVal(row[oWorkStatusIdx]);
      const payUrl = row[oPayUrlIdx] || null;
      const tokenCode = null;
      const notes = null;

      insertedOrderIds.add(orderId);

      ordersToInsert.push([
        orderId,
        orderNumber || null,
        validUserId,
        amount,
        paymentMethod,
        status,
        paymentStatus,
        date,
        createdAt,
        updatedAt,
        billingCity,
        billingCountry,
        billingStreet,
        billingZip,
        completedOn,
        coupon,
        couponDiscount,
        couponId,
        currency,
        deletedAt,
        detailsFilled,
        detailsFilledAt,
        duedate,
        email,
        firstName,
        isOrderApi,
        isRecurring,
        isRenewal,
        itemId,
        itemName,
        lastName,
        paymentDate,
        paymentId,
        purchaseType,
        rzpaySubscriptionId,
        shippingCity,
        shippingCountry,
        shippingStreet,
        shippingZip,
        subscriptionId,
        symbol,
        workStatus,
        payUrl,
        tokenCode,
        notes
      ]);
    }

    console.log(`Inserting ${ordersToInsert.length} orders...`);
    const orderColumns = [
      'id', 'orderNumber', 'userId', 'amount', 'paymentMethod', 'status', 'paymentStatus', 'date', 'createdAt', 'updatedAt',
      'billingCity', 'billingCountry', 'billingStreet', 'billingZip', 'completedOn', 'coupon', 'couponDiscount', 'couponId',
      'currency', 'deletedAt', 'detailsFilled', 'detailsFilledAt', 'duedate', 'email', 'firstName', 'isOrderApi', 'isRecurring',
      'isRenewal', 'itemId', 'itemName', 'lastName', 'paymentDate', 'paymentId', 'purchaseType', 'rzpaySubscriptionId',
      'shippingCity', 'shippingCountry', 'shippingStreet', 'shippingZip', 'subscriptionId', 'symbol', 'workStatus', 'payUrl',
      'tokenCode', 'notes'
    ];
    await batchInsert(client, 'Order', orderColumns, ordersToInsert, 400);
    console.log('Orders inserted successfully.');

    // 5. Load and parse OrderDetails
    console.log('Parsing order_details.csv...');
    const detailsData = parseCSV(fs.readFileSync(orderDetailsCsvPath, 'utf8'));
    const detailsHeaders = detailsData[0];
    const detailsRows = detailsData.slice(1);

    const dIdIdx = detailsHeaders.indexOf('id');
    const dOrderIdIdx = detailsHeaders.indexOf('order_id');
    const dItemNameIdx = detailsHeaders.indexOf('item_name');
    const dBannerTitleIdx = detailsHeaders.indexOf('banner_title');
    const dItemIdIdx = detailsHeaders.indexOf('item_id');
    const dAmountIdx = detailsHeaders.indexOf('amount');
    const dQuantityIdx = detailsHeaders.indexOf('quantity');
    const dCreatedAtIdx = detailsHeaders.indexOf('created_at');
    const dUpdatedAtIdx = detailsHeaders.indexOf('updated_at');
    const dProductTypeIdx = detailsHeaders.indexOf('product_type');

    const detailsToInsert: any[][] = [];

    for (const row of detailsRows) {
      if (row.length < 2) continue;
      const detailId = parseIntVal(row[dIdIdx]);
      const orderId = parseIntVal(row[dOrderIdIdx]);
      if (!detailId || !orderId) continue;

      // Don't check for orderId existence in insertedOrderIds since we dropped the constraint
      // to import all orphan records.

      const itemName = row[dItemNameIdx] || null;
      const itemId = row[dItemIdIdx] || null;
      const quantity = parseIntVal(row[dQuantityIdx]);
      const amount = parseFloatVal(row[dAmountIdx]);
      const platform = row[dBannerTitleIdx] || null;
      const type = row[dProductTypeIdx] || null;
      const image = null;
      const profileUrl = null;
      const createdAt = parseDate(row[dCreatedAtIdx]) || new Date();
      const updatedAt = parseDate(row[dUpdatedAtIdx]) || new Date();

      detailsToInsert.push([
        detailId,
        orderId,
        itemName,
        itemId,
        quantity,
        amount,
        platform,
        type,
        image,
        profileUrl,
        createdAt,
        updatedAt
      ]);
    }

    console.log(`Inserting ${detailsToInsert.length} order details...`);
    const detailColumns = [
      'id', 'orderId', 'itemName', 'itemId', 'quantity', 'amount', 'platform', 'type', 'image', 'profileUrl', 'createdAt', 'updatedAt'
    ];
    await batchInsert(client, 'OrderDetail', detailColumns, detailsToInsert, 800);
    console.log('Order details inserted successfully.');

    // 6. Update Sequences
    console.log('Synchronizing auto-increment primary key sequences...');
    await client.query(`SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id), 1)) FROM "User"`);
    await client.query(`SELECT setval(pg_get_serial_sequence('"Order"', 'id'), coalesce(max(id), 1)) FROM "Order"`);
    await client.query(`SELECT setval(pg_get_serial_sequence('"OrderDetail"', 'id'), coalesce(max(id), 1)) FROM "OrderDetail"`);
    console.log('Sequences synchronized successfully.');

    console.log('--- DB Import Completed Successfully! ---');
  } catch (err) {
    console.error('--- Import Failed ---', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
