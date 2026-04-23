import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pgBossModule = require('pg-boss');
const PgBoss = pgBossModule.default || pgBossModule.PgBoss || pgBossModule;

// Use the existing Postgres connection URL
// Use DIRECT_URL for pg-boss if available, as pgbouncer/pooling can interfere with advisory locks
const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL or DIRECT_URL is not defined in environment variables");
}

export const boss = new PgBoss(dbUrl);

boss.on('error', (error:any) => console.error('pg-boss error:', error));

let initialized = false;

export async function initQueue() {
  if (initialized) return;
  try {
    await boss.start();
    // Explicitly create queues to avoid "Queue does not exist" errors
    await boss.createQueue("support-email-queue");
    await boss.createQueue("support-ticket-sync-queue");
    initialized = true;
    console.log("pg-boss started and queues initialized successfully");
  } catch (error) {
    console.error("Failed to start pg-boss:", error);
  }
}
