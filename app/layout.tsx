import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anclora Private Estates',
  description: 'Luxury Real Estate in Mallorca',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
