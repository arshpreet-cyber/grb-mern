"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Search } from "lucide-react";
import Wrapper from "./Wrapper";
import products from "@/data/products";
import type { Product } from "@/data/products";


export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [mode, setMode] = useState<"onetime" | "monthly">("onetime");
  const [added, setAdded] = useState(false);

  const price = mode === "onetime" ? product.oneTimePrice : product.subscribePrice;
  const isMonthly = mode === "monthly";

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: `${product.id}-${mode}`,
      platform: product.platform,
      icon: "🌟",
      type: mode === "monthly" ? "subscribe" : "one-time",
      pricePerUnit: price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <li
      className={`relative bg-[#FDFCF2] rounded-[16px] p-[24px] flex flex-col font-sans cursor-pointer transform-gpu transition-shadow duration-200 w-full h-auto ${product.badge === "Most Popular" ? "most-popular-card" : ""}`}
      style={{
        border: "2px solid transparent",
        backgroundImage: "linear-gradient(#fff, #fff), linear-gradient(#E5E5E5, #ffffff)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundImage =
          "linear-gradient(#fff, #fff), linear-gradient(to right, #FFC107, #E49D56)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
        if (product.badge === "Most Popular")
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(228, 157, 86, 0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundImage =
          "linear-gradient(#fff, #fff), linear-gradient(#E5E5E5, #ffffff)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {product.badge === "Most Popular" && (
        <div className="absolute -top-[13px] right-[16px] bg-linear-to-r from-[#FFC107] to-[#E49D56] text-white font-sans text-[11px] font-semibold px-[16px] py-[5px] rounded-[20px] uppercase tracking-[0.8px] z-10 shadow-[0_2px_8px_rgba(228,157,86,0.35)] leading-[1.4]">
          {product.badge}
        </div>
      )}

      <div className="w-[56px] h-[56px] bg-white border border-black/10 rounded-[12px] shrink-0 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.platform}
          className="w-[34px] h-[34px] object-contain rounded-[4px]"
          onError={(e) => {
            e.currentTarget.src =
              "https://getreviews.buzz/storage/app/blog/0809068001728298556_experience.svg";
          }}
        />
      </div>

      <h4 className="text-[17px] font-semibold text-[#323232] mt-[25px] leading-[1.35]">
        {product.platform}
      </h4>

      <div className="my-[36px]">
        <div className="text-[14px] font-semibold text-black flex items-baseline gap-[2px] leading-none">
          <span className="text-[24px] font-semibold text-black">$</span>
          <span className="text-[24px] font-semibold text-black">{price.toFixed(2)}</span>
          <span className="text-[13px] font-normal text-[#555] ml-[2px]">/ per unit</span>
        </div>
        <p className="text-[13px] text-[#888] m-0 mt-1">Min. {product.minimumQuantity} Units</p>
      </div>

      <div className="grid grid-cols-2 gap-[8px] mb-[12px]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMode("onetime");
          }}
          className={`py-[8px] px-[10px] md:px-[16px] font-sans text-[13px] md:text-[14px] font-medium rounded-[8px] border transition-all text-center whitespace-nowrap ${
            !isMonthly
              ? "bg-[#F0EFEB] text-black/70 border-black/15"
              : "bg-white text-black/60 border-black/10 hover:border-[#ccc] hover:bg-[#F5F5F3]"
          }`}
        >
          One-time
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMode("monthly");
          }}
          className={`py-[8px] px-[10px] md:px-[16px] font-sans text-[13px] md:text-[14px] font-medium rounded-[8px] border transition-all text-center whitespace-nowrap ${
            isMonthly
              ? "bg-[#F0EFEB] text-black/70 border-black/15"
              : "bg-white text-black/60 border-black/10 hover:border-[#ccc] hover:bg-[#F5F5F3]"
          }`}
        >
          Monthly
        </button>
      </div>

      <button
        onClick={handleAdd}
        className={`flex items-center justify-center gap-[8px] h-[46px] w-full border border-black/15 rounded-[10px] text-[14px] md:text-[15px] font-semibold cursor-pointer transition-all font-sans m-0 ${
          isMonthly
            ? "bg-linear-to-b from-[#ffffff] to-[#e5e5e5] text-[#1a1a1a] hover:bg-[#F5F5F3] hover:-translate-y-[1px]"
            : "bg-white text-[#1a1a1a] hover:bg-[#F5F5F3] hover:-translate-y-[1px]"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[18px] h-[18px] shrink-0"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span>{added ? "Added to Cart" : isMonthly ? "Subscribe" : "Add to Cart"}</span>
      </button>
    </li>
  );
}

export function BuyReviewsSection() {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = products.filter((p) =>
    p.platform.toLowerCase().includes(search.toLowerCase())
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section className="w-full bg-[#FDFCF2]">
    <Wrapper>
    <div className="w-full mx-auto px-4 sm:px-6 py-12">
      {/* Centered search bar */}
      <div className="flex justify-center mb-[40px]">
        <div className="relative w-full max-w-[520px]">
          <input
            type="text"
            placeholder="Search review Platforms (e.g., Google, Trustpilot...)"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(8); }}
            className="w-full h-[50px] pl-[24px] pr-[52px] rounded-[50px] border border-[#E5E5E5] bg-white text-[14px] text-[#333] outline-none transition-all focus:border-[#ccc] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)] font-sans box-border placeholder:text-[#999] shadow-sm"
          />
          <Search className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#aaa] pointer-events-none" />
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] lg:gap-[24px] p-0 m-0 list-none">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>

      {/* View More Button */}
      {hasMore && (
        <div className="flex justify-center mt-[48px] mb-[20px]">
          <button
            onClick={() => setVisibleCount((c) => c + 8)}
            className="inline-flex items-center gap-[10px] px-[28px] py-[13px] rounded-[10px] border border-[#333] bg-white text-[#1a1a1a] text-[14px] font-medium font-sans transition-all hover:bg-[#f5f5f3] hover:border-[#111] hover:shadow-sm"
          >
            View More Platforms
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      )}
    </div>
    </Wrapper>
    </section>
  );
  
}