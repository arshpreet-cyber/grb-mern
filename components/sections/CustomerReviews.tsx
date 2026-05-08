"use client";

import React, { useRef } from "react";
import { SectionProps } from "@/types/section";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateSectionData } from "@/lib/redux/features/pageEditorSlice";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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

  const paginationRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const {
    heading = "Read Our <strong>Customer Reviews</strong>",
    subheading =
      "Below are the advantages of buying Google reviews online, demonstrating how it improves your business profile:",
    reviews = defaultReviews,
  } = data;

  const handleChange = (field: string, value: string) => {
    dispatch(updateSectionData({ id, data: { [field]: value } }));
  };

  const handleReviewChange = (index: number, field: string, value: string) => {
    const updated = reviews.map((r: any, i: number) =>
      i === index ? { ...r, [field]: value } : r
    );
    dispatch(updateSectionData({ id, data: { reviews: updated } }));
  };

  return (
    <section className="bg-gradient-to-b from-[#FEFEFC] to-[#FDFCF2] py-20 px-6">
      <div className="max-w-[1500px] mx-auto text-center">

        {/* HEADING */}
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

        {/* SUBHEADING */}
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
        <div className="relative mt-14">

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}

            pagination={{
              clickable: true,
              el: paginationRef.current,
              bulletClass:
                "swiper-pagination-bullet !w-8 !h-[6px] !rounded-full !bg-gray-300 !opacity-100 transition-all",
              bulletActiveClass:
                "swiper-pagination-bullet-active !bg-black !w-10",
            }}

            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}

            onBeforeInit={(swiper: any) => {
              swiper.params.pagination.el = paginationRef.current;
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}

            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}

            className="pb-16"
          >
            {reviews.map((item: any, i: number) => (
              <SwiperSlide key={i} className="h-auto">

                {/* CARD (UNCHANGED STYLE) */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-left shadow-sm h-full flex flex-col">

                  <div className="text-yellow-400 text-lg mb-3">
                    ★★★★★
                  </div>

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

                  <div className="mt-5">
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
                        />
                      </svg>

                      <p className="font-semibold text-gray-900">
                        {item.name}
                      </p>
                    </div>

                    <p className="text-sm text-gray-500">
                      {item.date}
                    </p>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* PAGINATION */}
          <div
            ref={paginationRef}
            className="flex justify-center gap-2 mt-8"
          ></div>

        </div>
      </div>
    </section>
  );
}