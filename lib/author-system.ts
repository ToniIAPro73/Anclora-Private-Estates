/**
 * Author System
 * Anclora Private Estates
 * 
 * Author profiles and portfolio management
 */

import { Author, BlogPost } from './blog-system';

export interface AuthorProfile extends Author {
  totalPosts: number;
  totalViews: number;
  expertise: string[];
  languages: string[];
  joinedDate: Date;
  featuredIn?: string[]; // External publications
  achievements?: string[];
  education?: string[];
  certifications?: string[];
}

export interface AuthorStats {
  totalPosts: number;
  totalViews: number;
  avgViewsPerPost: number;
  mostPopularPost?: BlogPost;
  recentPosts: BlogPost[];
  categoriesWritten: Array<{
    category: string;
    count: number;
  }>;
}

// ==============================================
// ANCLORA AUTHORS
// ==============================================

export const ancloraAuthors: Record<string, AuthorProfile> = {
  'toni-ia': {
    id: 'toni-ia',
    name: 'Toni IA',
    slug: 'toni-ia',
    bio: 'CEO y fundador de Anclora Private Estates. Experto en automatización de procesos inmobiliarios y estrategias de marketing digital. Especializado en propiedades de lujo en Mallorca.',
    avatar: '/images/team/toni-ia.jpg',
    role: 'CEO & Founder',
    email: 'toni@anclora.com',
    social: {
      linkedin: 'https://linkedin.com/in/toni-ia',
    },
    totalPosts: 0,
    totalViews: 0,
    expertise: [
      'Mercado Inmobiliario de Lujo',
      'Automatización con IA',
      'Marketing Digital',
      'Estrategia Empresarial',
    ],
    languages: ['Español', 'Catalán', 'Inglés'],
    joinedDate: new Date('2024-01-01'),
    featuredIn: [
      'Forbes España',
      'Expansión',
      'El Mundo Inmobiliario',
    ],
    achievements: [
      'Fundador de Anclora Private Estates',
      '€100M+ en transacciones gestionadas',
      'Pionero en automatización inmobiliaria con IA',
    ],
    education: [
      'MBA - Especialización en Real Estate',
      'Ingeniería en Sistemas',
    ],
    certifications: [
      'Certified Luxury Home Marketing Specialist (CLHMS)',
      'API en España',
    ],
  },

  'maria-garcia': {
    id: 'maria-garcia',
    name: 'María García',
    slug: 'maria-garcia',
    bio: 'Asesora Senior en Inversiones Inmobiliarias. Más de 15 años de experiencia en el mercado de lujo de Baleares. Especializada en inversión extranjera y fiscalidad internacional.',
    avatar: '/images/team/maria-garcia.jpg',
    role: 'Asesora Senior de Inversiones',
    social: {
      linkedin: 'https://linkedin.com/in/maria-garcia',
    },
    totalPosts: 0,
    totalViews: 0,
    expertise: [
      'Inversión Inmobiliaria',
      'Fiscalidad Internacional',
      'Golden Visa',
      'Análisis de Mercado',
    ],
    languages: ['Español', 'Inglés', 'Alemán'],
    joinedDate: new Date('2024-02-01'),
    achievements: [
      '€200M+ en inversiones gestionadas',
      'Experta en Golden Visa España',
      '50+ inversores internacionales asesorados',
    ],
    education: [
      'Máster en Dirección Financiera',
      'Licenciatura en Economía',
    ],
    certifications: [
      'CFP - Certified Financial Planner',
      'API en España',
    ],
  },

  'juan-martinez': {
    id: 'juan-martinez',
    name: 'Juan Martínez',
    slug: 'juan-martinez',
    bio: 'Arquitecto y experto en diseño de propiedades de lujo. Especializado en reformas de alto standing y proyectos de construcción sostenible en Mallorca.',
    avatar: '/images/team/juan-martinez.jpg',
    role: 'Arquitecto & Consultor de Diseño',
    social: {
      linkedin: 'https://linkedin.com/in/juan-martinez',
    },
    totalPosts: 0,
    totalViews: 0,
    expertise: [
      'Arquitectura de Lujo',
      'Diseño de Interiores',
      'Construcción Sostenible',
      'Renovación Patrimonial',
    ],
    languages: ['Español', 'Catalán', 'Inglés', 'Italiano'],
    joinedDate: new Date('2024-03-01'),
    featuredIn: [
      'AD España',
      'Elle Decoration',
      'Arquitectura y Diseño',
    ],
    achievements: [
      '100+ proyectos completados',
      'Premio Arquitectura Sostenible 2023',
      'Miembro del Colegio de Arquitectos de Baleares',
    ],
    education: [
      'Arquitectura - ETSAB Barcelona',
      'Máster en Diseño Sostenible',
    ],
    certifications: [
      'Arquitecto Colegiado',
      'LEED AP - Green Building',
      'Passivhaus Designer',
    ],
  },
};

