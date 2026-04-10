import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET(req: NextRequest) {
  try {
    // Check for authorization header
    const auth = req.headers.get("authorization");
    if (auth !== "Bearer seed-secret-key-123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log( "🌱 Starting SQL seed...");

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    try {
      const client = await pool.connect();

      try {
        // Create tables if they don't exist
        await client.query(`
          CREATE TABLE IF NOT EXISTS "User" (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            password TEXT,
            role TEXT DEFAULT 'USER',
            status TEXT DEFAULT 'passive',
            "createdAt" TIMESTAMP DEFAULT NOW(),
            "updatedAt" TIMESTAMP DEFAULT NOW()
          )
        `);
        console.log("✅ User table created");

        await client.query(`
          CREATE TABLE IF NOT EXISTS "Order" (
            id TEXT PRIMARY KEY,
            "orderNumber" TEXT UNIQUE NOT NULL,
            "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
            amount FLOAT,
            "paymentMethod" TEXT,
            status TEXT DEFAULT 'Pending',
            "paymentStatus" TEXT DEFAULT 'Pending',
            date TIMESTAMP DEFAULT NOW(),
            "createdAt" TIMESTAMP DEFAULT NOW(),
            "updatedAt" TIMESTAMP DEFAULT NOW()
          )
        `);
        console.log("✅ Order table created");

        await client.query(`
          CREATE TABLE IF NOT EXISTS "Ticket" (
            id TEXT PRIMARY KEY,
            "ticketId" TEXT UNIQUE NOT NULL,
            "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'Open',
            "createdAt" TIMESTAMP DEFAULT NOW(),
            "updatedAt" TIMESTAMP DEFAULT NOW()
          )
        `);
        console.log("✅ Ticket table created");

        await client.query(`
          CREATE TABLE IF NOT EXISTS "Revenue" (
            id TEXT PRIMARY KEY,
            month TEXT,
            year INT,
            today FLOAT DEFAULT 0,
            monthly FLOAT DEFAULT 0,
            yearly FLOAT DEFAULT 0,
            "allTime" FLOAT DEFAULT 0,
            "createdAt" TIMESTAMP DEFAULT NOW(),
            "updatedAt" TIMESTAMP DEFAULT NOW()
          )
        `);
        console.log("✅ Revenue table created");

        // Clear existing data
        await client.query('DELETE FROM "Order"');
        await client.query('DELETE FROM "Ticket"');
        await client.query('DELETE FROM "Revenue"');
        //Note: Not deleting User records to preserve test data

        // Insert test users if they don't exist
        const johnRes = await client.query('SELECT id FROM "User" WHERE email = $1', ['john@example.com']);
        let user1Id = johnRes.rows[0]?.id;
        if (!user1Id) {
          const result = await client.query(
            'INSERT INTO "User" (id, email, name, password, role, status, "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING id',
            ['john@example.com', 'John Doe', '$2a$10$abc123hashvalue123456789', 'USER', 'active']
          );
          user1Id = result.rows[0].id;
          console.log("✅ Created user: John Doe");
        }

        const janeRes = await client.query('SELECT id FROM "User" WHERE email = $1', ['jane@example.com']);
        let user2Id = janeRes.rows[0]?.id;
        if (!user2Id) {
          const result = await client.query(
            'INSERT INTO "User" (id, email, name, password, role, status, "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING id',
            ['jane@example.com', 'Jane Smith', '$2a$10$def456hashvalue456789123', 'USER', 'active']
          );
          user2Id = result.rows[0].id;
          console.log("✅ Created user: Jane Smith");
        }

        // Insert orders
        const orders = [
          ['#177150846', user1Id, 100.0, 'Credit Card', 'Pending', 'Pending', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)],
          ['#177150847', user2Id, 250.0, 'PayPal', 'Complete', 'Complete', new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)],
          ['#177150848', user1Id, 75.5, 'Credit Card', 'Complete', 'Complete', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)],
          ['#177150849', user2Id, 320.0, 'Stripe', 'Pending', 'Pending', new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)],
          ['#177150850', user1Id, 149.99, 'Credit Card', 'Complete', 'Complete', new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)],
          ['#177150851', user2Id, 89.99, 'PayPal', 'Cancelled', 'Failed', new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)],
          ['#177150852', user1Id, 199.0, 'Credit Card', 'Complete', 'Complete', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)],
          ['#177150853', user2Id, 55.5, 'Stripe', 'Pending', 'Pending', new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)],
        ];

        for (const order of orders) {
          await client.query(
            'INSERT INTO "Order" (id, "orderNumber", "userId", amount, "paymentMethod", status, "paymentStatus", date, "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW()) ON CONFLICT DO NOTHING',
            order
          );
        }
        console.log("✅ Created 8 fake orders");

        // Insert tickets
        const tickets = [
          ['#TKT-10956', user1Id, 'Quality issue auto accounts', 'Issue with automated account generation', 'Awaiting Reply', new Date(Date.now() - 1 * 60 * 60 * 1000)],
          ['#TKT-10985', user2Id, 'Review on order no. 177456031', 'Customer asking about order status', 'Open', new Date(Date.now() - 3 * 60 * 60 * 1000)],
          ['#TKT-10944', user1Id, 'All reviews has disappeared', 'Reviews not showing in dashboard', 'Closed', new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)],
          ['#TKT-10953', user2Id, 'Order Number - 177220728', 'Payment processing issue', 'Pending', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)],
          ['#TKT-10952', user1Id, 'Order Number - 177361288', 'Refund request for cancelled order', 'Open', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)],
          ['#TKT-11001', user2Id, 'Login issues with email', 'Cannot access account', 'Awaiting Reply', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)],
        ];

        for (const ticket of tickets) {
          await client.query(
            'INSERT INTO "Ticket" (id, "ticketId", "userId", title, description, status, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()) ON CONFLICT DO NOTHING',
            ticket
          );
        }
        console.log("✅ Created 6 fake tickets");

        // Insert revenue
        await client.query(
          'INSERT INTO "Revenue" (id, month, year, today, monthly, yearly, "allTime", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()) ON CONFLICT DO NOTHING',
          ['April', 2026, 350.0, 3895.0, 55357.0, 1597473.0]
        );
        console.log("✅ Created revenue data");

        return NextResponse.json(
          {
            success: true,
            message: "Database seeded successfully with SQL!",
            stats: {
              ordersCreated: orders.length,
              ticketsCreated: tickets.length,
              revenueCreated: 1,
            },
          },
          { status: 200 }
        );
      } finally {
        client.release();
      }
    } finally {
      await pool.end();
    }
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Failed to seed database",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
