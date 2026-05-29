'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Wrapper from "@/components/ui/Wrapper";
import { ArrowRight, Calendar } from "lucide-react";
import { SectionProps } from '@/types/section';

export default function BlogSection({ data, settings }: SectionProps) {
  const {
    title = "Insights & Perspectives",
    description = "A collection of ideas and perspectives designed to help you understand, shape, and grow your brand reputation with clarity.",
    limit = 3,
    buttonText = "View All Blogs",
    buttonLink = "/blog"
  } = data;

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`/api/blog?status=1&limit=${limit}`);
        const data = await res.json();
        if (data.success) {
          setBlogs(data.blogs);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [limit]);

  const styles: React.CSSProperties = {
    padding: settings.padding || '50px 0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#ffffff',
  };

  if (!loading && blogs.length === 0) return null;

  return (
    <section style={styles} className="font-['Poppins',sans-serif]">
      <Wrapper>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[40px] gap-6">
            <div className="max-w-2xl">
              <h2 className="text-[28px] md:text-[36px] font-semibold text-[#111] leading-tight mb-3">
                {title}
              </h2>
              <p className="text-[15px] md:text-[16px] text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
            <Link 
              href={buttonLink} 
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-[15px] font-medium text-gray-800 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              {buttonText} <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {loading ? (
               // Simple loading state
               [1, 2, 3].map(i => (
                 <div key={i} className="h-[350px] bg-slate-100 animate-pulse rounded-xl" />
               ))
            ) : (
              blogs.map((blog) => (
                <Link href={`/blog/${blog.slug}`} key={blog.id} className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-[1.5] overflow-hidden bg-gray-100">
                    {blog.media ? (
                      <img 
                        src={blog.media} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <Calendar size={16} />
                      <span>
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                      {blog.title}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
