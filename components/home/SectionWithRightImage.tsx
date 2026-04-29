"use client";

/* eslint-disable @next/next/no-img-element */
import Wrapper from "@/components/ui/Wrapper";

export default function SectionWithRightImage() {
  return (
    <section className="py-5 lg:py-15 bg-white">
      <Wrapper>
        <div className="w-full mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[38px] lg:text-[40px] font-normal text-gray-900 leading-tight mb-6">
                Turn Reviews into Brand
                <br />
                <span className="font-semibold">Visibility and Growth</span>
              </h2>
              <p className="text-[#000] leading-[2] mb-6 text-justify">
                Customer reviews shape how people see your business. They often decide whether someone chooses you or looks elsewhere. Most customers rely on reviews to judge quality and trust, and they look for real experiences. But here&apos;s the thing. A small number of reviews rarely creates a strong impact.
              </p>
              <p className="text-[#000] leading-[2] mb-6 text-justify">
                Regular feedback builds credibility over time. It shows that your business consistently delivers value. Recent reviews matter just as much, since they reflect how your business performs today.
              </p>
              <p className="text-[#000] leading-[2] mb-6 text-justify">
                Strong and consistent reviews improve your visibility across search and local platforms. They help your business appear when customers are actively looking and ready to take action. With a clear and consistent approach, reviews become a valuable asset that builds trust, strengthens visibility, and supports steady growth.
              </p>
            </div>

            <div className="relative">
              <div className="relative">
                <img
                  src="https://getreviews.buzz/storage/app/blog/0547241001776770835_0936012001776065359_right-img.png"
                  alt="Review and growth illustration"
                  className="w-[743px] h-[706px]"
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
