import 'dotenv/config';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}
const pool = new Pool({ connectionString: databaseUrl });

async function main() {
  const res = await pool.query('SELECT * FROM "User"');
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

main();
