import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1] : null;

const pool = new Pool({ connectionString: dbUrl! });

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT COUNT(*) FROM "Order" WHERE "completedOn" IS NOT NULL');
    console.log('Orders with completedOn NOT NULL:', res.rows[0].count);
    
    const res2 = await client.query('SELECT COUNT(*) FROM "Order" WHERE status = \'3\'');
    console.log('Orders with status = 3:', res2.rows[0].count);
  } finally {
    client.release();
    pool.end();
  }
}
main();