// ==============================================
// AUTHOR FUNCTIONS
// ==============================================

/**
 * Get author by slug
 */
export function getAuthorBySlug(slug: string): AuthorProfile | undefined {
  return Object.values(ancloraAuthors).find(author => author.slug === slug);
}

/**
 * Get all authors
 */
export function getAllAuthors(): AuthorProfile[] {
  return Object.values(ancloraAuthors);
}

/**
 * Calculate author statistics
 */
export function calculateAuthorStats(
  author: Author,
  allPosts: BlogPost[]
): AuthorStats {
  const authorPosts = allPosts.filter(
    post => post.author.id === author.id && post.status === 'published'
  );

  const totalPosts = authorPosts.length;
  const totalViews = authorPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  const avgViewsPerPost = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0;

  const mostPopularPost = authorPosts.length > 0
    ? authorPosts.reduce((max, post) =>
        (post.views || 0) > (max.views || 0) ? post : max
      )
    : undefined;

  const recentPosts = authorPosts
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 5);

  // Count posts per category
  const categoryCount = new Map<string, number>();
  authorPosts.forEach(post => {
    post.categories.forEach(category => {
      const count = categoryCount.get(category.name) || 0;
      categoryCount.set(category.name, count + 1);
    });
  });

  const categoriesWritten = Array.from(categoryCount.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalPosts,
    totalViews,
    avgViewsPerPost,
    mostPopularPost,
    recentPosts,
    categoriesWritten,
  };
}

/**
 * Get author expertise tags
 */
export function getAuthorExpertiseTags(author: AuthorProfile): string[] {
  return author.expertise || [];
}

/**
 * Get recommended authors
 * Based on category overlap with current post
 */
