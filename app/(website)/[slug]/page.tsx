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

    const hasBenefits = sections.some((s: any) => s.type === 'benefits-section');
    if (!hasBenefits && isProductPage) {
      const productObj = products.find((p) => p.id === slug || p.id === cleanSlug);
      const platformName = productObj?.platform || page.title.replace("Reviews", "").trim() || "Google";
      const benefitsSec = {
        id: `section-benefits-${slug}-${Date.now()}`,
        type: 'benefits-section',
        data: { platform: platformName },
        settings: {
          padding: '80px 0',
          backgroundColor: '#FFFFFF',
          visibility: true,
        }
      };
      const bannerIndex = sections.findIndex((s: any) => s.type === 'productbanner');
      if (bannerIndex !== -1) {
        sections.splice(bannerIndex + 1, 0, benefitsSec);
      } else {
        sections.unshift(benefitsSec);
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
