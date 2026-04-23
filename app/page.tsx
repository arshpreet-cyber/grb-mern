/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import HomeNavbar from "@/components/HomeNavbar";
// import HeroBanner from "@/components/HeroBanner";
import PremiumHeroSection from "@/components/PremiumHeroSection";

const services = [
  {
    icon: "🌟",
    platform: "Google Reviews",
    desc: "Boost your Google Business rating with real, verified 5-star reviews.",
    price: "$2.99",
    per: "per review",
    badge: "Most Popular",
    badgeColor: "bg-violet-600",
  },
  {
    icon: "👍",
    platform: "Facebook Reviews",
    desc: "Increase trust on your Facebook page with authentic positive reviews.",
    price: "$2.49",
    per: "per review",
    badge: "Best Value",
    badgeColor: "bg-emerald-600",
  },
  {
    icon: "🛒",
    platform: "Trustpilot Reviews",
    desc: "Strengthen your Trustpilot score and convert more visitors into buyers.",
    price: "$3.49",
    per: "per review",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "📱",
    platform: "App Store Reviews",
    desc: "Improve your app ranking with genuine iOS & Android store reviews.",
    price: "$3.99",
    per: "per review",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "🏪",
    platform: "Yelp Reviews",
    desc: "Dominate local search with high-quality Yelp reviews for your business.",
    price: "$2.99",
    per: "per review",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "🛍️",
    platform: "Amazon Reviews",
    desc: "Increase product credibility and sales with verified Amazon reviews.",
    price: "$4.49",
    per: "per review",
    badge: "Premium",
    badgeColor: "bg-amber-500",
  },
];

