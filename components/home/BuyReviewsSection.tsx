"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Wrapper from "@/components/ui/Wrapper";
import type { Product } from "@/lib/constants/products";
import { useRouter } from "next/navigation";

// Extend base product locally to safely expect slug & priority fields
type LocalProduct = Product & {
  slug?: string;
  priority?: number | null;
  styleId?: number;
};
// ===== PIXEL MATCH STYLE MAP DICTIONARY =====
const PRODUCT_STYLE_RULES: Record<number, { headerBg: string; badgeColor: string }> = {
  1: { headerBg: '#E7F7EC99', badgeColor: '#00B077' },
  2: { headerBg: '#FFFAEB', badgeColor: '#C59E03' },
  3: { headerBg: '#FFE8E657', badgeColor: '#FF1D0A' },
  4: { headerBg: '#E875331A', badgeColor: '#E87533' },
  5: { headerBg: '#EAF6EE', badgeColor: '#2B9D52' },
  7: { headerBg: '#EFFCFF', badgeColor: '#00D2FF' },
  8: { headerBg: '#FFFAED', badgeColor: '#FFCD40' },
  9: { headerBg: '#C8DFFF33', badgeColor: '#0C3B7C' },
  10: { headerBg: '#FFFCEB', badgeColor: '#B5990D' },
  11: { headerBg: '#FFF3F3', badgeColor: '#FF8580' },
  12: { headerBg: '#D5E7FF99', badgeColor: '#1877F2' },
  13: { headerBg: '#F1FAF4', badgeColor: '#00B077' },
  15: { headerBg: '#F3FFED', badgeColor: '#4EBA1B' },
  16: { headerBg: '#FFF7EA', badgeColor: '#F19200' },
  17: { headerBg: '#FFF7F5', badgeColor: '#DD2C00' },
  18: { headerBg: '#FFFEE4', badgeColor: '#837C09' },
  19: { headerBg: '#F9FCFF', badgeColor: '#1976D2' },
  20: { headerBg: '#FFFAED', badgeColor: '#FFCD40' },
  21: { headerBg: '#F5F5F5', badgeColor: '#000000' },
  22: { headerBg: '#EAF9FF', badgeColor: '#0099FD9' },
  23: { headerBg: '#FBF9FF', badgeColor: '#7139DE' },
  24: { headerBg: '#F6F2FF', badgeColor: '#4F269C' },
  25: { headerBg: '#EFF4FF', badgeColor: '#2061EB' },
  26: { headerBg: '#FFFCF3', badgeColor: '#A98107' },
  27: { headerBg: '#FFF2E8', badgeColor: '#D37728' },
  28: { headerBg: '#F4F8FF', badgeColor: '#006AFF' },
  29: { headerBg: '#FFD0D233', badgeColor: '#D92228' },
  30: { headerBg: '#F0F9FF', badgeColor: '#036DB5' },
  31: { headerBg: '#F2FFFF', badgeColor: '#009999' },
  32: { headerBg: '#C8DFFF33', badgeColor: '#1B41E9' },
  33: { headerBg: '#FFF3F3', badgeColor: '#FF8580' },
  34: { headerBg: '#F8F6FF', badgeColor: '#391C94' },
  35: { headerBg: '#F5FCFF', badgeColor: '#0281C5' },
  36: { headerBg: '#FFF9F5', badgeColor: '#FA7718' },
  37: { headerBg: '#FFF6F6', badgeColor: '#EF3346' },
  38: { headerBg: '#FFF8F8', badgeColor: '#F14B55' },
  39: { headerBg: '#FFF5EE', badgeColor: '#F6721B' },
  40: { headerBg: '#F6F8FF', badgeColor: '#35478C' },
  41: { headerBg: '#2AD2FF17', badgeColor: '#2AD2FF' },
  42: { headerBg: '#FFFBFB', badgeColor: '#D80C0C' },
  43: { headerBg: '#FFFCF3', badgeColor: '#A98107' },
  44: { headerBg: '#FFF8F8', badgeColor: '#C4242B' },
  45: { headerBg: '#FFFAF3', badgeColor: '#FF9100' },
  46: { headerBg: '#EBF6FF', badgeColor: '#00447B' },
  47: { headerBg: '#FFF9F5', badgeColor: '#FF581C' },
  48: { headerBg: '#F8FDFF', badgeColor: '#09A2DA' },
  49: { headerBg: '#F0FAFF', badgeColor: '#28A9E2' },
  50: { headerBg: '#F9F9F9', badgeColor: '#404040' },
  51: { headerBg: '#13B3BA17', badgeColor: '#13B3BA' },
  52: { headerBg: '#F6F2FF', badgeColor: '#4F269C' },
  53: { headerBg: '#F6FFE8', badgeColor: '#80BA27' },
  54: { headerBg: '#F3F4FF', badgeColor: '#5462BF' },
  55: { headerBg: '#FFF8F3', badgeColor: '#D36F2A' },
  56: { headerBg: '#F9FBFF', badgeColor: '#0D3880' },
  57: { headerBg: '#F5F5F5', badgeColor: '#000000' },
  58: { headerBg: '#EEF7FF', badgeColor: '#0054A6' },
  83: { headerBg: '#E4F7FF99', badgeColor: '#005F86' },
  86: { headerBg: '#F9FCFF', badgeColor: '#214E81' },
  87: { headerBg: '#E7F7EC99', badgeColor: '#00B077' },
  88: { headerBg: '#F9F9F9', badgeColor: '#000000' },
  89: { headerBg: '#FFF3F3', badgeColor: '#FF8580' },
  90: { headerBg: '#FFF3F0', badgeColor: '#FD5730' },
  91: { headerBg: '#F2F9FF', badgeColor: '#0088FF' },
  92: { headerBg: '#F2FFF8', badgeColor: '#009245' },
  93: { headerBg: '#FFF3F0', badgeColor: '#FD5730' },
  94: { headerBg: '#FAF8FF', badgeColor: '#612ACE' },
  133: { headerBg: '#F5FAFF', badgeColor: '#2976D1' },
  134: { headerBg: '#EFF4FF', badgeColor: '#384361' },
  135: { headerBg: '#F9FCFF', badgeColor: '#214E81' },
  136: { headerBg: '#F6F8FF', badgeColor: '#3655FF' },
  137: { headerBg: '#FAF8FF', badgeColor: '#612ACE' },
  141: { headerBg: '#F8F9FF', badgeColor: '#2A357F' },
  142: { headerBg: '#F0F5FF', badgeColor: '#2E5BCA' },
  143: { headerBg: '#F4FFF3', badgeColor: '#6FBF67' },
  144: { headerBg: '#F6FFFD', badgeColor: '#1C5344' },
  156: { headerBg: '#FFFCF3', badgeColor: '#A98107' },
  157: { headerBg: '#EEFFEB', badgeColor: '#2CA01C' },
  158: { headerBg: '#F3FFED', badgeColor: '#4EBA1B' },
  159: { headerBg: '#FFF3F0', badgeColor: '#FD5730' }
};