export function getRecommendedAuthors(
  currentPost: BlogPost,
  allAuthors: AuthorProfile[],
  allPosts: BlogPost[]
): AuthorProfile[] {
  // Get authors who have written in same categories
  const currentCategories = new Set(currentPost.categories.map(c => c.id));

  const authorScores = allAuthors
    .filter(author => author.id !== currentPost.author.id)
    .map(author => {
      const authorPosts = allPosts.filter(
        post => post.author.id === author.id && post.status === 'published'
      );

      let score = 0;

      // Score based on category overlap
      authorPosts.forEach(post => {
        post.categories.forEach(category => {
          if (currentCategories.has(category.id)) {
            score += 1;
          }
        });
      });

      return { author, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return authorScores.slice(0, 3).map(item => item.author);
}

// ==============================================
// AUTHOR SEO
// ==============================================

/**
 * Generate author page SEO metadata
 */
export function generateAuthorSEO(author: AuthorProfile, stats: AuthorStats) {
  return {
    title: `${author.name} - ${author.role} | Anclora Private Estates`,
    description: `${author.bio} ${stats.totalPosts} artículos publicados. Experto en ${author.expertise.slice(0, 3).join(', ')}.`,
    keywords: [
      author.name,
      author.role,
      ...author.expertise,
      'blog inmobiliario mallorca',
      'experto inmobiliario',
    ],
    canonicalUrl: `/blog/autor/${author.slug}`,
    openGraph: {
      type: 'profile',
      profile: {
        firstName: author.name.split(' ')[0],
        lastName: author.name.split(' ').slice(1).join(' '),
      },
    },
  };
}

/**
 * Generate author Person schema
 */
export function generateAuthorPersonSchema(
  author: AuthorProfile,
  stats: AuthorStats,
  baseUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    image: `${baseUrl}${author.avatar}`,
    url: `${baseUrl}/blog/autor/${author.slug}`,
    jobTitle: author.role,
    email: author.email,
    sameAs: author.social?.linkedin ? [author.social.linkedin] : undefined,
    knowsAbout: author.expertise,
    worksFor: {
      '@type': 'Organization',
      name: 'Anclora Private Estates',
      url: baseUrl,
    },
    alumniOf: author.education?.map(edu => ({
      '@type': 'EducationalOrganization',
      name: edu,
    })),
    award: author.achievements,
  };
}

/**
 * Generate ProfilePage schema
 */
export function generateAuthorProfilePageSchema(
  author: AuthorProfile,
  baseUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: author.name,
      description: author.bio,
      image: `${baseUrl}${author.avatar}`,
      jobTitle: author.role,
      worksFor: {
        '@type': 'Organization',
        name: 'Anclora Private Estates',
      },
    },
  };
}

// ==============================================
// AUTHOR PORTFOLIO
// ==============================================

/**
 * Group author posts by category
 */
export function groupAuthorPostsByCategory(
  authorPosts: BlogPost[]
): Map<string, BlogPost[]> {
  const grouped = new Map<string, BlogPost[]>();

  authorPosts.forEach(post => {
    post.categories.forEach(category => {
      const existing = grouped.get(category.name) || [];
      grouped.set(category.name, [...existing, post]);
    });
  });

  return grouped;
}

/**
 * Get author's most read posts
 */
export function getAuthorMostReadPosts(
  author: Author,
  allPosts: BlogPost[],
  limit: number = 5
): BlogPost[] {
  return allPosts
    .filter(post => post.author.id === author.id && post.status === 'published')
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
}

/**
 * Get author's recent posts
 */
export function getAuthorRecentPosts(
  author: Author,
  allPosts: BlogPost[],
  limit: number = 5
): BlogPost[] {
  return allPosts
    .filter(post => post.author.id === author.id && post.status === 'published')
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
}

/**
 * Get author's expertise distribution
 */
export function getAuthorExpertiseDistribution(
  author: Author,
  allPosts: BlogPost[]
): Array<{ expertise: string; count: number; percentage: number }> {
  const authorPosts = allPosts.filter(
    post => post.author.id === author.id && post.status === 'published'
  );

  if (authorPosts.length === 0) return [];

  // Count category occurrences
  const categoryCount = new Map<string, number>();
  authorPosts.forEach(post => {
    post.categories.forEach(category => {
      const count = categoryCount.get(category.name) || 0;
      categoryCount.set(category.name, count + 1);
    });
  });

  const total = authorPosts.length;

  return Array.from(categoryCount.entries())
    .map(([expertise, count]) => ({
      expertise,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

// ==============================================
// TEAM PAGE HELPERS
// ==============================================

/**
 * Get team members for about/team page
 */
export function getTeamMembers(): AuthorProfile[] {
  return getAllAuthors().sort((a, b) => {
    // Sort by role importance
    const roleOrder: Record<string, number> = {
      'CEO & Founder': 1,
      'Asesora Senior de Inversiones': 2,
      'Arquitecto & Consultor de Diseño': 3,
    };

    return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
  });
}

/**
 * Get team member by expertise
 */
export function getTeamMembersByExpertise(expertise: string): AuthorProfile[] {
  return getAllAuthors().filter(author =>
    author.expertise.some(exp =>
      exp.toLowerCase().includes(expertise.toLowerCase())
    )
  );
}
