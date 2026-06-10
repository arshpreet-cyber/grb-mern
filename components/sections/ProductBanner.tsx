"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Wrapper from "@/components/ui/Wrapper";
import { SectionProps } from "@/types/section";
import { useCart } from "@/context/CartContext";
import products from "@/lib/constants/products";

export default function BuySection({ data = {}, settings }: SectionProps) {
  const {
    title,
    description,
    image,
    ratingText = "4.9 · 2,847+ Reviews",
    pricePerReview = 15,
    productId,
    checklist,
    stats,
  } = data;

  const product = productId ? products.find((p) => p.id === productId) : null;
  const resolvedImage = image || "https://beta.getreviews.buzz/storage/app/blog/0539654001776770835_0702272001776065346_left-img.png";
  const resolvedPlatform = product?.platform || (typeof title === "string" ? title : "Product");

  const { addItem, updateQty } = useCart();

  const [quantity, setQuantity] = useState(5);
  const [plan, setPlan] = useState<"one-time" | "monthly">("one-time");
  const [spinKey, setSpinKey] = useState(0);
  const [activePkgIdx, setActivePkgIdx] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);

  // Configuration for individual package values
  const variantLabels = [
    { label: "30 Days Warranty", min: "Min. 5 reviews", oneTimePrice: 15 },
    { label: "15 Days Warranty", min: "Min. 5 reviews", oneTimePrice: 10 },
    { label: "07 Days Warranty", min: "Min. 5 reviews", oneTimePrice: 7 },
  ];

  // Check if the current service is Google Reviews
  const isGoogleProduct =
    resolvedPlatform.toLowerCase().includes("google reviews") ||
    (typeof title === "string" && title.toLowerCase().includes("google reviews")) ||
    (!title && !product?.platform);

  // Determine current unit price based on active configuration
  // Use the selected package price, or fall back to the first package when none is selected
  const effectivePkgIdx = activePkgIdx >= 0 ? activePkgIdx : 0;

  const getCurrentPrice = () => {
    if (isGoogleProduct) {
      const targetBase = variantLabels[effectivePkgIdx]?.oneTimePrice ?? pricePerReview;
      if (plan === "monthly") {
        // Apply relative subscription modifier matching context ratio structure
        const contextOneTime = product?.oneTimePrice ?? pricePerReview;
        const contextMonthly = product?.subscribePrice ?? pricePerReview;
        const ratio = contextOneTime > 0 ? (contextMonthly / contextOneTime) : 1;
        return targetBase * ratio;
      }
      return targetBase;
    } else {
      return plan === "monthly"
        ? (product?.subscribePrice ?? pricePerReview)
        : (product?.oneTimePrice ?? pricePerReview);
    }
  };

  const currentPrice = getCurrentPrice();
  const total = quantity * currentPrice;


  const handleAddToCart = () => {
    // Auto-select the first package if none is selected
    if (isGoogleProduct && activePkgIdx < 0) {
      setActivePkgIdx(0);
    }
    const usedIdx = activePkgIdx >= 0 ? activePkgIdx : 0;
    const pkgSuffix = isGoogleProduct ? `-${variantLabels[usedIdx].label.replace(/\s+/g, "").toLowerCase()}` : "";
    const cartId = productId
      ? `${productId}-${plan === "monthly" ? "monthly" : "onetime"}${pkgSuffix}`
      : `${title || "product"}-${plan}${pkgSuffix}`;

    addItem({
      id: cartId,
      platform: resolvedPlatform,
      icon: image || product?.image || "",
      image: image || product?.image || "",
      type: plan === "monthly" ? "subscribe" : "one-time",
      pricePerUnit: currentPrice,
    });
    updateQty(cartId, quantity);
  };

  const renderDescription = () => {
    if (Array.isArray(description)) {
      return description.map((p, i) => {
        if (typeof p === "string" && (p.includes("<") || p.includes(">"))) {
          return <p key={i} dangerouslySetInnerHTML={{ __html: p }} />;
        }
        return <p key={i}>{p}</p>;
      });
    }
    if (typeof description === "string") {
      if (description.includes("<") || description.includes(">")) {
        return <div dangerouslySetInnerHTML={{ __html: description }} />;
      }
      return <p>{description}</p>;
    }
    return description;
  };

  return (
    <section
      className="bg-gradient-to-b from-[#FEFEFC] to-[#FCFBF3] text-[#1A1A1A] tracking-[-0.1px] font-sans antialiased"
      style={{ padding: settings?.padding || "60px 0 100px", margin: settings?.margin, backgroundColor: settings?.backgroundColor || undefined }}
    >
      <Wrapper>
        <div
          className="max-w-[1500px] mx-auto px-5 lg:px-10 flex flex-col lg:flex-row gap-14 items-start"
        >


          <div
            className="w-full max-w-[600px] lg:max-w-none mx-auto lg:w-[55%] flex flex-col relative lg:sticky lg:top-30 lg:self-start"
            id="sticky-scroll-media-frame"
          >
            <div className="relative bg-transparent flex items-center justify-center w-full">
              <div className=" mx-auto flex justify-center items-center">
                <img
                  src={resolvedImage}
                  alt="preview"
                  className="w-full h-auto block object-contain"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            </div>
          </div>


          <div className="w-full lg:w-[45%] flex flex-col" id="prod-gmbpots">
            {/* Google Verified Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#FFE26E3D] px-2.5 py-1.5 rounded-[20px] w-fit mx-auto lg:mx-0 mb-4">
              <img
                src="https://beta.getreviews.buzz/storage/app/blog/0280225001779423808_Vector.svg"
                alt="Icon"
                width="18"
                height="18"
              />
              <span className="text-[12px] font-400 tracking-[0.8px] uppercase">
                VERIFIED SERVICES
              </span>
            </div>

            <h1 className="text-center lg:text-left text-[#000000] text-[28px] md:text-[40px] font-[300] leading-[1.25] tracking-[-0.5px] mb-4">
              Buy{" "}
              <span className="font-[500]">
                {title || "Google Reviews"}
              </span>{" "}
              That Build Trust
            </h1>

            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-[15px] text-[#4A4A48] mb-2 cursor-pointer transition-all duration-200 hover:opacity-85 text-center lg:text-left ${isExpanded ? "" : "line-clamp-2"
                }`}
              style={{ lineHeight: "1.55" }}
            >
              {description ? renderDescription() : (
                <p>Improve your business&apos;s online reputation with 100% real, authentic, and long-lasting Google reviews.</p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-3 mt-4 mb-6 text-[15px] sm:text-[16px] font-400 text-[#1A1A1A]">
              {/* Stars & Fully Underlined Ratings */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-[2.5px] text-[#FFC107]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                {/* Entire block wrapped inside the link to get a single continuous underline */}
                <a href="#" className="text-[#1A1A1A] underline decoration-1 underline-offset-4 hover:opacity-80 transition-opacity whitespace-nowrap">
                  {ratingText.includes("4.9") ? ratingText : `4.9 · ${ratingText}`}
                </a>
              </div>
              <div
                className="hidden sm:block h-[24px] w-[1px] self-center mx-1"
                style={{
                  background: 'linear-gradient(to bottom, #FDFCF6 0%, #A7A7A7 50%, #FDFCF6 100%)'
                }}
              ></div>
              <div className="flex items-center gap-1.5 text-[#1A1A1A]">
                <div className="flex items-center justify-center flex-shrink-0">
                  <img
                    src="/uploads/media/1779865984257-32abcbee-5896-4877-8916-a96dcd33ab89-Group.svg"
                    alt="24/7 Customer Service"
                    className="w-[20px] h-[20px] object-contain"
                  />
                </div>
                <span className="whitespace-nowrap">24/7 Customer Service</span>
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#EBE9E1] mb-8"></div>



            {/* CONDITIONALLY RENDER PACKAGES OR IMAGE-MATCHED TEXT PRICE */}
            {isGoogleProduct ? (
              <div>
                <span className="text-[15px] font-medium text-[#000000] uppercase tracking-[0.8px] mb-6 block text-center lg:text-left">
                  Select Package
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 md:gap-4 mb-8" id="variant-cards-wrap">
                  {variantLabels.map((pkg, idx) => {
                    const isCurrentActive = activePkgIdx >= 0 && activePkgIdx === idx;

                    // Evaluate individual item package configuration pricing values dynamically
                    let displayItemPrice = pkg.oneTimePrice;
                    if (plan === "monthly") {
                      const contextOneTime = product?.oneTimePrice ?? pricePerReview;
                      const contextMonthly = product?.subscribePrice ?? pricePerReview;
                      const ratio = contextOneTime > 0 ? (contextMonthly / contextOneTime) : 1;
                      displayItemPrice = pkg.oneTimePrice * ratio;
                    }

                    // Remove decimals and pad single digits with zero (e.g., $07)
                    const roundedPrice = Math.floor(displayItemPrice);
                    const formattedPrice = roundedPrice < 10 ? `0${roundedPrice}` : roundedPrice.toString();

                    // Dynamic colors based on active state to match the image
                    const warrantyTextColor = isCurrentActive ? "text-[#A87E2C]" : "text-[#FFC107]";
                    const tooltipBorderColor = isCurrentActive ? "border-[#A87E2C] text-[#A87E2C]" : "border-[#FFC107] text-[#FFC107]";
                    const tooltipHoverBg = isCurrentActive ? "hover:bg-[#A87E2C]" : "hover:bg-[#FFC107]";

                    return (
                      <div
                        key={idx}
                        onClick={() => setActivePkgIdx(idx)}
                        className={`w-full rounded-[10px] cursor-pointer text-left relative transition-all p-[18px_20px] ${isCurrentActive
                          ? "border-[1.5px] border-[#FFDF43] bg-[#FFFdf2]"
                          : "border border-[#EBE9E1] bg-white"
                          }`}
                      >
                        <div className=" flex items-baseline gap-1">
                          <span className="text-[28px] font-semibold text-[#000000] tracking-[-0.5px]">
                            ${formattedPrice}
                          </span>
                          <span className="text-[13px] font-400 text-[#6B6B6B]">
                            / Per Review
                          </span>
                        </div>

                        <div className={`text-[14px] font-medium flex items-center gap-1.5 ${warrantyTextColor}`}>
                          <span>{pkg.label}</span>
                          <div className="relative inline-block group">
                            <span
                              onClick={(e) => e.stopPropagation()}
                              className={`w-[14px] h-[14px] border rounded-full flex items-center justify-center text-[10px] bg-white cursor-pointer transition-colors duration-200 hover:text-white ${tooltipBorderColor} ${tooltipHoverBg}`}
                            >
                              ?
                            </span>

                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[260px] bg-[#111111] text-white p-3 rounded-[10px] text-[13px] leading-[1.5] font-normal transition-all duration-200 opacity-0 pointer-events-none invisible group-hover:opacity-100 group-hover:pointer-events-auto group-hover:visible z-[999] shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
                              If any reviews drop during the warranty period, we will replace them once, subject to a one-time <a href="/terms-and-conditions" target="_blank" className="text-[#FFDF43] underline font-medium">replacement policy</a>.
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-solid border-[#111_transparent_transparent_transparent]" />
                            </div>
                          </div>
                        </div>
                        <div className="text-[14px] text-[#8F8E88] font-normal">{pkg.min}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* MATCHES UPLOADED SCREENSHOT EXACTLY FOR NON-GOOGLE CHANNELS */
              <div className="mb-6 select-none text-center lg:text-left">
                <div className="text-[28px] text-[#1A1A1A] tracking-tight">
                  <span className="font-semibold text-[30px]">${currentPrice.toFixed(2)}</span>
                  <span className="font-normal text-[15px] text-[#1A1A1A]"> / Per Review</span>
                </div>
              </div>
            )}

            {/* Mode Switches */}
            <div className="inline-flex bg-white border border-[#0000000F] rounded-[9px] p-1 w-fit mx-auto lg:mx-0 mb-8 gap-0.5">
              <button
                type="button"
                onClick={() => setPlan("one-time")}
                className={`inline-flex items-center justify-center gap-1.5 px-6 py-2.5 text-[13px] font-bold rounded-[9px] border-none cursor-pointer text-[#4A4A48] transition-all bg-transparent ${plan === "one-time" ? "!bg-gradient-to-b from-[#FFE26E] to-[#FFCD05] !text-[#000000]" : ""}`}
              >
                One - Time
              </button>
              <button
                type="button"
                onClick={() => { setPlan("monthly"); setSpinKey(k => k + 1); }}
                className={`inline-flex items-center justify-center gap-1.5 px-6 py-2.5 text-[13px] font-bold rounded-[9px] border-none cursor-pointer text-[#4A4A48] transition-all bg-transparent ${plan === "monthly" ? "!bg-gradient-to-b from-[#FFE26E] to-[#FFCD05] !text-[#000000]" : ""}`}
              >
                <svg key={spinKey} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mr-0.5 animate-spin-once">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Monthly
              </button>
            </div>

            {/* Quantity Strips Counter & Cart Buttons */}
            <span className="text-[15px] font-medium text-[#000000] uppercase tracking-[0.8px] mb-3 block text-center lg:text-left">
              Quantity (Min: 5)
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-9 w-full">
              <div className="flex items-center border border-[#E5E5E5] rounded-[10px] h-[49px] w-full sm:w-[180px] flex-shrink-0 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(q => (q > 5 ? q - 1 : 5))}
                  className="bg-[#F9F9F9] border-none flex-1 h-full text-[28px] text-[#D4D4D4] cursor-pointer inline-flex items-center justify-center select-none font-medium hover:bg-[#F0F0F0] transition-colors pb-1"
                >
                  −
                </button>

                {/* Increased width from w-[60px] to w-[70px] to match the new container size */}
                <div className="w-[70px] h-full bg-white border-x border-[#E5E5E5] flex items-center justify-center">
                  <input
                    type="number"
                    className="w-full h-full border-none bg-transparent text-center text-[18px] font-500 text-black outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 m-0"
                    value={quantity}
                    min={5}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setQuantity(isNaN(val) || val < 5 ? 5 : val);
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="bg-[#F9F9F9] border-none flex-1 h-full text-[28px] text-[#D4D4D4] cursor-pointer inline-flex items-center justify-center select-none font-medium hover:bg-[#F0F0F0] transition-colors pb-1"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:flex-1 h-[49px] text-[16px] font-500 rounded-[8px] border-none no-underline cursor-pointer tracking-[0.2px] hover:opacity-90 transition-all ${plan === "monthly" ? "!bg-[#fc0] text-[#1a1a1a]" : "!bg-black text-white"
                  }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>{plan === "monthly" ? "Subscribe" : "Add to Cart"}-${total.toFixed(2)}</span>
              </button>
            </div>

            {/* Checklists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-9 border-b border-[#EBE9E1] pb-9">
              {(checklist && Array.isArray(checklist) ? checklist : [
                "Real, verified accounts — no bots or fakes",
                "Gradual drip-feed for natural-looking growth",
                "Custom written content tailored to your brand",
                "Free replacements within 30 days"
              ]).map((text: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-[16px] leading-[1.45] text-[#333331] font-400 text-left">
                  <img
                    src="https://beta.getreviews.buzz/storage/app/blog/0280225001779423808_Vector.svg"
                    alt="Icon"
                    width="20"
                    height="20"
                    className="flex-shrink-0 mt-0.5"
                  />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Bottom Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {(stats && Array.isArray(stats) ? stats : [
                { img: "https://beta.getreviews.buzz/storage/app/blog/0000064001779424671_costumer-1.svg", val: "10K+", lbl: "Happy Clients" },
                { img: "https://beta.getreviews.buzz/storage/app/blog/0768381001779424865_Group-1000006417.svg", val: "99%", lbl: "Retention" },
                { img: "https://beta.getreviews.buzz/storage/app/blog/0686695001779424894_Group-1000006418.svg", val: "100%", lbl: "Safe & secure" }
              ]).map((stat: { img?: string; val: string; lbl: string }, idx: number) => (
                <div key={idx} className="w-full bg-white border border-[#EBE9E1] rounded-[16px] p-4 sm:p-5 lg:p-4 xl:p-[24px_28px] flex flex-col items-baseline justify-center text-center">
                  <div className="mb-3.5 flex items-center justify-start w-full">
                    {stat.img && <img src={stat.img} alt="Stat Asset Wrapper" />}
                  </div>
                  <div className="text-[22px] font-semibold text-black mb-1 tracking-[-0.5px] w-full text-left">
                    {stat.val}
                  </div>
                  <div className="text-[16px] text-black font-400 w-full text-left">
                    {stat.lbl}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </Wrapper>
    </section>
  );
}