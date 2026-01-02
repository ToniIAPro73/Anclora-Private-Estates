import type { Metadata } from 'next';

export const siteMetadata: Metadata = {
  title: {
    default: 'Anclora Private Estates | Luxury Real Estate in Mallorca',
    template: '%s | Anclora Private Estates',
  },
  description:
    'Discover exclusive luxury properties in Mallorca. Anclora Private Estates offers curated selection of premium villas and estates with absolute confidentiality.',
  keywords: [
    'luxury real estate',
    'Mallorca properties',
    'exclusive villas',
    'private estates',
    'high-end real estate',
  ],
  authors: [{ name: 'Anclora Private Estates' }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_GB',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Anclora Private Estates',
    title: 'Anclora Private Estates | Luxury Real Estate in Mallorca',
    description:
      'Discover exclusive luxury properties in Mallorca with absolute confidentiality.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anclora Private Estates',
    description: 'Luxury Real Estate in Mallorca',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
