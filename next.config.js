/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  output: 'export', // Enable static export for GoDaddy hosting
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

