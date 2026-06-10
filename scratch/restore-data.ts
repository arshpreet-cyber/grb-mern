import 'dotenv/config';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new Pool({ connectionString: databaseUrl });

async function main() {
  const client = await pool.connect();
  try {
    const backupPath = path.join(__dirname, 'db_backup.json');
    if (!fs.existsSync(backupPath)) {
      console.error('Backup file not found at:', backupPath);
      return;
    }
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    console.log('Restoring data...');

    // 1. Restore Users
    const userIdMap = new Map<string, number>();
    for (const u of backupData.users) {
      const res = await client.query(
        `INSERT INTO "User" (name, email, password, phone, role, status, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [u.name, u.email, u.password, u.phone, u.role, u.status, u.createdAt, u.updatedAt]
      );
      const newId = res.rows[0].id;
      userIdMap.set(u.id, newId);
      console.log(`User "${u.email}": mapped ${u.id} -> ${newId}`);
    }

    // 2. Restore Orders
    const orderIdMap = new Map<string, number>();
    for (const o of backupData.orders) {
      const newUserId = o.userId ? userIdMap.get(o.userId) : null;
      const res = await client.query(
        `INSERT INTO "Order" (
          "orderNumber", "userId", amount, "paymentMethod", status, "paymentStatus", date, "createdAt", "updatedAt",
          "billingCity", "billingCountry", "billingStreet", "billingZip", "completedOn", coupon, "couponDiscount", "couponId",
          currency, "deletedAt", "detailsFilled", "detailsFilledAt", duedate, email, "firstName", "isOrderApi", "isRecurring",
          "isRenewal", "itemId", "itemName", "lastName", "paymentDate", "paymentId", "purchaseType", "rzpaySubscriptionId",
          "shippingCity", "shippingCountry", "shippingStreet", "shippingZip", "subscriptionId", symbol, "workStatus", "payUrl",
          "tokenCode", notes
         ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24,
          $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44
         ) RETURNING id`,
        [
          o.orderNumber, newUserId, o.amount, o.paymentMethod, o.status, o.paymentStatus, o.date, o.createdAt, o.updatedAt,
          o.billingCity, o.billingCountry, o.billingStreet, o.billingZip, o.completedOn, o.coupon, o.couponDiscount, o.couponId,
          o.currency, o.deletedAt, o.detailsFilled, o.detailsFilledAt, o.duedate, o.email, o.firstName, o.isOrderApi, o.isRecurring,
          o.isRenewal, o.itemId, o.itemName, o.lastName, o.paymentDate, o.paymentId, o.purchaseType, o.rzpaySubscriptionId,
          o.shippingCity, o.shippingCountry, o.shippingStreet, o.shippingZip, o.subscriptionId, o.symbol, o.workStatus, o.payUrl,
          o.tokenCode, o.notes
        ]
      );
      const newId = res.rows[0].id;
      orderIdMap.set(o.id, newId);
      console.log(`Order "${o.orderNumber}": mapped ${o.id} -> ${newId}`);
    }

    // 3. Restore OrderDetails
    for (const d of backupData.orderDetails) {
      const newOrderId = orderIdMap.get(d.orderId);
      if (!newOrderId) {
        console.warn(`Skipping OrderDetail ${d.id}: associated order ${d.orderId} not found`);
        continue;
      }
      await client.query(
        `INSERT INTO "OrderDetail" (
          "orderId", "itemName", "itemId", quantity, amount, platform, type, image, "profileUrl", "createdAt", "updatedAt"
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [newOrderId, d.itemName, d.itemId, d.quantity, d.amount, d.platform, d.type, d.image, d.profileUrl, d.createdAt, d.updatedAt]
      );
      console.log(`OrderDetail for "${d.itemName}": restored with new orderId ${newOrderId}`);
    }

    console.log('Restoration completed successfully!');
  } catch (err) {
    console.error('Restoration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
