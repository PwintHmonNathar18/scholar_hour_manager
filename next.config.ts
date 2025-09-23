/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone since it breaks on some VMs
  // output: 'standalone',

  serverExternalPackages: ['mongoose'], // keep mongoose handling for production

  // Configure for subpath deployment
  basePath: '/scholar-hour-manager',
  assetPrefix: '/scholar-hour-manager',

  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },

  // Fix lockfile warnings for production deployment
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
