import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../.env');
const dbUrlMatch = fs.readFileSync(envPath, 'utf8').match(/DATABASE_URL="([^"]+)"/);
const pool = new Pool({ connectionString: dbUrlMatch![1] });

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT status, COUNT(*) FROM "Order" WHERE "completedOn" IS NOT NULL GROUP BY status');
    console.log('--- Statuses for orders with completedOn IS NOT NULL ---');
    console.table(res.rows);
    
    const res2 = await client.query('SELECT status, COUNT(*) FROM "Order" WHERE "completedOn" IS NULL GROUP BY status');
    console.log('--- Statuses for orders with completedOn IS NULL ---');
    console.table(res2.rows);
  } finally {
    client.release();
    pool.end();
  }
}
main();
