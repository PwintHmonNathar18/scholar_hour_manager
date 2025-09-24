/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['mongoose'],
  // Only use basePath in production (VM deployment)
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/scholar-hour-manager',
    assetPrefix: '/scholar-hour-manager',
  }),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
