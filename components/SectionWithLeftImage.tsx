"use client";

/* eslint-disable @next/next/no-img-element */
import Wrapper from "@/components/Wrapper";

export default function SectionWithLeftImage() {
  return (
    <section className="py-5 lg:py-15">
      <Wrapper>
        <div className="w-full mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div>
                <img src="https://getreviews.buzz/storage/app/blog/0539654001776770835_0702272001776065346_left-img.png" alt="illustration of floating review boxes" className="rounded-lg w-full" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6">
                Where Reputation Meets <span className="text-[#FCD12A] font-bold">Real Business Growth</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                A strong online presence boosts visibility. But to turn that visibility into growth, you need the right approach. This is where a solid review strategy matters.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Get Reviews Buzz, we help businesses build and enhance their reputation. Our structured and goal-focused approach improves how your brand is perceived. We ensure it connects with your target audience and stands out in the market.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our process supports long-term results. We help you encourage repeat customers and build a lasting reputation that benefits your business over time. When your reputation matches your growth goals, it builds customer trust. This leads to better conversions and lasting success.
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
