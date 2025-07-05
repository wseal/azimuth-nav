import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https", //
        hostname: "**", //
      },
      {
        protocol: "http", //
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
