import 'dotenv/config';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new Pool({ connectionString: databaseUrl });

async function main() {
  const client = await pool.connect();
  try {
    console.log('1. Truncating User, Order, OrderDetail, Ticket, TicketThread tables...');
    await client.query('TRUNCATE TABLE "OrderDetail", "Order", "TicketThread", "Ticket", "User" CASCADE;');
    console.log('   Truncated tables successfully!');

    console.log('2. Altering "Page" table ID column from text to serial...');
    // Drop primary key constraint
    await client.query('ALTER TABLE "Page" DROP CONSTRAINT IF EXISTS "Page_pkey" CASCADE;');
    // Drop the id column
    await client.query('ALTER TABLE "Page" DROP COLUMN IF EXISTS "id";');
    // Add id column back as serial primary key
    await client.query('ALTER TABLE "Page" ADD COLUMN "id" SERIAL PRIMARY KEY;');
    console.log('   Altered "Page" table successfully!');
    
    console.log('Migration prep script finished successfully!');
  } catch (err) {
    console.error('Migration prep script failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
