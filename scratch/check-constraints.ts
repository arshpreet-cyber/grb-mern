import 'dotenv/config';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}
const pool = new Pool({ connectionString: databaseUrl });

async function main() {
  const client = await pool.connect();
  const res = await client.query(`
    SELECT constraint_name, table_name, constraint_type
    FROM information_schema.table_constraints
    WHERE table_name IN ('OrderDetail', 'Order');
  `);
  console.log(res.rows);
  client.release();
  await pool.end();
}

main();
