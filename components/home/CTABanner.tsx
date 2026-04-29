"use client";

import Link from "next/link";
import Wrapper from "@/components/ui/Wrapper";

export default function CTABanner() {
  return (
    <section className="bg-linear-to-r from-violet-600 to-indigo-700 py-20 text-center text-white">
      <Wrapper>
        <div className="mx-auto w-full px-5">
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
      </Wrapper>
    </section>
  );
}
