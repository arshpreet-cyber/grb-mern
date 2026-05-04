"use client";

/* eslint-disable @next/next/no-img-element */
import products from "@/lib/constants/products";
import { ShoppingCart } from "lucide-react";

interface Props {
  currentProductId?: string;
}

export default function YouMayAlsoLike({ currentProductId }: Props) {
  const googleProducts = products
    .filter(
      (item) =>
        item.id.startsWith("google") &&
        item.id !== currentProductId
    )
    .slice(0, 4);

  return (
    <section className="bg-[#fff] py-12 lg:py-16">
      <div className="max-w-[1500px] mx-auto px-6">

        <h2 className="text-2xl lg:text-3xl font-semibold mb-8">
          You May Also Like...
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {googleProducts.map((product) => {
            const price = product.oneTimePrice;

            return (
              <div
                key={product.id}
                className="relative bg-[#FDFCF2] rounded-[16px] p-[24px] flex flex-col"
                style={{
                  border: "2px solid transparent",
                  backgroundImage:
                    "linear-gradient(#fff, #fff), linear-gradient(#E5E5E5, #ffffff)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
              >
                {/* ICON */}
                <div className="w-[56px] h-[56px] bg-white border border-black/10 rounded-[12px] flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.platform}
                    className="w-[34px] h-[34px] object-contain"
                  />
                </div>

                {/* TITLE */}
                <h4 className="text-[17px] font-semibold text-[#323232] mt-[25px]">
                  {product.platform}
                </h4>

                {/* DESCRIPTION */}
                <p className="text-[13px] text-[#888] mt-2 line-clamp-2">
                  {product.desc}
                </p>

                {/* PRICE */}
                <div className="my-[30px]">
                  <div className="text-[24px] font-semibold text-black flex items-baseline">
                    ${price}
                    <span className="text-[13px] font-normal text-[#555] ml-1">
                      / per unit
                    </span>
                  </div>

                  <p className="text-[13px] text-[#888] mt-1">
                    Min. {product.minimumQuantity} Units · Bulk Discounts Available
                  </p>
                </div>

                {/* TOGGLE */}
                <div className="grid grid-cols-2 gap-[8px] mb-[12px]">
                  <button className="py-[8px] rounded-[8px] border text-[13px] bg-white text-black/60 border-black/10">
                    One-time
                  </button>
                  <button className="py-[8px] rounded-[8px] border text-[13px] bg-white text-black/60 border-black/10">
                    Monthly
                  </button>
                </div>

                {/* BUTTON */}
                <button className="flex items-center justify-center gap-[8px] h-[46px] w-full rounded-[10px] text-[14px] font-semibold bg-[#fc0] text-[#1a1a1a]">
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}