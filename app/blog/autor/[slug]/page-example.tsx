/**
 * Author Profile Page
 * /app/blog/autor/[slug]/page.tsx
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { SchemaRenderer } from '@/components/seo/SchemaRenderer';
import {
  getAuthorBySlug,
  calculateAuthorStats,
  generateAuthorPersonSchema,
  getAuthorRecentPosts,
  getAuthorMostReadPosts,
  groupAuthorPostsByCategory,
} from '@/lib/author-system';
import type { BlogPost } from '@/lib/blog-system';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const author = getAuthorBySlug(params.slug);

  if (!author) {
    return {
      title: 'Autor no encontrado',
    };
  }

  return generateSEOMetadata({
    title: `${author.name} - ${author.role} | Anclora Blog`,
    description: author.bio,
    url: `/blog/autor/${author.slug}`,
    type: 'profile',
    image: author.avatar,
  });
}

export default async function AuthorPage({
  params,
}: {
  params: { slug: string };
}) {
  const author = getAuthorBySlug(params.slug);

  if (!author) {
    notFound();
  }

  // Fetch all posts
  const allPosts = await getAllPosts();

  // Calculate stats
  const stats = calculateAuthorStats(author, allPosts);

  // Get author posts
  const recentPosts = getAuthorRecentPosts(author, allPosts, 9);
  const mostReadPosts = getAuthorMostReadPosts(author, allPosts, 3);

  // Group by category
  const postsByCategory = groupAuthorPostsByCategory(recentPosts);

  // Generate schemas
  const authorSchema = generateAuthorPersonSchema(author, stats, 'https://anclora.com');

  return (
    <>
      <SchemaRenderer schemas={[authorSchema]} />

      <div className="bg-white">
        {/* Hero - Author Header */}
        <section className="bg-gradient-to-br from-anclora-black to-gray-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-48 h-48 rounded-full border-4 border-gold"
                />

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="font-serif text-5xl mb-3">{author.name}</h1>
                  <p className="text-xl text-gold mb-4">{author.role}</p>
                  <p className="text-lg text-white/80 mb-6 max-w-2xl">
                    {author.bio}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                    <div>
                      <div className="text-3xl font-bold text-gold">
                        {stats.totalPosts}
                      </div>
                      <div className="text-sm text-white/70">Artículos</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gold">
                        {(stats.totalViews / 1000).toFixed(1)}K
                      </div>
                      <div className="text-sm text-white/70">Lecturas</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gold">
                        {stats.avgViewsPerPost}
                      </div>
                      <div className="text-sm text-white/70">Promedio/post</div>
                    </div>
                  </div>

                  {/* Social */}
                  {author.social?.linkedin && (
                    <div className="flex justify-center md:justify-start gap-3">
                      <a
                        href={author.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#0077B5] rounded hover:opacity-90 transition"
                      >
                        LinkedIn
                      </a>
                      {author.email && (
                        <a
                          href={`mailto:${author.email}`}
                          className="px-4 py-2 bg-gold rounded hover:bg-gold-dark transition"
                        >
                          Contactar
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise & Languages */}
        <section className="border-b border-gray-200 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Expertise */}
                <div>
                  <h3 className="font-semibold text-gray-600 mb-3">ESPECIALIDADES</h3>
                  <div className="flex flex-wrap gap-2">
                    {author.expertise.map((exp, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-medium"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="font-semibold text-gray-600 mb-3">IDIOMAS</h3>
                  <div className="flex flex-wrap gap-2">
                    {author.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Most Popular Posts */}
        {mostReadPosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="font-serif text-3xl mb-8">Artículos Más Populares</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mostReadPosts.map((post, index) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                      <a href={`/blog/${post.slug}`} className="block relative">
                        <img
                          src={post.featuredImage.url}
                          alt={post.featuredImage.alt}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white font-bold text-xl">
                          #{index + 1}
                        </div>
                      </a>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-gold font-semibold">
                            {post.categories[0]?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {post.views?.toLocaleString()} vistas
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

                        <a
                          href={`/blog/${post.slug}`}
                          className="text-gold hover:underline font-medium text-sm"
                        >
                          Leer artículo →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent Posts by Category */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl">Artículos Recientes</h2>
                <span className="text-gray-600">
                  {stats.totalPosts} en total
                </span>
              </div>

              {/* Category tabs */}
              <div className="flex overflow-x-auto gap-3 mb-8 pb-3 border-b border-gray-200">
                <button className="px-4 py-2 bg-gold text-white rounded whitespace-nowrap">
                  Todos ({recentPosts.length})
                </button>
                {stats.categoriesWritten.map(cat => (
                  <button
                    key={cat.category}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition whitespace-nowrap"
                  >
                    {cat.category} ({cat.count})
                  </button>
                ))}
              </div>

              {/* Posts grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentPosts.map(post => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition border border-gray-200"
                  >
                    <a href={`/blog/${post.slug}`}>
                      <img
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt}
                        className="w-full h-40 object-cover"
                      />
                    </a>

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gold font-semibold">
                          {post.categories[0]?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.readingTime} min
                        </span>
                      </div>

                      <h3 className="font-serif text-lg mb-2 line-clamp-2">
                        <a
                          href={`/blog/${post.slug}`}
                          className="hover:text-gold transition"
                        >
                          {post.title}
                        </a>
                      </h3>

                      <time className="text-sm text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Education & Certifications */}
                <div>
                  <h3 className="font-serif text-2xl mb-6">Formación</h3>
                  
                  {author.education && author.education.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-600 mb-3">
                        EDUCACIÓN
                      </h4>
                      <ul className="space-y-2">
                        {author.education.map((edu, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-gold mt-1">✓</span>
                            <span>{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {author.certifications && author.certifications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-600 mb-3">
                        CERTIFICACIONES
                      </h4>
                      <ul className="space-y-2">
                        {author.certifications.map((cert, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-gold mt-1">✓</span>
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="font-serif text-2xl mb-6">Logros</h3>

                  {author.achievements && author.achievements.length > 0 && (
                    <ul className="space-y-4">
                      {author.achievements.map((achievement, index) => (
                        <li
                          key={index}
                          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">🏆</span>
                            <span>{achievement}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {author.featuredIn && author.featuredIn.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-600 mb-3">
                        APARICIONES EN MEDIOS
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {author.featuredIn.map((media, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white border border-gray-200 rounded text-sm"
                          >
                            {media}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-anclora-black text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl mb-4">
                Conecta con {author.name.split(' ')[0]}
              </h2>
              <p className="text-white/80 mb-8">
                ¿Tienes preguntas sobre {author.expertise[0]?.toLowerCase()}? 
                {author.name.split(' ')[0]} está aquí para ayudarte.
              </p>
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="inline-block bg-gold text-white px-8 py-3 rounded hover:bg-gold-dark transition font-semibold"
                >
                  Enviar mensaje
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Mock data function
async function getAllPosts(): Promise<BlogPost[]> {
  // TODO: Replace with actual database query
  return [];
}
