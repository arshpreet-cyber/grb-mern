import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  // Create a standard Postgres connection pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  // Wrap it in the Prisma Adapter
  const adapter = new PrismaPg(pool)
  
  // Pass the adapter to the Prisma Client (v7 requirement)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma