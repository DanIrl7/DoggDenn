import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    qualities: [25, 50, 75, 100],
  },
  experimental: {
    allowedDevOrigins: ['192.168.205.159'],
  },
};

export default nextConfig;