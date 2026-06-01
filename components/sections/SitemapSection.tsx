'use client';

import React from 'react';
import { SectionProps } from '@/types/section';

export default function SitemapSection({ data = {}, settings = {} as any }: SectionProps) {
  const {
    title = 'Site Map',
    description = 'A complete overview of all pages on our website.',
    mainPages = [],
    caseStudies = [],
    reviewProducts = [],
  } = data;

  const sectionStyles: React.CSSProperties = {
    padding: settings.padding || '60px 0',
    margin: settings.margin || '0',
    backgroundColor: settings.backgroundColor || '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  // Group review products into chunks of 3 for sitemap columns
  const chunkedReviewProducts = React.useMemo(() => {
    if (!reviewProducts || reviewProducts.length === 0) return [];
    const chunkSize = Math.ceil(reviewProducts.length / 3);
    const chunks: any[][] = [];
    for (let i = 0; i < reviewProducts.length; i += chunkSize) {
      chunks.push(reviewProducts.slice(i, i + chunkSize));
    }
    return chunks;
  }, [reviewProducts]);

  return (
    <section style={sectionStyles} className="w-full block box-border">
      <div className="max-w-[1200px] mx-auto px-5 box-border">
        {/* Header */}
        <div className="text-center mb-[50px]">
          <h1 className="sitemap-header-title text-4xl md:text-[2.5rem] font-extrabold text-black m-0 mb-2.5 tracking-tight">
            {title}
          </h1>
          <p className="text-[#666666] text-lg md:text-[1.1rem] m-0">
            {description}
          </p>
        </div>

        {/* Style block for media queries equivalent to original CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .sitemap-grid-row {
              display: flex;
              flex-wrap: wrap;
              margin-left: -15px;
              margin-right: -15px;
              padding-left: 120px;
            }
            .sitemap-grid-col {
              flex: 0 0 33.3333%;
              max-width: 33.3333%;
              padding: 0 15px;
              box-sizing: border-box;
            }
            .sitemap-empty-spacer {
              height: 38px;
            }
            @media (max-width: 991px) {
              .sitemap-grid-row {
                padding-left: 30px;
              }
              .sitemap-grid-col {
                flex: 0 0 50%;
                max-width: 50%;
                margin-bottom: 30px;
              }
              .sitemap-empty-spacer {
                display: none;
              }
            }
            @media (max-width: 576px) {
              .sitemap-grid-row {
                padding-left: 15px;
              }
              .sitemap-grid-col {
                flex: 0 0 100%;
                max-width: 100%;
                margin-bottom: 35px;
              }
              .sitemap-header-title {
                font-size: 2rem !important;
              }
            }
          `
        }} />

        {/* Top Grid: Main Pages & Case Studies */}
        <div className="sitemap-grid-row">
          {/* Main Pages */}
          <div className="sitemap-grid-col">
            <h2 className="text-[1.75rem] font-bold text-black m-0 mb-5 leading-normal">
              Main Pages
            </h2>
            <div className="flex flex-col gap-3">
              {mainPages.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  className="text-black no-underline text-[0.95rem] font-normal opacity-100 hover:opacity-60 transition-opacity duration-200 text-left self-start"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Case Studies Col 1 */}
          <div className="sitemap-grid-col">
            <h2 className="text-[1.75rem] font-bold text-black m-0 mb-5 leading-normal">
              Case Studies
            </h2>
            <div className="flex flex-col gap-3">
              {caseStudies.slice(0, 11).map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  className="text-black no-underline text-[0.95rem] font-normal opacity-100 hover:opacity-60 transition-opacity duration-200 text-left self-start"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Case Studies Col 2 */}
          <div className="sitemap-grid-col">
            <div className="sitemap-empty-spacer m-0 mb-5"></div>
            <div className="flex flex-col gap-3">
              {caseStudies.slice(11).map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  className="text-black no-underline text-[0.95rem] font-normal opacity-100 hover:opacity-60 transition-opacity duration-200 text-left self-start"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-0 border-t border-slate-200 my-[50px] md:my-[50px] mb-10 w-full" />

        {/* Bottom Grid: All Services / Review Products */}
        <div className="text-center mb-[30px]">
          <h2 className="text-3xl font-bold text-black m-0 leading-normal">
            All Services
          </h2>
        </div>

        <div className="sitemap-grid-row">
          {chunkedReviewProducts.map((chunk, chunkIdx) => (
            <div key={chunkIdx} className="sitemap-grid-col mb-10">
              <div className="flex flex-col gap-3">
                {chunk.map((link: any, idx: number) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="text-black no-underline text-[0.95rem] font-normal opacity-100 hover:opacity-60 transition-opacity duration-200 text-left self-start"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="text-center mt-[50px]">
          <a
            href="/"
            className="inline-flex items-center justify-center bg-[#1e293b] hover:bg-black text-white px-9 py-3.5 rounded-[50px] font-bold text-base no-underline shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </section>
  );
}
