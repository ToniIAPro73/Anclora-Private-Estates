/**
 * Blog Post Page Example
 * Complete implementation with SEO, Schema, Related Posts
 * /app/blog/[slug]/page.tsx
 */

import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { getBlogPostSchemas } from '@/lib/schema-examples';
import { SchemaRenderer } from '@/components/seo/SchemaRenderer';
import { findRelatedPosts } from '@/lib/related-posts';
import { generateContextualLinks } from '@/lib/internal-linking';
import { BlogPost } from '@/lib/blog-system';

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post no encontrado',
    };
  }

  return generateSEOMetadata({
    title: post.seo.title,
    description: post.seo.description,
    url: `/blog/${post.slug}`,
    type: 'article',
    image: post.featuredImage.url,
    article: {
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name],
      tags: post.tags.map(t => t.name),
    },
  });
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  // Get all posts for related posts calculation
  const allPosts = await getAllPosts();

  // Find related posts
  const relatedPosts = findRelatedPosts(post, allPosts, {
    limit: 3,
    minScore: 0.2,
  });

  // Generate schemas
  const schemas = getBlogPostSchemas(post);

  // Generate internal links
  const contextualLinks = generateContextualLinks({
    currentPage: {
      type: 'blog',
    },
  });

  // Format date
  const publishedDate = new Date(post.publishedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <SchemaRenderer schemas={schemas} />
      
      <article className="bg-white">
        {/* Hero Section */}
        <header className="relative h-[50vh] min-h-[400px]">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt}
            width={1400}
            height={800}
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/blog/categoria/${category.slug}`}
                    className="px-3 py-1 bg-gold text-white text-sm rounded-full hover:bg-gold-dark transition"
                  >
                    {category.name}
                  </a>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <a 
                    href={`/blog/autor/${post.author.slug}`}
                    className="hover:text-gold transition"
                  >
                    {post.author.name}
                  </a>
                </div>
                <span>•</span>
                <time dateTime={post.publishedAt.toISOString()}>
                  {publishedDate}
                </time>
                <span>•</span>
                <span>{post.readingTime} min lectura</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Excerpt */}
              <div className="mb-8 p-6 bg-gray-50 border-l-4 border-gold">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  ETIQUETAS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <a
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition"
                    >
                      #{tag.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-8 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-6">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full"
                  />
                  <div>
                    <h3 className="text-2xl font-serif mb-2">
                      Sobre {post.author.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{post.author.role}</p>
                    <p className="text-gray-700 mb-4">{post.author.bio}</p>
                    <a
                      href={`/blog/autor/${post.author.slug}`}
                      className="text-gold hover:underline font-medium"
                    >
                      Ver todos los artículos →
                    </a>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  COMPARTIR
                </h3>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://anclora.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#1DA1F2] text-white rounded hover:opacity-90 transition"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://anclora.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#0077B5] text-white rounded hover:opacity-90 transition"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://anclora.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#1877F2] text-white rounded hover:opacity-90 transition"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + `https://anclora.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#25D366] text-white rounded hover:opacity-90 transition"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-4 space-y-8">
                {/* Table of Contents */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-serif text-xl mb-4">Contenido</h3>
                  <nav className="space-y-2">
                    <a href="#section-1" className="block text-gray-700 hover:text-gold transition">
                      1. Primer sección
                    </a>
                    <a href="#section-2" className="block text-gray-700 hover:text-gold transition">
                      2. Segunda sección
                    </a>
                    <a href="#section-3" className="block text-gray-700 hover:text-gold transition">
                      3. Tercera sección
                    </a>
                  </nav>
                </div>

                {/* CTA Box */}
                <div className="bg-gold text-white p-6 rounded-lg">
                  <h3 className="font-serif text-xl mb-3">
                    ¿Buscas una propiedad?
                  </h3>
                  <p className="mb-4 text-white/90">
                    Nuestro equipo de expertos está listo para ayudarte.
                  </p>
                  <a
                    href="/contacto"
                    className="block w-full bg-white text-gold text-center py-3 rounded font-semibold hover:bg-gray-100 transition"
                  >
                    Contactar
                  </a>
                </div>

                {/* Related Links */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">
                    También te puede interesar
                  </h3>
                  <ul className="space-y-3">
                    {contextualLinks.slice(0, 5).map((link, index) => (
                      <li key={index}>
                        <a 
                          href={link.url}
                          className="text-gold hover:underline"
                          title={link.title}
                        >
                          → {link.anchor}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="font-serif text-3xl mb-8">Artículos Relacionados</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <a href={`/blog/${relatedPost.slug}`}>
                      <Image
                        src={relatedPost.featuredImage.url}
                        alt={relatedPost.featuredImage.alt}
                        width={800}
                        height={480}
                        className="w-full h-48 object-cover"
                      />
                    </a>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {relatedPost.categories[0] && (
                          <span className="text-xs text-gold font-semibold">
                            {relatedPost.categories[0].name}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {relatedPost.readingTime} min
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-xl mb-3">
                        <a 
                          href={`/blog/${relatedPost.slug}`}
                          className="hover:text-gold transition"
                        >
                          {relatedPost.title}
                        </a>
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {relatedPost.excerpt}
                      </p>
                      
                      <a 
                        href={`/blog/${relatedPost.slug}`}
                        className="text-gold hover:underline font-medium text-sm"
                      >
                        Leer más →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="bg-anclora-black text-white py-16">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="font-serif text-3xl mb-4">
              Recibe Nuestros Mejores Artículos
            </h2>
            <p className="text-white/80 mb-8">
              Únete a nuestra newsletter y recibe análisis exclusivos del mercado inmobiliario de Mallorca.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded text-gray-900"
                required
              />
              <button 
                type="submit"
                className="bg-gold text-white px-8 py-3 rounded hover:bg-gold-dark transition font-semibold"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </section>
      </article>
    </>
  );
}

// Mock data fetching functions (replace with actual database queries)
async function getBlogPost(_slug: string): Promise<BlogPost | null> {
  // TODO: Replace with actual database query
  return null;
}

async function getAllPosts(): Promise<BlogPost[]> {
  // TODO: Replace with actual database query
  return [];
}
