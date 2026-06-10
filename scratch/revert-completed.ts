import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../.env');
const dbUrlMatch = fs.readFileSync(envPath, 'utf8').match(/DATABASE_URL="([^"]+)"/);
const pool = new Pool({ connectionString: dbUrlMatch![1] });

async function main() {
  const client = await pool.connect();
  try {
    // We previously did: UPDATE "Order" SET status = '3' WHERE "completedOn" IS NOT NULL AND status != '3'
    // We want to set them back to '2', because the user confirmed '2' is the actual Completed status.
    // There was originally only 1 order with status='3' anyway, so setting all status='3' to '2' is safe and correct.
    const res = await client.query('UPDATE "Order" SET status = \'2\' WHERE status = \'3\'');
    console.log(`Reverted ${res.rowCount} orders back to status='2' (Completed).`);
  } finally {
    client.release();
    pool.end();
  }
}
main();
