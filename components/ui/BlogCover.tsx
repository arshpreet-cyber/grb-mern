"use client";

import { useState } from "react";

const FALLBACK = "/blog-fallback.svg";

// Treat empty / whitespace / bare-id media values as missing so we start
// from the fallback instead of waiting for an onError round-trip.
function initialSrc(src?: string | null) {
  if (!src) return FALLBACK;
  const v = src.trim();
  if (!v) return FALLBACK;
  // Valid web sources start with http(s):// or a leading slash.
  if (/^(https?:\/\/|\/)/.test(v)) return v;
  return FALLBACK;
}

export default function BlogCover({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(() => initialSrc(src));

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK);
      }}
    />
  );
}
