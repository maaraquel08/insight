import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3845",
        pathname: "/assets/**",
      },
    ],
  },
  // Ensure proper handling of ESM modules like lucide-react
  transpilePackages: [],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

