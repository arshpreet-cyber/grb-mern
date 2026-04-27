"use client";

/* eslint-disable @next/next/no-img-element */
import Wrapper from "@/components/Wrapper";
import { useEffect, useRef, useState } from "react";

interface StatItemProps {
  target: number;
  suffix: string;
  label: string;
  description: string;
  shouldAnimate: boolean;
}

function useCountUp(target: number, shouldAnimate: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    let startTime: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startValue + eased * (target - startValue)));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(step);
  }, [shouldAnimate, target, duration]);

  return count;
}

function StatItem({ target, suffix, label, description, shouldAnimate }: StatItemProps) {
  const count = useCountUp(target, shouldAnimate, 2200);

  return (
    <div className="flex flex-col text-left px-4 lg:px-8 xl:px-10">
      <div className="text-[48px] lg:text-[56px] leading-none text-black mb-4 lg:mb-6 font-normal tracking-[-1px]">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[#FFC000] font-semibold text-[18px] mb-3">{label}</div>
      <div className="text-[#777] text-[15px] leading-[1.6] sm:max-w-[280px]">{description}</div>
    </div>
  );
}

const stats = [
  { target: 12804, suffix: "+", label: "Orders Delivered", description: "Focused on getting every delivery right with care and consistency." },
  { target: 6090, suffix: "+", label: "Active Users", description: "Partnering with businesses across industries to build a lasting reputation." },
  { target: 95, suffix: "%", label: "Client Satisfaction", description: "A reflection of our commitment to quality, trust, and measurable results." },
  { target: 7, suffix: "+", label: "Years Of Proven Growth", description: "Determined to adapt experienced strategies in reputation management." },
];

export default function StatsBar() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section className="bg-white py-16 px-4 sm:px-6 relative w-full font-sans" ref={sectionRef}>
      <Wrapper>
        <div className="w-full">
          <div className="text-center mb-16 md:mb-[80px]">
            <h2 className="text-[28px] sm:text-[30px] lg:text-[40px] leading-[1.25] text-[#111]">
              <span className="font-normal text-[#222]">Why Businesses Keep Coming Back:</span>
              <strong className="font-bold text-black lg:mt-3 inline-block">Proven Results, Trusted Reviews, Consistent Growth</strong>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-y-16 lg:gap-y-0 lg:divide-x lg:divide-gray-200">
            {stats.map((stat) => (
              <StatItem key={stat.label} {...stat} shouldAnimate={hasAnimated} />
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}