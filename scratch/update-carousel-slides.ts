import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const pages = await prisma.page.findMany();
    console.log(`Found ${pages.length} pages in total. Processing...`);

    let updatedCount = 0;

    for (const page of pages) {
      let isUpdated = false;

      // Helper to process sections JSON
      const processSections = (sectionsJson: any) => {
        if (!Array.isArray(sectionsJson)) return { updatedJson: sectionsJson, changed: false };
        
        let changed = false;
        const newSections = sectionsJson.map((section: any) => {
          if (section?.type === 'safe-reviews-carousel') {
            const data = section.data || {};
            const platform = data.platform || 'Google';
            const oldSlides = data.slides || [];
            
            // Build the new upgraded slides
            const newSlides = [
              {
                heading: `How We Provide Safe<br/>And <strong>Authentic ${platform} Reviews</strong>`,
                subheading: `We take a strategic, secure approach to ${platform} reputation management that improves your profile while keeping reviews authentic.`,
                listTitle: `Here's how we keep ${platform} reviews safe and authentic:`,
                layout: "checklist",
                features: [
                  {
                    title: "Accounts That Are Both Legitimate and Active",
                    desc: "Our reviews are provided by genuine, geographically relevant profiles with established activity, ensuring that they complement organic customer feedback.",
                  },
                  {
                    title: "Customized Reviews",
                    desc: "Our customized reviews accurately reflect customer experiences, boosting credibility and trustworthiness.",
                  },
                  {
                    title: "Delivery Occurs Gradually and Naturally",
                    desc: "To maintain authenticity, reviews are posted in a consistent pattern over time, avoiding sudden spikes that may raise suspicion.",
                  },
                ],
                image: oldSlides[0]?.image || "/uploads/media/safe_reviews_graphic.png",
              },
              {
                heading: `Achieve Business Growth<br/>When <strong>You Manage ${platform} Reviews</strong>`,
                layout: "paragraphs",
                features: [
                  {
                    desc: `Buying ${platform} reviews online is not only a good way to improve your brand's image, but it also helps to attract more customers to your store, both online and offline. Our ${platform} review management services help your brand stand out in the crowded digital landscape.`,
                  },
                  {
                    desc: `By using our buy ${platform} reviews service, you can get genuine feedback from local profiles at a low cost to help your business succeed.`,
                  },
                  {
                    desc: `We help professional service providers rank higher in local searches by buying ${platform} 5-star reviews for their ${platform} Business Profiles. High-quality ${platform} reviews ensure customer satisfaction and maximize your brand's influence in the target market.`,
                  },
                ],
                button: {
                  text: "Get a Quote",
                  link: "/contact-us",
                },
                image: oldSlides[1]?.image || "/uploads/media/safe_reviews_graphic.png",
              },
              {
                heading: `Should You Proactively Get Reviews<br/>or <strong>Rely on Organic ${platform} Reviews?</strong>`,
                layout: "paragraphs",
                features: [
                  {
                    desc: `Are you unsure whether to pay for ${platform} reviews or wait for them to appear organically? Organic reviews are valuable but slow, while a structured plan to generate ${platform} reviews delivers consistent results.`,
                  },
                  {
                    desc: `This delay can have an impact on your company's growth, particularly if you're in a competitive market. Buying ${platform} reviews instantly boosts your business's credibility, improves search rankings, and attracts more customers to your GMB profile.`,
                  },
                  {
                    desc: `Unlike organic reviews, buying reviews guarantees consistent and strategic positive feedback, higher ratings, and a strong online presence.`,
                  },
                  {
                    desc: `Many businesses choose to buy ${platform} 5-star reviews to increase brand trust and stay ahead of competitors. When done correctly with high-quality, real-looking reviews, this approach improves your reputation and reinforces customer confidence.`,
                  },
                ],
                image: oldSlides[2]?.image || "/uploads/media/safe_reviews_graphic.png",
              },
            ];

            changed = true;
            return {
              ...section,
              data: {
                ...data,
                slides: newSlides,
              }
            };
          }
          return section;
        });

        return { updatedJson: newSections, changed };
      };

      const resLive = processSections(page.sections);
      const resDraft = processSections(page.draftSections);

      if (resLive.changed || resDraft.changed) {
        await prisma.page.update({
          where: { id: page.id },
          data: {
            sections: resLive.updatedJson,
            draftSections: resDraft.updatedJson,
          }
        });
        isUpdated = true;
        updatedCount++;
        console.log(`Updated page: ${page.title} (${page.slug})`);
      }
    }

    console.log(`Migration finished. Successfully updated ${updatedCount} pages.`);
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
