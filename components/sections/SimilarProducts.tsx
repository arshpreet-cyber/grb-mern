"use client";

import { useState } from "react";
import products from "@/lib/constants/products";
import { ProductCard } from "@/components/home/BuyReviewsSection";
import { SectionProps } from "@/types/section";

export default function YouMayAlsoLike({ data = {} }: SectionProps) {
  const { excludeIds = [], category = "google" } = data;
  const [selection, setSelection] = useState<{ productId: string; mode: "onetime" | "monthly" } | null>(null);

  const filteredProducts = products
    .filter((item) => item.id.startsWith(category) && !excludeIds.includes(item.id))
    .slice(0, 4);

  return (
    <section className="bg-[#fff] py-12 lg:py-16">
      <div className="max-w-[1500px] mx-auto px-6">
        <h2 className="text-2xl lg:text-3xl font-semibold mb-8">
          You May Also Like...
        </h2>
        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selectedMode={selection?.productId === product.id ? selection.mode : null}
              onSelect={(mode) => setSelection({ productId: product.id, mode })}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
