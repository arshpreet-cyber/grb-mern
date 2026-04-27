import React from "react";

type Button = {
  text?: string;
  link?: string;
};

type Feature = {
  text: string;
};

type SectionData = {
  title?: string;
  description?: string;
  features?: Feature[];
  image?: string;
  btn?: Button;
};

type Props = {
  data?: SectionData;
};

const SectionWithLeftImage: React.FC<Props> = ({ data = {} }) => {
  return (
    <section className="bg-[#f5f6f7] py-16 lg:py-24">
      <div className="w-full mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT IMAGE */}
          <div className="relative">
            
            {/* Yellow shadow background */}
           <div className="absolute top-3 right-3 w-full h-full bg-yellow-200 rounded-xl"></div>

            {/* Image */}
            <div className="relative bg-white rounded-xl p-4">
              <img
                src={
                  data.image ??
                  "https://getreviews.buzz/storage/app/blog/0289771001772516301_0007418001728297326_home-1.webp"
                }
                alt="seo"
                className="rounded-lg w-full"
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6">
              {data.title ??
                "SEO Services To Rank Your Website Across The Top Search Engines"}
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              {data.description ??
                "Looking to secure the top spot in search engine results? We have got you covered! With our SEO expertise and knowledge, we can help make it happen."}
            </p>

            {/* FEATURES LIST */}
            <ul className="space-y-3 mb-8">
              {(data.features ?? [
                { text: "Measurable results" },
                { text: "Comprehensive website audit" },
                { text: "Real-time project status reports" },
                { text: "More website traffic, qualified leads, and positive reviews" },
              ]).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-yellow-500 mt-1">✔</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* BUTTON */}
            <a
              href={data.btn?.link ?? "#"}
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-md transition"
            >
              {data.btn?.text ?? "GET A QUOTE"}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SectionWithLeftImage;