"use client";

import Link from "next/link";
import Wrapper from "@/components/Wrapper";

const services = [
  { icon: "🌟", platform: "Google Reviews", desc: "Boost your Google Business rating with real, verified 5-star reviews.", price: "$2.99", per: "per review", badge: "Most Popular", badgeColor: "bg-violet-600" },
  { icon: "👍", platform: "Facebook Reviews", desc: "Increase trust on your Facebook page with authentic positive reviews.", price: "$2.49", per: "per review", badge: "Best Value", badgeColor: "bg-emerald-600" },
  { icon: "🛒", platform: "Trustpilot Reviews", desc: "Strengthen your Trustpilot score and convert more visitors into buyers.", price: "$3.49", per: "per review", badge: null, badgeColor: "" },
  { icon: "📱", platform: "App Store Reviews", desc: "Improve your app ranking with genuine iOS & Android store reviews.", price: "$3.99", per: "per review", badge: null, badgeColor: "" },
  { icon: "🏪", platform: "Yelp Reviews", desc: "Dominate local search with high-quality Yelp reviews for your business.", price: "$2.99", per: "per review", badge: null, badgeColor: "" },
  { icon: "🛍️", platform: "Amazon Reviews", desc: "Increase product credibility and sales with verified Amazon reviews.", price: "$4.49", per: "per review", badge: "Premium", badgeColor: "bg-amber-500" },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <Wrapper>
        <div className="mx-auto w-full px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-3">Our Services</p>
            <h2 className="text-4xl font-extrabold text-slate-900">Reviews for Every Platform</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              We cover all major review platforms so you can build trust wherever your customers are looking.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.platform} className="relative rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                {s.badge && (
                  <span className={`absolute top-4 right-4 rounded-full ${s.badgeColor} px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white`}>
                    {s.badge}
                  </span>
                )}
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-bold text-slate-900">{s.platform}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-violet-600">{s.price}</span>
                    <span className="ml-1 text-xs text-slate-400">{s.per}</span>
                  </div>
                  <Link href="/register" className="rounded-xl bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700 hover:bg-violet-100 transition">
                    Order Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
