import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Wrapper from "@/components/ui/Wrapper";
import BlogCover from "@/components/ui/BlogCover";
import { Metadata } from "next";
import { TableOfContents, BlogSearch, SocialShare } from "@/components/blog/BlogDetailComponents";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.replace(/\/+$/, "");
  const blog = await prisma.blog.findFirst({
    // Tolerate slugs stored with a trailing slash (legacy imports).
    where: { slug: { in: [slug, `${slug}/`] }, status: 1, deleted_at: null },
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
  const slug = resolvedParams.slug.replace(/\/+$/, "");
  const blog = await prisma.blog.findFirst({
    // Tolerate slugs stored with a trailing slash (legacy imports).
    where: { slug: { in: [slug, `${slug}/`] }, status: 1, deleted_at: null },
  });

  if (!blog) {
    notFound();
  }

  // Treat junk values (e.g. "' '", "", "''") from legacy imports as empty.
  const clean = (v: string | null) =>
    v && !/^['"’‘\s]+$/.test(v.trim()) ? v.trim() : "";
  const authorName = clean(blog.author) || "Get Reviews Buzz Team";
  const tag = clean(blog.tag);

  // Fetch recent blogs
  const recentBlogs = await prisma.blog.findMany({
    where: { status: 1, deleted_at: null, id: { not: blog.id } },
    orderBy: { created_at: "desc" },
    take: 5,
  });

  // Server-side parsing to inject unique IDs and scroll margin styles to all H2 tags
  const headings: { id: string; text: string }[] = [];
  let headingIndex = 0;
  const contentWithIds = (blog.content || "").replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, contentText) => {
    const text = contentText.replace(/<[^>]*>/g, "").trim();
    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    const id = idMatch ? idMatch[1] : `heading-${headingIndex++}`;
    headings.push({ id, text });
    
    // Add scroll-mt-[110px] class to headings for offset with fixed header
    let updatedAttrs = attrs;
    const classMatch = attrs.match(/class=["']([^"']+)["']/);
    if (classMatch) {
      const existingClasses = classMatch[1];
      if (!existingClasses.includes("scroll-mt-")) {
        updatedAttrs = attrs.replace(classMatch[0], `class="${existingClasses} scroll-mt-[110px]"`);
      }
    } else {
      updatedAttrs = ` class="scroll-mt-[110px]"${attrs}`;
    }

    if (!idMatch) {
      return `<h2 id="${id}"${updatedAttrs}>${contentText}</h2>`;
    }
    return `<h2${updatedAttrs}>${contentText}</h2>`;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-24 pb-20">
      <Wrapper>
        <div className="blogpost_main flex flex-col lg:flex-row gap-[30px] items-start w-full px-4 sm:px-6 lg:px-8">
          
          {/* Desktop Table of Contents */}
          <div className="tab_desktop hidden lg:block w-[240px] sticky top-[110px] h-fit shrink-0">
            <TableOfContents headings={headings} />
          </div>

          {/* Blog Content */}
          <article className="blog-post flex-1 min-w-0 w-full">
            <h1 className="text-[32px] md:text-[40px] font-bold text-gray-900 leading-tight mb-4">
              {blog.title}
            </h1>
            
            <div className="postmetadata mb-6">
              <p className="blog-author text-[14.5px] text-gray-400 font-semibold font-sans">
                {clean(blog.author) ? `${clean(blog.author)} // ` : "// "}
                {new Date(blog.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="featured-image mb-6">
              <BlogCover
                src={blog.media}
                alt={blog.title || "Blog cover"}
                className="w-full aspect-[1.9] object-cover rounded-[10px] shadow-sm"
              />
            </div>

            {/* Mobile Table of Contents */}
            <div className="tab_mobile block lg:hidden my-6">
              <TableOfContents headings={headings} />
            </div>

            <div 
              className="post prose prose-lg max-w-none text-gray-800 prose-headings:font-semibold prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl prose-table:text-base break-words"
              id="blog-content"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            {/* Sharing Component */}
            <SocialShare title={blog.title || ""} />

            {/* Tags */}
            {tag && (
              <div className="post-tags flex flex-wrap gap-[10px] mt-8 pt-6 border-t border-gray-100">
                {tag.split(',').map((t) => t.trim()).filter(Boolean).map((t, i) => (
                  <span 
                    key={i} 
                    className="text-[13px] px-3 py-1.5 rounded-[20px] bg-[#f2f2f2] text-gray-600 font-medium cursor-pointer transition-colors hover:bg-[#ffcc00] hover:text-[#111]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <div className="blog-sidebar w-full lg:w-[320px] shrink-0 mt-10 lg:mt-0 lg:sticky lg:top-[110px] h-fit">
            {/* Live Search */}
            <BlogSearch />

            {/* Categories */}
            <div className="blogpost-categories mb-8 p-6 rounded-[8px] bg-white border border-[#e6e6e6] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="main-sub border-b border-gray-200 pb-2.5 mb-5">
                <h4 className="blog-subtitle text-[20px] font-bold text-gray-900 font-sans tracking-tight">
                  Categories
                </h4>
              </div>
              <ul className="list-disc pl-5 space-y-2.5 text-[#111] font-sans m-0">
                <li>
                  <a href="https://getreviews.buzz" className="text-[15px] text-[#333] hover:text-yellow-600 transition-colors">
                    Get Reviews Online
                  </a>
                </li>
                <li>
                  <a href="https://getreviews.buzz/products/buy-google-reviews/" className="text-[15px] text-[#333] hover:text-yellow-600 transition-colors">
                    Get Google Reviews
                  </a>
                </li>
                <li>
                  <a href="https://getreviews.buzz/products/buy-trustpilot-reviews/" className="text-[15px] text-[#333] hover:text-yellow-600 transition-colors">
                    Get Trustpilot Reviews
                  </a>
                </li>
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="blog-recentposts p-6 rounded-[8px] bg-white border border-[#e6e6e6] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="main-sub border-b border-gray-200 pb-2.5 mb-5">
                <h4 className="blog-subtitle text-[20px] font-bold text-gray-900 font-sans tracking-tight">
                  Recent Posts
                </h4>
              </div>
              <ul className="p-0 m-0 list-none space-y-6">
                {recentBlogs.map((recentBlog) => (
                  <li key={recentBlog.slug} className="m-0">
                    <Link href={`/blog/${recentBlog.slug}`} className="flex flex-col gap-2.5 text-decoration-none group">
                      <figure className="w-full m-0 overflow-hidden rounded-[8px] border border-black/5 aspect-[1.8] bg-gray-50">
                        <BlogCover
                          src={recentBlog.media}
                          alt={recentBlog.title || "Recent post image"}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </figure>
                      <div className="flex flex-col">
                        <span className="recents text-[14px] font-bold text-[#111] group-hover:text-yellow-600 transition-colors leading-[1.4] line-clamp-2 font-sans">
                          {recentBlog.title}
                        </span>
                        <span className="recent-date text-[12px] text-gray-400 mt-1 font-sans">
                          {new Date(recentBlog.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </Wrapper>
    </div>
  );
}
