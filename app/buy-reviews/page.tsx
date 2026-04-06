"use client";

import { useCart } from "@/context/CartContext";
import HomeNavbar from "@/components/HomeNavbar";
import Link from "next/link";
import { useState } from "react";

const products = [
  {
    id: "google-reviews",
    platform: "Google Reviews",
    icon: "🌟",
    desc: "Boost your Google Business rating with real, verified 5-star reviews from genuine accounts.",
    oneTimePrice: 2.99,
    subscribePrice: 2.49,
    badge: "Most Popular",
    badgeColor: "bg-violet-600",
    features: ["Real aged accounts", "Permanent reviews", "Drip delivery", "Refill guarantee"],
    color: "from-violet-500 to-indigo-600",
  },
  {
    id: "facebook-reviews",
    platform: "Facebook Reviews",
    icon: "👍",
    desc: "Increase trust on your Facebook page with authentic positive reviews from real users.",
    oneTimePrice: 2.49,
    subscribePrice: 1.99,
    badge: "Best Value",
    badgeColor: "bg-emerald-600",
    features: ["Real profiles", "Fast delivery", "Safe method", "24/7 support"],
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "trustpilot-reviews",
    platform: "Trustpilot Reviews",
    icon: "⭐",
    desc: "Strengthen your Trustpilot score and convert more visitors into paying customers.",
    oneTimePrice: 3.49,
    subscribePrice: 2.99,
    badge: null,
    badgeColor: "",
    features: ["Verified accounts", "Natural delivery", "High retention", "Refill guarantee"],
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "amazon-reviews",
    platform: "Amazon Reviews",
    icon: "🛍️",
    desc: "Increase product credibility and boost sales with verified Amazon product reviews.",
    oneTimePrice: 4.49,
    subscribePrice: 3.99,
    badge: "Premium",
    badgeColor: "bg-amber-500",
    features: ["Verified purchase", "Detailed reviews", "Safe & compliant", "Dedicated manager"],
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "yelp-reviews",
    platform: "Yelp Reviews",
    icon: "🏪",
    desc: "Dominate local search with high-quality Yelp reviews for your business listing.",
    oneTimePrice: 2.99,
    subscribePrice: 2.49,
    badge: null,
    badgeColor: "",
    features: ["Local accounts", "Geo-targeted", "Natural pacing", "Safe delivery"],
    color: "from-red-500 to-rose-600",
  },
  {
    id: "appstore-reviews",
    platform: "App Store Reviews",
    icon: "📱",
    desc: "Improve your app ranking with genuine iOS & Android store reviews and ratings.",
    oneTimePrice: 3.99,
    subscribePrice: 3.49,
    badge: null,
    badgeColor: "",
    features: ["iOS & Android", "Real downloads", "Keyword reviews", "Ranking boost"],
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "tripadvisor-reviews",
    platform: "TripAdvisor Reviews",
    icon: "✈️",
    desc: "Boost your TripAdvisor ranking and attract more tourists and travelers to your business.",
    oneTimePrice: 3.99,
    subscribePrice: 3.49,
    badge: null,
    badgeColor: "",
    features: ["Travel accounts", "Detailed reviews", "Fast delivery", "Safe method"],
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: "gmb-reviews",
    platform: "GMB Reviews",
    icon: "📍",
    desc: "Improve your Google Maps presence with authentic Google My Business reviews.",
    oneTimePrice: 2.99,
    subscribePrice: 2.49,
    badge: "Hot",
    badgeColor: "bg-red-500",
    features: ["Maps ranking", "Local SEO boost", "Real accounts", "Permanent"],
    color: "from-indigo-500 to-violet-600",
  },
];

function ProductCard({ product }: { product: typeof products[0] }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState<"one-time" | "subscribe" | null>(null);

  const handleAdd = (type: "one-time" | "subscribe") => {
    addItem({
      id: `${product.id}-${type}`,
      platform: product.platform,
      icon: product.icon,
      type,
      pricePerUnit: type === "one-time" ? product.oneTimePrice : product.subscribePrice,
    });
    setAdded(type);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div className="relative rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
      {product.badge && (
        <span className={`absolute top-4 right-4 rounded-full ${product.badgeColor} px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white z-10`}>
          {product.badge}
        </span>
      )}

      {/* Card Header */}
      <div className={`bg-gradient-to-br ${product.color} p-6 text-white`}>
        <div className="text-4xl mb-3">{product.icon}</div>
        <h3 className="text-lg font-extrabold">{product.platform}</h3>
        <p className="mt-1 text-sm text-white/80 leading-relaxed">{product.desc}</p>
      </div>

      {/* Features */}
      <div className="px-6 py-4 flex-1">
        <ul className="space-y-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-[9px] font-bold">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing & Buttons */}
      <div className="px-6 pb-6 space-y-3">
        {/* One-Time Purchase */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">One-Time</p>
              <p className="text-xl font-extrabold text-slate-900">${product.oneTimePrice.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ review</span></p>
            </div>
          </div>
          <button
            onClick={() => handleAdd("one-time")}
            className={`w-full rounded-xl py-2.5 text-sm font-bold transition ${added === "one-time" ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90"}`}>
            {added === "one-time" ? "✓ Added to Cart!" : "🛒 Add to Cart"}
          </button>
        </div>

        {/* Subscribe */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Subscribe & Save</p>
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white">SAVE 17%</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900">${product.subscribePrice.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ review/mo</span></p>
            </div>
          </div>
          <button
            onClick={() => handleAdd("subscribe")}
            className={`w-full rounded-xl py-2.5 text-sm font-bold transition ${added === "subscribe" ? "bg-emerald-500 text-white" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
            {added === "subscribe" ? "✓ Added to Cart!" : "♻️ Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuyReviewsPage() {
  const { count, openCart } = useCart();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? products : products.filter((p) =>
    p.platform.toLowerCase().includes(filter)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950 text-white py-16 px-5 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300 mb-6">
            ⭐ 50,000+ Reviews Delivered
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Buy Reviews Online
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
            Real reviews from real accounts. Choose your platform, pick one-time or subscribe, and watch your reputation grow.
          </p>
          {count > 0 && (
            <button onClick={openCart}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-lg hover:bg-violet-50 transition">
              🛒 View Cart ({count} items)
            </button>
          )}
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-[65px] z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center gap-2 overflow-x-auto">
          {["all", "google", "facebook", "amazon", "trustpilot", "yelp", "app"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${filter === f ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {f === "all" ? "All Platforms" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 p-8 text-white text-center">
          <h2 className="text-2xl font-extrabold mb-2">Why Choose Us?</h2>
          <p className="text-violet-200 mb-8">Trusted by 12,000+ businesses worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "✅", label: "100% Real Accounts" },
              { icon: "🔒", label: "Secure & Safe" },
              { icon: "⚡", label: "Fast Delivery" },
              { icon: "♻️", label: "Refill Guarantee" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{t.icon}</span>
                <p className="text-sm font-semibold text-violet-100">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
