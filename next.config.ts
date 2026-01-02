import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Image Optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Add remote patterns for external image sources (AWS S3, Backblaze B2)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ancloraprivateestates.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.backblazeb2.com',
      },
      {
        protocol: 'https',
        hostname: '**.backblazeb2.com',
      },
    ],
  },

  // Disable powered by header
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Strict mode
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
