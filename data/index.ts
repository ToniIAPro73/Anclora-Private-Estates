/**
 * DATA INDEX
 * Punto único de importación para todos los datos de ejemplo y configuración
 */

export * from './navigation';
export * from './site-structure';
export * from './sample-properties';
export * from './sample-blog-posts';

// Re-exports convenientes
export { mainNavigation, footerNavigation, ctaNavigation, socialLinks } from './navigation';
export { siteMap, componentLoadPriority, pageSeoData } from './site-structure';
export { 
  sampleProperties, 
  featuredProperties, 
  offMarketProperties, 
  portfolioStats 
} from './sample-properties';
export { 
  sampleBlogPosts, 
  blogAuthors, 
  featuredBlogPosts, 
  latestBlogPosts, 
  getBlogPostsByCategory,
  blogStats 
} from './sample-blog-posts';
