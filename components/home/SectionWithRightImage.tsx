"use client";

/* eslint-disable @next/next/no-img-element */
import Wrapper from "@/components/ui/Wrapper";

interface SectionWithRightImageProps {
  title?: React.ReactNode;
  content?: string | string[] | React.ReactNode;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function SectionWithRightImage({
  title,
  content,
  image,
  buttonText,
  buttonLink = "#",
}: SectionWithRightImageProps) {
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
    <section className="py-5 lg:py-15 bg-white overflow-hidden font-sans">
      <Wrapper>
        <div className="w-full mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <h2 className="text-[38px] lg:text-[40px] font-normal text-gray-900 leading-tight mb-6">
                {title || (
                  <>
                    Turn Reviews into Brand
                    <br />
                    <span className="font-semibold">Visibility and Growth</span>
                  </>
                )}
              </h2>
              <div className="text-black leading-[2] mb-6 text-justify">
                {content ? renderContent() : (
                  <>
                    <p className="mb-6">
                      Customer reviews shape how people see your business. They often decide whether someone chooses you or looks elsewhere. Most customers rely on reviews to judge quality and trust, and they look for real experiences. But here&apos;s the thing. A small number of reviews rarely creates a strong impact.
                    </p>
                    <p className="mb-6">
                      Regular feedback builds credibility over time. It shows that your business consistently delivers value. Recent reviews matter just as much, since they reflect how your business performs today.
                    </p>
                    <p className="mb-6">
                      Strong and consistent reviews improve your visibility across search and local platforms. They help your business appear when customers are actively looking and ready to take action. With a clear and consistent approach, reviews become a valuable asset that builds trust, strengthens visibility, and supports steady growth.
                    </p>
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

            <div className="relative flex justify-center lg:justify-end">
              <img
                src={image || "/uploads/media/1778826313456-ab2b57c2-e8a2-4c20-9e20-c0e6c0f1806e-right-img-home.webp"}
                alt="Illustration"
                className="w-full h-auto max-w-[743px] object-contain"
              />
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
