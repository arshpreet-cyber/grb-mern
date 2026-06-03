import type { Product } from './products';

export interface DefaultSection {
  id: string;
  type: string;
  data: Record<string, any>;
  settings: {
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    visibility?: boolean;
  };
}

/**
 * Returns the default sections JSON for a product page.
 * Used as fallback when the DB has no Page record for this product,
 * and also used when seeding new product pages into the DB.
 */
export function getDefaultProductSections(product: Product): DefaultSection[] {
  const isGoogle =
    product.platform.toLowerCase().includes('google reviews') ||
    product.id === 'buy-google-reviews';

  return [
    // ─── 1. Product Banner ───────────────────────────────────
    {
      id: `section-pb-${product.id}`,
      type: 'productbanner',
      data: {
        productId: product.id,
        title: product.platform,
        description: product.desc,
        image: product.image,
        pricePerReview: product.oneTimePrice,
        ratingText: '4.9 · 2,847+ Reviews',
        checklist: [
          'Real, verified accounts — no bots or fakes',
          'Gradual drip-feed for natural-looking growth',
          'Custom written content tailored to your brand',
          'Free replacements within 30 days',
        ],
        stats: [
          {
            img: 'https://beta.getreviews.buzz/storage/app/blog/0000064001779424671_costumer-1.svg',
            val: '10K+',
            lbl: 'Happy Clients',
          },
          {
            img: 'https://beta.getreviews.buzz/storage/app/blog/0768381001779424865_Group-1000006417.svg',
            val: '99%',
            lbl: 'Retention',
          },
          {
            img: 'https://beta.getreviews.buzz/storage/app/blog/0686695001779424894_Group-1000006418.svg',
            val: '100%',
            lbl: 'Safe & secure',
          },
        ],
      },
      settings: {
        padding: '60px 0 100px',
        visibility: true,
      },
    },

    // ─── 2. Benefits Section ─────────────────────────────────
    {
      id: `section-benefits-${product.id}`,
      type: 'benefits-section',
      data: { platform: product.platform },
      settings: {
        padding: '80px 0',
        backgroundColor: '#FFFFFF',
        visibility: true,
      },
    },

    // ─── 3. How It Works (uses component's Google Reviews defaults) ───
    {
      id: `section-hiw-${product.id}`,
      type: 'how-it-work-card',
      data: {},
      settings: {
        padding: '80px 0',
        backgroundColor: '#FFFFFF',
        visibility: true,
      },
    },

    // ─── 3. Customer Reviews (uses component's Google Reviews defaults) ─
    {
      id: `section-cr-${product.id}`,
      type: 'customer-reviews',
      data: {},
      settings: {
        padding: '80px 0',
        backgroundColor: '#FAFAF5',
        visibility: true,
      },
    },

    // ─── 4. FAQ Section (uses component's Google Reviews defaults) ──
    {
      id: `section-faq-${product.id}`,
      type: 'faq-section',
      data: {},
      settings: {
        padding: '50px 0',
        backgroundColor: '#faf8f7',
        visibility: true,
      },
    },

    // ─── 5. Similar Products ─────────────────────────────────
    {
      id: `section-sp-${product.id}`,
      type: 'similar-products',
      data: {
        excludeIds: [product.id],
      },
      settings: {
        padding: '60px 0',
        backgroundColor: '#FFFFFF',
        visibility: true,
      },
    },

    // ─── 6. CTA Product (uses component's Google Reviews defaults) ──
    {
      id: `section-cta-${product.id}`,
      type: 'cta-product',
      data: {},
      settings: {
        padding: '80px 0',
        visibility: true,
      },
    },
  ];
}

/**
 * Returns default page metadata for a product.
 */
export function getDefaultProductMeta(product: Product) {
  return {
    title: product.platform,
    metaTitle: `Buy ${product.platform} - Real & Authentic | GetReviews.buzz`,
    metaDescription: product.desc,
    keywords: `buy ${product.platform.toLowerCase()}, ${product.platform.toLowerCase()}, buy reviews, real reviews, authentic reviews`,
    robotsText: 'index, follow',
    inSitemap: true,
    status: 'Published',
  };
}
