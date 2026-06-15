// Trigger Next.js dev server restart to reload generated Prisma Client
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep heavy client-only and standalone-server packages out of the serverless
  // function bundles (they were pushing functions past Vercel's 250 MB limit and
  // failing fresh deploys). These run only in the browser or in the custom
  // Express server (server.ts), never inside a Next API route / RSC.
  outputFileTracingExcludes: {
    "*": [
      "node_modules/three/**",
      "node_modules/three-stdlib/**",
      "node_modules/stats-gl/**",
      "node_modules/@mediapipe/**",
      "node_modules/hls.js/**",
      "node_modules/@react-three/**",
      "node_modules/postprocessing/**",
      "node_modules/gsap/**",
      "node_modules/recharts/**",
      "node_modules/swiper/**",
      "node_modules/@tiptap/**",
      "node_modules/prosemirror-**/**",
      "node_modules/socket.io/**",
      "node_modules/socket.io-client/**",
      "node_modules/engine.io/**",
      "node_modules/pg-boss/**",
      "node_modules/express/**",
      "node_modules/@swc/core*/**",
      "node_modules/esbuild/**",
      "node_modules/@esbuild/**",
      "node_modules/typescript/**",
    ],
  },
  async redirects() {
    return [
      {
        source: '/products/:slug/reviews',
        destination: '/products/:slug/',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "t3.gstatic.com" },
      { protocol: "https", hostname: "icon.horse" },
      { protocol: "https", hostname: "beta.getreviews.buzz" },
      { protocol: "https", hostname: "getreviews.buzz" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
    ],
  },
};

export default nextConfig;
