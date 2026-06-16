// Trigger Next.js dev server restart to reload generated Prisma Client
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep heavy client-only and standalone-server packages out of the serverless
  // function bundles (they were pushing functions past Vercel's 250 MB limit and
  // failing fresh deploys). These run only in the browser or in the custom
  // Express server (server.ts), never inside a Next API route / RSC.
  outputFileTracingExcludes: {
    "*": [
      // 263 MB of uploaded media lived in the repo and was being traced into the
      // /api/upload and /api/admin/media functions, blowing past the 250 MB limit.
      // It's served as a static asset, never needed inside a function bundle.
      "public/uploads/**",
      "public/**",
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
    const list = [
      {
        source: '/products/:slug/reviews',
        destination: '/products/:slug/',
        permanent: true,
      },
    ];

    // Only redirect to Blob CDN in production, or if Blob token is present in dev
    if (process.env.NODE_ENV === "production" || process.env.BLOB_READ_WRITE_TOKEN) {
      list.push({
        source: '/uploads/:path*',
        destination: 'https://qdeipxjkeqncplsk.public.blob.vercel-storage.com/uploads/:path*',
        permanent: false,
      });
    }

    return list;
  },
  async rewrites() {
    const list = [];

    // In dev without a blob token, rewrite non-existent local uploads to the Blob CDN
    if (process.env.NODE_ENV === "development" && !process.env.BLOB_READ_WRITE_TOKEN) {
      list.push({
        source: '/uploads/:path*',
        destination: 'https://qdeipxjkeqncplsk.public.blob.vercel-storage.com/uploads/:path*',
      });
    }

    return list;
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
