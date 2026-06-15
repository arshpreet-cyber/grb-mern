"use client";

import Image from "next/image";
import Wrapper from "@/components/ui/Wrapper";

const partners = [
  { name: "AzureAutoDetailing", src: "/uploads/media/1781506667564-86dcb207-c350-414a-b118-1423261a62f3-0764040001728298998-azure-auto.webp" },
  { name: "PierPoint Mortgage", src: "/uploads/media/1781506683843-4e455cd6-b5bc-49ce-a0b4-5d1588de4919-0768624001728298998-pearpoint.webp" },
  { name: "Interstate Air Conditioning & Heating", src: "/uploads/media/1781506696509-07fca59c-5276-487c-aea5-476e4d4ef837-0766920001728298998-interstate.webp" },
  { name: "Ronald's Garage Doors", src: "/uploads/media/1781506708894-6fa2480b-958f-49af-863d-ad01854f6b7c-0770292001728298998-ronalds.webp" },
  { name: "North Valley Garage Doors", src: "/uploads/media/1781506719362-edeb8bb3-7075-494a-87cf-70e98579dc4c-0772122001728298998-north-valley.webp" },
  { name: "Water Mold Fire Restoration", src: "/uploads/media/1781506758226-92c02cac-185f-4227-9fae-34b5757b2cfb-0578091001728541929-Water-Mold-Fire-Restoration-01.jpg" },
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