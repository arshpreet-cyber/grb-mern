import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Home Page',
      slug: 'home',
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          data: {
            title: 'Turn Reputation into Revenue with Hotel Rev',
            subtitle: 'Elevate your brand with reviews that actually convert.',
          },
          settings: { visibility: true, padding: '4rem 1rem' }
        },
        {
          id: 'text-1',
          type: 'text',
          data: {
            content: '<h2>Search review Platforms</h2><p>(e.g. Google, Trustpilot...)</p>',
          },
          settings: { visibility: true, padding: '2rem 1rem', alignment: 'center' }
        }
      ]
    }
  });

  console.log('Seed successful:', homePage.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
