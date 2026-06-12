import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
  console.log("Starting database migration to fix ticket statuses...");
  try {
    // 1. Convert '1' to 'Open'
    const openRes = await prisma.ticket.updateMany({
      where: { status: "1" },
      data: { status: "Open" }
    });
    console.log(`Mapped status "1" to "Open" for ${openRes.count} tickets.`);

    // 2. Convert '2' to 'Closed'
    const closedRes1 = await prisma.ticket.updateMany({
      where: { status: "2" },
      data: { status: "Closed" }
    });
    console.log(`Mapped status "2" to "Closed" for ${closedRes1.count} tickets.`);

    // 3. Convert '4' to 'Closed'
    const closedRes2 = await prisma.ticket.updateMany({
      where: { status: "4" },
      data: { status: "Closed" }
    });
    console.log(`Mapped status "4" to "Closed" for ${closedRes2.count} tickets.`);

    // 4. Convert '5' to 'Awaiting Reply'
    const awaitingRes = await prisma.ticket.updateMany({
      where: { status: "5" },
      data: { status: "Awaiting Reply" }
    });
    console.log(`Mapped status "5" to "Awaiting Reply" for ${awaitingRes.count} tickets.`);

    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
