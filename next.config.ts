import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use basePath in production
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/scholar-hour-manager',
    assetPrefix: '/scholar-hour-manager',
  }),
  output: 'standalone',
  serverExternalPackages: ['mongoose']
};

export default nextConfig;
