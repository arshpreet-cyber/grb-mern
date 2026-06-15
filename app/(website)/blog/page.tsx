'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Wrapper from "@/components/ui/Wrapper";
import BlogCard from "@/components/blog/BlogCard";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

function BlogListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>({ total: 0, page: 1, limit: 10, pages: 1 });
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          status: '1',
          page: page.toString(),
          limit: '10',
          ...(search ? { search } : {})
        });
        const res = await fetch(`/api/blog?${queryParams}`);
        const data = await res.json();
        if (data.success) {
          setBlogs(data.blogs);
          setPagination(data.pagination);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/blog?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <section className="py-12 md:py-20 bg-[#fafafa]">
      <Wrapper>
        <h1 className="text-3xl font-bold text-center mt-6 mb-16">Blog</h1>
        <div className="flex flex-col lg:flex-row gap-12 px-4">

          {/* Main Content */}
          <div className="flex-grow lg:w-2/3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[400px] bg-gray-200 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : blogs.length > 0 ? (
              <>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 p-0">
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} data={blog} />
                  ))}
                </ul>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-16 flex justify-center items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border border-[#f0c000] transition-all ${page === 1 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'hover:bg-[#f0c000] hover:text-white text-gray-900'}`}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => {
                      // Show current page, and 2 pages before/after
                      if (p >= page - 2 && p <= page + 2) {
                        return (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border border-[#f0c000] font-bold transition-all ${p === page ? 'bg-[#f0c000] text-white' : 'bg-white text-gray-900 hover:bg-[#f0c000] hover:text-white'}`}
                          >
                            {p}
                          </button>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.pages}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border border-[#f0c000] transition-all ${page === pagination.pages ? 'opacity-50 cursor-not-allowed text-gray-400' : 'hover:bg-[#f0c000] hover:text-white text-gray-900'}`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-xl">No blog posts found.</p>
                {search && (
                  <button
                    onClick={() => { setSearchValue(''); router.push('/blog'); }}
                    className="mt-4 text-[#f0c000] font-semibold hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 flex flex-col gap-8">

            {/* Search */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <form onSubmit={handleSearch} className="relative flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-5 pr-12 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-[#f0c000] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 w-10 h-10 bg-[#f0c000] text-white rounded-full flex items-center justify-center hover:bg-[#d4a800] transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-[#f0c000] inline-block">Categories</h4>
              <ul className="flex flex-col gap-4 p-0 list-none">
                <li className="group">
                  <a href="/" className="text-gray-600 hover:text-[#f0c000] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f0c000] opacity-0 group-hover:opacity-100 transition-opacity" />
                    Get Reviews Online
                  </a>
                </li>
                <li className="group">
                  <a href="/products/buy-google-reviews/" className="text-gray-600 hover:text-[#f0c000] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f0c000] opacity-0 group-hover:opacity-100 transition-opacity" />
                    Get Google Reviews
                  </a>
                </li>
                <li className="group">
                  <a href="/products/buy-trustpilot-reviews/" className="text-gray-600 hover:text-[#f0c000] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f0c000] opacity-0 group-hover:opacity-100 transition-opacity" />
                    Get Trustpilot Reviews
                  </a>
                </li>
              </ul>
            </div>

          </aside>

        </div>
      </Wrapper>
    </section>
  );
}

export default function BlogListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa]" />}>
      <BlogListingContent />
    </Suspense>
  );
}
