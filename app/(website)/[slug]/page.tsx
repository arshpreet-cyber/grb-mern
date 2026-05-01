import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

type Section = { id: string; type: string; heading: string; content: string };

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

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  const sections = Array.isArray(page.sections) ? (page.sections as Section[]) : [];

  return (
    <>
      {/* Header Script */}
      {page.headerScript && (
        <div dangerouslySetInnerHTML={{ __html: page.headerScript }} />
      )}

      <div className="min-h-screen bg-white text-slate-900">

        {/* Sections */}
        {sections.length > 0 && (
          <div className="mx-auto max-w-10xl px-5 pb-16 space-y-10">
            {sections.map((section) => (
              <div key={section.id}>
                {section.heading && (
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">{section.heading}</h2>
                )}
                {section.content && (
                  <div
                    className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
      </div>

      {/* Body / Footer Scripts */}
      {page.bodyScript && <div dangerouslySetInnerHTML={{ __html: page.bodyScript }} />}
      {page.footerScript && <div dangerouslySetInnerHTML={{ __html: page.footerScript }} />}
    </>
  );
}
