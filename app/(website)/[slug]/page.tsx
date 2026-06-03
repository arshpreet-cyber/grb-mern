export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import EditorWrapper from "@/components/editor/EditorWrapper";
import PageRenderer from "@/components/sections/PageRenderer";
import PageScripts from "@/components/layout/PageScripts";
import SingleProductPage from "@/components/sections/SingleProductPage";
import products from "@/lib/constants/products";
import { getDefaultProductSections, getDefaultProductMeta } from "@/lib/constants/productPageDefaults";

// ─── Data fetchers ───────────────────────────────────────────

async function getPageBySlug(slug: string) {
  try {
    return await prisma.page.findUnique({ where: { slug } }) as any;
  } catch (error) {
    console.error(`Failed to load page for slug "${slug}"`, error);
    return null;
  }
}

/** Fetch the product from the DB Product table by slug */
async function getProductBySlug(slug: string) {
  try {
    const dbProduct = await prisma.product.findFirst({
      where: {
        slug: {
          in: [slug, slug.replace(/^buy-/, '')]
        },
        deletedAt: null
      },
    });
    if (dbProduct) {
      const standardPrice = dbProduct.price ? parseFloat(dbProduct.price) : 0;
      const monthlyPrice = dbProduct.dropdownPrice
        ? parseFloat(dbProduct.dropdownPrice)
        : standardPrice * 0.9;
      return {
        id: dbProduct.id,
        slug: dbProduct.slug || slug,
        platform: dbProduct.title || "Unknown Platform",
        image: dbProduct.media || "",
        desc: dbProduct.content || dbProduct.metaDescription || "",
        oneTimePrice: standardPrice,
        subscribePrice: monthlyPrice,
        minimumQuantity: dbProduct.minimumQuantity || 1,
        metaTitle: dbProduct.metaTitle || undefined,
        metaDescription: dbProduct.metaDescription || undefined,
        keywords: dbProduct.keywords || undefined,
      };
    }
    return null;
  } catch (error) {
    console.error(`Failed to load product for slug "${slug}"`, error);
    return null;
  }
}

/** Fallback: find a matching product from the static constants file */
function findStaticProduct(slug: string) {
  const match = products.find((p) => p.id === slug);
  if (!match) return null;
  return {
    id: match.id,
    slug: match.id,
    platform: match.platform,
    image: match.image,
    desc: match.desc,
    oneTimePrice: match.oneTimePrice,
    subscribePrice: match.subscribePrice,
    minimumQuantity: match.minimumQuantity,
  };
}

// ─── Metadata ────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  // 1. Try DB page
  const page = await getPageBySlug(slug);
  if (page) {
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
      keywords: page.keywords || undefined,
      robots: page.robotsText || "index, follow",
      alternates: page.canonicalLink ? { canonical: page.canonicalLink } : undefined,
      openGraph: page.opengraphImage ? { images: [page.opengraphImage] } : undefined,
    };
  }

  // 2. Try DB product
  const dbProduct = await getProductBySlug(slug);
  if (dbProduct) {
    return {
      title: dbProduct.metaTitle || `Buy ${dbProduct.platform} - Real & Authentic | GetReviews.buzz`,
      description: dbProduct.metaDescription || dbProduct.desc,
      keywords: dbProduct.keywords,
      robots: "index, follow",
    };
  }

  // 3. Try static product (file fallback)
  const staticProduct = findStaticProduct(slug);
  if (staticProduct) {
    return {
      title: `Buy ${staticProduct.platform} - Real & Authentic | GetReviews.buzz`,
      description: staticProduct.desc,
      robots: "index, follow",
    };
  }

  return { title: "Not Found" };
}

// ─── Page component ──────────────────────────────────────────

