/**
 * sitemap.xml Route Handler
 * Dynamic sitemap generation with property listings
 */

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ancloraprivateestates.com';
  const currentDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicios/compra`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/servicios/venta`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/servicios/gestion`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/servicios/valoracion`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Dynamic property pages
  // TODO: Fetch from database/API
  const propertyPages: MetadataRoute.Sitemap = await getPropertyPages(baseUrl);

  // Dynamic blog pages
  // TODO: Fetch from CMS/database
  const blogPages: MetadataRoute.Sitemap = await getBlogPages(baseUrl);

  // Location pages
  const locationPages: MetadataRoute.Sitemap = [
    'son-vida',
    'palma-centro',
    'paseo-maritimo',
    'port-andratx',
    'valldemossa',
    'deia',
    'soller',
    'pollensa',
  ].map(location => ({
    url: `${baseUrl}/propiedades/ubicacion/${location}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...propertyPages, ...blogPages, ...locationPages];
}

/**
 * Get property pages from database
 */
async function getPropertyPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  // TODO: Replace with actual database query
  // Example structure:
  /*
  const properties = await db.property.findMany({
    where: { status: 'active' },
    select: { id: true, updatedAt: true }
  });
  
  return properties.map(property => ({
    url: `${baseUrl}/propiedades/${property.id}`,
    lastModified: property.updatedAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));
  */

  // Mock data for now
  const mockProperties = [
    'villa-son-vida-001',
    'apartment-palma-centro-002',
    'penthouse-paseo-maritimo-003',
    'villa-puerto-andratx-004',
    'finca-valldemossa-005',
  ];

  return mockProperties.map(id => ({
    url: `${baseUrl}/propiedades/${id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
}

/**
 * Get blog pages from CMS
 */
async function getBlogPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  // TODO: Replace with actual CMS query
  // Example structure:
  /*
  const posts = await cms.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  });
  
  return posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  */

  // Mock data for now
  const mockPosts = [
    'guia-comprar-propiedad-mallorca',
    'inversiones-inmobiliarias-2025',
    'tendencias-mercado-lujo-baleares',
  ];

  return mockPosts.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
}
