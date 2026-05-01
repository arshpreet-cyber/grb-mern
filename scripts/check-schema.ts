import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkSchema() {
  try {
    const page = await prisma.page.findFirst();
    console.log('Page keys:', Object.keys(page || {}));
    
    // Try to update with draftSections
    if (page) {
       console.log('Attempting manual update of draftSections...');
       await prisma.page.update({
         where: { id: page.id },
         data: { draftSections: [] } as any
       });
       console.log('Manual update success!');
    }
  } catch (error: any) {
    console.error('Check Schema Error:', error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkSchema();
