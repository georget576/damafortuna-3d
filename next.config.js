/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization
  images: {
    domains: ['fonts.gstatic.com'],
    // Allow images from the local public folder
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Enable local image optimization
    unoptimized: false,
  },
  // Compress all assets
  compress: true,
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;