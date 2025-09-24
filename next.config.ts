/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  output: 'standalone',
  serverExternalPackages: ['mongoose'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
