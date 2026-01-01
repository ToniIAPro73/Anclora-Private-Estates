/**
 * RSS & Atom Feed Generator
 * Anclora Private Estates
 * 
 * Generate RSS 2.0 and Atom feeds for blog
 */

import { BlogPost, Category } from './blog-system';

export interface FeedConfig {
  title: string;
  description: string;
  link: string;
  language: string;
  copyright: string;
  managingEditor: string;
  webMaster: string;
  imageUrl?: string;
  categories?: string[];
}

// ==============================================
// RSS 2.0 FEED GENERATION
// ==============================================

/**
 * Generate RSS 2.0 feed
 */
export function generateRSSFeed(
  posts: BlogPost[],
  config: FeedConfig
): string {
  const buildDate = new Date().toUTCString();
  const lastBuildDate = posts.length > 0
    ? new Date(posts[0].publishedAt).toUTCString()
    : buildDate;

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.title)}</title>
    <link>${escapeXml(config.link)}</link>
    <description>${escapeXml(config.description)}</description>
    <language>${config.language}</language>
    <copyright>${escapeXml(config.copyright)}</copyright>
    <managingEditor>${escapeXml(config.managingEditor)}</managingEditor>
    <webMaster>${escapeXml(config.webMaster)}</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <atom:link href="${escapeXml(config.link)}/feed.xml" rel="self" type="application/rss+xml" />`;

  if (config.imageUrl) {
    rss += `
    <image>
      <url>${escapeXml(config.imageUrl)}</url>
      <title>${escapeXml(config.title)}</title>
      <link>${escapeXml(config.link)}</link>
    </image>`;
  }

  if (config.categories) {
    config.categories.forEach(category => {
      rss += `
    <category>${escapeXml(category)}</category>`;
    });
  }

  // Add items
  posts.forEach(post => {
    rss += generateRSSItem(post, config.link);
  });

  rss += `
  </channel>
</rss>`;

  return rss;
}

/**
 * Generate RSS item
 */
function generateRSSItem(post: BlogPost, baseUrl: string): string {
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const pubDate = new Date(post.publishedAt).toUTCString();

  let item = `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(post.author.name)}</dc:creator>`;

  // Add categories
  post.categories.forEach(category => {
    item += `
      <category>${escapeXml(category.name)}</category>`;
  });

  // Add tags as categories
  post.tags.forEach(tag => {
    item += `
      <category>${escapeXml(tag.name)}</category>`;
  });

  // Add featured image
  if (post.featuredImage) {
    item += `
      <media:content url="${escapeXml(post.featuredImage.url)}" medium="image">
        <media:title>${escapeXml(post.featuredImage.alt)}</media:title>
      </media:content>`;
  }

  item += `
    </item>`;

  return item;
}

// ==============================================
// ATOM FEED GENERATION
// ==============================================

/**
 * Generate Atom feed
 */
export function generateAtomFeed(
  posts: BlogPost[],
  config: FeedConfig
): string {
  const updated = posts.length > 0
    ? new Date(posts[0].updatedAt).toISOString()
    : new Date().toISOString();

  let atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(config.title)}</title>
  <link href="${escapeXml(config.link)}" />
  <link href="${escapeXml(config.link)}/atom.xml" rel="self" type="application/atom+xml" />
  <id>${escapeXml(config.link)}/</id>
  <updated>${updated}</updated>
  <subtitle>${escapeXml(config.description)}</subtitle>
  <rights>${escapeXml(config.copyright)}</rights>`;

  if (config.imageUrl) {
    atom += `
  <icon>${escapeXml(config.imageUrl)}</icon>`;
  }

  // Add entries
  posts.forEach(post => {
    atom += generateAtomEntry(post, config.link);
  });

  atom += `
</feed>`;

  return atom;
}

/**
 * Generate Atom entry
 */
function generateAtomEntry(post: BlogPost, baseUrl: string): string {
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const published = new Date(post.publishedAt).toISOString();
  const updated = new Date(post.updatedAt).toISOString();

  let entry = `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${escapeXml(postUrl)}" />
    <id>${escapeXml(postUrl)}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    <summary>${escapeXml(post.excerpt)}</summary>
    <content type="html"><![CDATA[${post.content}]]></content>
    <author>
      <name>${escapeXml(post.author.name)}</name>
    </author>`;

  // Add categories
  post.categories.forEach(category => {
    entry += `
    <category term="${escapeXml(category.slug)}" label="${escapeXml(category.name)}" />`;
  });

  entry += `
  </entry>`;

  return entry;
}

// ==============================================
// CATEGORY-SPECIFIC FEEDS
// ==============================================

/**
 * Generate RSS feed for specific category
 */
export function generateCategoryRSSFeed(
  posts: BlogPost[],
  category: Category,
  config: FeedConfig
): string {
  const categoryPosts = posts.filter(post =>
    post.categories.some(cat => cat.id === category.id)
  );

  const categoryConfig: FeedConfig = {
    ...config,
    title: `${config.title} - ${category.name}`,
    description: category.description,
    link: `${config.link}/blog/categoria/${category.slug}`,
  };

  return generateRSSFeed(categoryPosts, categoryConfig);
}

