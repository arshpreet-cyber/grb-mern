"use client";

import { useCart } from "@/context/CartContext";
import HomeNavbar from "@/components/HomeNavbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const products = [
  {
    id: "google-reviews",
    platform: "Google Reviews",
    image: "https://logo.clearbit.com/google.com",
    desc: "Boost your Google Business rating with real, verified 5-star reviews from genuine accounts.",
    oneTimePrice: 2.99,
    subscribePrice: 2.49,
    badge: "Most Popular",
    minimumQuantity: 10,
  },
  {
    id: "facebook-reviews",
    platform: "Facebook Reviews",
    image: "https://logo.clearbit.com/facebook.com",
    desc: "Increase trust on your Facebook page with authentic positive reviews from real users.",
    oneTimePrice: 2.49,
    subscribePrice: 1.99,
    badge: null,
    minimumQuantity: 10,
  },
  {
    id: "trustpilot-reviews",
    platform: "Trustpilot Reviews",
    image: "https://logo.clearbit.com/trustpilot.com",
    desc: "Strengthen your Trustpilot score and convert more visitors into paying customers.",
    oneTimePrice: 3.49,
    subscribePrice: 2.99,
    badge: null,
    minimumQuantity: 5,
  },
  {
    id: "amazon-reviews",
    platform: "Amazon Reviews",
    image: "https://logo.clearbit.com/amazon.com",
    desc: "Increase product credibility and boost sales with verified Amazon product reviews.",
    oneTimePrice: 4.49,
    subscribePrice: 3.99,
    badge: null,
    minimumQuantity: 5,
  },
  {
    id: "yelp-reviews",
    platform: "Yelp Reviews",
    image: "https://logo.clearbit.com/yelp.com",
    desc: "Dominate local search with high-quality Yelp reviews for your business listing.",
    oneTimePrice: 2.99,
    subscribePrice: 2.49,
    badge: null,
    minimumQuantity: 10,
  },
  {
    id: "appstore-reviews",
    platform: "App Store Reviews",
    image: "https://logo.clearbit.com/apple.com",
    desc: "Improve your app ranking with genuine iOS & Android store reviews and ratings.",
    oneTimePrice: 3.99,
    subscribePrice: 3.49,
    badge: null,
    minimumQuantity: 10,
  },
  {
    id: "tripadvisor-reviews",
    platform: "TripAdvisor Reviews",
    image: "https://logo.clearbit.com/tripadvisor.com",
    desc: "Boost your TripAdvisor ranking and attract more tourists and travelers to your business.",
    oneTimePrice: 3.99,
    subscribePrice: 3.49,
    badge: null,
    minimumQuantity: 5,
  },
  {
    id: "gmb-reviews",
    platform: "GMB Reviews",
    image: "https://logo.clearbit.com/google.com",
    desc: "Improve your Google Maps presence with authentic Google My Business reviews.",
    oneTimePrice: 2.99,
    subscribePrice: 2.49,
    badge: null,
    minimumQuantity: 10,
  },
];

