"use client";

import React from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

import { Swiper, SwiperSlide } from "swiper/react";


import "swiper/css";


const defaultReviews = [
  {
    text: "Honestly, I was a little doubtful, but everything turned out great. The reviews look super real, and I've already noticed more people checking out my business.",
    name: "Emily R., Tampa, FL",
    date: "04th April, 2025",
  },
  {
    text: "Great experience overall. Everything was smooth and the results were visible quickly.",
    name: "John D., Miami, FL",
    date: "10th April, 2025",
  },
  {
    text: "Very satisfied. The process was easy and support was responsive.",
    name: "Sarah K., Dallas, TX",
    date: "18th April, 2025",
  },
  {
    text: "Highly recommended. Helped boost visibility and trust instantly.",
    name: "Michael B., Austin, TX",
    date: "22nd April, 2025",
  },
  {
    text: "Amazing service! My business profile looks much more credible now.",
    name: "Lisa M., Chicago, IL",
    date: "28th April, 2025",
  },
  {
    text: "Fast delivery and genuine-looking reviews. Will use again!",
    name: "Tom W., Seattle, WA",
    date: "02nd May, 2025",
  },
];

export default function Testimonials({
  id,
  data = {},
  settings,
  isEditing,
}: SectionProps) {

  const dispatch = useAppDispatch();

  const {
    heading = "Read Our <strong>Customer Reviews</strong>",
    subheading = "Below are the advantages of buying Google reviews online, demonstrating how it improves your business profile:",
    reviews = defaultReviews,
  } = data;

  const handleChange = (field: string, value: string) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handleReviewChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = reviews.map((r: any, i: number) =>
      i === index ? { ...r, [field]: value } : r
    );

    dispatch(updateSectionData({ id, data: { reviews: updated } }));
  };

  return (
    <section className="bg-gradient-to-b from-[#FEFEFC] to-[#FDFCF2] py-20 px-6">
      <div className="max-w-[1500px] mx-auto text-center">

        {/* Heading */}
        {isEditing ? (
          <input
            className="text-4xl font-semibold text-gray-900 w-full text-center outline-none border-b border-dashed border-[#fc0] bg-transparent mb-2"
            value={heading.replace(/<[^>]*>/g, "")}
            onChange={(e) => handleChange("heading", e.target.value)}
          />
        ) : (
          <h2
            className="text-4xl font-semibold text-gray-900"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        )}

        {/* Subheading */}
        {isEditing ? (
          <textarea
            className="mt-4 text-gray-600 max-w-2xl mx-auto w-full text-center outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none"
            rows={2}
            value={subheading}
            onChange={(e) => handleChange("subheading", e.target.value)}
          />
        ) : (
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {subheading}
          </p>
        )}

        {/* SWIPER */}
        <div className="mt-14">

          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            loop={true}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="testimonialSwiper pb-14"
          >

            {reviews.map((item: any, i: number) => (
              <SwiperSlide key={i} className="h-auto">

                {/* ORIGINAL CARD STYLE */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-left shadow-sm h-full flex flex-col">

                  {/* Stars */}
                  <div className="text-yellow-400 text-lg mb-3">
                    ★★★★★
                  </div>

                  {/* Review Text */}
                  {isEditing ? (
                    <textarea
                      className="text-gray-700 leading-relaxed w-full outline-none border-b border-dashed border-[#fc0] bg-transparent resize-none flex-1"
                      rows={4}
                      value={item.text}
                      onChange={(e) =>
                        handleReviewChange(i, "text", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed flex-1 line-clamp-2">
                      {item.text}
                    </p>
                  )}

                  {/* User */}
                  <div className="mt-5">

                    {isEditing ? (
                      <>
                        <input
                          className="font-semibold text-gray-900 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent"
                          value={item.name}
                          onChange={(e) =>
                            handleReviewChange(i, "name", e.target.value)
                          }
                        />

                        <input
                          className="text-sm text-gray-500 w-full outline-none border-b border-dashed border-[#fc0] bg-transparent mt-1"
                          value={item.date}
                          onChange={(e) =>
                            handleReviewChange(i, "date", e.target.value)
                          }
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">

                          <svg
                            className="w-5 h-5 text-green-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 2l2.2 2.5 3.3-.5 1.2 3.1 3.1 1.2-.5 3.3L22 12l-2.5 2.2.5 3.3-3.1 1.2-1.2 3.1-3.3-.5L12 22l-2.2-2.5-3.3.5-1.2-3.1-3.1-1.2.5-3.3L2 12l2.5-2.2-.5-3.3 3.1-1.2 1.2-3.1 3.3.5L12 2z" />

                            <path
                              d="M9.5 12.5l1.5 1.5 3-3"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                        </div>

                        <p className="text-sm text-gray-500 ml-0">
                          {item.date}
                        </p>
                      </>
                    )}
                  </div>
                </div>

              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}