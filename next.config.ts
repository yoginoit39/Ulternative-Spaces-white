import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photos are served as pre-rendered static WebP files (see
  // scripts/optimize-images.mjs), not through an image server.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    deviceSizes: [480, 828, 1200, 1920],
    imageSizes: [],
  },
};

export default nextConfig;
