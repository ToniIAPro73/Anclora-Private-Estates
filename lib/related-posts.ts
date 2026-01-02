/**
 * Related Posts Algorithm
 * Anclora Private Estates
 * 
 * Intelligent content recommendation system
 */

import { BlogPost, Category, Tag } from './blog-system';

export interface RelatedPostScore {
  post: BlogPost;
  score: number;
  reasons: string[];
}

export interface RelatedPostsOptions {
  limit?: number;
  minScore?: number;
  excludeCurrentPost?: boolean;
  weightCategory?: number;
  weightTag?: number;
  weightRecency?: number;
  weightPopularity?: number;
}

// ==============================================
// RELATED POSTS ALGORITHM
// ==============================================

/**
 * Find related posts using weighted scoring algorithm
 */
export function findRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  options: RelatedPostsOptions = {}
): BlogPost[] {
  const {
    limit = 5,
    minScore = 0.2,
    excludeCurrentPost = true,
    weightCategory = 0.4,
    weightTag = 0.3,
    weightRecency = 0.2,
    weightPopularity = 0.1,
  } = options;

  // Filter posts
  const posts = allPosts.filter(post => {
    if (post.status !== 'published') return false;
    if (excludeCurrentPost && post.id === currentPost.id) return false;
    return true;
  });

  // Calculate scores
  const scoredPosts: RelatedPostScore[] = posts.map(post => {
    const reasons: string[] = [];
    let score = 0;

    // 1. Category similarity (40% weight by default)
    const categoryScore = calculateCategoryScore(currentPost, post);
    if (categoryScore > 0) {
      score += categoryScore * weightCategory;
      if (categoryScore === 1) {
        reasons.push('Misma categoría');
      } else {
        reasons.push('Categorías relacionadas');
      }
    }

    // 2. Tag similarity (30% weight by default)
    const tagScore = calculateTagScore(currentPost, post);
    if (tagScore > 0) {
      score += tagScore * weightTag;
      const sharedTags = getSharedTags(currentPost, post);
      if (sharedTags.length > 0) {
        reasons.push(`${sharedTags.length} tag${sharedTags.length > 1 ? 's' : ''} en común`);
      }
    }

    // 3. Recency (20% weight by default)
    const recencyScore = calculateRecencyScore(post);
    score += recencyScore * weightRecency;
    if (recencyScore > 0.7) {
      reasons.push('Contenido reciente');
    }

    // 4. Popularity (10% weight by default)
    const popularityScore = calculatePopularityScore(post, allPosts);
    score += popularityScore * weightPopularity;
    if (popularityScore > 0.8) {
      reasons.push('Popular');
    }

    return { post, score, reasons };
  });

  // Filter by minimum score and sort
  return scoredPosts
    .filter(item => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * Get related posts with scores (for debugging/display)
 */
export function getRelatedPostsWithScores(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  options: RelatedPostsOptions = {}
): RelatedPostScore[] {
  const {
    limit = 5,
    minScore = 0.2,
    excludeCurrentPost = true,
    weightCategory = 0.4,
    weightTag = 0.3,
    weightRecency = 0.2,
    weightPopularity = 0.1,
  } = options;

  const posts = allPosts.filter(post => {
    if (post.status !== 'published') return false;
    if (excludeCurrentPost && post.id === currentPost.id) return false;
    return true;
  });

  const scoredPosts: RelatedPostScore[] = posts.map(post => {
    const reasons: string[] = [];
    let score = 0;

    const categoryScore = calculateCategoryScore(currentPost, post);
    if (categoryScore > 0) {
      score += categoryScore * weightCategory;
      reasons.push(`Categoría: ${(categoryScore * 100).toFixed(0)}%`);
    }

    const tagScore = calculateTagScore(currentPost, post);
    if (tagScore > 0) {
      score += tagScore * weightTag;
      reasons.push(`Tags: ${(tagScore * 100).toFixed(0)}%`);
    }

    const recencyScore = calculateRecencyScore(post);
    score += recencyScore * weightRecency;
    reasons.push(`Recencia: ${(recencyScore * 100).toFixed(0)}%`);

    const popularityScore = calculatePopularityScore(post, allPosts);
    score += popularityScore * weightPopularity;
    reasons.push(`Popularidad: ${(popularityScore * 100).toFixed(0)}%`);

    return { post, score, reasons };
  });

  return scoredPosts
    .filter(item => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ==============================================
// SCORING FUNCTIONS
// ==============================================

/**
 * Calculate category similarity score (0-1)
 */
function calculateCategoryScore(post1: BlogPost, post2: BlogPost): number {
  const categories1 = new Set(post1.categories.map(c => c.id));
  const categories2 = new Set(post2.categories.map(c => c.id));

  // Count shared categories
  let shared = 0;
  categories1.forEach(cat => {
    if (categories2.has(cat)) shared++;
  });

  if (shared === 0) return 0;

  // Full match if all categories match
  if (shared === categories1.size && shared === categories2.size) {
    return 1;
  }

  // Partial match based on Jaccard similarity
  const union = new Set([...categories1, ...categories2]);
  return shared / union.size;
}

/**
 * Calculate tag similarity score (0-1)
 */
function calculateTagScore(post1: BlogPost, post2: BlogPost): number {
  const tags1 = new Set(post1.tags.map(t => t.id));
  const tags2 = new Set(post2.tags.map(t => t.id));

  // Count shared tags
  let shared = 0;
  tags1.forEach(tag => {
    if (tags2.has(tag)) shared++;
  });

  if (shared === 0) return 0;

  // Jaccard similarity
  const union = new Set([...tags1, ...tags2]);
  return shared / union.size;
}

/**
 * Calculate recency score (0-1)
 * Recent posts get higher scores
 */
function calculateRecencyScore(post: BlogPost): number {
  const now = new Date();
  const publishDate = new Date(post.publishedAt);
  const daysSincePublished = Math.floor(
    (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Score decreases over time
  // 0-7 days: 1.0
  // 7-30 days: 0.8
  // 30-90 days: 0.5
  // 90-180 days: 0.3
  // 180+ days: 0.1

  if (daysSincePublished <= 7) return 1.0;
  if (daysSincePublished <= 30) return 0.8;
  if (daysSincePublished <= 90) return 0.5;
  if (daysSincePublished <= 180) return 0.3;
  return 0.1;
}

/**
 * Calculate popularity score (0-1)
 * Based on views relative to other posts
 */
function calculatePopularityScore(
  post: BlogPost,
  allPosts: BlogPost[]
): number {
  if (!post.views) return 0;

  const publishedPosts = allPosts.filter(p => p.status === 'published' && p.views);
  if (publishedPosts.length === 0) return 0;

  const views = publishedPosts.map(p => p.views || 0);
  const maxViews = Math.max(...views);
  const minViews = Math.min(...views);

  if (maxViews === minViews) return 0.5;

  // Normalize between 0 and 1
  return (post.views - minViews) / (maxViews - minViews);
}

/**
 * Get shared tags between two posts
 */
function getSharedTags(post1: BlogPost, post2: BlogPost): Tag[] {
  const tags1Ids = new Set(post1.tags.map(t => t.id));
  return post2.tags.filter(tag => tags1Ids.has(tag.id));
}

// ==============================================
// CONTENT RECOMMENDATIONS
// ==============================================

/**
 * Get recommended posts for a user based on reading history
 */
export function getRecommendedPosts(
  readingHistory: BlogPost[],
  allPosts: BlogPost[],
  limit: number = 10
): BlogPost[] {
  if (readingHistory.length === 0) {
    // No history - return popular posts
    return allPosts
      .filter(p => p.status === 'published')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  }

  // Aggregate all related posts from reading history
  const relatedPostsMap = new Map<string, number>();

  readingHistory.forEach(historyPost => {
    const related = findRelatedPosts(historyPost, allPosts, {
      limit: 20,
      minScore: 0.1,
    });

    related.forEach((post, index) => {
      // Higher weight for more similar posts (earlier in array)
      const weight = 1 - (index / related.length);
      const currentScore = relatedPostsMap.get(post.id) || 0;
      relatedPostsMap.set(post.id, currentScore + weight);
    });
  });

  // Filter out already read posts
  const readIds = new Set(readingHistory.map(p => p.id));
  const recommendations = Array.from(relatedPostsMap.entries())
    .filter(([id]) => !readIds.has(id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => allPosts.find(p => p.id === id))
    .filter((p): p is BlogPost => p !== undefined);

  return recommendations;
}

/**
 * Get "Continue Reading" suggestions
 * Posts from same series or category
 */
export function getContinueReadingSuggestions(
  currentPost: BlogPost,
  allPosts: BlogPost[]
): BlogPost[] {
  // Find posts in same categories
  const sameCategoryPosts = allPosts.filter(post => {
    if (post.id === currentPost.id) return false;
    if (post.status !== 'published') return false;
    return post.categories.some(cat =>
      currentPost.categories.some(currCat => currCat.id === cat.id)
    );
  });

  // Sort by recency
  return sameCategoryPosts
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 3);
}

/**
 * Get "You might also like" suggestions
 * Diverse content based on tags
 */
export function getYouMightAlsoLike(
  currentPost: BlogPost,
  allPosts: BlogPost[]
): BlogPost[] {
  return findRelatedPosts(currentPost, allPosts, {
    limit: 6,
    minScore: 0.15,
    weightCategory: 0.2,
    weightTag: 0.5, // Emphasize tag similarity for diversity
    weightRecency: 0.2,
    weightPopularity: 0.1,
  });
}

// ==============================================
// CATEGORY RECOMMENDATIONS
// ==============================================

/**
 * Get recommended categories for a user
 */
export function getRecommendedCategories(
  readingHistory: BlogPost[],
  allCategories: Category[]
): Category[] {
  if (readingHistory.length === 0) {
    // Return categories sorted by post count
    return [...allCategories].sort(
      (a, b) => (b.postCount || 0) - (a.postCount || 0)
    );
  }

  // Count category occurrences in reading history
  const categoryCount = new Map<string, number>();

  readingHistory.forEach(post => {
    post.categories.forEach(category => {
      const count = categoryCount.get(category.id) || 0;
      categoryCount.set(category.id, count + 1);
    });
  });

  // Sort categories by occurrence
  return allCategories
    .map(category => ({
      category,
      count: categoryCount.get(category.id) || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .map(item => item.category);
}

// ==============================================
// TRENDING CONTENT
// ==============================================

/**
 * Get trending posts
 * Based on recent views increase
 */
export function getTrendingPosts(
  allPosts: BlogPost[],
  limit: number = 5
): BlogPost[] {
  // In a real implementation, this would calculate
  // views growth rate over last 7 days
  // For now, we'll use a combination of recency + views

  return allPosts
    .filter(p => p.status === 'published' && p.views)
    .map(post => {
      const recencyScore = calculateRecencyScore(post);
      const viewsNormalized = (post.views || 0) / 1000; // Normalize
      const trendScore = recencyScore * 0.7 + viewsNormalized * 0.3;
      return { post, trendScore };
    })
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit)
    .map(item => item.post);
}
