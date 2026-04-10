/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";

const slides = [
  {
    label: "Real Estate",
    bg: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=85",
    reviews: [
      {
        platform: "Google",
        logo: "https://www.google.com/s2/favicons?domain=google.com&sz=32",
        name: "Sarah Mitchell",
        avatar: "SM",
        rating: 5,
        text: "Incredible service! My listings got so much more visibility after the reviews came in.",
        time: "2 days ago",
        color: "#4285F4",
      },
      {
        platform: "Zillow",
        logo: "https://www.google.com/s2/favicons?domain=zillow.com&sz=32",
        name: "James Thornton",
        avatar: "JT",
        rating: 5,
        text: "Best investment I made for my real estate business. Highly recommend!",
        time: "1 week ago",
        color: "#006AFF",
      },
      {
        platform: "TrustPilot",
        logo: "https://www.google.com/s2/favicons?domain=trustpilot.com&sz=32",
        name: "Emily Carter",
        avatar: "EC",
        rating: 5,
        text: "Fast delivery, real reviews. My rating jumped from 3.9 to 4.8 in two weeks!",
        time: "3 days ago",
        color: "#00B67A",
      },
    ],
  },
  {
    label: "Plumbing",
    bg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85",
    reviews: [
      {
        platform: "Google",
        logo: "https://www.google.com/s2/favicons?domain=google.com&sz=32",
        name: "Robert Hayes",
        avatar: "RH",
        rating: 5,
        text: "My plumbing business went from 10 reviews to 85 in a month. Calls tripled!",
        time: "5 days ago",
        color: "#4285F4",
      },
      {
        platform: "Houzz",
        logo: "https://www.google.com/s2/favicons?domain=houzz.com&sz=32",
        name: "Linda Brooks",
        avatar: "LB",
        rating: 5,
        text: "Absolutely worth it. Customers trust us so much more now.",
        time: "2 weeks ago",
        color: "#73BA25",
      },
      {
        platform: "Thumbtack",
        logo: "https://www.google.com/s2/favicons?domain=thumbtack.com&sz=32",
        name: "Mike Jensen",
        avatar: "MJ",
        rating: 5,
        text: "Went from page 3 to page 1 on local search. Game changer!",
        time: "1 week ago",
        color: "#009FD9",
      },
    ],
  },
  {
    label: "Legal",
    bg: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&q=85",
    reviews: [
      {
        platform: "Google",
        logo: "https://www.google.com/s2/favicons?domain=google.com&sz=32",
        name: "David Lawson",
        avatar: "DL",
        rating: 5,
        text: "Our law firm's credibility skyrocketed. New client inquiries up 60%.",
        time: "3 days ago",
        color: "#4285F4",
      },
      {
        platform: "Avvo",
        logo: "https://www.google.com/s2/favicons?domain=avvo.com&sz=32",
        name: "Patricia Moore",
        avatar: "PM",
        rating: 5,
        text: "Professional, fast, and the results speak for themselves.",
        time: "1 week ago",
        color: "#003087",
      },
      {
        platform: "TrustPilot",
        logo: "https://www.google.com/s2/favicons?domain=trustpilot.com&sz=32",
        name: "Kevin Walsh",
        avatar: "KW",
        rating: 5,
        text: "Exceeded expectations. Reviews look completely natural and authentic.",
        time: "4 days ago",
        color: "#00B67A",
      },
    ],
  },
  {
    label: "Healthcare",
    bg: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85",
    reviews: [
      {
        platform: "Google",
        logo: "https://www.google.com/s2/favicons?domain=google.com&sz=32",
        name: "Dr. Anna Collins",
        avatar: "AC",
        rating: 5,
        text: "Patient trust increased dramatically. Our clinic is now fully booked.",
        time: "2 days ago",
        color: "#4285F4",
      },
      {
        platform: "WebMD",
        logo: "https://www.google.com/s2/favicons?domain=webmd.com&sz=32",
        name: "Thomas Reed",
        avatar: "TR",
        rating: 5,
        text: "Fantastic results. More patients finding us online every single day.",
        time: "5 days ago",
        color: "#CC0000",
      },
      {
        platform: "TrustPilot",
        logo: "https://www.google.com/s2/favicons?domain=trustpilot.com&sz=32",
        name: "Susan Park",
        avatar: "SP",
        rating: 5,
        text: "The best decision for our practice. Highly professional service.",
        time: "1 week ago",
        color: "#00B67A",
      },
    ],
  },
  {
    label: "Hospitality",
    bg: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=85",
    reviews: [
      {
        platform: "Booking.com",
        logo: "https://www.google.com/s2/favicons?domain=booking.com&sz=32",
        name: "Marco Rossi",
        avatar: "MR",
        rating: 5,
        text: "Our hotel occupancy went from 60% to 95% after the reviews campaign.",
        time: "3 days ago",
        color: "#003580",
      },
      {
        platform: "TripAdvisor",
        logo: "https://www.google.com/s2/favicons?domain=tripadvisor.com&sz=32",
        name: "Claire Dubois",
        avatar: "CD",
        rating: 5,
        text: "We jumped 12 spots in TripAdvisor rankings. Incredible ROI!",
        time: "1 week ago",
        color: "#34E0A1",
      },
      {
        platform: "Google",
        logo: "https://www.google.com/s2/favicons?domain=google.com&sz=32",
        name: "Ahmed Hassan",
        avatar: "AH",
        rating: 5,
        text: "Guests now find us first on Google Maps. Revenue up 40% this quarter.",
        time: "2 days ago",
        color: "#4285F4",
      },
    ],
  },
];

