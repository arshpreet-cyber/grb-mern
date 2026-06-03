/**
 * Seed Script: Create a Page record for every product.
 * 
 * Usage:
 *   npx tsx scripts/seed-product-pages.ts
 * 
 * This script:
 *  1. Fetches all products from the DB Product table
 *  2. Falls back to static products.ts for any missing data
 *  3. For each product, checks if a Page with that slug already exists
 *  4. If not, creates a new Page record with default sections
 *  5. Safe to re-run — skips products that already have a page
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import staticProducts from '../lib/constants/products';
import { getDefaultProductSections, getDefaultProductMeta } from '../lib/constants/productPageDefaults';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedProductPages() {
  console.log('🌱 Starting product pages seed...\n');

  // ── 1. Fetch all DB products ──────────────────────────────
  let dbProducts: any[] = [];
  try {
    dbProducts = await prisma.product.findMany({
      where: { deletedAt: null },
    });
    console.log(`   📦 Found ${dbProducts.length} products in DB Product table.`);
  } catch (err: any) {
    console.warn(`   ⚠️  Could not fetch DB products: ${err.message}`);
  }

  // ── 2. Build a merged product list (DB-first, static fallback) ──
  const dbBySlug = new Map<string, any>();
  for (const dbp of dbProducts) {
    if (dbp.slug) {
      dbBySlug.set(dbp.slug, dbp);
      if (!dbp.slug.startsWith('buy-')) {
        dbBySlug.set(`buy-${dbp.slug}`, dbp);
      }
    }
  }

  // Start with static products as the base list (ensures all slugs covered)
  const allSlugs = new Set<string>();
  const matchedDbSlugs = new Set<string>();
  const productList: Array<{
    slug: string;
    platform: string;
    image: string;
    desc: string;
    oneTimePrice: number;
    subscribePrice: number;
    minimumQuantity: number;
  }> = [];

  // Add static products
  for (const sp of staticProducts) {
    const slug = sp.id;
    allSlugs.add(slug);

    // Check if DB has this product for fresh data
    const dbMatch = dbBySlug.get(slug);
    if (dbMatch) {
      matchedDbSlugs.add(dbMatch.slug);
      const standardPrice = dbMatch.price ? parseFloat(dbMatch.price) : sp.oneTimePrice;
      const monthlyPrice = dbMatch.dropdownPrice ? parseFloat(dbMatch.dropdownPrice) : sp.subscribePrice;
      productList.push({
        slug,
        platform: dbMatch.title || sp.platform,
        image: dbMatch.media || sp.image,
        desc: dbMatch.content || dbMatch.metaDescription || sp.desc,
        oneTimePrice: standardPrice,
        subscribePrice: monthlyPrice,
        minimumQuantity: dbMatch.minimumQuantity || sp.minimumQuantity,
      });
    } else {
      productList.push({
        slug,
        platform: sp.platform,
        image: sp.image,
        desc: sp.desc,
        oneTimePrice: sp.oneTimePrice,
        subscribePrice: sp.subscribePrice,
        minimumQuantity: sp.minimumQuantity,
      });
    }
  }

  // Also add any DB products that aren't in the static list and haven't been matched
  for (const dbp of dbProducts) {
    if (dbp.slug && !allSlugs.has(dbp.slug) && !matchedDbSlugs.has(dbp.slug)) {
      allSlugs.add(dbp.slug);
      const standardPrice = dbp.price ? parseFloat(dbp.price) : 0;
      const monthlyPrice = dbp.dropdownPrice ? parseFloat(dbp.dropdownPrice) : standardPrice * 0.9;
      productList.push({
        slug: dbp.slug,
        platform: dbp.title || 'Unknown Platform',
        image: dbp.media || '',
        desc: dbp.content || dbp.metaDescription || '',
        oneTimePrice: standardPrice,
        subscribePrice: monthlyPrice,
        minimumQuantity: dbp.minimumQuantity || 1,
      });
    }
  }

  console.log(`   📋 Total products to process: ${productList.length}\n`);

  // ── 3. Seed Page records ──────────────────────────────────
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of productList) {
    const { slug } = product;

    try {
      const existing = await prisma.page.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (existing) {
        console.log(`  ⏭️  Skipped: "${slug}" (already exists)`);
        skipped++;
        continue;
      }

      // Build a Product-shaped object for the defaults generators
      const productForDefaults = {
        id: slug,
        platform: product.platform,
        image: product.image,
        desc: product.desc,
        oneTimePrice: product.oneTimePrice,
        subscribePrice: product.subscribePrice,
        badge: null,
        minimumQuantity: product.minimumQuantity,
      };

      const sections = getDefaultProductSections(productForDefaults);
      const meta = getDefaultProductMeta(productForDefaults);

      await prisma.page.create({
        data: {
          title: meta.title,
          slug,
          status: meta.status,
          metaTitle: meta.metaTitle,
          metaDescription: meta.metaDescription,
          keywords: meta.keywords,
          robotsText: meta.robotsText,
          inSitemap: meta.inSitemap,
          sections: JSON.parse(JSON.stringify(sections)),
          draftSections: JSON.parse(JSON.stringify(sections)),
        },
      });

      console.log(`  ✅ Created: "${slug}" — ${product.platform}`);
      created++;
    } catch (err: any) {
      console.error(`  ❌ Error for "${slug}":`, err.message || err);
      errors++;
    }
  }

  console.log('\n────────────────────────────────────');
  console.log(`✅ Created: ${created}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors:  ${errors}`);
  console.log(`📊 Total:   ${productList.length}`);
  console.log('────────────────────────────────────\n');
}

seedProductPages()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