export default async function SlugPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ edit?: string, preview?: string }>
}) {
  const { slug } = await params;
  const { edit, preview } = await searchParams;
  const isEditMode = edit === 'true';
  const isPreviewMode = preview === 'true';
  const page = await getPageBySlug(slug);

  // ══════════════════════════════════════════════════════════
  // PATH 1: Page exists in DB → render via PageRenderer (CMS)
  // (Same as homepage when it has DB sections)
  // ══════════════════════════════════════════════════════════
  if (page) {
    const cleanSlug = slug.replace(/^buy-/, '');
    const isProductPage = products.some((p) => p.id === slug || p.id === cleanSlug);

    let sections = isPreviewMode 
      ? (Array.isArray(page.draftSections) && (page.draftSections as any[]).length > 0 ? (page.draftSections as any[]) : (page.sections as any[]))
      : (Array.isArray(page.sections) ? (page.sections as any[]) : []);

    sections = [...sections];

    if (isProductPage) {
      const productObj = products.find((p) => p.id === slug || p.id === cleanSlug);
      const platformName = productObj?.platform || page.title.replace("Reviews", "").trim() || "Google";

      // 1. Similar Products
      const hasSimilar = sections.some((s: any) => s.type === 'similar-products');
      if (!hasSimilar) {
        const similarSec = {
          id: `section-sp-${slug}-${Date.now()}`,
          type: 'similar-products',
          data: { excludeIds: [slug] },
          settings: { padding: '60px 0', backgroundColor: '#FFFFFF', visibility: true }
        };
        const bannerIndex = sections.findIndex((s: any) => s.type === 'productbanner');
        sections.splice(bannerIndex !== -1 ? bannerIndex + 1 : 0, 0, similarSec);
      }

      // 2. Image Text 1 (How We Help You Manage)
      const hasImgText1 = sections.some((s: any) => s.type === 'image-text' && s.data?.title?.includes("How We Help You Manage"));
      if (!hasImgText1) {
        const imgText1Sec = {
          id: `section-imgtext-1-${slug}-${Date.now()}`,
          type: 'image-text',
          data: {
            title: `How We Help You Manage <br/> <span class='font-semibold'>${platformName} Reviews</span>`,
            content: `<p>We take a strategic, secure approach to ${platformName} reputation management that improves your profile while keeping reviews authentic.</p><p>Our custom reviews accurately reflect customer experiences, boosting credibility and trustworthiness.</p>`,
            image: "/uploads/media/safe_reviews_graphic.png",
            imagePosition: "left",
            showButton: false,
          },
          settings: { padding: '80px 0', backgroundColor: '#FFFFFF', visibility: true }
        };
        const similarIndex = sections.findIndex((s: any) => s.type === 'similar-products');
        sections.splice(similarIndex !== -1 ? similarIndex + 1 : 1, 0, imgText1Sec);
      }

      // 3. How It Works
      const hasHowItWorks = sections.some((s: any) => s.type === 'how-it-work-card');
      if (!hasHowItWorks) {
        const howItWorksSec = {
          id: `section-how-it-work-card-${slug}-${Date.now()}`,
          type: 'how-it-work-card',
          data: {
            heading: "How It Works in <strong>4 Simple Steps</strong>",
            subheading: "Our process is quick, simple, and designed to help you improve your online reputation effortlessly.",
            steps: [
              { 
                title: "Pick A Review", 
                desc: `Choose The Type And Number Of ${platformName} Reviews You Want To Improve Your Company's Profile.`, 
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
                desc: `Buy ${platformName} Reviews With A Secure, One-Step Checkout And Your Preferred Payment Method.`, 
                color: "bg-green-100", 
                icon: { href: "/uploads/media/1777978022187-e61c5a1a-4fe8-41d4-9e55-a6c5f33f2cb5-Group-844.svg" } 
              },
              { 
                title: "Fill Business Details", 
                desc: `Include Your ${platformName} Link And Any Customization Instructions.`, 
                color: "bg-indigo-100", 
                icon: { href: "/uploads/media/1777978039825-2a6a3096-e833-42c5-8286-e4b1a7a10566-Group-846.svg" } 
              },
            ]
          },
          settings: { padding: '80px 0', backgroundColor: '#FFFFFF', visibility: true }
        };
        const imgText1Index = sections.findIndex((s: any) => s.type === 'image-text' && s.data?.title?.includes("How We Help You Manage"));
        sections.splice(imgText1Index !== -1 ? imgText1Index + 1 : 2, 0, howItWorksSec);
      }

      // 4. Benefits
      const hasBenefits = sections.some((s: any) => s.type === 'benefits-section');
      if (!hasBenefits) {
        const benefitsSec = {
          id: `section-benefits-${slug}-${Date.now()}`,
          type: 'benefits-section',
          data: { platform: platformName },
          settings: { padding: '80px 0', backgroundColor: '#FFFFFF', visibility: true }
        };
        const stepsIndex = sections.findIndex((s: any) => s.type === 'how-it-work-card');
        sections.splice(stepsIndex !== -1 ? stepsIndex + 1 : 3, 0, benefitsSec);
      }


      // 5. Drawbacks
      const hasDrawbacks = sections.some((s: any) => s.type === 'organic-drawbacks');
      if (!hasDrawbacks) {
        const drawbacksSec = {
          id: `section-drawbacks-${slug}-${Date.now()}`,
          type: 'organic-drawbacks',
          data: {
            platform: platformName,
            heading: `The Drawbacks Of Relying Solely On Organic ${platformName} Reviews`,
            subheading: `While organic ${platformName} reviews are useful for establishing credibility, relying solely on them can present several challenges that may slow your company's growth. Here are some major drawbacks:`,
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
            ]
          },
          settings: { padding: '80px 0', backgroundColor: '#FFFFFF', visibility: true }
        };
        const benefitsIndex = sections.findIndex((s: any) => s.type === 'benefits-section');
        sections.splice(benefitsIndex !== -1 ? benefitsIndex + 1 : 4, 0, drawbacksSec);
      }

      // 6. Safe Reviews Carousel
      const hasSafeReviews = sections.some((s: any) => s.type === 'safe-reviews-carousel');
      if (!hasSafeReviews) {
        const safeReviewsSec = {
          id: `section-safe-reviews-${slug}-${Date.now()}`,
          type: 'safe-reviews-carousel',
          data: {
            platform: platformName,
            slides: [
              {
                heading: `How We Provide Safe And Authentic ${platformName} Reviews`,
                subheading: `We take a strategic, secure approach to ${platformName} reputation management that improves your profile while keeping reviews authentic.`,
                listTitle: `Here's how we keep ${platformName} reviews safe and authentic:`,
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
                heading: "Targeted Geolocation Profiles",
                subheading: `We assign reviews to profiles that match the geographic location of your business for maximum local SEO impact.`,
                listTitle: "How we ensure localized profile matching:",
                features: [
                  {
                    title: "IP-Verified Routing",
                    desc: `Reviews are posted using residential IPs matching your business's target cities and neighborhoods.`,
                  },
                  {
                    title: "Realistic Activity Patterns",
                    desc: "Reviewers have historical check-ins and reviews in your region, making their profiles fully organic and relevant.",
                  },
                  {
                    title: "SEO-Optimized Content",
                    desc: "Our custom reviews contain regional keywords to boost your local map pack search visibility ranking.",
                  },
                ],
                image: "/uploads/media/safe_reviews_graphic.png",
              },
              {
                heading: "Active Anti-Drop Refill Guarantee",
                subheading: "We implement rigorous quality controls and follow up with a 30-day warranty to keep your rating intact.",
                listTitle: "Our reliability and safety features include:",
                features: [
                  {
                    title: "Strict Account Verification",
                    desc: "All review profiles pass continuous checks to confirm active status on local directories.",
                  },
                  {
                    title: "30-Day Free Replacements",
                    desc: "If any reviews are filtered or dropped, our automated system replaces them free of charge within 24 hours.",
                  },
                  {
                    title: "Safe, Compliant Billing",
                    desc: "Billing info is completely separated and kept private from directory crawler bots to guarantee profile safety.",
                  },
                ],
                image: "/uploads/media/safe_reviews_graphic.png",
              },
            ]
          },
          settings: { padding: '80px 0', visibility: true }
        };
        const drawbacksIndex = sections.findIndex((s: any) => s.type === 'organic-drawbacks');
        sections.splice(drawbacksIndex !== -1 ? drawbacksIndex + 1 : 5, 0, safeReviewsSec);
      }

      // 7. Image Text 2 (We Focus on Building)
      const hasImgText2 = sections.some((s: any) => s.type === 'image-text' && s.data?.title?.includes("We Focus on Building"));
      if (!hasImgText2) {
        const imgText2Sec = {
          id: `section-imgtext-2-${slug}-${Date.now()}`,
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
          settings: { padding: '80px 0', backgroundColor: '#FFFFFF', visibility: true }
        };
        const safeIndex = sections.findIndex((s: any) => s.type === 'safe-reviews-carousel');
        sections.splice(safeIndex !== -1 ? safeIndex + 1 : 6, 0, imgText2Sec);
      }
    }

    if (isEditMode) {
      const pageCopy = { 
        ...page, 
        sections, 
        draftSections: page.draftSections && page.draftSections.length > 0 ? sections : page.sections 
      };
      return <EditorWrapper initialPage={pageCopy} />;
    }

    return (
      <>
        <PageScripts headerScript={page.headerScript} bodyScript={page.bodyScript} footerScript={page.footerScript} />
        <div className="min-h-screen bg-white text-slate-900">
          <PageRenderer sections={sections.filter((s: any) => s.settings?.visibility !== false)} />
        </div>
      </>
    );
  }

  // ══════════════════════════════════════════════════════════
  // PATH 2: No DB page — try product (DB first, then static)
  // (Same as homepage's static fallback, but with product data)
  // ══════════════════════════════════════════════════════════
  const product = (await getProductBySlug(slug)) || findStaticProduct(slug);

  if (product) {
    // If admin wants to edit, seed a virtual page with default sections
    if (isEditMode) {
      const meta = getDefaultProductMeta({ 
        id: String(product.slug || product.id),
        platform: product.platform,
        image: product.image,
        desc: product.desc || '',
        oneTimePrice: product.oneTimePrice,
        subscribePrice: product.subscribePrice,
        badge: null,
        minimumQuantity: product.minimumQuantity,
      });
      const defaultSections = getDefaultProductSections({
        id: String(product.slug || product.id),
        platform: product.platform,
        image: product.image,
        desc: product.desc || '',
        oneTimePrice: product.oneTimePrice,
        subscribePrice: product.subscribePrice,
        badge: null,
        minimumQuantity: product.minimumQuantity,
      });
      const virtualPage = {
        id: '',
        title: meta.title,
        slug,
        status: 'Draft',
        sections: defaultSections,
        draftSections: defaultSections,
        metaTitle: meta.metaTitle,
        metaDescription: meta.metaDescription,
        keywords: meta.keywords,
        robotsText: meta.robotsText,
        inSitemap: meta.inSitemap,
        headerScript: null,
        bodyScript: null,
        footerScript: null,
        titleImage: null,
        opengraphImage: null,
        canonicalLink: null,
        schemaCode: null,
      };
      return <EditorWrapper initialPage={virtualPage} />;
    }

    // ── Static fallback: render product page directly with props ──
    // (Same pattern as homepage rendering <HeroBanner>, <BuyReviewsSection>, etc.)
    return <SingleProductPage product={product} />;
  }

  // ══════════════════════════════════════════════════════════
  // PATH 3: Nothing matched — 404
  // ══════════════════════════════════════════════════════════
  if (isEditMode) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-xl font-bold text-gray-700">Page not found in database.</p>
        <p className="text-sm text-gray-500">Slug: <code>{slug}</code></p>
      </div>
    );
  }
  notFound();
}
