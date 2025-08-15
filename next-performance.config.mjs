/** @type {import('next').NextConfig} */

const nextConfig = {
  // تحسين الصور
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ضغط الملفات
  compress: true,
  poweredByHeader: false,

  // تحسين حزم JavaScript
  swcMinify: true,

  // تحسين التخزين المؤقت للصفحات الثابتة
  generateStaticParams: false,

  // تحسين إعادة التوجيهات
  async redirects() {
    return [];
  },

  // تحسين العناوين
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=31536000, immutable',
          },
        ],
      },
    ];
  },

  // تحسين تجميع الوحدات
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  // تحسين أداء البناء
  output: 'standalone',

  // تحسين حزم التطبيق
  bundlePagesRouterDependencies: true,

  // تفعيل التخزين المؤقت للبيانات
  incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),

  // تحسين الأداء في بيئة الإنتاج
  productionBrowserSourceMaps: false,

  // تحسين تجزئة الكود
  webpack: (config, { dev, isServer }) => {
    // تحسين تجزئة الكود في بيئة الإنتاج
    if (!dev && !isServer) {
      Object.assign(config.optimization, {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\/]node_modules[\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
            },
          },
        },
      });
    }

    return config;
  },
};

export default nextConfig;
