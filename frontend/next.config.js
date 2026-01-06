/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3062',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.experience-club.online',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
