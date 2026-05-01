"use client";

import Image from "next/image";
import Wrapper from "@/components/ui/Wrapper";

const partners = [
  { name: "AzureAutoDetailing", src: "https://getreviews.buzz/storage/app/blog/0764040001728298998_azure-auto.webp" },
  { name: "PierPoint Mortgage", src: "https://getreviews.buzz/storage/app/blog/0768624001728298998_pearpoint.webp" },
  { name: "Interstate Air Conditioning & Heating", src: "https://getreviews.buzz/storage/app/blog/0766920001728298998_interstate.webp" },
  { name: "Ronald's Garage Doors", src: "https://getreviews.buzz/storage/app/blog/0770292001728298998_ronalds.webp" },
  { name: "North Valley Garage Doors", src: "https://getreviews.buzz/storage/app/blog/0772122001728298998_north-valley.webp" },
  { name: "Water Mold Fire Restoration", src: "https://getreviews.buzz/storage/app/blog/0578091001728541929_Water-Mold-Fire-Restoration-01.jpg" },
];

export default function PartnerLogos() {
  return (
    <section className="bg-white py-12">
      <Wrapper>
        <div className="mx-auto w-full px-5">
          {/* Logo Grid */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex h-24 w-44 items-center justify-center rounded-md border border-yellow-100 bg-white p-4 transition-shadow hover:shadow-md sm:w-52 sm:p-6"
              >
                <div className="relative h-[100px] w-[500px]">
                  <Image
                    src={partner.src}
                    alt={`${partner.name} logo`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}