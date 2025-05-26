/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@"] = require("path").resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
