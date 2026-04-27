import React from "react";

type Button = {
  text?: string;
  link?: string;
};

type Background = {
  color?: string;
  image?: string;
};

type SectionSettings = {
  id?: string;
  class?: string;
  visibility?: boolean;
  background?: Background;
};

type VelvetData = {
  section_settings?: SectionSettings;
  title?: string;
  description?: string;
  image?: string;
  btn1?: Button;
};

type Props = {
  data?: VelvetData;
};

const VelvetSection: React.FC<Props> = ({ data = {} }) => {
  const settings = data.section_settings || {};

  const customId =
    settings.id || `section-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <section
      id={customId}
      className="bg-[#f5f6f7] py-16 lg:py-24"
    >
      <div className="w-full mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6">
              {data.title ??
                "Propel Your Business To New Heights With Google Business Optimization"}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-6">
              {data.description ??
                `Create a robust Google presence for your business with Get Reviews Buzz. 
We offer a range of Google Business Optimization services to help you stand out in the crowded online marketplace.`}
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              Our targeted optimization strategies can help you attract local customers and increase your reach.
            </p>

            {/* CTA BUTTON */}
            <a
              href={data.btn1?.link ?? "#"}
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-md transition"
            >
              {data.btn1?.text ?? "GET A QUOTE"}
            </a>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            
            {/* Yellow background card */}
            <div className="absolute top-3 left-3 w-full h-full bg-yellow-200 rounded-xl"></div>

            {/* Main Image Card */}
            <div className="relative z-10 bg-white rounded-xl shadow-md p-4">
                <img
                src={
                    data.image ??
                    "https://getreviews.buzz/storage/app/blog/0289771001772516301_0007418001728297326_home-1.webp"
                }
                alt="business"
                className="rounded-lg w-full"
                />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default VelvetSection;