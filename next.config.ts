import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error - turbopack is a valid option but missing from types
    turbopack: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;
