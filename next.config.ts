import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "reelboost.online",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "snapta.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "maps.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media3.giphy.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media0.giphy.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media1.giphy.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media2.giphy.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media4.giphy.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.yeteneksat.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d1yb64k1jgx7ak.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.0.27",
        port: "3006",
        pathname: "/**",
      },

      // VPS Backend
      {
        protocol: "http",
        hostname: "147.93.84.125",
        port: "3004",
        pathname: "/**",
      },

      // VPS direct
      {
        protocol: "http",
        hostname: "147.93.84.125",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;