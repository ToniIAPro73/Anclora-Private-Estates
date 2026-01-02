'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { Input } from '@/components/ui';
import { BlogCard } from '@/components/blog/BlogCard';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { Pagination } from '@/components/shared/Pagination';
import { sampleBlogPosts } from '@/data';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import type { BlogPost, Language } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';

/**
 * Blog Listing Page
 * 
 * Displays filterable grid of blog posts with featured posts and pagination
 */
export default function BlogPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as Language) || 'es';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Get featured posts (first 3 with isFeatured = true)
  const featuredPosts = useMemo(() => {
    return sampleBlogPosts.filter((post: BlogPost) => post.isFeatured).slice(0, 3);
  }, []);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return sampleBlogPosts.filter((post: BlogPost) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const titleMatch = post.title[locale].toLowerCase().includes(searchLower);
        const excerptMatch = post.excerpt[locale].toLowerCase().includes(searchLower);
        if (!titleMatch && !excerptMatch) return false;
      }

      // Category filter
      if (selectedCategory && post.category !== selectedCategory) return false;

      // Exclude featured posts from main grid
      if (post.isFeatured && featuredPosts.includes(post)) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, featuredPosts, locale]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE.blog);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE.blog,
    currentPage * ITEMS_PER_PAGE.blog
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="dark" padding="xl">
          <Container size="lg" className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              {t('blog.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('blog.subtitle')}
            </p>
          </Container>
        </Section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <Section background="beige" padding="lg">
            <Container size="xl">
              <h2 className="font-serif text-3xl font-bold text-gray-dark mb-8">
                {t('blog.featured')}
              </h2>
              <div className="space-y-6">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} featured />
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* Filters & Posts */}
        <Section background="white" padding="xl">
          <Container size="xl">
            {/* Search & Category Filters */}
            <div className="space-y-6 mb-12">
              {/* Search */}
              <div className="max-w-xl">
                <Input
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                />
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  {t('blog.categories.title') || 'Categorías'}
                </h3>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </div>

            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredPosts.length} {filteredPosts.length === 1 ? t('blog.results.single') : t('blog.results.plural')}
              </p>
            </div>

            {/* Posts Grid */}
            {paginatedPosts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {paginatedPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-4">
                  No se encontraron artículos
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="text-anclora-gold hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </Container>
        </Section>

        {/* Newsletter CTA */}
        <Section background="gradient" padding="lg">
          <Container size="md" className="text-center">
            <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
              {t('blog.newsletter.title') || 'Suscríbete a Nuestro Newsletter'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('blog.newsletter.subtitle') || 'Recibe los mejores insights del mercado inmobiliario directamente en tu inbox'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-anclora-gold"
              />
              <button className="px-6 py-3 bg-anclora-gold text-white font-semibold rounded-md hover:bg-anclora-gold-dark transition-colors">
                Suscribirse
              </button>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
