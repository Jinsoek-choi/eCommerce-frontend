// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.msscdn.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
