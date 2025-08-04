/** @type {import('next').NextConfig} */
const nextConfig = {
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
  output: 'export',
};

export default nextConfig;