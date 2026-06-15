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
            img: '/uploads/media/1781499499702-738565c9-f87d-403e-9e60-0dbd3ee00f71-Vector-1-.svg',
            val: '10K+',
            lbl: 'Happy Clients',
          },
          {
            img: '/uploads/media/1781499507867-a4c5174e-3a63-4316-83b4-13af71e98937-diagram-2.svg',
            val: '99%',
            lbl: 'Retention',
          },
          {
            img: '/uploads/media/1781499520046-54ff665e-db79-4218-9d0f-ba3e1ef89cbf-Group-1000006419.svg',
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

    // ─── 2. Similar Products ─────────────────────────────────
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

    // ─── 3. Image Text Section (1st instance) ───────────────────
    {
      id: `section-imgtext-1-${product.id}`,
      type: 'image-text',
      data: {
        title: `How We Help You Manage <br/> <span class='font-semibold'>${product.platform} Reviews</span>`,
        content: `<p>We take a strategic, secure approach to ${product.platform} reputation management that improves your profile while keeping reviews authentic.</p><p>Our custom reviews accurately reflect customer experiences, boosting credibility and trustworthiness.</p>`,
        image: "/uploads/media/safe_reviews_graphic.png",
        imagePosition: "left",
        showButton: false,
      },
      settings: {
        padding: '80px 0',
        backgroundColor: '#FFFFFF',
        visibility: true,
      },
    },

    // ─── 4. How It Works Section ─────────────────────────────
    {
      id: `section-how-it-work-card-${product.id}`,
      type: 'how-it-work-card',
      data: {
        heading: "How It Works in <strong>4 Simple Steps</strong>",
        subheading: "Our process is quick, simple, and designed to help you improve your online reputation effortlessly.",
        steps: [
          {
            title: "Pick A Review",
            desc: `Choose The Type And Number Of ${product.platform} Reviews You Want To Improve Your Company's Profile.`,
            color: "bg-yellow-100",
            icon: { href: "/uploads/media/1777977982660-8109977b-4427-4a5e-955a-11ba0bb2ac91-rating-1.svg" }
          },
          {
            title: "Select Your Package",
            desc: "Pick The Number Of Reviews Or The Service Package That Fits Your Needs.",
            color: "bg-blue-100",
            icon: { href: "/uploads/media/1777978008677-ecbb379c-db78-4858-84fe-1d5559314feb-XMLID-991-.svg" }
          },
          {
            title: "Configure & Order",
            desc: `Buy ${product.platform} Reviews With A Secure, One-Step Checkout And Your Preferred Payment Method.`,
            color: "bg-green-100",
            icon: { href: "/uploads/media/1777978022187-e61c5a1a-4fe8-41d4-9e55-a6c5f33f2cb5-Group-844.svg" }
          },
          {
            title: "Fill Business Details",
            desc: `Include Your ${product.platform} Link And Any Customization Instructions.`,
            color: "bg-indigo-100",
            icon: { href: "/uploads/media/1777978039825-2a6a3096-e833-42c5-8286-e4b1a7a10566-Group-846.svg" }
          },
        ]
      },
      settings: {
        padding: '80px 0',
        backgroundColor: '#FFFFFF',
        visibility: true,
      },
    },


    // ─── 5. Benefits Section ─────────────────────────────────
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

    // ─── 6. Organic Drawbacks Section ──────────────────────────────────
    {
      id: `section-drawbacks-${product.id}`,
      type: 'organic-drawbacks',
      data: {
        platform: product.platform,
        heading: `The Drawbacks Of Relying Solely On Organic ${product.platform} Reviews`,
        subheading: `While organic ${product.platform} reviews are useful for establishing credibility, relying solely on them can present several challenges that may slow your company's growth. Here are some major drawbacks:`,
        cards: [
          {
            title: "Slow and Unpredictable Growth",
            iconType: "chart",
            paragraphs: [
              `Obtaining organic reviews necessitates that customers take the initiative to provide feedback, which can be a slow and inconsistent process.`,
              `Since many happy consumers just don't write reviews, it can be challenging to build a strong online reputation fast.`,
            ],
          },
          {
            title: "Vulnerable to Negative Feedback",
            iconType: "warning",
            paragraphs: [
              `A single disgruntled customer or malicious competitor can easily damage your score. Without a steady stream of positive feedback, your rating suffers disproportionately.`,
              `Relying on organic reviews means you have no control over the frequency and timing of reviews to balance negative feedback.`,
            ],
          },
          {
            title: "Outpaced by Competitors",
            iconType: "competition",
            paragraphs: [
              `Competitors who actively acquire reviews will quickly outrank you in search visibility and local map pack rankings.`,
              `If you rely solely on natural review growth, it could take years to reach the rating volume that your competitors achieve in weeks.`,
            ],
          },
        ],
      },
      settings: {
        padding: '80px 0',
        backgroundColor: '#FFFFFF',
        visibility: true,
      },
    },

    // ─── 7. Safe Reviews Carousel ──────────────────────────────────────
    {
      id: `section-safe-reviews-${product.id}`,
      type: 'safe-reviews-carousel',
      data: {
        platform: product.platform,
        slides: [
          {
            heading: `How We Provide Safe<br/>And <strong>Authentic ${product.platform} Reviews</strong>`,
            subheading: `We take a strategic, secure approach to ${product.platform} reputation management that improves your profile while keeping reviews authentic.`,
            listTitle: `Here's how we keep ${product.platform} reviews safe and authentic:`,
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
            image: "/uploads/media/safe_reviews_graphic.png",
          },
          {
            heading: `Achieve Business Growth<br/>When <strong>You Manage ${product.platform} Reviews</strong>`,
            layout: "paragraphs",
            features: [
              {
                desc: `Buying ${product.platform} reviews online is not only a good way to improve your brand's image, but it also helps to attract more customers to your store, both online and offline. Our ${product.platform} review management services help your brand stand out in the crowded digital landscape.`,
              },
              {
                desc: `By using our buy ${product.platform} reviews service, you can get genuine feedback from local profiles at a low cost to help your business succeed.`,
              },
              {
                desc: `We help professional service providers rank higher in local searches by buying ${product.platform} 5-star reviews for their ${product.platform} Business Profiles. High-quality ${product.platform} reviews ensure customer satisfaction and maximize your brand's influence in the target market.`,
              },
            ],
            button: {
              text: "Get a Quote",
              link: "/contact-us",
            },
            image: "/uploads/media/safe_reviews_graphic.png",
          },
          {
            heading: `Should You Proactively Get Reviews<br/>or <strong>Rely on Organic ${product.platform} Reviews?</strong>`,
            layout: "paragraphs",
            features: [
              {
                desc: `Are you unsure whether to pay for ${product.platform} reviews or wait for them to appear organically? Organic reviews are valuable but slow, while a structured plan to generate ${product.platform} reviews delivers consistent results.`,
              },
              {
                desc: `This delay can have an impact on your company's growth, particularly if you're in a competitive market. Buying ${product.platform} reviews instantly boosts your business's credibility, improves search rankings, and attracts more customers to your GMB profile.`,
              },
              {
                desc: `Unlike organic reviews, buying reviews guarantees consistent and strategic positive feedback, higher ratings, and a strong online presence.`,
              },
              {
                desc: `Many businesses choose to buy ${product.platform} 5-star reviews to increase brand trust and stay ahead of competitors. When done correctly with high-quality, real-looking reviews, this approach improves your reputation and reinforces customer confidence.`,
              },
            ],
            image: "/uploads/media/safe_reviews_graphic.png",
          },
        ],
      },
      settings: {
        padding: '80px 0',
        visibility: true,
      },
    },

    // ─── 8. Image Text Section (2nd instance) ───────────────────
    {
      id: `section-imgtext-2-${product.id}`,
      type: 'image-text',
      data: {
        title: `We Focus on Building <br/> <span class='font-semibold'>a Reputation for Your Business</span>`,
        content: `<p>A well-reviewed business will appear higher in search results, making it easier for potential customers to find.</p><p>More reviews boost your company's reliability and local-global reach. People read reviews before they buy or visit a business.</p>`,
        image: "https://getreviews.buzz/storage/app/blog/0547241001776770835_0936012001776065359_right-img.png",
        imagePosition: "left",
        buttonText: "Read More",
        buttonLink: "/",
        showButton: true,
      },
      settings: {
        padding: '80px 0',
        backgroundColor: '#FFFFFF',
        visibility: true,
      },
    },


    // ─── 10. Customer Reviews ────────────────────────────────────────
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

    // ─── 11. FAQ Section ─────────────────────────────────────────────
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
