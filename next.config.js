/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  images: {
    domains: ['example.com'], // Replace with actual domains if needed
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://finsenseibackend-production.up.railway.app/api/:path*',
      },
    ];
  },
  // Additional Next.js configuration can go here
};

module.exports = nextConfig;