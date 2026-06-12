import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const email = "mohit@adaired.org";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN", status: "active" }
    });
    console.log("✅ User already exists. Role updated to ADMIN:", email);
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: "Mohit Kumar",
      email,
      password: await bcrypt.hash("123456789", 10),
      role: "ADMIN",
      status: "active",
    },
  });

  console.log("✅ Admin user created:", user.email, "| Role:", user.role);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
