/**
 * Blog Category Page
 * /app/blog/categoria/[slug]/page.tsx
 */

import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { SchemaRenderer } from '@/components/seo/SchemaRenderer';
import { blogCategories, getCategoryBySlug, getPostsByCategory } from '@/lib/blog-system';
import { generateBreadcrumbs } from '@/lib/internal-linking';
import type { BlogPost, Category } from '@/lib/blog-system';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return generateSEOMetadata({
    title: category.seoTitle || `${category.name} | Blog Anclora`,
    description: category.seoDescription || category.description,
    url: `/blog/categoria/${category.slug}`,
    type: 'website',
  });
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  // Fetch posts for this category
  const allPosts = await getAllPosts();
  const categoryPosts = getPostsByCategory(allPosts, category.slug);

  // Pagination
  const postsPerPage = 12;
  const totalPages = Math.ceil(categoryPosts.length / postsPerPage);
  const posts = categoryPosts.slice(0, postsPerPage);

  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs({
    currentPage: {
      title: category.name,
      url: `/blog/categoria/${category.slug}`,
    },
    parentPages: [
      { title: 'Inicio', url: '/' },
      { title: 'Blog', url: '/blog' },
    ],
  });

  // Generate schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `https://anclora.com/blog/categoria/${category.slug}`,
    breadcrumb: breadcrumbs,
    hasPart: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://anclora.com/blog/${post.slug}`,
      datePublished: post.publishedAt.toISOString(),
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
    })),
  };

  return (
    <>
      <SchemaRenderer schemas={[collectionPageSchema]} />

      <div className="bg-white">
        {/* Hero */}
        <section 
          className="py-20 text-white relative overflow-hidden"
          style={{ backgroundColor: category.color || '#C5A059' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              {/* Breadcrumbs */}
              <nav className="mb-6">
                <ol className="flex items-center gap-2 text-white/80 text-sm">
                  <li><a href="/" className="hover:text-white">Inicio</a></li>
                  <li>/</li>
                  <li><a href="/blog" className="hover:text-white">Blog</a></li>
                  <li>/</li>
                  <li className="text-white">{category.name}</li>
                </ol>
              </nav>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{category.icon}</span>
                <div>
                  <h1 className="font-serif text-5xl mb-2">{category.name}</h1>
                  <p className="text-xl text-white/90">{category.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-white/80">
                <span>{categoryPosts.length} artículos</span>
                <span>•</span>
                <span>Actualizado regularmente</span>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg mb-4">
                  Aún no hay artículos en esta categoría
                </p>
                <a
                  href="/blog"
                  className="text-gold hover:underline font-medium"
                >
                  Ver todos los artículos →
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map(post => (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition border border-gray-200"
                    >
                      <a href={`/blog/${post.slug}`} className="block">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.featuredImage.alt}
                          width={800}
                          height={480}
                          className="w-full h-48 object-cover"
                        />
                      </a>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span 
                            className="text-xs font-semibold px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: category.color + '20',
                              color: category.color 
                            }}
                          >
                            {category.icon} {category.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {post.readingTime} min
                          </span>
                        </div>

                        <h3 className="font-serif text-xl mb-3">
                          <a
                            href={`/blog/${post.slug}`}
                            className="hover:text-gold transition"
                          >
                            {post.title}
                          </a>
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm text-gray-700">
                              {post.author.name}
                            </span>
                          </div>

                          <a
                            href={`/blog/${post.slug}`}
                            className="text-gold hover:underline font-medium text-sm"
                          >
                            Leer →
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Load More */}
                {totalPages > 1 && (
                  <div className="mt-12 text-center">
                    <button className="px-8 py-3 border-2 border-gold text-gold rounded hover:bg-gold hover:text-white transition font-semibold">
                      Cargar más artículos
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Related Categories */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl mb-8">Otras Categorías</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getRelatedCategories(category).map(relatedCategory => (
                <a
                  key={relatedCategory.id}
                  href={`/blog/categoria/${relatedCategory.slug}`}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{relatedCategory.icon}</span>
                    <h3 className="font-semibold text-lg">{relatedCategory.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {relatedCategory.description}
                  </p>
                  <span className="text-gold text-sm font-medium">
                    {relatedCategory.postCount || 0} artículos →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-anclora-black text-white py-16">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="font-serif text-3xl mb-4">
              ¿Te ha resultado útil?
            </h2>
            <p className="text-white/80 mb-8">
              Suscríbete para recibir más contenido sobre {category.name.toLowerCase()}
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
      </div>
    </>
  );
}

// Helper functions
function getRelatedCategories(currentCategory: Category): Category[] {
  return blogCategories
    .filter((cat: Category) => cat.id !== currentCategory.id)
    .slice(0, 4);
}

async function getAllPosts(): Promise<BlogPost[]> {
  // TODO: Replace with actual database query
  return [];
}
