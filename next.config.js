/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [""], // Add your CDN image url here
  },
}

module.exports = nextConfig
