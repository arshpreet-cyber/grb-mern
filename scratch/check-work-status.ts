import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../.env');
const dbUrlMatch = fs.readFileSync(envPath, 'utf8').match(/DATABASE_URL="([^"]+)"/);
const pool = new Pool({ connectionString: dbUrlMatch![1] });

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT "workStatus", COUNT(*) FROM "Order" GROUP BY "workStatus"');
    console.log('--- workStatus Counts ---');
    console.table(res.rows);
  } finally {
    client.release();
    pool.end();
  }
}
main();
