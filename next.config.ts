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
}