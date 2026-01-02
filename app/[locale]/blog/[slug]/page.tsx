import React from 'react';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header, Footer, Section, Container } from '@/components/layout';
import { Badge, OptimizedImage } from '@/components/ui';
import { BlogCard } from '@/components/blog/BlogCard';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { MarkdownContent } from '@/components/blog/MarkdownContent';
import { sampleBlogPosts } from '@/data';
import siteConfig from '@/lib/config';
import type { BlogPost } from '@/types';

interface BlogPostDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Blog Post Detail Page
 * 
 * Displays complete blog post with markdown content, ToC, and related posts
 */
export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { locale, slug } = await params;
  const post = sampleBlogPosts.find((p: BlogPost) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const lang = locale as keyof typeof post.title;

  // Get related posts (same category, different post)
  const relatedPosts = sampleBlogPosts
    .filter((p: BlogPost) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <>
      <Header />
      <main>
        {/* Back Button */}
        <Section background="white" padding="sm">
          <Container size="xl">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-anclora-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{locale === 'es' ? 'Volver al blog' : locale === 'de' ? 'Zurück zum Blog' : 'Back to blog'}</span>
            </Link>
          </Container>
        </Section>

        {/* Hero */}
        <Section background="white" padding="lg">
          <Container size="lg">
            <article>
              {/* Category Badge */}
              <div className="mb-6">
                <Badge variant="primary">{post.category}</Badge>
              </div>

              {/* Title */}
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-dark mb-6">
                {post.title[lang]}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{post.author.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <time dateTime={post.publishedAt.toISOString()}>
                    {new Date(post.publishedAt).toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{post.readingTime} {locale === 'es' ? 'min lectura' : locale === 'de' ? 'Min. Lesedauer' : 'min read'}</span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative h-96 rounded-lg overflow-hidden mb-8">
                <OptimizedImage
                  src={post.coverImage || '/assets/images/placeholders/blog-placeholder.svg'}
                  alt={post.title[lang]}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  objectFit="cover"
                  priority
                />
              </div>

              {/* Share Buttons */}
              <div className="flex justify-between items-center py-6 border-y border-gray-200 mb-8">
                <ShareButtons title={post.title[lang]} url={postUrl} />
              </div>
            </article>
          </Container>
        </Section>

        {/* Content & ToC */}
        <Section background="beige" padding="lg">
          <Container size="xl">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
                  <MarkdownContent content={post.content[lang]} />

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Author Bio */}
                <div className="bg-white rounded-lg shadow-md p-8 mt-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-anclora-gold/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-anclora-gold" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-gray-dark">
                        {post.author.name}
                      </h3>
                      <p className="text-gray-600">{post.author.title[lang]}</p>
                    </div>
                  </div>
                  {post.author.bio && (
                    <p className="text-gray-700 leading-relaxed">
                      {post.author.bio[lang]}
                    </p>
                  )}
                </div>

                {/* Comments Placeholder */}
                <div className="bg-white rounded-lg shadow-md p-8 mt-8">
                  <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-4">
                    {locale === 'es' ? 'Comentarios' : locale === 'de' ? 'Kommentare' : 'Comments'}
                  </h3>
                  <p className="text-gray-600">
                    {locale === 'es' ? 'Los comentarios estarán disponibles próximamente.' : locale === 'de' ? 'Kommentare werden in Kürze verfügbar sein.' : 'Comments will be available soon.'}
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <TableOfContents content={post.content[lang]} />
              </div>
            </div>
          </Container>
        </Section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Section background="white" padding="lg">
            <Container size="xl">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-8">
                {locale === 'es' ? 'Artículos Relacionados' : locale === 'de' ? 'Ähnliche Artikel' : 'Related Articles'}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* Newsletter CTA */}
        <Section background="gradient" padding="lg">
          <Container size="md" className="text-center">
            <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
              {locale === 'es' ? '¿Te gustó este artículo?' : locale === 'de' ? 'Hat Ihnen dieser Artikel gefallen?' : 'Did you like this article?'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {locale === 'es' ? 'Recibe más contenido como este directamente en tu inbox' : locale === 'de' ? 'Erhalten Sie weitere Inhalte wie diesen direkt in Ihren Posteingang' : 'Receive more content like this directly in your inbox'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={locale === 'es' ? 'Tu email' : locale === 'de' ? 'Ihre E-Mail' : 'Your email'}
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anclora-gold"
              />
              <button className="px-6 py-3 bg-anclora-gold text-white font-semibold rounded-md hover:bg-anclora-gold-dark transition-colors">
                {locale === 'es' ? 'Suscribirse' : locale === 'de' ? 'Abonnieren' : 'Subscribe'}
              </button>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'en' },
    { locale: 'de' }
  ].flatMap(l => 
    sampleBlogPosts.map((post: BlogPost) => ({
      locale: l.locale,
      slug: post.slug,
    }))
  );
}
