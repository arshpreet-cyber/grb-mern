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

async function seedFunctionalPages() {
  try {
    // 1. How It Works
    const howItWorksSections = [
      {
        id: 'hiw-hero',
        type: 'image-text',
        data: {
          title: "Climb The Ladder Of Business <br /><span class='text-[#fcd535]'>Growth With Every Positive Step</span>",
          content: "<p>Understanding how reviews impact your business is the first step toward long-term success. Our platform helps you bridge the gap between customer feedback and brand reputation.</p>",
          buttonText: "Get Started",
          image: "https://getreviews.buzz/storage/app/blog/0539654001776770835_0702272001776065346_left-img.png",
          imagePosition: "right"
        },
        settings: { visibility: true, padding: '80px 0' }
      }
    ];

    await prisma.page.upsert({
      where: { slug: 'how-it-works' },
      update: { sections: howItWorksSections, draftSections: howItWorksSections, title: 'How It Works' },
      create: { title: 'How It Works', slug: 'how-it-works', sections: howItWorksSections, draftSections: howItWorksSections }
    });

    // 2. Buy Reviews Page
    const buyReviewsSections = [
      {
        id: 'br-hero',
        type: 'hero',
        data: {
          staticTitle1: 'Premium',
          staticTitleBold: 'Review',
          staticTitle2: 'Services',
          typingServices: ['Google Reviews', 'Trustpilot Reviews', 'Yelp Reviews'],
          description: 'The highest quality reviews for your business growth.'
        },
        settings: { visibility: true }
      },
      {
        id: 'br-grid',
        type: 'buy-reviews',
        data: {},
        settings: { visibility: true }
      }
    ];

    await prisma.page.upsert({
      where: { slug: 'buy-reviews' },
      update: { sections: buyReviewsSections, draftSections: buyReviewsSections, title: 'Buy Reviews' },
      create: { title: 'Buy Reviews', slug: 'buy-reviews', sections: buyReviewsSections, draftSections: buyReviewsSections }
    });

    console.log('Functional pages seeded successfully');
  } catch (error) {
    console.error('Error seeding functional pages:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seedFunctionalPages();
