import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env.local
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1] : null;

if (!dbUrl) {
  throw new Error('Could not find DATABASE_URL in .env.local');
}

const pool = new Pool({ connectionString: dbUrl });

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT status, COUNT(*) FROM "Order" GROUP BY status ORDER BY COUNT(*) DESC');
    console.log('--- Status Counts ---');
    console.table(res.rows);

    const payRes = await client.query('SELECT "paymentStatus", COUNT(*) FROM "Order" GROUP BY "paymentStatus" ORDER BY COUNT(*) DESC');
    console.log('--- Payment Status Counts ---');
    console.table(payRes.rows);
    
    // Check if there are "Complete" or "Completed" stored in text?
    const textRes = await client.query('SELECT DISTINCT status FROM "Order"');
    console.log('Distinct statuses:', textRes.rows.map(r => r.status));
  } finally {
    client.release();
    pool.end();
  }
}

main();
