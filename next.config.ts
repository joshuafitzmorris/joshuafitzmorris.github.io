import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static output, so the site deploys to Vercel, Cloudflare Pages,
  // Netlify, S3, or any plain web host without a Node runtime.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
