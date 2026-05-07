import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Marking most tickets as read...");
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Mark all but the first 2 as read
  for (let i = 2; i < tickets.length; i++) {
    await prisma.ticket.update({
      where: { id: tickets[i].id },
      data: { readStatus: 2 },
    });
  }

  console.log(`Updated ${tickets.length - 2} tickets to readStatus: 2`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
