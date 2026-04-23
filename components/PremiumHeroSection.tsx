"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";

type MousePosition = {
  x: number;
  y: number;
};

const PremiumHeroScene = dynamic<{
  mouse: MousePosition;
  pushTrigger: { x: number; y: number; timestamp: number } | null;
}>(() => import("./PremiumHeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(250,204,21,0.2),_transparent_28%),radial-gradient(circle_at_70%_70%,_rgba(0,0,0,0.06),_transparent_34%),linear-gradient(180deg,_#ffffff_0%,_#fffdf4_100%)]" />
  ),
});

const platformTags = ["Google", "Trustpilot", "Facebook", "Avvo"];
const industryTags = ["Hotels", "Hospitals", "Legal Firms"];
const trustStats = [
  { value: "4.9/5", label: "Reputation velocity" },
  { value: "120+", label: "Review touchpoints" },
  { value: "24/7", label: "Brand presence" },
];

export default function PremiumHeroSection() {
  const [mouse, setMouse] = useState<MousePosition>({ x: 0, y: 0 });
  const [pushTrigger, setPushTrigger] = useState<{
    x: number;
    y: number;
    timestamp: number;
  } | null>(null);

  const capabilityPills = useMemo(
    () => [
      ...platformTags.map((label) => `Platform | ${label}`),
      ...industryTags.map((label) => `Industry | ${label}`),
    ],
    [],
  );

  return (
    <section
      className="relative isolate overflow-hidden bg-white text-black"
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -2;
        setMouse({ x, y });
      }}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      onClick={() =>
        setPushTrigger({ x: 0.5, y: 0.5, timestamp: performance.now() })
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,_rgba(250,204,21,0.16),_transparent_24%),radial-gradient(circle_at_88%_18%,_rgba(0,0,0,0.05),_transparent_22%),linear-gradient(180deg,_#ffffff_0%,_#fffdf7_72%,_#ffffff_100%)]" />
      <div className="absolute left-0 top-0 h-[520px] w-[520px] rounded-full bg-yellow-300/18 blur-3xl" />
      <div className="absolute right-0 top-24 h-[420px] w-[420px] rounded-full bg-stone-200/60 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-black/8" />

      <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 xl:px-12">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-700 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.9)]" />
            Trusted review infrastructure
          </div>

          <div className="mt-8 max-w-2xl rounded-[2rem] border border-black/8 bg-white/92 p-7 shadow-[0_30px_90px_rgba(17,17,17,0.09)] backdrop-blur-xl sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-500">
              Get Reviews
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl lg:text-6xl">
              Build Trust. Boost Reputation.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-700 sm:text-lg">
              Premium review solutions for every industry and platform.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
              Launch polished, high-credibility review campaigns across hospitality,
              healthcare, and legal services with seamless distribution to the
              platforms customers trust most.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-stone-900"
              >
                Get Started
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-yellow-300/30 px-6 py-3.5 text-sm font-semibold text-stone-900 transition hover:bg-yellow-300/45"
              >
                View Services
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {capabilityPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-black/8 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-600"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {trustStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.5rem] border border-black/8 bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.05)]"
              >
                <div className="text-2xl font-semibold text-stone-950">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-stone-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] lg:min-h-[680px]">
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-black/8 bg-[radial-gradient(circle_at_center,_rgba(250,204,21,0.14),_transparent_54%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(255,250,235,0.94))] shadow-[0_30px_90px_rgba(0,0,0,0.08)]" />
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            <div className="pointer-events-none absolute inset-0">
              <PremiumHeroScene mouse={mouse} pushTrigger={pushTrigger} />
            </div>
          </div>

          <div className="pointer-events-none absolute left-6 top-6 rounded-2xl border border-black/8 bg-white/95 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <div className="text-xs uppercase tracking-[0.22em] text-stone-400">
              Coverage
            </div>
            <div className="mt-2 text-sm font-medium text-stone-900">
              Hotels, hospitals, legal firms
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-6 right-6 rounded-2xl border border-black/8 bg-black px-4 py-3 shadow-[0_18px_36px_rgba(0,0,0,0.14)]">
            <div className="text-xs uppercase tracking-[0.22em] text-stone-400">
              Platforms
            </div>
            <div className="mt-2 text-sm font-medium text-white">
              Google, Trustpilot, Facebook, Avvo
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