export function ProductCard({
  product,
  selectedMode,
  onSelect,
}: {
  product: LocalProduct;
  selectedMode: "onetime" | "monthly" | null;
  onSelect: (mode: "onetime" | "monthly") => void;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const effectiveMode = selectedMode || "onetime";
  const isMonthly = effectiveMode === "monthly";

  const isGoogleReviews = Number(product.id) === 2 || product.platform?.toLowerCase() === "google reviews";
  const styleKey = Number(product.styleId ?? product.id);

  const designRule =
    PRODUCT_STYLE_RULES[styleKey] || {
      headerBg: "#fffcf2",
      badgeColor: "#c99c15",
    };

  const price30 = isGoogleReviews ? 15 : (product.oneTimePrice || 20);
  const price15 = isGoogleReviews ? 10 : (Math.round(price30 * 0.5) || 10);
  const price7 = isGoogleReviews ? 7 : (Math.round(price30 * 0.35) || 7);

  const packages = [
    { dbId: 2, variant: "30 Day", price: price30, label: "30 Days Warranty" },
    { dbId: 201, variant: "15 Day", price: price15, label: "15 Days Warranty" },
    { dbId: 138, variant: "7 Day", price: price7, label: "7 Days Warranty" },
  ];

  const [activePkgIndex, setActivePkgIndex] = useState(0);
  const selectedPkg = packages[activePkgIndex];

  const finalPrice = isGoogleReviews ? selectedPkg.price : (product.oneTimePrice || 20);
  const productIdToUse = isGoogleReviews ? selectedPkg.dbId : product.id;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: `${productIdToUse}-${effectiveMode}`,
      platform: product.platform,
      icon: "🌟",
      image: product.image,
      type: isMonthly ? "subscribe" : "one-time",
      pricePerUnit: finalPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (isGoogleReviews) {
    return (
      <li
        className="product-card-redesign most-popular-card google-refill-card ssr-card relative bg-white flex flex-col font-sans cursor-pointer transition-all duration-200 w-full h-full rounded-[16px]"
        onClick={() => { const s = String(product.slug || product.id); router.push(`/products/${s.startsWith('buy-') ? s : `buy-${s}`}/reviews/`); }}
        style={{
          border: "2px solid transparent",
          backgroundImage: "linear-gradient(#fff, #fff), linear-gradient(#E5E5E5, #ffffff)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          overflow: "visible",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div
          className="card-header p-[24px_28px] flex justify-between items-center rounded-[16px_16px_0_0]"
          style={{ backgroundColor: designRule.headerBg }}
        >
          <div className="card-title-wrapper flex items-center gap-[12px]">
            <h4 className="card-title text-[17px] font-semibold text-black m-0 leading-[1.2]">Google Reviews</h4>
          </div>
          <div
            className="secure-badge bg-white text-[11px] font-semibold p-[4px_11px] rounded-[20px] flex items-center gap-[6px] tracking-[0.3px] shadow-[0_2px_5px_rgba(0,0,0,0.04)] whitespace-nowrap"
            style={{ color: designRule.badgeColor }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
            100% SECURE
          </div>
        </div>

        <div className="test p-[25px] flex flex-col flex-1">
          <div className="select-package-pill flex items-center ml-[20px] mb-[18px] max-[768px]:ml-0 max-[768px]:mb-[20px]">
            <div className="pill-inner bg-gradient-to-r from-[#ffe26e] to-[#ffcd05] text-black text-[13.5px] font-normal p-[5px_10px] rounded-[30px] flex items-center gap-[7px] max-[768px]:relative max-[768px]:mt-0 mt-[42px] absolute">
              Select Package
            </div>
          </div>

          <div className="warranty-grid border-[1.5px] border-[#ffebaf] rounded-[12px] p-[30px_10px_10px_10px] grid grid-cols-3 gap-[8px] mb-[18px] max-[359px]:flex max-[359px]:flex-col max-[359px]:gap-[10px]" onClick={(e) => e.stopPropagation()}>
            {packages.map((pkg, index) => {
              const isActive = activePkgIndex === index;
              return (
                <div
                  key={pkg.variant}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePkgIndex(index);
                  }}
                  className={`warranty-box flex flex-col items-start p-[10px_6px_8px_6px] rounded-[8px] cursor-pointer border-[1.5px] border-transparent transition-all min-h-[70px] max-[359px]:w-full max-[359px]:flex-row max-[359px]:items-center max-[359px]:justify-between max-[359px]:p-[10px_12px] ${isActive
                      ? "border-[#ffd737] bg-[#FFF9E6]"
                      : "bg-white hover:border-[#ffd737] hover:bg-[#FFF9E6]"
                    }`}
                >
                  <div className="warranty-price flex items-baseline gap-[1px] mb-[2px] max-[359px]:mb-0 max-[359px]:mr-[8px]">
                    <span className="amount text-[14px] font-semibold text-[#1a1a1a] max-[359px]:text-[18px]">${pkg.price}</span>
                    <span className="Review text-[8px] text-black/70 ml-[1px] whitespace-nowrap">/ per Review</span>
                  </div>
                  <div className="warranty-min text-[10px] text-black/50">Min. 5 reviews</div>
                  <div
                    className={`warranty-label text-[6px] font-semibold tracking-wide relative mb-[5px] leading-[1.3] max-[359px]:mb-0 max-[359px]:ml-auto max-[359px]:text-right ${isActive ? "text-[#b07b00] font-medium" : "text-[#FFC107]"
                      }`}
                  >
                    <span>{pkg.label}</span> &nbsp;
                    <span className="tooltip-question relative inline-flex items-center justify-center w-[10px] h-[10px] border border-black text-black rounded-full cursor-pointer group" onClick={(e) => e.stopPropagation()}>
                      ?
                      <span className={`warranty-tooltip-box absolute bottom-[100%] left-1/2 -translate-x-1/2 pb-[8px] w-max max-w-[280px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-[99999] max-[600px]:left-1/2 max-[600px]:-translate-x-1/2 max-[600px]:w-[220px] max-[600px]:max-w-[calc(100vw-20px)]
                        ${index === 2 ? 'max-[600px]:left-auto max-[600px]:right-0 max-[600px]:transform-none' : ''}
                        ${index === 0 ? 'max-[600px]:left-0 max-[600px]:transform-none' : ''}`}>
                        <span className="block p-[12px] text-justify bg-[#111] text-white text-[10px] font-normal leading-[1.5] rounded-[10px] break-words whitespace-normal">
                          If any reviews drop during the warranty period, we will replace them once, subject to a one-time <a href="/terms-conditions/" target="_blank" className="text-[#ffce0c]">replacement policy</a>.
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card-bottom-actions mt-auto w-full">
            <div className="card-toggle-row flex justify-center items-center shadow-[0_0_5px_0px_rgba(0,0,0,0.1)] rounded-[8px] w-fit gap-[0px] mb-[15px] p-[0px] max-[768px]:nowrap max-[768px]:w-full max-[768px]:gap-[6px]">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSelect("onetime"); }}
                className={`card-toggle-btn relative p-[6px_20px] font-sans text-[14px] font-medium rounded-[8px] border-none cursor-pointer transition-all text-center max-[768px]:shrink-0 max-[768px]:p-[6px_14px] max-[768px]:text-[13px] max-[400px]:p-[5px_10px] max-[400px]:text-[12px] ${!isMonthly ? "bg-[#f3f3f3] text-black/70 active" : "bg-white text-black/60 hover:text-black hover:bg-[#f3f3f3]"
                  }`}
              >
                One–time
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSelect("monthly"); }}
                className={`card-toggle-btn monthly-btn-icon flex items-center justify-center gap-[6px] relative p-[6px_20px] font-sans text-[14px] font-medium rounded-[8px] border-none cursor-pointer transition-all text-center max-[768px]:shrink-0 max-[768px]:p-[6px_14px] max-[768px]:text-[13px] max-[400px]:p-[5px_10px] max-[400px]:text-[12px] ${isMonthly ? "bg-[#f3f3f3] text-black/70 active" : "bg-white text-black/60 hover:text-black hover:bg-[#f3f3f3]"
                  }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="max-[768px]:w-[14px] max-[768px]:h-[14px] max-[768px]:mr-[4px]">
                  <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                </svg>
                Monthly
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`card-cart-btn flex items-center justify-center gap-[8px] h-[46px] w-full text-black border border-black/13 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all mt-0 font-sans ${isMonthly ? "bg-[#fc0] text-[#1a1a1a] border-none monthly-mode" : "bg-white onetime-mode"
                }`}
              style={{ backgroundColor: isMonthly ? '#fc0' : 'white' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>{added ? "Added to Cart" : isMonthly ? "Subscribe" : "Add to Cart"}</span>
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      className="product-card-redesign ssr-card relative bg-white flex flex-col font-sans cursor-pointer transition-all duration-200 w-full h-full rounded-[16px]"
      onClick={() => { const s = String(product.slug || product.id); router.push(`/products/${s.startsWith('buy-') ? s : `buy-${s}`}/reviews/`); }}
      style={{
        border: "2px solid transparent",
        backgroundImage: "linear-gradient(#fff, #fff), linear-gradient(#E5E5E5, #ffffff)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        overflow: "visible",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(#fff, #fff), linear-gradient(to right, #FFC107, #E49D56)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(#fff, #fff), linear-gradient(#E5E5E5, #ffffff)",
          e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="s-header-redesign p-[24px_24px_10px_24px] flex flex-col items-start border-b-none rounded-[16px_16px_0_0]"
        style={{ backgroundColor: designRule.headerBg }}
      >
        <div
          className="s-secure-badge inline-flex items-center gap-[6px] bg-white text-[11px] font-semibold p-[4px_11px] rounded-[20px] uppercase tracking-[0.5px] shadow-[0_2px_4px_rgba(0,0,0,0.03)] mb-[45px]"
          style={{ color: designRule.badgeColor }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: designRule.badgeColor }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
          <span>100% SECURE</span>
        </div>
        <h4 className="s-prod-title text-[20px] font-semibold text-black m-[0_0_6px_0] leading-[1.2]">{product.platform}</h4>
        {/* <p className="s-trust-score text-[12px] text-[#666666] m-0">Trust Score 4.9 | based on 6,792 reviews</p> */}
      </div>

      <div className="card-body p-[25px] flex flex-col flex-1">
        <div className="card-pricing m-0">
          <div className="card-price-val text-[14px] font-semibold text-black flex items-baseline gap-[2px]">
            <span className="currency text-[40px] font-semibold text-black">$</span>
            <span className="amount text-[40px] font-semibold text-black">{Math.floor(finalPrice)}</span>
            <span className="per-Review text-[13px] font-normal text-[#555] ml-[2px] whitespace-nowrap">/ per Review</span>
          </div>
          <p className="card-min-qty text-[13px] text-[#888] mb-[25px] mt-0">
            Min. {product.minimumQuantity} Reviews
          </p>
        </div>

        <div className="card-bottom-actions mt-auto w-full">
          <div className="card-toggle-row flex justify-center items-center shadow-[0_0_5px_0px_rgba(0,0,0,0.1)] rounded-[8px] w-fit gap-[0px] mb-[15px] p-[0px] max-[768px]:nowrap max-[768px]:w-full max-[768px]:gap-[6px]">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelect("onetime"); }}
              className={`card-toggle-btn relative p-[6px_20px] font-sans text-[14px] font-medium rounded-[8px] border-none cursor-pointer transition-all text-center max-[768px]:shrink-0 max-[768px]:p-[6px_14px] max-[768px]:text-[13px] max-[400px]:p-[5px_10px] max-[400px]:text-[12px] ${!isMonthly ? "bg-[#f3f3f3] text-black/70 active" : "bg-white text-black/60 hover:text-black hover:bg-[#f3f3f3]"
                }`}
            >
              One-time
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelect("monthly"); }}
              className={`card-toggle-btn flex items-center justify-center gap-[6px] relative p-[6px_20px] font-sans text-[14px] font-medium rounded-[8px] border-none cursor-pointer transition-all text-center max-[768px]:shrink-0 max-[768px]:p-[6px_14px] max-[768px]:text-[13px] max-[400px]:p-[5px_10px] max-[400px]:text-[12px] ${isMonthly ? "bg-[#f3f3f3] text-black/70 active" : "bg-white text-black/60 hover:text-black hover:bg-[#f3f3f3]"
                }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="max-[768px]:w-[14px] max-[768px]:h-[14px] max-[768px]:mr-[4px]">
                <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              Monthly
            </button>
          </div>

          <button
            onClick={handleAdd}
            className={`card-cart-btn flex items-center justify-center gap-[8px] h-[46px] w-full text-black border border-black/13 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all mt-0 font-sans ${isMonthly ? "bg-[#fc0] text-[#1a1a1a] border-none monthly-mode" : "bg-white onetime-mode"
              }`}
            style={{ backgroundColor: isMonthly ? '#fc0' : 'white' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0">
              <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>{added ? "Added to Cart" : isMonthly ? "Subscribe" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </li>
  );
}

export function BuyReviewsSection() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [selection, setSelection] = useState<Record<string, "onetime" | "monthly">>({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products");
        if (!response.ok) {
          const errorPayload = await response.json().catch(() => ({}));
          throw new Error(errorPayload.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const baseFiltered = data.filter((d: any) => d.id !== 138 && d.id !== 201);

        const sortedProducts = [...baseFiltered].sort((a: any, b: any) => {
          const priorityA = a.priority !== null && a.priority !== undefined ? a.priority : Infinity;
          const priorityB = b.priority !== null && b.priority !== undefined ? b.priority : Infinity;
          return priorityA - priorityB;
        });

        setProducts(sortedProducts);
      } catch (error: any) {

      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const clearSearch = () => {
    setSearch("");
    setVisibleCount(8);
  };

  const filtered = products.filter((p) =>
    p.platform?.toLowerCase().includes(search.toLowerCase()) ||
    (p.slug && p.slug.toLowerCase().includes(search.toLowerCase()))
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section className="pad-100 c w-full bg-[#fcfcf2] overflow-visible" style={{ backgroundColor: "#fcfcf2" }}>
      <Wrapper>
        <div className="product_sect max-w-[1500px] w-full mx-auto px-4 sm:px-6 transition-all duration-300">
          <div className="rgt_prod w-full overflow-visible" id="product_container">

            <div className="filter-search-row sticky top-[70px] z-[99] bg-[#fcfcf2] flex items-center justify-between pt-[15px] pb-[15px] m-[0_0_28px_0] gap-[20px] will-change-transform max-[992px]:top-0 max-[992px]:flex-col max-[992px]:items-start max-[992px]:p-[10px_0] max-[992px]:m-[0_40px_20px_40px] max-[768px]:m-[0_20px_20px_20px] max-[768px]:gap-[12px] max-[480px]:m-[0_15px_15px_15px]">
              <div className="search-wrap relative w-full max-w-[700px] h-[55px] mx-auto max-[992px]:max-w-full max-[768px]:w-full max-[768px]:h-[50px]">
                <input
                  type="text"
                  id="js-search-input"
                  placeholder="Search review Platforms (e.g., Google, Trustpilot...)"
                  value={search}
                  autoComplete="off"
                  onChange={(e) => { setSearch(e.target.value); setVisibleCount(8); }}
                  className="srch-input-field w-full h-full p-[16px_55px_16px_22px] text-[15px] border-2 border-[#e5e5e5] rounded-[50px] outline-none bg-white text-black/70 transition-all focus:border-[#bbb] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)] box-border placeholder:text-black/60 max-[480px]:text-[16px]"
                />

                {search.length > 0 && (
                  <button
                    id="js-search-clear"
                    onClick={clearSearch}
                    className="absolute right-[18px] top-1/2 -translate-y-1/2 bg-black/5 border-none cursor-pointer p-[6px] rounded-full w-[26px] h-[26px] flex items-center justify-center z-[20] pointer-events-auto"
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}

                {search.length === 0 && (
                  <svg className="search-icon-svg absolute right-[18px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="rgba(0,0,0,0.4)">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                )}
              </div>
            </div>

            <ul className="product-grid-list grid grid-cols-4 gap-[24px] w-full p-0 m-0 list-none items-stretch max-[1470px]:grid-cols-3 max-[1200px]:grid-cols-3 max-[992px]:grid-cols-2 max-[992px]:gap-[16px] max-[900px]:grid-cols-2 max-[768px]:grid-cols-2 max-[768px]:gap-[14px] max-[600px]:grid-cols-1" id="product-grid">
              {isLoading ? (
                /* === SKELETON PLACEHOLDER CARDS FOR INSTANT REFRESH VISUAL FEEDBACK === */
                Array.from({ length: 4 }).map((_, i) => (
                  <li
                    key={`skeleton-card-${i}`}
                    className="relative bg-white flex flex-col w-full min-h-[410px] rounded-[16px] border-2 border-neutral-100/80 animate-pulse overflow-hidden shadow-sm"
                  >
                    {/* Top Header Placeholder */}
                    <div className="h-[120px] bg-neutral-100/80 w-full p-[24px_24px_10px_24px] flex flex-col justify-between">
                      <div className="h-5 w-24 bg-neutral-200/80 rounded-full" />
                      <div className="h-6 w-36 bg-neutral-200/80 rounded mt-auto mb-2" />
                      <div className="h-3 w-48 bg-neutral-200/60 rounded" />
                    </div>
                    {/* Main Content Body Placeholder */}
                    <div className="p-[25px] flex flex-col flex-1 gap-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <div className="h-10 w-6 bg-neutral-200/70 rounded" />
                        <div className="h-10 w-20 bg-neutral-200/80 rounded" />
                        <div className="h-4 w-24 bg-neutral-200/50 rounded" />
                      </div>
                      <div className="h-4 w-32 bg-neutral-100/80 rounded" />
                      {/* Action Row Placeholder */}
                      <div className="mt-auto w-full flex flex-col gap-3">
                        <div className="h-8 w-36 bg-neutral-100/80 rounded-lg mx-auto" />
                        <div className="h-[46px] w-full bg-neutral-200/80 rounded-[10px]" />
                      </div>
                    </div>
                  </li>
                ))
              ) : search.trim().length > 0 && filtered.length === 0 ? (
                <div className="js-empty-state text-center col-span-full p-[60px_20px] text-[#666]">
                  <h3 className="font-medium mb-[10px] text-[18px]">No platforms found</h3>
                  <p>Try adjusting your search</p>
                </div>
              ) : (
                visible.map((productItem) => (
                  <ProductCard
                    key={productItem.id}
                    product={productItem}
                    selectedMode={selection[productItem.id] || null}
                    onSelect={(mode) => setSelection(prev => ({ ...prev, [productItem.id]: mode }))}
                  />
                ))
              )}
            </ul>

            {hasMore && !isLoading && (
              <div id="js-show-more-wrapper" className="show-more-wrapper flex justify-center p-[20px_0_100px_0] w-full">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 8)}
                  className="show-more-btn flex items-center gap-[8px] p-[12px_28px] bg-white text-[#333] border border-[#333] rounded-[10px] text-[14px] font-medium cursor-pointer transition-all font-sans hover:bg-[#F5F5F5]"
                  id="js-load-more-btn"
                >
                  <span>View More Platforms</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[16px] h-[16px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}