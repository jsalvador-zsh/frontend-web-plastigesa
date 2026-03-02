import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '5.78.43.23',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.plastigesa.org',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
