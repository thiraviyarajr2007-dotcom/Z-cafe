/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['framer-motion', 'three'],
  images: {
    domains: ['images.unsplash.com', 'firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
