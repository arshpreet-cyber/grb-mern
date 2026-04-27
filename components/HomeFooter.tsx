"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Wrapper from "@/components/Wrapper";

export default function HomeFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-14">
      <Wrapper>
        <div className="mx-auto w-full px-5">
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
      </Wrapper>
    </footer>
  );
}
