export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import EditorWrapper from "@/components/editor/EditorWrapper";
import PageRenderer from "@/components/sections/PageRenderer";
import PageScripts from "@/components/layout/PageScripts";
import { getDefaultProductSections, getDefaultProductMeta } from "@/lib/constants/productPageDefaults";

async function getPageBySlug(slug: string) {
  try {
    return await prisma.page.findUnique({ where: { slug } }) as any;
  } catch (error) {
    console.error(`Failed to load page for slug "${slug}"`, error);
    return null;
  }
}

async function getProductBySlug(slug: string) {
  try {
    const dbProduct = await prisma.product.findFirst({
      where: {
        slug,
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

async function autoCreateProductPage(slug: string, product: {
  id: number | string;
  slug: string;
  platform: string;
  image: string;
  desc: string;
  oneTimePrice: number;
  subscribePrice: number;
  minimumQuantity: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}) {
  const productForDefaults = {
    id: String(product.slug || product.id),
    platform: product.platform,
    image: product.image,
    desc: product.desc || '',
    oneTimePrice: product.oneTimePrice,
    subscribePrice: product.subscribePrice,
    badge: null,
    minimumQuantity: product.minimumQuantity,
  };

  const defaultSections = getDefaultProductSections(productForDefaults);
  const meta = getDefaultProductMeta(productForDefaults);

  try {
    const createdPage = await prisma.page.create({
      data: {
        slug,
        title: meta.title,
        sections: defaultSections as any,
        draftSections: defaultSections as any,
        status: 'Published',
        metaTitle: product.metaTitle || meta.metaTitle,
        metaDescription: product.metaDescription || meta.metaDescription || '',
        keywords: product.keywords || meta.keywords || '',
        canonicalLink: '',
        robotsText: meta.robotsText,
        inSitemap: meta.inSitemap,
        titleImage: '',
        opengraphImage: '',
        schemaCode: '',
        headerScript: '',
        bodyScript: '',
        footerScript: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return createdPage as any;
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return await getPageBySlug(slug);
    }
    console.error(`Failed to auto-create page for product slug "${slug}"`, error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

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

  const dbProduct = await getProductBySlug(slug);
  if (dbProduct) {
    return {
      title: dbProduct.metaTitle || `Buy ${dbProduct.platform} - Real & Authentic | GetReviews.buzz`,
      description: dbProduct.metaDescription || dbProduct.desc,
      keywords: dbProduct.keywords,
      robots: "index, follow",
    };
  }

  return { title: "Not Found" };
}

export default async function ProductReviewsPage({
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

  const product = await getProductBySlug(slug);
  if (!product) {
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

  let page = await getPageBySlug(slug);

  if (page) {
    const sections = isPreviewMode
      ? (Array.isArray(page.draftSections) && (page.draftSections as any[]).length > 0 ? (page.draftSections as any[]) : (page.sections as any[]))
      : (Array.isArray(page.sections) ? (page.sections as any[]) : []);

    if (isEditMode) {
      const pageCopy = {
        ...page,
        sections,
        draftSections: page.draftSections && page.draftSections.length > 0 ? page.draftSections : page.sections
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

  const productForPage = product;

  if (productForPage) {
    page = await autoCreateProductPage(slug, productForPage);

    if (page) {
      const sections = Array.isArray(page.sections) ? (page.sections as any[]) : [];

      if (isEditMode) {
        const pageCopy = {
          ...page,
          sections,
          draftSections: Array.isArray(page.draftSections) && page.draftSections.length > 0
            ? page.draftSections
            : sections,
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
  }

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
