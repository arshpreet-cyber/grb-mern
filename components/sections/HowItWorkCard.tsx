"use client";

import React from "react";

const steps = [
  {
    title: "Pick A Review",
    desc: "Choose The Type And Number Of Google Reviews You Want To Improve Your Company’s Profile.",
    color: "bg-yellow-100",
    icon: "⭐",
  },
  {
    title: "Select Your Package",
    desc: "Pick The Number Of Reviews Or The Service Package That Fits Your Needs.",
    color: "bg-blue-100",
    icon: "📝",
  },
  {
    title: "Configure & Order",
    desc: "Buy Google Reviews With A Secure, One-Step Checkout And Your Preferred Payment Method.",
    color: "bg-green-100",
    icon: "🛒",
  },
  {
    title: "Fill Business Details",
    desc: "Include Your Google Business Profile (GBP) Link And Any Customization Instructions.",
    color: "bg-indigo-100",
    icon: "📄",
  },
];

export default function HowItWorks() {
  // ✨ Different motion for each card (fan-out effect)
  const transforms = [
    "group-hover:-translate-y-6 group-hover:-translate-x-6 group-hover:-rotate-3",
    "group-hover:-translate-y-12 group-hover:rotate-1",
    "group-hover:-translate-y-8 group-hover:translate-x-6 group-hover:rotate-3",
    "group-hover:-translate-y-4 group-hover:translate-x-10 group-hover:rotate-6",
  ];

  return (
    <section className="bg-[#f7f7f7] py-24 px-6">
      <div className="max-w-[1500] mx-auto text-center">
        
        {/* Heading */}
        <h2 className="text-4xl font-semibold text-gray-900">
          How It Works in <span className="font-bold">4 Simple Steps</span>
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Our process is quick, simple, and designed to help you improve your online reputation effortlessly.
        </p>

        {/* Cards Group */}
        <div className="group flex flex-wrap justify-center gap-6 mt-16">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`
                w-[260px]
                bg-white rounded-2xl p-6 text-left
                border border-gray-200 shadow-sm

                transition-all duration-500 ease-out
                transform-gpu

                ${transforms[i]}
                group-hover:shadow-xl
              `}
              style={{
                // ✨ slight messy stack look
                transform: `rotate(${i % 2 === 0 ? "-2deg" : "2deg"})`,
                // ✨ stagger animation
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 flex items-center justify-center rounded-xl ${step.color}`}>
                <span className="text-2xl">{step.icon}</span>
              </div>

              {/* Title */}
              <h3 className="mt-6 font-semibold text-lg text-gray-900">
                {step.title}
              </h3>

              {/* Desc */}
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}