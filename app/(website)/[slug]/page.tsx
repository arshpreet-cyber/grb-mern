export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import HomeNavbar from "@/components/layout/HomeNavbar"
import EditorWrapper from "@/components/editor/EditorWrapper";
import PageRenderer from "@/components/sections/PageRenderer";

async function getPageBySlug(slug: string) {
  try {
    return await prisma.page.findUnique({ where: { slug } });
  } catch (error) {
    console.error(`Failed to load page for slug "${slug}"`, error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Not Found" };
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
    keywords: page.keywords || undefined,
    robots: page.robotsText || "index, follow",
    alternates: page.canonicalLink ? { canonical: page.canonicalLink } : undefined,
    openGraph: page.opengraphImage ? { images: [page.opengraphImage] } : undefined,
  };
}

export default async function SlugPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ edit?: string, preview?: string }>
}) {
  const { slug } = await params;
  const { edit, preview } = await searchParams;
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  const isEditMode = edit === 'true';
  const isPreviewMode = preview === 'true';

  if (isEditMode) {
    return <EditorWrapper initialPage={page} />;
  }

  // Use draft sections if in preview mode, otherwise use live sections
  const sections = isPreviewMode 
    ? (Array.isArray(page.draftSections) && (page.draftSections as any[]).length > 0 ? (page.draftSections as any[]) : (page.sections as any[]))
    : (Array.isArray(page.sections) ? (page.sections as any[]) : []);

  return (
    <>
      {page.headerScript && (
        <div dangerouslySetInnerHTML={{ __html: page.headerScript }} />
      )}

      <div className="min-h-screen bg-white text-slate-900">
        <PageRenderer sections={sections.filter((s: any) => s.settings?.visibility !== false)} />
      </div>

      {page.bodyScript && (
        <div dangerouslySetInnerHTML={{ __html: page.bodyScript }} />
      )}
      {page.footerScript && (
        <div dangerouslySetInnerHTML={{ __html: page.footerScript }} />
      )}
    </>
  );
}
