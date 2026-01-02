/**
 * Blog Listing Page
 * Complete implementation with filters, search, pagination
 * /app/blog/page.tsx
 */

import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { SchemaRenderer } from '@/components/seo/SchemaRenderer';
import { getHomePageSchemas } from '@/lib/schema-examples';
import { blogCategories } from '@/lib/blog-system';
import type { BlogPost, Category } from '@/lib/blog-system';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog Inmobiliario | Anclora Private Estates',
  description: 'Guías, análisis y consejos sobre el mercado inmobiliario de lujo en Mallorca. Inversión, ubicaciones, legal y más.',
  url: '/blog',
  type: 'website',
});

interface BlogPageProps {
  searchParams: {
    categoria?: string;
    buscar?: string;
    pagina?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.pagina || '1', 10);
  const postsPerPage = 12;
  const categoryFilter = searchParams.categoria;
  const searchQuery = searchParams.buscar;

  // Fetch posts
  let allPosts = await getAllPosts();

  // Apply filters
  if (categoryFilter) {
    allPosts = allPosts.filter(post =>
      post.categories.some(cat => cat.slug === categoryFilter)
    );
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    allPosts = allPosts.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
    );
  }

  // Pagination
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = allPosts.slice(startIndex, endIndex);

  // Get featured posts
  const featuredPosts = await getFeaturedPosts();

  // Generate schemas
  const schemas = getHomePageSchemas();

  return (
    <>
      <SchemaRenderer schemas={schemas} />

      <div className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-anclora-black to-gray-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="font-serif text-5xl md:text-6xl mb-6">
                Blog Inmobiliario
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Guías, análisis y consejos de expertos sobre el mercado inmobiliario de lujo en Mallorca
              </p>

              {/* Search Bar */}
              <form method="GET" className="relative">
                <input
                  type="text"
                  name="buscar"
                  placeholder="Buscar artículos..."
                  defaultValue={searchQuery}
                  className="w-full px-6 py-4 pr-32 rounded-lg text-gray-900 text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold text-white px-6 py-2 rounded hover:bg-gold-dark transition font-semibold"
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Categories Navigation */}
        <section className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto py-4 gap-3 scrollbar-hide">
              <a
                href="/blog"
                className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
                  !categoryFilter
                    ? 'bg-gold text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </a>
              {blogCategories.map(category => (
                <a
                  key={category.id}
                  href={`/blog?categoria=${category.slug}`}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition flex items-center gap-2 ${
                    categoryFilter === category.slug
                      ? 'bg-gold text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {!categoryFilter && !searchQuery && currentPage === 1 && featuredPosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="font-serif text-3xl mb-8">Destacados</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Featured */}
                {featuredPosts[0] && (
                  <article className="lg:row-span-2 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <a href={`/blog/${featuredPosts[0].slug}`} className="block relative h-96">
                      <img
                        src={featuredPosts[0].featuredImage.url}
                        alt={featuredPosts[0].featuredImage.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-gold rounded-full text-sm">
                            {featuredPosts[0].categories[0]?.name}
                          </span>
                          <span className="text-sm text-white/80">
                            {featuredPosts[0].readingTime} min
                          </span>
                        </div>
                        <h3 className="font-serif text-3xl mb-3">
                          {featuredPosts[0].title}
                        </h3>
                        <p className="text-white/80">
                          {featuredPosts[0].excerpt}
                        </p>
                      </div>
                    </a>
                  </article>
                )}

                {/* Secondary Featured */}
                <div className="space-y-8">
                  {featuredPosts.slice(1, 3).map(post => (
                    <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex">
                      <a href={`/blog/${post.slug}`} className="w-1/3">
                        <img
                          src={post.featuredImage.url}
                          alt={post.featuredImage.alt}
                          className="w-full h-full object-cover"
                        />
                      </a>
                      <div className="w-2/3 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gold font-semibold">
                            {post.categories[0]?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {post.readingTime} min
                          </span>
                        </div>
                        <h3 className="font-serif text-xl mb-2">
                          <a 
                            href={`/blog/${post.slug}`}
                            className="hover:text-gold transition"
                          >
                            {post.title}
                          </a>
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Results info */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl">
                  {categoryFilter
                    ? `Categoría: ${blogCategories.find(c => c.slug === categoryFilter)?.name}`
                    : searchQuery
                    ? `Resultados para "${searchQuery}"`
                    : 'Todos los Artículos'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {totalPosts} {totalPosts === 1 ? 'artículo' : 'artículos'}
                </p>
              </div>

              {/* Sort dropdown */}
              <select className="px-4 py-2 border border-gray-300 rounded">
                <option value="recientes">Más recientes</option>
                <option value="populares">Más populares</option>
                <option value="antiguos">Más antiguos</option>
              </select>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg mb-4">
                  No se encontraron artículos
                </p>
                <a
                  href="/blog"
                  className="text-gold hover:underline font-medium"
                >
                  Ver todos los artículos →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <a href={`/blog/${post.slug}`} className="block">
                      <img
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt}
                        className="w-full h-48 object-cover"
                      />
                    </a>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gold font-semibold">
                          {post.categories[0]?.name}
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
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
                          Leer más →
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  {/* Previous */}
                  {currentPage > 1 && (
                    <a
                      href={buildPaginationUrl(currentPage - 1, categoryFilter, searchQuery)}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                    >
                      ← Anterior
                    </a>
                  )}

                  {/* Pages */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first, last, current, and surrounding pages
                    if (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    ) {
                      return (
                        <a
                          key={page}
                          href={buildPaginationUrl(page, categoryFilter, searchQuery)}
                          className={`px-4 py-2 border rounded transition ${
                            page === currentPage
                              ? 'bg-gold text-white border-gold'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </a>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}

                  {/* Next */}
                  {currentPage < totalPages && (
                    <a
                      href={buildPaginationUrl(currentPage + 1, categoryFilter, searchQuery)}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                    >
                      Siguiente →
                    </a>
                  )}
                </nav>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-anclora-black text-white py-16">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="font-serif text-3xl mb-4">
              Recibe Análisis Exclusivos
            </h2>
            <p className="text-white/80 mb-8">
              Únete a más de 1,000 inversores que reciben nuestro análisis semanal del mercado inmobiliario de Mallorca.
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
function buildPaginationUrl(
  page: number,
  category?: string,
  search?: string
): string {
  const params = new URLSearchParams();
  if (page > 1) params.set('pagina', page.toString());
  if (category) params.set('categoria', category);
  if (search) params.set('buscar', search);
  
  const queryString = params.toString();
  return `/blog${queryString ? `?${queryString}` : ''}`;
}

// Mock data functions
async function getAllPosts(): Promise<BlogPost[]> {
  // TODO: Replace with actual database query
  return [];
}

async function getFeaturedPosts(): Promise<BlogPost[]> {
  // TODO: Replace with actual database query
  return [];
}
