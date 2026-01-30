/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static site generation
  reactStrictMode: true,
  
  // Minimal webpack configuration
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  }
};

module.exports = nextConfig;