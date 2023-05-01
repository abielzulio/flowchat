/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [""], // Add your CDN image url here
  },
}

module.exports = nextConfig
