"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import BlogCover from "@/components/ui/BlogCover";

// ================== 1. Table of Contents Component ==================
interface TOCHeading {
  id: string;
  text: string;
}

export function TableOfContents({ headings }: { headings: TOCHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the top-most visible heading
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: "-100px 0px -40% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="content_table p-6 rounded-[8px] bg-white border border-[#e6e6e6] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <p className="text-[17px] font-bold text-gray-900 mb-3 font-sans tracking-tight">
        Table of Contents
      </p>
      <nav>
        <ul className="level-1 space-y-2.5 list-none p-0 m-0">
          {headings.map((h, i) => {
            const isActive = activeId === h.id;
            return (
              <li key={h.id} className="m-0 leading-[1.4]">
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(h.id);
                    if (el) {
                      const headerOffset = 110; // offset for fixed header
                      const elementPosition = el.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`transition-colors text-[13.5px] block ${
                    isActive
                      ? "text-[#F4B000] font-semibold"
                      : "text-gray-500 hover:text-black hover:underline"
                  }`}
                >
                  {i + 1}. {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

// ================== 2. Search Component ==================
interface SearchResultBlog {
  slug: string;
  title: string;
}

export function BlogSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog?search=${encodeURIComponent(query)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.blogs || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={dropdownRef} className="blog_searchbar relative w-full mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowDropdown(true)}
          className="w-full h-[45px] px-6 border-none rounded-full bg-[#f2f2f2] outline-none text-gray-700 text-[14.5px] placeholder:text-gray-400 focus:bg-[#ebebeb] transition-colors font-sans"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-[8px] shadow-lg max-h-[300px] overflow-y-auto z-[9999]">
          {loading ? (
            <div className="p-3 text-[14px] text-gray-500 text-center">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="p-0 m-0 list-none">
              {results.map((blog) => (
                <li key={blog.slug} className="border-b border-gray-50 last:border-0 m-0">
                  <Link
                    href={`/blog/${blog.slug}`}
                    onClick={() => {
                      setShowDropdown(false);
                      setQuery("");
                    }}
                    className="block p-3 text-[14px] text-gray-700 hover:bg-yellow-50 hover:text-black transition-colors"
                  >
                    {blog.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-[14px] text-gray-500 text-center">No blog found!</div>
          )}
        </div>
      )}
    </div>
  );
}

// ================== 3. Social Share Component ==================
export function SocialShare({ title }: { title: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="post-sharing mt-8 border-t border-gray-100 pt-6">
      <div className="blog-social flex gap-2.5">
        <a
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#111] hover:bg-[#ffcc00] group transition-all"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="fill-[#ffcc00] group-hover:fill-[#111] transition-colors">
            <path d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6z"></path>
          </svg>
        </a>
        <a
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#111] hover:bg-[#ffcc00] group transition-all"
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Twitter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="fill-[#ffcc00] group-hover:fill-[#111] transition-colors">
            <path d="M9.294 6.928L14.357 1h-1.2L8.762 6.147L5.25 1H1.2l5.31 7.784L1.2 15h1.2l4.642-5.436L10.751 15h4.05zM7.651 8.852l-.538-.775L2.832 1.91h1.843l3.454 4.977l.538.775l4.491 6.47h-1.843z"></path>
          </svg>
        </a>
        <a
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#111] hover:bg-[#ffcc00] group transition-all"
          href={`http://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="fill-[#ffcc00] group-hover:fill-[#111] transition-colors">
            <path d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"></path>
          </svg>
        </a>
        <a
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#111] hover:bg-[#ffcc00] group transition-all"
          href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share via Email"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="fill-[#ffcc00] group-hover:fill-[#111] transition-colors">
            <path d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}
