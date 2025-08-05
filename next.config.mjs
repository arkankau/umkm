/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],

  // Enable static export
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Ignore ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable webpack cache to prevent large files
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  
};

export default nextConfig;