function ProductCard({ product }: { product: typeof products[0] }) {
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
      icon: "🌟", // Using generic icon or we can use product.image in cart later
      type: mode === "monthly" ? "subscribe" : "one-time",
      pricePerUnit: price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <li 
      className={`relative bg-white rounded-[16px] p-[24px] flex flex-col font-sans cursor-pointer transform-gpu transition-shadow duration-200 w-full h-auto ${product.badge === 'Most Popular' ? 'most-popular-card' : ''}`}
      style={{
        border: "2px solid transparent",
        backgroundImage: "linear-gradient(#fff, #fff), linear-gradient(#E5E5E5, #ffffff)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(#fff, #fff), linear-gradient(to right, #FFC107, #E49D56)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
        if(product.badge === 'Most Popular') e.currentTarget.style.boxShadow = "0 6px 24px rgba(228, 157, 86, 0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(#fff, #fff), linear-gradient(#E5E5E5, #ffffff)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Most Popular Badge */}
      {product.badge === "Most Popular" && (
        <div className="absolute -top-[13px] right-[16px] bg-linear-to-r from-[#FFC107] to-[#E49D56] text-white font-sans text-[11px] font-semibold px-[16px] py-[5px] rounded-[20px] uppercase tracking-[0.8px] z-10 shadow-[0_2px_8px_rgba(228,157,86,0.35)] leading-[1.4]">
          {product.badge}
        </div>
      )}

      {/* Logo */}
      <div className="w-[56px] h-[56px] bg-white border border-black/10 rounded-[12px] shrink-0 flex items-center justify-center">
        <img src={product.image} alt={product.platform} className="w-[34px] h-[34px] object-contain rounded-[4px]" onError={(e) => { e.currentTarget.src = "https://getreviews.buzz/storage/app/blog/0809068001728298556_experience.svg"; }} />
      </div>

      {/* Title */}
      <h4 className="text-[17px] font-semibold text-[#323232] mt-[25px] leading-[1.35]">
        {product.platform}
      </h4>

      {/* Pricing */}
      <div className="my-[36px]">
        <div className="text-[14px] font-semibold text-black flex items-baseline gap-[2px] leading-none">
          <span className="text-[24px] font-semibold text-black">$</span>
          <span className="text-[24px] font-semibold text-black">{price.toFixed(2)}</span>
          <span className="text-[13px] font-normal text-[#555] ml-[2px]">/ per unit</span>
        </div>
        <p className="text-[13px] text-[#888] m-0 mt-1">Min. {product.minimumQuantity} Units</p>
      </div>

      {/* Toggle Buttons */}
      <div className="grid grid-cols-2 gap-[8px] mb-[12px]">
        <button
          onClick={(e) => { e.stopPropagation(); setMode("onetime"); }}
          className={`py-[8px] px-[10px] md:px-[16px] font-sans text-[13px] md:text-[14px] font-medium rounded-[8px] border transition-all text-center whitespace-nowrap ${
            !isMonthly ? "bg-[#F0EFEB] text-black/70 border-black/15" : "bg-white text-black/60 border-black/10 hover:border-[#ccc] hover:bg-[#F5F5F3]"
          }`}
        >
          One-time
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setMode("monthly"); }}
          className={`py-[8px] px-[10px] md:px-[16px] font-sans text-[13px] md:text-[14px] font-medium rounded-[8px] border transition-all text-center whitespace-nowrap ${
            isMonthly ? "bg-[#F0EFEB] text-black/70 border-black/15" : "bg-white text-black/60 border-black/10 hover:border-[#ccc] hover:bg-[#F5F5F3]"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAdd}
        className={`flex items-center justify-center gap-[8px] h-[46px] w-full border border-black/15 rounded-[10px] text-[14px] md:text-[15px] font-semibold cursor-pointer transition-all font-sans m-0 ${
          isMonthly 
            ? "bg-linear-to-b from-[#ffffff] to-[#e5e5e5] text-[#1a1a1a] hover:bg-[#F5F5F3] hover:-translate-y-[1px]" 
            : "bg-white text-[#1a1a1a] hover:bg-[#F5F5F3] hover:-translate-y-[1px]"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span>{added ? "Added to Cart" : isMonthly ? "Subscribe" : "Add to Cart"}</span>
      </button>
    </li>
  );
}

import Wrapper from "@/components/Wrapper";

export default function BuyReviewsPage() {
  const { count } = useCart();
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchFilter = filter === "all" || p.platform.toLowerCase().includes(filter);
    const matchSearch = p.platform.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <Wrapper>
      <div className="min-h-screen bg-slate-50 font-sans">
        <HomeNavbar />

        <div className="w-full mx-auto px-4 sm:px-6 py-12">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[30px] gap-[20px]">
            
            {/* Categories Pill */}
            <div className="flex gap-[10px] items-center flex-nowrap md:flex-wrap overflow-x-auto w-full md:w-auto pb-[10px] md:pb-0 scrollbar-hide">
              {["all", "google", "facebook", "amazon", "trustpilot", "yelp"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-[20px] py-[10px] rounded-[25px] border font-sans text-[14px] font-medium transition-all outline-none whitespace-nowrap ${
                    filter === f 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-[#666] border-[#E5E5E5] hover:border-[#ccc] hover:text-[#333]"
                  }`}
                >
                  {f === "all" ? "All Platforms" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-[280px]">
              <input
                type="text"
                placeholder="Search platforms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[44px] pl-[20px] pr-[45px] py-[10px] rounded-[25px] border border-[#E5E5E5] bg-white text-[14px] text-[#333] outline-none transition-all focus:border-[#ccc] font-sans box-border placeholder:text-[#999]"
              />
              <Search className="absolute right-[15px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#666] pointer-events-none" />
            </div>
          </div>

          {/* Product Grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] lg:gap-[24px] p-0 m-0 list-none">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>

          {/* View More Button */}
          {filtered.length > 0 && (
            <div className="flex justify-center pt-[40px] pb-[100px] w-full">
              <button className="flex items-center gap-[8px] px-[28px] py-[12px] bg-white text-[#333] border border-[#333] rounded-[10px] text-[14px] font-medium cursor-pointer transition-all hover:bg-[#F5F5F5] font-sans">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                View More
              </button>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
