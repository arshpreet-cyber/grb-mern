"use client";

import { useState, useMemo } from "react";
import products from "@/lib/constants/products";
import { ProductCard } from "@/components/home/BuyReviewsSection";
import { SectionProps } from "@/types/section";

export default function YouMayAlsoLike({ data = {} }: SectionProps) {
  const { excludeIds = [] } = data;
  
  // Identify if we are currently on a Google-related product
  const isGoogleCategory = useMemo(() => {
    return excludeIds.some((id: string) => id.toLowerCase().includes('google'));
  }, [excludeIds]);

  const [selection, setSelection] = useState<{ productId: string; mode: "onetime" | "monthly" } | null>(null);

  const filteredProducts = useMemo(() => {
    // 1. If it's a Google product, find other Google products first
    if (isGoogleCategory) {
      const googleProducts = products.filter(
        (item) => item.id.toLowerCase().includes('google') && !excludeIds.includes(item.id)
      );
      
      // If we found Google alternatives, show them (up to 4)
      if (googleProducts.length > 0) {
        return googleProducts.slice(0, 4);
      }
    }

    // 2. For all other products (or if no Google alternatives found), 
    // show a random selection excluding current products
    return products
      .filter((item) => !excludeIds.includes(item.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
      
  }, [excludeIds, isGoogleCategory]);

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