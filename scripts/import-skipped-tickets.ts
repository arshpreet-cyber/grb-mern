import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { Pool } from 'pg';
import "dotenv/config";

const BATCH_SIZE = 1000;

function parseDate(d: string) {
  if (!d || d.toLowerCase() === 'null') return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) return null;
  return date.toISOString();
}

function parseIntNull(v: string) {
  if (!v || v.toLowerCase() === 'null') return null;
  const parsed = parseInt(v, 10);
  return isNaN(parsed) ? null : parsed;
}

function parseString(v: string) {
  if (!v || v.toLowerCase() === 'null') return null;
  return v;
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL, max: 2 });
  
  try {
    const res = await pool.query('SELECT id FROM "User"');
    const validUserIds = new Set(res.rows.map(r => r.id.toString()));

    const ticketsCsv = fs.readFileSync('c:/Users/mohit.kumar/Downloads/tickets.csv', 'utf8');
    const threadsCsv = fs.readFileSync('c:/Users/mohit.kumar/Downloads/ticket_threads.csv', 'utf8');

    const ticketsRaw = parse(ticketsCsv, { columns: true, skip_empty_lines: true });
    const threadsRaw = parse(threadsCsv, { columns: true, skip_empty_lines: true });

    const invalidTickets = ticketsRaw.filter(t => !validUserIds.has(t.user_id) && t.user_id && t.user_id !== 'NULL');
    
    // 1. CREATE MISSING USERS
    const uniqueMissingUsers = new Map();
    for (const t of invalidTickets) {
        if (!uniqueMissingUsers.has(t.user_id)) {
            uniqueMissingUsers.set(t.user_id, {
                id: parseInt(t.user_id, 10),
                name: parseString(t.name) || `Legacy User ${t.user_id}`,
                email: `legacy_ticket_${t.user_id}@example.com` // ensure uniqueness
            });
        }
    }

    const missingUsersList = Array.from(uniqueMissingUsers.values());
    if (missingUsersList.length > 0) {
        console.log(`Creating ${missingUsersList.length} missing placeholder users...`);
        let userQuery = `INSERT INTO "User" ("id", "name", "email", "status", "role", "updatedAt") VALUES `;
        const userParams = [];
        let pIndex = 1;
        const userVals = missingUsersList.map(u => {
            const v = `($${pIndex++}, $${pIndex++}, $${pIndex++}, 'passive', 'USER', NOW())`;
            userParams.push(u.id, u.name, u.email);
            return v;
        });
        userQuery += userVals.join(', ') + ' ON CONFLICT ("id") DO NOTHING';
        await pool.query(userQuery, userParams);
        console.log(`Created missing users.`);
    }

    // 2. PREPARE TICKETS
    const ticketIdMap = new Map();
    const ticketsToInsert = [];
    
    for (const t of invalidTickets) {
      const realTicketId = parseString(t.ticket_id) || `TKT-${t.id}`;
      ticketIdMap.set(t.id, realTicketId);

      ticketsToInsert.push({
        ticket_number: parseString(t.ticket_number),
        user_id: parseIntNull(t.user_id),
        assigned_to: parseString(t.assigned_to),
        name: parseString(t.name),
        email: parseString(t.email),
        phone: parseString(t.phone),
        subject: parseString(t.subject),
        query: parseString(t.query),
        ticket_id: realTicketId,
        by_admin: parseIntNull(t.by_admin) ?? 1,
        ticket_type: parseIntNull(t.ticket_type),
        status: t.status === '1' ? 'Open' :
                t.status === '2' ? 'Closed' :
                t.status === '5' ? 'Awaiting Reply' :
                t.status === '4' ? 'Closed' :
                parseString(t.status) || 'Open',
        read_status: parseIntNull(t.read_status) ?? 1,
        replied_status: parseIntNull(t.replied_status),
        user_read_status: parseIntNull(t.user_read_status),
        created_at: parseDate(t.created_at) || new Date().toISOString(),
        updated_at: parseDate(t.updated_at) || new Date().toISOString(),
        replied_at: parseDate(t.replied_at),
        last_thread_id: parseString(t.last_thread_id),
        admin_reply_at: parseDate(t.admin_reply_at),
        deleted_at: parseDate(t.deleted_at),
      });
    }

    console.log(`Prepared ${ticketsToInsert.length} formerly skipped tickets.`);

    // 3. PREPARE THREADS
    const threadsToInsert = [];
    for (const th of threadsRaw) {
      const parentTicketId = ticketIdMap.get(th.ticket_id);
      if (!parentTicketId) continue; // Not one of the skipped tickets

      threadsToInsert.push({
        ticketId: parentTicketId,
        agentId: parseString(th.agent_id),
        content: parseString(th.content),
        media: parseString(th.media),
        direction: parseString(th.direction) || "1",
        createdAt: parseDate(th.created_at) || new Date().toISOString(),
        updatedAt: parseDate(th.updated_at) || new Date().toISOString(),
        deletedAt: parseDate(th.deleted_at)
      });
    }

    console.log(`Prepared ${threadsToInsert.length} formerly skipped threads.`);

    // 4. IMPORT TICKETS
    if (ticketsToInsert.length > 0) {
        console.log(`Importing skipped tickets...`);
        for (let i = 0; i < ticketsToInsert.length; i += BATCH_SIZE) {
            const batch = ticketsToInsert.slice(i, i + BATCH_SIZE);
            let query = `INSERT INTO "Ticket" (
                "ticket_number", "user_id", "assigned_to", "name", "email", "phone", "subject", "query", 
                "ticket_id", "by_admin", "ticket_type", "status", "read_status", "replied_status", 
                "user_read_status", "created_at", "updated_at", "replied_at", "last_thread_id", 
                "admin_reply_at", "deleted_at", "title"
            ) VALUES `;
            const params = [];
            let paramIndex = 1;
            
            const values = batch.map(t => {
                const v = `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`;
                params.push(t.ticket_number, t.user_id, t.assigned_to, t.name, t.email, t.phone, t.subject, t.query, t.ticket_id, t.by_admin, t.ticket_type, t.status, t.read_status, t.replied_status, t.user_read_status, t.created_at, t.updated_at, t.replied_at, t.last_thread_id, t.admin_reply_at, t.deleted_at, "");
                return v;
            });

            query += values.join(', ') + ' ON CONFLICT ("ticket_id") DO NOTHING';
            await pool.query(query, params);
        }
        console.log("Imported skipped tickets.");
    }

    // 5. IMPORT THREADS
    if (threadsToInsert.length > 0) {
        console.log(`Importing skipped threads...`);
        for (let i = 0; i < threadsToInsert.length; i += BATCH_SIZE) {
            const batch = threadsToInsert.slice(i, i + BATCH_SIZE);
            let query = `INSERT INTO "TicketThread" (
                "ticketId", "agentId", "content", "media", "direction", "createdAt", "updatedAt", "deletedAt"
            ) VALUES `;
            const params = [];
            let paramIndex = 1;
            
            const values = batch.map(t => {
                const v = `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`;
                params.push(t.ticketId, t.agentId, t.content, t.media, t.direction, t.createdAt, t.updatedAt, t.deletedAt);
                return v;
            });

            query += values.join(', ');
            await pool.query(query, params);
        }
        console.log("Imported skipped threads.");
    }

    console.log("Skipped import completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    pool.end();
  }
}

main().catch(console.error);
