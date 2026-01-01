'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Badge, OptimizedImage } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

/**
 * BlogCard Component
 * 
 * Card display for blog posts in listings
 */
export function BlogCard({ post, featured = false }: BlogCardProps) {
  const { tr } = useTranslation();

  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group block"
    >
      <article className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        featured ? 'md:flex md:gap-6' : ''
      }`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${
          featured ? 'md:w-1/2 h-64 md:h-auto' : 'h-56'
        }`}>
          <OptimizedImage
            src={post.featuredImage || '/assets/images/placeholders/blog-placeholder.svg'}
            alt={tr(post.title)}
            fill
            sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            objectFit="cover"
            className="group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="primary" size="sm">
              {tr(post.category)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${featured ? 'md:w-1/2 md:flex md:flex-col md:justify-center' : ''}`}>
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-serif font-semibold text-gray-dark mb-3 group-hover:text-anclora-gold transition-colors ${
            featured ? 'text-3xl' : 'text-xl'
          } line-clamp-2`}>
            {tr(post.title)}
          </h3>

          {/* Excerpt */}
          <p className={`text-gray-600 mb-4 ${
            featured ? 'text-lg line-clamp-3' : 'text-sm line-clamp-2'
          }`}>
            {tr(post.excerpt)}
          </p>

          {/* Read More */}
          <div className="flex items-center gap-2 text-anclora-gold font-medium">
            <span>Leer más</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
}
