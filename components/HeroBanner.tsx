/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

export default function HeroTyping() {
  const services = [
    "Hotel Reviews",
    "Health Services Reviews",
    "Plumbing Services Reviews",
    "Real Estate Reviews",
    "Legal Services Reviews",
    "Authentic Reviews",
  ];

  const [text, setText] = useState(services[0]);
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(services[0].length);
  const [deleting, setDeleting] = useState(true);

  useEffect(() => {
    const TYPE_SPEED = 80;
    const DELETE_SPEED = 40;
    const PAUSE = 1000;

    let timeout;

    const full = services[index];

    if (!deleting) {
      timeout = setTimeout(() => {
        const next = full.slice(0, charIndex + 1);
        setText(next);
        setCharIndex(next.length);

        if (next.length === full.length) {
          setTimeout(() => setDeleting(true), PAUSE);
        }
      }, TYPE_SPEED);
    } else {
      timeout = setTimeout(() => {
        const next = full.slice(0, charIndex - 1);
        setText(next);
        setCharIndex(next.length);

        if (next.length === 0) {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % services.length);
        }
      }, DELETE_SPEED);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index, services]);

  return (
    <section className="flex items-center justify-center text-center px-[16px] py-[10px] md:pb-[30px] min-[1470px]:px-[20px] min-[1470px]:py-[30px] bg-gradient-to-b from-transparent to-[#FDFCF2] font-[Poppins] w-full">
      <div className="w-full max-w-full  mx-auto">
        <h1 className="text-[40px] min-[480px]:text-[40px] md:text-[40px] min-[1470px]:text-[40px] font-[350] text-[#1a1a1a] leading-[1.3] mb-[7px] tracking-[-0.01em] min-[1470px]:tracking-[-0.02em]">
          Turn Reputation into <strong className="font-[510]">Revenue</strong> with
          <br />
          <span className="inline-flex items-center justify-center flex-nowrap align-middle box-border gap-[6px] px-[6px] py-[2px] min-h-[36px] min-[480px]:min-h-[44px] md:gap-[10px] md:px-[8px] md:py-[4px] md:min-h-[52px] min-[1470px]:min-h-[64px] bg-[#FFE58233]">
            
            <img
              src="https://beta.getreviews.buzz/storage/app/blog/0635691001775712992_Line-18.png"
              alt="|"
              className="shrink-0 w-[5px] h-[26px] min-[480px]:h-[32px] md:w-[7px] md:h-[50px]"
            />

            <strong className="font-[510]">
              <span className="inline-block min-w-0 text-left align-middle leading-[1.3] text-[26px] min-[480px]:text-[40px] md:text-inherit">
             {text}
              </span>
              {/* <span className="inline-block w-[3px] h-[1em] bg-[#1a1a1a] ml-[3px] align-middle animate-pulse"></span> */}
            </strong>

            <img
              src="https://beta.getreviews.buzz/storage/app/blog/0227099001775713012_Line-16.png"
              alt="|"
              className="shrink-0 w-[5px] h-[26px] min-[480px]:h-[32px] md:w-[7px] md:h-[50px]"
            />

          </span>
        </h1>

        <p className="text-[13px] min-[480px]:text-[14px] min-[1470px]:text-[16px] text-black m-0 mt-[8px] md:mt-0 tracking-[0.01em]">
          Elevate your brand with reviews that actually convert.
        </p>
      </div>
    </section>
  );
}