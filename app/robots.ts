/**
 * robots.txt Route Handler
 * Dynamic robots.txt generation
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ancloraprivateestates.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/private/',
          '*.json',
          '/*?*', // Disallow query parameters for duplicate content
        ],
      },
      // Specific rules for search engines
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'GPTBot', // OpenAI crawler
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT
        allow: '/',
      },
      {
        userAgent: 'CCBot', // Common Crawl
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai', // Claude
        allow: '/',
      },
      {
        userAgent: 'claude-web', // Claude Web
        allow: '/',
      },
      // Block bad bots
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'BLEXBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
