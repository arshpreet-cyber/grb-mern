'use client';
import React from 'react';
import Link from 'next/link';
import BlogCover from '@/components/ui/BlogCover';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  data: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    media?: string;
    author?: string;
    created_at: string;
  };
}

export default function BlogCard({ data }: BlogCardProps) {
  return (
    <li className="list-none">
      <Link href={`/blog/${data.slug}`} className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
          <BlogCover
            src={data.media}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-[#f0c000]" />
              <span>{new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={16} className="text-[#f0c000]" />
              <span>{data.author || "Admin"}</span>
            </div>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#f0c000] transition-colors line-clamp-2">
            {data.title}
          </h3>
          
          {data.excerpt && (
            <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 text-sm md:text-base">
              {data.excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-[#f0c000] font-semibold text-sm group-hover:gap-3 transition-all">
            Read More <ArrowRight size={18} />
          </div>
        </div>
      </Link>
    </li>
  );
}
