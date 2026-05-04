"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/navigation";
import Wrapper from "@/components/ui/Wrapper";
import { SectionProps } from "@/types/section";
import { useCart } from "@/context/CartContext";

export default function BuySection({ data = {}, settings }: SectionProps) {
  const {
    title,
    description,
    image,
    ratingText = "4.9 (11 verified Customer Reviews)",
    pricePerReview = 15,
    breadcrumbText = "Google Review",
  } = data;
  const router = useRouter();
  const { addItem, updateQty } = useCart();

  const [quantity, setQuantity] = useState(5);
  const [plan, setPlan] = useState<"one-time" | "monthly">("one-time");

  const handleAddToCart = () => {
    const id = `${title || "product"}-${plan}`;
    addItem({
      id,
      platform: typeof title === "string" ? title : "Product",
      icon: image || "",
      image: image || "",
      type: plan === "monthly" ? "subscribe" : "one-time",
      pricePerUnit: pricePerReview,
    });
    updateQty(id, quantity);
  };

  const renderDescription = () => {
    if (Array.isArray(description)) {
      return description.map((p, i) => (
        <p key={i} className="mb-4">{p}</p>
      ));
    }
    if (typeof description === "string") {
      return <p className="mb-4">{description}</p>;
    }
    return description;
  };

  const total = quantity * pricePerReview;

  return (
    <section className="bg-[#FDFCF2] py-12 lg:py-20" style={{ padding: settings?.padding, margin: settings?.margin, backgroundColor: settings?.backgroundColor || undefined }}>
      <Wrapper>
        <div className="max-w-[1500] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            {/* Breadcrumb */}
            <p className="text-sm text-gray-500 mb-4">
              <span
                onClick={() => router.push("/")}
                className="cursor-pointer hover:underline"
              >
                Home
              </span>{" "}
              / <span className="text-black">{breadcrumbText}</span>
            </p>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4">
              {title || <>Buy <span className="font-extrabold">Google Reviews</span></>}
            </h1>

            {/* Description */}
            <div className="text-gray-600 mb-4">
              {description ? renderDescription() : (
                <p>
                  Improve your business's online reputation with 100% real,
                  authentic, and long-lasting Google reviews.
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="text-yellow-400 text-lg">★★★★★</div>
              <span className="text-gray-700 text-sm">{ratingText}</span>
            </div>

            <hr className="mb-6" />

            {/* Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setPlan("one-time")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  plan === "one-time"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                One-Time
              </button>

              <button
                onClick={() => setPlan("monthly")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  plan === "monthly"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold">
                ${pricePerReview}.00
              </span>
              <span className="text-gray-600 ml-2">/ Per Review</span>
            </div>

            <hr className="mb-6" />

            {/* Quantity */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">
                QUANTITY (MIN: 5)
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => (q > 5 ? q - 1 : 5))}
                    className="px-4 py-2 bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-6">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2 bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-yellow-400 hover:text-black transition"
                >
                  Add to Cart – ${total.toFixed(2)}
                </button>
              </div>
            </div>

            <a href="#" className="text-red-500 text-sm underline">
              View Terms & Conditions
            </a>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={
                image ||
                "https://getreviews.buzz/storage/app/blog/0539654001776770835_0702272001776065346_left-img.png"
              }
              alt="preview"
              className="w-full max-w-[620px] object-contain "
            />
          </div>

        </div>
      </Wrapper>
    </section>
  );
}