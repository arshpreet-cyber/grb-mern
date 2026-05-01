import { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditorWrapper from "@/components/editor/EditorWrapper";
import PageRenderer from "@/components/sections/PageRenderer";
import HeroBanner from "@/components/home/HeroBanner";
import { BuyReviewsSection } from "@/components/home/BuyReviewsSection";
import CustomPlatform from "@/components/home/CustomPlatform";
import StatsBar from "@/components/home/StatsBar";
import IconGrid from "@/components/home/IconGrid";
import SectionWithRightImage from "@/components/home/SectionWithRightImage";
import SectionWithLeftImage from "@/components/home/SectionWithLeftImage";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import FaqSection from "@/components/home/FaqSection";
import { HOME_PAGE_DATA } from "@/lib/constants/pageData";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: 'home' } });
  if (!page) return { title: "Home | GetReviews.buzz" };
  return {
    title: page.metaTitle || "Home | GetReviews.buzz",
    description: page.metaDescription || "Elevate your brand with reviews that actually convert.",
    keywords: page.keywords || undefined,
    robots: page.robotsText || "index, follow",
  };
}

async function getHomePage() {
  try {
    return await prisma.page.findUnique({
      where: { slug: 'home' },
    }) as any;
  } catch (error) {
    console.error("Failed to load home page", error);
    return null;
  }
}

export default async function HomePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ edit?: string, preview?: string }> 
}) {
  const { edit, preview } = await searchParams;
  const isEditMode = edit === 'true';
  const isPreviewMode = preview === 'true';
  const page = await getHomePage();

  if (isEditMode && page) {
    return <EditorWrapper initialPage={page} />;
  }

  // Decide which sections to render
  const sectionsToRender = isPreviewMode 
    ? (page && Array.isArray(page.draftSections) && (page.draftSections as any[]).length > 0 ? (page.draftSections as any[]) : (page?.sections as any[]))
    : (page && Array.isArray(page.sections) ? (page.sections as any[]) : []);

  // If we have dynamic content in the DB, render it.
  if (sectionsToRender && sectionsToRender.length > 0) {
    return (
      <>
        {page?.headerScript && <div dangerouslySetInnerHTML={{ __html: page.headerScript }} />}
        <div className="min-h-screen bg-white text-slate-900 font-sans">
          <PageRenderer sections={sectionsToRender.filter((s: any) => s.settings?.visibility !== false)} />
        </div>
        {page?.bodyScript && <div dangerouslySetInnerHTML={{ __html: page.bodyScript }} />}
        {page?.footerScript && <div dangerouslySetInnerHTML={{ __html: page.footerScript }} />}
      </>
    );
  }

  // Static Fallback (only if DB is empty)
  const { visibilitySection } = HOME_PAGE_DATA;
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <HeroBanner />
      <BuyReviewsSection />
      <CustomPlatform />
      <StatsBar />
      <IconGrid />
      <SectionWithRightImage 
        title={visibilitySection.title}
        content={visibilitySection.content}
      />
      <SectionWithLeftImage />
      <HomeBlogSection />
      <FaqSection />
    </div>
  );
}