/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    (config.resolve.alias as Record<string, string>)["@"] = require("path").resolve(__dirname, "src");
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
