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
  // Add these new configurations for static export
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
};

export default nextConfig;