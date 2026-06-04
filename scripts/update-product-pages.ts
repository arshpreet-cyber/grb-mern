/**
 * Update Script: Re-generate sections for all existing product pages.
 * 
 * This updates the sections JSON in the DB to use empty data for all
 * sections except productbanner, so components use their built-in
 * Google Reviews defaults.
 * 
 * Usage:
 *   npx tsx scripts/update-product-pages.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import staticProducts from '../lib/constants/products';
import { getDefaultProductSections } from '../lib/constants/productPageDefaults';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateProductPages() {
  console.log('🔄 Updating product pages with Google Reviews defaults...\n');

  // Fetch DB products
  let dbProducts: any[] = [];
  try {
    dbProducts = await prisma.product.findMany({ where: { deletedAt: null } });
  } catch (err: any) {
    console.warn(`  ⚠️  Could not fetch DB products: ${err.message}`);
  }

  // Create a map of DB products by slug and also by buy-prefixed slug
  const dbBySlug = new Map<string, any>();
  for (const dbp of dbProducts) {
    if (dbp.slug) {
      dbBySlug.set(dbp.slug, dbp);
      if (!dbp.slug.startsWith('buy-')) {
        dbBySlug.set(`buy-${dbp.slug}`, dbp);
      }
    }
  }

  // Build a map of product data by slug (DB-first, static fallback)
  const productMap = new Map<string, any>();
  const matchedDbSlugs = new Set<string>();

  // Add static products with DB merges
  for (const sp of staticProducts) {
    const slug = sp.id;
    const dbMatch = dbBySlug.get(slug);
    if (dbMatch) {
      matchedDbSlugs.add(dbMatch.slug);
      const standardPrice = dbMatch.price ? parseFloat(dbMatch.price) : sp.oneTimePrice;
      const monthlyPrice = dbMatch.dropdownPrice ? parseFloat(dbMatch.dropdownPrice) : sp.subscribePrice;
      productMap.set(slug, {
        id: slug,
        platform: dbMatch.title || sp.platform,
        image: dbMatch.media || sp.image,
        desc: dbMatch.content || dbMatch.metaDescription || sp.desc,
        oneTimePrice: standardPrice,
        subscribePrice: monthlyPrice,
        minimumQuantity: dbMatch.minimumQuantity || sp.minimumQuantity,
        badge: sp.badge,
      });
    } else {
      productMap.set(slug, sp);
    }
  }

  // Also add any DB products that aren't in the static list and haven't been matched
  for (const dbp of dbProducts) {
    if (dbp.slug && !productMap.has(dbp.slug) && !matchedDbSlugs.has(dbp.slug)) {
      const standardPrice = dbp.price ? parseFloat(dbp.price) : 0;
      productMap.set(dbp.slug, {
        id: dbp.slug,
        platform: dbp.title || 'Unknown Platform',
        image: dbp.media || '',
        desc: dbp.content || dbp.metaDescription || '',
        oneTimePrice: standardPrice,
        subscribePrice: dbp.dropdownPrice ? parseFloat(dbp.dropdownPrice) : standardPrice * 0.9,
        badge: null,
        minimumQuantity: dbp.minimumQuantity || 1,
      });
    }
  }

  // Get all pages that match product slugs
  const allPages = await prisma.page.findMany({
    select: { id: true, slug: true },
  });

  let updated = 0;
  let skipped = 0;

  for (const page of allPages) {
    const product = productMap.get(page.slug);
    if (!product) {
      // Not a product page, skip
      continue;
    }

    try {
      const newSections = getDefaultProductSections(product);
      await prisma.page.update({
        where: { id: page.id },
        data: {
          sections: JSON.parse(JSON.stringify(newSections)),
          draftSections: JSON.parse(JSON.stringify(newSections)),
        },
      });
      console.log(`  ✅ Updated: "${page.slug}"`);
      updated++;
    } catch (err: any) {
      console.error(`  ❌ Error for "${page.slug}":`, err.message);
      skipped++;
    }
  }

  console.log('\n────────────────────────────────────');
  console.log(`✅ Updated: ${updated}`);
  console.log(`❌ Errors:  ${skipped}`);
  console.log('────────────────────────────────────\n');
}

updateProductPages()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
