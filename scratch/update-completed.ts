import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../.env');
const dbUrlMatch = fs.readFileSync(envPath, 'utf8').match(/DATABASE_URL="([^"]+)"/);
const pool = new Pool({ connectionString: dbUrlMatch![1] });

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query('UPDATE "Order" SET status = \'3\' WHERE "completedOn" IS NOT NULL AND status != \'3\'');
    console.log(`Updated ${res.rowCount} orders to status='3' (Complete) because they had a completedOn date.`);
  } finally {
    client.release();
    pool.end();
  }
}
main();
