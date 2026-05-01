import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Wrapper from "@/components/ui/Wrapper";
import HomeNavbar from "@/components/layout/HomeNavbar";
import HomeFooter from "@/components/layout/HomeFooter";
import { Calendar, User } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = await prisma.blog.findFirst({
    where: { slug: resolvedParams.slug, status: 1, deleted_at: null },
  });

  if (!blog) return { title: "Blog Not Found" };

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt,
    keywords: blog.keywords,
    alternates: {
      canonical: blog.canonical_link,
    },
  };
}

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = await prisma.blog.findFirst({
    where: { slug: resolvedParams.slug, status: 1, deleted_at: null },
  });

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <HomeNavbar />

      {/* Blog Header / Hero */}
      <div className="pt-32 pb-16">
        <Wrapper>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl">
              <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
                {blog.category && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                    {blog.category}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {blog.excerpt}
                </p>
              )}

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{blog.author || "Get Reviews Buzz Team"}</p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
      </div>

      <Wrapper>
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-5xl">
            {blog.media && (
              <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blog.media} alt={blog.title || "Blog cover"} className="w-full h-auto object-cover max-h-[700px]" />
              </div>
            )}

            <article
              className="prose prose-lg md:prose-xl max-w-none text-gray-800 prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500"
              dangerouslySetInnerHTML={{ __html: blog.content || "" }}
            />

            {/* Tags */}
            {blog.tag && (
              <div className="mt-16 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tag.split(',').map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About Author */}
            {blog.about_author && (
              <div className="mt-12 bg-gray-50 p-8 rounded-2xl border border-gray-100 flex gap-6 items-start">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-500 flex-shrink-0 shadow-sm">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">About {blog.author || "the Author"}</h3>
                  <p className="text-gray-600 leading-relaxed">{blog.about_author}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Wrapper>

      <HomeFooter />
    </div>
  );
}
