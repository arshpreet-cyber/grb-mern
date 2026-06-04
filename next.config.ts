// Trigger Next.js dev server restart to reload generated Prisma Client
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "beta.getreviews.buzz" },
      { protocol: "https", hostname: "getreviews.buzz" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
    ],
  },
};

export default nextConfig;
