import type { Metadata } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import './globals.css';
import { siteMetadata } from '@/lib/metadata';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  // Base metadata from lib/metadata, but potentially localized if we want to expand it
  return {
    ...siteMetadata,
    title: {
      default: locale === 'es' 
        ? 'Anclora Private Estates | Inmobiliaria de Lujo en Mallorca'
        : locale === 'de'
          ? 'Anclora Private Estates | Luxusimmobilien auf Mallorca'
          : 'Anclora Private Estates | Luxury Real Estate in Mallorca',
      template: '%s | Anclora Private Estates',
    },
    description: locale === 'es'
      ? 'Descubra propiedades de lujo exclusivas en Mallorca. Anclora Private Estates ofrece una selección de villas y fincas premium con confidencialidad absoluta.'
      : locale === 'de'
        ? 'Entdecken Sie exklusive Luxusimmobilien auf Mallorca. Anclora Private Estates bietet eine Auswahl an Premium-Villas und Fincas mit absoluter Vertraulichkeit.'
        : 'Discover exclusive luxury properties in Mallorca. Anclora Private Estates offers curated selection of premium villas and estates with absolute confidentiality.',
    openGraph: {
      ...siteMetadata.openGraph,
      locale: locale === 'es' ? 'es_ES' : locale === 'de' ? 'de_DE' : 'en_GB',
    },
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!['es', 'en', 'de'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${montserrat.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