/**
 * Generate Atom feed for specific category
 */
export function generateCategoryAtomFeed(
  posts: BlogPost[],
  category: Category,
  config: FeedConfig
): string {
  const categoryPosts = posts.filter(post =>
    post.categories.some(cat => cat.id === category.id)
  );

  const categoryConfig: FeedConfig = {
    ...config,
    title: `${config.title} - ${category.name}`,
    description: category.description,
    link: `${config.link}/blog/categoria/${category.slug}`,
  };

  return generateAtomFeed(categoryPosts, categoryConfig);
}

// ==============================================
// JSON FEED GENERATION
// ==============================================

export interface JSONFeed {
  version: string;
  title: string;
  home_page_url: string;
  feed_url: string;
  description?: string;
  icon?: string;
  favicon?: string;
  authors?: Array<{
    name: string;
    url?: string;
    avatar?: string;
  }>;
  language?: string;
  items: JSONFeedItem[];
}

export interface JSONFeedItem {
  id: string;
  url: string;
  title: string;
  content_html: string;
  summary?: string;
  image?: string;
  date_published: string;
  date_modified?: string;
  authors?: Array<{
    name: string;
    url?: string;
    avatar?: string;
  }>;
  tags?: string[];
}

/**
 * Generate JSON Feed 1.1
 */
export function generateJSONFeed(
  posts: BlogPost[],
  config: FeedConfig
): JSONFeed {
  const items: JSONFeedItem[] = posts.map(post => {
    const postUrl = `${config.link}/blog/${post.slug}`;

    return {
      id: postUrl,
      url: postUrl,
      title: post.title,
      content_html: post.content,
      summary: post.excerpt,
      image: post.featuredImage?.url,
      date_published: new Date(post.publishedAt).toISOString(),
      date_modified: new Date(post.updatedAt).toISOString(),
      authors: [
        {
          name: post.author.name,
          avatar: post.author.avatar,
        },
      ],
      tags: [
        ...post.categories.map(c => c.name),
        ...post.tags.map(t => t.name),
      ],
    };
  });

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: config.title,
    home_page_url: config.link,
    feed_url: `${config.link}/feed.json`,
    description: config.description,
    icon: config.imageUrl,
    favicon: config.imageUrl,
    language: config.language,
    items,
  };
}

// ==============================================
// SITEMAP FOR BLOG
// ==============================================

/**
 * Generate sitemap XML for blog posts
 */
export function generateBlogSitemap(
  posts: BlogPost[],
  baseUrl: string
): string {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Blog homepage
  sitemap += `
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Blog posts
  posts.forEach(post => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const lastmod = new Date(post.updatedAt).toISOString().split('T')[0];

    sitemap += `
  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Truncate HTML content for feeds
 */
export function truncateContent(
  html: string,
  maxLength: number = 500
): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');

  if (text.length <= maxLength) {
    return html;
  }

  // Find safe truncation point
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return text.substring(0, lastSpace) + '...';
}

// ==============================================
// FEED ROUTES FOR NEXT.JS
// ==============================================

/**
 * Example Next.js route handler for RSS feed
 * app/feed.xml/route.ts
 */
export const rssRouteExample = `
import { generateRSSFeed } from '@/lib/rss-feed';
import { getAllPosts } from '@/lib/blog-data';

export async function GET() {
  const posts = await getAllPosts();

  const rss = generateRSSFeed(posts, {
    title: 'Anclora Private Estates Blog',
    description: 'Últimas noticias y guías sobre el mercado inmobiliario de lujo en Mallorca',
    link: 'https://anclora.com',
    language: 'es',
    copyright: '© 2025 Anclora Private Estates',
    managingEditor: 'blog@anclora.com (Anclora Editorial Team)',
    webMaster: 'tech@anclora.com (Anclora Tech Team)',
    imageUrl: 'https://anclora.com/images/logo.png',
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
`;

/**
 * Example Next.js route handler for JSON feed
 * app/feed.json/route.ts
 */
export const jsonFeedRouteExample = `
import { generateJSONFeed } from '@/lib/rss-feed';
import { getAllPosts } from '@/lib/blog-data';

export async function GET() {
  const posts = await getAllPosts();

  const feed = generateJSONFeed(posts, {
    title: 'Anclora Private Estates Blog',
    description: 'Últimas noticias y guías sobre el mercado inmobiliario de lujo en Mallorca',
    link: 'https://anclora.com',
    language: 'es',
    copyright: '© 2025 Anclora Private Estates',
    managingEditor: 'blog@anclora.com',
    webMaster: 'tech@anclora.com',
    imageUrl: 'https://anclora.com/images/logo.png',
  });

  return Response.json(feed, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
`;
