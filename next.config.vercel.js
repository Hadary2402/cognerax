/** @type {import('next').NextConfig} */
// This config is for Vercel deployment - includes API routes
// For static export (GoDaddy), use next.config.js instead
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // DO NOT use output: 'export' - we need API routes for Vercel!
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
