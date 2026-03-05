/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xnwjumqehhbrsbcupouv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "media.rawg.io",
        port: "",
        pathname: "/**",
      },
      {
        // RAWG sometimes serves from this CDN
        protocol: "https",
        hostname: "*.rawg.io",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // cache optimised images for 24 hours
  },
  webpack: (config: Configuration) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    (config.resolve.alias as Record<string, string>)["@"] =
      require("path").resolve(__dirname, "src");
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
