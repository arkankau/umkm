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
  // Remove the static export settings - EdgeOne can handle serverless functions
};

export default nextConfig;