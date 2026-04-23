require('dotenv').config();
const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query('SELECT id, name, email FROM "User"');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
