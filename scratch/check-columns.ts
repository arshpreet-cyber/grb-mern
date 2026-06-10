import 'dotenv/config';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new Pool({ connectionString: databaseUrl });

async function main() {
  try {
    const client = await pool.connect();
    
    // Check columns of User table
    console.log('--- User columns ---');
    const userRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User';
    `);
    console.log(userRes.rows);

    // Check columns of Order table
    console.log('--- Order columns ---');
    const orderRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Order';
    `);
    console.log(orderRes.rows);

    // Check columns of OrderDetail table
    console.log('--- OrderDetail columns ---');
    const detailRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'OrderDetail';
    `);
    console.log(detailRes.rows);

    // Check columns of Page table
    console.log('--- Page columns ---');
    const pageRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Page';
    `);
    console.log(pageRes.rows);

    client.release();
  } catch (err) {
    console.error('Error querying schema info:', err);
  } finally {
    await pool.end();
  }
}

main();
