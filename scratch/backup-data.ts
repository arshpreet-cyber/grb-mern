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
    console.log('Starting database backup of text-ID tables...');
    
    // Backup Users
    const users = await client.query('SELECT * FROM "User"');
    // Backup Orders
    const orders = await client.query('SELECT * FROM "Order"');
    // Backup OrderDetails
    const orderDetails = await client.query('SELECT * FROM "OrderDetail"');
    
    // Backup Tickets (check if table exists first)
    let tickets: any[] = [];
    try {
      const ticketsRes = await client.query('SELECT * FROM "Ticket"');
      tickets = ticketsRes.rows;
    } catch (e: any) {
      console.warn('Ticket table query failed or does not exist:', e.message);
    }

    // Backup TicketThreads
    let ticketThreads: any[] = [];
    try {
      const threadsRes = await client.query('SELECT * FROM "TicketThread"');
      ticketThreads = threadsRes.rows;
    } catch (e: any) {
      console.warn('TicketThread table query failed or does not exist:', e.message);
    }

    const backupData = {
      users: users.rows,
      orders: orders.rows,
      orderDetails: orderDetails.rows,
      tickets: tickets,
      ticketThreads: ticketThreads
    };

    const backupPath = path.join(__dirname, 'db_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`Backup completed successfully! Saved to: ${backupPath}`);
    console.log(`Backup stats: Users: ${backupData.users.length}, Orders: ${backupData.orders.length}, OrderDetails: ${backupData.orderDetails.length}, Tickets: ${backupData.tickets.length}, TicketThreads: ${backupData.ticketThreads.length}`);
  } catch (err) {
    console.error('Backup failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
