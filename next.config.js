/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_API_URL: 'https://finsenseibackend-production.up.railway.app',
  },
  images: {
    domains: ['example.com'], // Replace with actual domains if needed
  },
};

module.exports = nextConfig;