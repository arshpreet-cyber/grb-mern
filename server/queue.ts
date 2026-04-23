import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pgBossModule = require('pg-boss');
const PgBoss = pgBossModule.default || pgBossModule.PgBoss || pgBossModule;

// Use the existing Postgres connection URL
const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL or DIRECT_URL is required for pg-boss");
}

export const boss = new PgBoss(dbUrl);

boss.on('error', (error:any) => console.error('pg-boss error:', error));

let initialized = false;

export async function initQueue() {
  if (initialized) return;
  try {
    await boss.start();
    initialized = true;
    console.log("pg-boss started successfully");
  } catch (error) {
    console.error("Failed to start pg-boss:", error);
  }
}
