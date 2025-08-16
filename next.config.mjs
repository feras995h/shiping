/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['@prisma/client'],
  experimental: {
    allowedDevOrigins: [
      'bdc8a1d5-99f3-4904-808e-82112f9678ee-00-24c48438stazq.janeway.replit.dev',
      '*.replit.dev'
    ]
  },
}

export default nextConfig