const packages = [
  {
    name: "Starter",
    price: "$19",
    reviews: "10 Reviews",
    features: ["Google or Facebook", "Delivered in 3–5 days", "Real accounts", "24/7 support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$49",
    reviews: "30 Reviews",
    features: ["Any platform", "Delivered in 5–7 days", "Real accounts", "Priority support", "Drip delivery"],
    cta: "Most Popular",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$99",
    reviews: "75 Reviews",
    features: ["Multi-platform", "Delivered in 7–10 days", "Real accounts", "Dedicated manager", "Drip delivery", "Refill guarantee"],
    cta: "Go Pro",
    highlight: false,
  },
];

const steps = [
  { step: "01", title: "Choose Your Package", desc: "Select the platform and number of reviews that fit your business goals." },
  { step: "02", title: "Provide Your Details", desc: "Share your business URL or profile link — no passwords needed, ever." },
  { step: "03", title: "Secure Checkout", desc: "Pay safely with credit card, PayPal, or crypto. 100% encrypted." },
  { step: "04", title: "Watch Reviews Roll In", desc: "Reviews are delivered gradually to look natural and stay permanent." },
];

const testimonials = [
  {
    name: "James R.",
    role: "Restaurant Owner",
    avatar: "JR",
    text: "My Google rating went from 3.8 to 4.7 in just two weeks. Bookings are up 40%. Absolutely worth every penny.",
    stars: 5,
  },
  {
    name: "Sarah M.",
    role: "E-commerce Seller",
    avatar: "SM",
    text: "The Amazon reviews were delivered exactly as promised. My product went from page 4 to page 1. Incredible results.",
    stars: 5,
  },
  {
    name: "David K.",
    role: "App Developer",
    avatar: "DK",
    text: "App Store reviews boosted my app's visibility massively. Downloads tripled within a month. Highly recommend!",
    stars: 5,
  },
];

const faqs = [
  {
    q: "Are the reviews from real people?",
    a: "Yes. All reviews come from real, aged accounts with genuine activity. We never use bots or fake profiles.",
  },
  {
    q: "Will the reviews be removed?",
    a: "Our reviews are designed to be permanent. We offer a free refill guarantee if any are removed within 30 days.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery starts within 24–48 hours. We drip-feed reviews gradually to ensure they look completely natural.",
  },
  {
    q: "Is this safe for my business?",
    a: "Absolutely. We use safe, manual delivery methods that comply with platform guidelines to protect your account.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and cryptocurrency for maximum privacy and convenience.",
  },
];

const stats = [
  { value: "50,000+", label: "Reviews Delivered" },
  { value: "12,000+", label: "Happy Clients" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Customer Support" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* ── Navbar ── */}
      <HomeNavbar />

      {/* ── New Premium Hero ── */}
      <PremiumHeroSection />

      {/* ── Hero ── */}
      {/* <HeroBanner /> */}

      {/* ── Stats Bar ── */}
      <section className="bg-linear-to-r from-violet-600 to-indigo-700 text-white">
        <div className="mx-auto grid max-w-350 grid-cols-2 gap-8 px-5 py-10 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="mt-1 text-sm text-violet-200">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-350 px-5">
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
      </section>

      {/* ── Pricing Packages ── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="mx-auto max-w-350 px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-3">Pricing</p>
            <h2 className="text-4xl font-extrabold text-slate-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              No hidden fees. No subscriptions. Pay once and watch your reputation grow.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-3xl p-8 flex flex-col ${
                  pkg.highlight
                    ? "bg-linear-to-br from-violet-600 to-indigo-700 text-white shadow-2xl scale-105"
                    : "bg-white border border-slate-200 text-slate-900 shadow-sm"
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-5 py-1.5 text-xs font-bold text-slate-900 shadow">
                    ⭐ Most Popular
                  </div>
                )}
                <p className={`text-sm font-bold uppercase tracking-widest ${pkg.highlight ? "text-violet-200" : "text-violet-600"}`}>
                  {pkg.name}
                </p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-5xl font-extrabold">{pkg.price}</span>
                  <span className={`mb-2 text-sm ${pkg.highlight ? "text-violet-200" : "text-slate-400"}`}>/ package</span>
                </div>
                <p className={`mt-1 text-sm font-semibold ${pkg.highlight ? "text-violet-200" : "text-slate-500"}`}>{pkg.reviews}</p>

                <ul className="mt-8 space-y-3 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${pkg.highlight ? "text-violet-100" : "text-slate-600"}`}>
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${pkg.highlight ? "bg-white/20 text-white" : "bg-violet-100 text-violet-600"}`}>
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`mt-8 block rounded-2xl py-3.5 text-center text-sm font-bold transition ${
                    pkg.highlight
                      ? "bg-white text-violet-700 hover:bg-violet-50"
                      : "bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90"
                  }`}
                >
                  {pkg.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-slate-950 text-white">
        <div className="mx-auto max-w-350 px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Process</p>
            <h2 className="text-4xl font-extrabold">How It Works</h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Getting more reviews is simple. Just 4 easy steps and you&apos;re done.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute top-8 left-full z-0 hidden h-px w-full bg-linear-to-r from-violet-600/50 to-transparent lg:block" />
                )}
                <div className="relative z-10 rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-indigo-700 text-lg font-extrabold text-white shadow-lg">
                    {s.step}
                  </div>
                  <h3 className="text-base font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-350 px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-3">Testimonials</p>
            <h2 className="text-4xl font-extrabold text-slate-900">What Our Clients Say</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white border border-slate-100 p-7 shadow-sm">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-700">&quot;{t.text}&quot;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-linear-to-r from-violet-600 to-indigo-700 py-20 text-center text-white">
        <div className="mx-auto max-w-350 px-5">
          <h2 className="text-4xl font-extrabold">Ready to Boost Your Reputation?</h2>
          <p className="mt-4 text-violet-200 text-lg">
            Join 12,000+ businesses that trust us to grow their online presence.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="rounded-2xl bg-white px-8 py-4 text-base font-bold text-violet-700 shadow-xl hover:bg-violet-50 transition">
              Start Today — It&apos;s Easy →
            </Link>
            <Link href="#pricing" className="rounded-2xl border border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-white">
        <div className="mx-auto max-w-350 px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-3">FAQ</p>
            <h2 className="text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <p className="font-bold text-slate-900 flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-xs">?</span>
                  {faq.q}
                </p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-400 py-14">
        <div className="mx-auto max-w-350 px-5">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div>
              <div className="mb-4">
                <img
                  src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
                  alt="GetReviews.Buzz"
                  width={160}
                  height={40}
                  style={{ width: "160px", height: "auto" }}
                />
              </div>
              <p className="text-sm leading-relaxed">The #1 platform for buying real, authentic reviews to grow your business reputation online.</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Services</p>
              <ul className="space-y-2 text-sm">
                {["Google Reviews", "Facebook Reviews", "Trustpilot Reviews", "Amazon Reviews", "App Store Reviews"].map((s) => (
                  <li key={s}><Link href="/register" className="hover:text-white transition">{s}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                {["About Us", "How It Works", "Pricing", "Blog", "Contact"].map((s) => (
                  <li key={s}><Link href="#" className="hover:text-white transition">{s}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                {["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy"].map((s) => (
                  <li key={s}><Link href="#" className="hover:text-white transition">{s}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} grb-mern-gilt.vercel.app — All rights reserved.</p>
            <div className="flex items-center gap-4">
              {["🔒 SSL Secured", "💳 Safe Payments", "⭐ Trusted Service"].map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

