"use client";

/* eslint-disable @next/next/no-img-element */
import Wrapper from "@/components/ui/Wrapper";

interface SectionWithLeftImageProps {
  title?: React.ReactNode;
  content?: string | string[] | React.ReactNode;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function SectionWithLeftImage({
  title,
  content,
  image,
  buttonText,
  buttonLink = "#",
}: SectionWithLeftImageProps) {
  const renderContent = () => {
    if (Array.isArray(content)) {
      return content.map((p, i) => <p key={i} className="mb-6">{p}</p>);
    }
    if (typeof content === "string") {
      return <p className="mb-6">{content}</p>;
    }
    return content;
  };

  return (
    <section className="py-5 lg:py-15">
      <Wrapper>
        <div className="w-full mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <div>
                <img src={image || "/uploads/media/1778826313456-ab2b57c2-e8a2-4c20-9e20-c0e6c0f1806e-right-img-home.webp"} alt="illustration of floating review boxes" className="rounded-lg w-full" />
              </div>
            </div>
            <div>
              <h2 className="text-[40px] font-normal text-[#000] leading-tight mb-6">
                {title || (
                  <>Where Reputation Meets <span className="font-semibold text-[#000]">Real Business Growth</span></>
                )}
              </h2>
              <div className="text-[#000] leading-[2] mb-6 text-justify">
                {content ? renderContent() : (
                  <>
                    <p className="mb-6">A strong online presence boosts visibility. But to turn that visibility into growth, you need the right approach. This is where a solid review strategy matters.</p>
                    <p className="mb-6">At Get Reviews Buzz, we help businesses build and enhance their reputation. Our structured and goal-focused approach improves how your brand is perceived. We ensure it connects with your target audience and stands out in the market.</p>
                    <p className="mb-6">Our process supports long-term results. We help you encourage repeat customers and build a lasting reputation that benefits your business over time. When your reputation matches your growth goals, it builds customer trust. This leads to better conversions and lasting success.</p>
                  </>
                )}
              </div>
              {buttonText && (
                <a
                  href={buttonLink}
                  className="inline-block bg-[#fcd535] text-gray-900 px-8 py-4 rounded-md font-bold text-sm tracking-wider hover:bg-black hover:text-white transition-all uppercase"
                >
                  {buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
