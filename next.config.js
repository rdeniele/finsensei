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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://finsenseibackend-production.up.railway.app';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  // Additional Next.js configuration can go here
};

module.exports = nextConfig;