const features = [
  { icon: "⭐", text: "Get Positive Reviews" },
  { icon: "📈", text: "Drive Website Traffic" },
  { icon: "📍", text: "Boost Local Ranking" },
  { icon: "🚀", text: "Scale Beyond Limits" },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#FFCC00">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function HeroBanner() {
  const { addItem, openCart } = useCart();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleStartFreeTrial = () => {
    addItem({
      id: "google-free-review",
      platform: "Google Free Review",
      icon: "⭐",
      type: "one-time",
      pricePerUnit: 0,
    });
    openCart();
  };

  return (
    <section className="flex min-h-170 w-full flex-row bg-white">

      {/* ── LEFT ── */}
      <div className="flex-[0_0_46%] flex flex-col justify-center py-16 pl-[calc(50vw-700px+20px)] pr-12 max-lg:flex-[0_0_100%] max-lg:px-5 max-lg:py-14 max-lg:items-center max-lg:text-center">

        <div className="inline-flex items-center gap-2 bg-[#fff8e1] border border-[#ffe066] rounded-full px-4 py-1.5 w-fit mb-6 max-lg:mx-auto">
          <span className="w-2 h-2 rounded-full bg-[#ffcc00] animate-pulse" />
          <span className="text-[13px] font-semibold text-[#7a6000]">
            Trusted by 12,000+ businesses
          </span>
        </div>

        <h1 className="text-[2.6rem] lg:text-[3.2rem] xl:text-[3.8rem] font-extrabold leading-[1.15] text-[#0a0a0a]" style={{ fontFamily: "Poppins, sans-serif" }}>
          Get More <br />
          <span className="text-[#ffcc00]" style={{ WebkitTextStroke: "1px #d4a800" }}>Web Traffic</span>
        </h1>

        <p className="mt-4 mb-6 max-w-95 text-[15px] leading-relaxed text-[#666] max-lg:mx-auto">
          Boost your reputation with authentic 5-star reviews on Google, TrustPilot, Zillow & 100+ platforms.
        </p>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-3 list-none p-0 mb-8 max-lg:mx-auto">
          {features.map((f) => (
            <li key={f.text} className="flex items-center gap-2.5 text-[14px] text-[#333] font-medium">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#ffe066] bg-[#fff8e1] text-[13px]">
                {f.icon}
              </span>
              {f.text}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 flex-wrap max-lg:justify-center">
          <button
            type="button"
            onClick={handleStartFreeTrial}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] text-white bg-black hover:bg-[#1a1a1a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Free Trial
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
            
          </button>
          {/* <Link href="/services/buy-reviews-online/" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#555] hover:text-black transition-colors">
            View all platforms →
          </Link> */}
        </div>

        {/* platform logos strip */}
        <div className="mt-10 pt-8 border-t border-[#f0f0f0]">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#aaa] mb-3 max-lg:text-center">Works on 100+ platforms</p>
          <div className="flex items-center gap-3 flex-wrap max-lg:justify-center">
            {[
              { domain: "google.com", name: "Google" },
              { domain: "trustpilot.com", name: "Trustpilot" },
              { domain: "facebook.com", name: "Facebook" },
              { domain: "yelp.com", name: "Yelp" },
              { domain: "zillow.com", name: "Zillow" },
              { domain: "tripadvisor.com", name: "TripAdvisor" },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-1.5 bg-[#f7f7f7] border border-[#eee] rounded-lg px-3 py-1.5">
                <img src={`https://www.google.com/s2/favicons?domain=${p.domain}&sz=16`} alt={p.name} width={14} height={14} />
                <span className="text-[12px] font-medium text-[#555]">{p.name}</span>
              </div>
            ))}
            <span className="text-[12px] text-[#aaa] font-medium">+94 more</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex-[0_0_54%] relative overflow-hidden max-lg:hidden">

        {/* bg images — clipped to 80% width so left edge has breathing room */}
        <div className="absolute top-0 right-0 w-[88%] h-full">
          {slides.map((slide, i) => (
            <img
              key={i}
              src={slide.bg}
              alt={slide.label}
              className={`absolute inset-0 w-full h-full object-cover rounded-tl-[280px] rounded-bl-[20px] ${
                i === current ? "opacity-100 z-1" : "opacity-0 z-0"
              }`}
              style={{
                transition: i === current
                  ? "opacity 800ms ease"
                  : "opacity 800ms ease",
                transform: i === current ? "scale(1) translateX(0)" : "scale(1.06) translateX(30px)",
                transitionProperty: "opacity, transform",
                transitionDuration: "900ms",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              loading={i === 0 ? undefined : "lazy"}
            />
          ))}
        </div>

        {/* gradient overlay — only on the 88% image area */}
        <div className="absolute top-0 right-0 z-2 h-full w-[88%] rounded-bl-[20px] rounded-tl-[280px] bg-linear-to-br from-black/50 via-black/20 to-transparent" />

        {/* review cards — aligned to start of the 88% bg image, left offset = 12% of right panel */}
        <div className="absolute inset-0 z-3 flex flex-col justify-center py-10" style={{ paddingLeft: "calc(12% + 24px)", paddingRight: "24px" }}>
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`${
                i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 absolute pointer-events-none"
              }`}
              style={{ transition: "opacity 600ms ease, transform 600ms ease" }}
            >
              <div className="flex flex-col gap-6">
                {slide.reviews.map((r, j) => (
                  <div
                    key={j}
                    className="bg-white/95 backdrop-blur-md rounded-2xl px-6 py-5 shadow-xl border border-white/60 flex items-start gap-4 w-[72%]"
                    style={{
                      marginLeft: `${(2 - j) * 48}px`,
                      transitionDelay: i === current ? `${j * 120}ms` : "0ms",
                    }}
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                      style={{ background: r.color }}
                    >
                      {r.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[15px] font-bold text-[#111] truncate">{r.name}</span>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <img src={r.logo} alt={r.platform} width={15} height={15} className="rounded-sm" />
                          <span className="text-[12px] text-[#888]">{r.platform}</span>
                        </div>
                      </div>
                      <StarRating count={r.rating} />
                      <p className="text-[14px] text-[#444] mt-2 leading-relaxed">{r.text}</p>
                      <p className="text-[12px] text-[#bbb] mt-2">{r.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* industry badge */}
        <div className="absolute top-8 right-8 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/60">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Industry</p>
          <p className="text-[13px] font-bold text-[#0a0a0a]">{slides[current].label}</p>
        </div>

        {/* dots */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); startTimer(); }}
              className={`transition-all duration-300 cursor-pointer rounded-full ${
                i === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
