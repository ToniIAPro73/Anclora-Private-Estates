import { Redis } from 'ioredis';
import { logger } from '../../monitoring/logging/logger';

/**
 * Lead Scoring System
 * 
 * Calcula puntuación de leads basado en múltiples factores:
 * - Engagement (respuestas, velocidad)
 * - Perfil (budget, timeline, property type)
 * - Comportamiento (preguntas, interés)
 * - Fuente (campaña, referral)
 */

export interface LeadProfile {
  phone: string;
  name?: string;
  email?: string;
  source: 'whatsapp' | 'web' | 'referral' | 'facebook_ads' | 'organic';
  campaign_id?: string;
  created_at: Date;
  
  // Property Interest
  property_type?: 'villa' | 'apartment' | 'land' | 'commercial';
  location_preference?: string[];
  budget_range?: {
    min: number;
    max: number;
  };
  timeline?: 'immediate' | '1-3_months' | '3-6_months' | '6-12_months' | 'exploring';
  
  // Buyer Classification
  buyer_type?: 'investor' | 'end_user' | 'relocating' | 'vacation_home';
  financing_status?: 'cash' | 'mortgage_approved' | 'mortgage_needed' | 'unknown';
}

export interface LeadBehavior {
  // Engagement Metrics
  total_messages: number;
  messages_sent: number;
  messages_received: number;
  avg_response_time_seconds: number;
  last_interaction: Date;
  
  // Conversation Quality
  questions_asked: number;
  properties_viewed: number;
  brochures_requested: number;
  appointments_requested: number;
  
  // Interaction Depth
  conversation_duration_minutes: number;
  topics_discussed: string[];
  specific_property_interest: boolean;
  price_discussed: boolean;
  
  // Red Flags
  unresponsive_count: number;
  negative_sentiment_count: number;
  spam_indicators: number;
}

export interface LeadScore {
  phone: string;
  score: number; // 0-100
  category: 'hot' | 'warm' | 'cold' | 'unqualified';
  confidence: number; // 0-1
  
  breakdown: {
    engagement_score: number; // 0-30
    profile_score: number; // 0-30
    behavior_score: number; // 0-30
    source_score: number; // 0-10
  };
  
  factors: {
    positive: string[];
    negative: string[];
  };
  
  recommended_action: 'immediate_contact' | 'nurture' | 'schedule_followup' | 'low_priority';
  probability_conversion: number; // 0-1
  estimated_value: number; // EUR
  
  calculated_at: Date;
  expires_at: Date;
}

export class LeadScoringEngine {
  private redis: Redis;
  
  // Scoring weights
  private static readonly WEIGHTS = {
    engagement: 0.30,
    profile: 0.30,
    behavior: 0.30,
    source: 0.10,
  };
  
  // Category thresholds
  private static readonly THRESHOLDS = {
    hot: 80,
    warm: 60,
    cold: 40,
  };
  
  // Cache TTL
  private static readonly SCORE_TTL = 3600; // 1 hour

  constructor(redis: Redis) {
    this.redis = redis;
  }

  /**
   * Calculate comprehensive lead score
   */
  async calculateScore(
    profile: LeadProfile,
    behavior: LeadBehavior
  ): Promise<LeadScore> {
    try {
      // Check cache first
      const cached = await this.getCachedScore(profile.phone);
      if (cached) {
        return cached;
      }

      // Calculate component scores
      const engagementScore = this.calculateEngagementScore(behavior);
      const profileScore = this.calculateProfileScore(profile);
      const behaviorScore = this.calculateBehaviorScore(behavior);
      const sourceScore = this.calculateSourceScore(profile);

      // Weighted total score
      const totalScore = Math.round(
        engagementScore * LeadScoringEngine.WEIGHTS.engagement +
        profileScore * LeadScoringEngine.WEIGHTS.profile +
        behaviorScore * LeadScoringEngine.WEIGHTS.behavior +
        sourceScore * LeadScoringEngine.WEIGHTS.source
      );

      // Determine category
      const category = this.determineCategory(totalScore);

      // Calculate conversion probability
      const probability_conversion = this.calculateConversionProbability(
        totalScore,
        profile,
        behavior
      );

      // Estimate deal value
      const estimated_value = this.estimateValue(profile, probability_conversion);

      // Identify factors
      const factors = this.identifyFactors(profile, behavior, {
        engagement: engagementScore,
        profile: profileScore,
        behavior: behaviorScore,
        source: sourceScore,
      });

      // Recommended action
      const recommended_action = this.determineRecommendedAction(
        category,
        probability_conversion,
        behavior
      );

      const score: LeadScore = {
        phone: profile.phone,
        score: totalScore,
        category,
        confidence: this.calculateConfidence(behavior),
        breakdown: {
          engagement_score: engagementScore,
          profile_score: profileScore,
          behavior_score: behaviorScore,
          source_score: sourceScore,
        },
        factors,
        recommended_action,
        probability_conversion,
        estimated_value,
        calculated_at: new Date(),
        expires_at: new Date(Date.now() + LeadScoringEngine.SCORE_TTL * 1000),
      };

      // Cache score
      await this.cacheScore(score);

      logger.info('Lead score calculated', {
        phone: profile.phone,
        score: totalScore,
        category,
        probability_conversion,
      });

      return score;
    } catch (error) {
      logger.error('Error calculating lead score', { error, phone: profile.phone });
      throw error;
    }
  }

  /**
   * Calculate engagement score (0-30)
   */
  private calculateEngagementScore(behavior: LeadBehavior): number {
    let score = 0;

    // Message volume (0-8)
    if (behavior.total_messages > 20) score += 8;
    else if (behavior.total_messages > 10) score += 6;
    else if (behavior.total_messages > 5) score += 4;
    else if (behavior.total_messages > 2) score += 2;

    // Response time (0-8)
    const avgResponseMinutes = behavior.avg_response_time_seconds / 60;
    if (avgResponseMinutes < 5) score += 8;
    else if (avgResponseMinutes < 15) score += 6;
    else if (avgResponseMinutes < 60) score += 4;
    else if (avgResponseMinutes < 180) score += 2;

    // Recency (0-8)
    const hoursSinceLastInteraction = 
      (Date.now() - behavior.last_interaction.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastInteraction < 24) score += 8;
    else if (hoursSinceLastInteraction < 72) score += 6;
    else if (hoursSinceLastInteraction < 168) score += 4;
    else if (hoursSinceLastInteraction < 336) score += 2;

    // Conversation balance (0-6)
    const balanceRatio = behavior.messages_sent / Math.max(behavior.messages_received, 1);
    if (balanceRatio > 0.5 && balanceRatio < 2) score += 6;
    else if (balanceRatio > 0.3 && balanceRatio < 3) score += 4;
    else score += 2;

    return Math.min(score, 30);
  }

  /**
   * Calculate profile score (0-30)
   */
  private calculateProfileScore(profile: LeadProfile): number {
    let score = 0;

    // Budget qualification (0-10)
    if (profile.budget_range) {
      if (profile.budget_range.min >= 1000000) score += 10; // >1M EUR
      else if (profile.budget_range.min >= 500000) score += 8;
      else if (profile.budget_range.min >= 250000) score += 6;
      else if (profile.budget_range.min >= 100000) score += 4;
      else score += 2;
    }

    // Timeline urgency (0-8)
    switch (profile.timeline) {
      case 'immediate': score += 8; break;
      case '1-3_months': score += 7; break;
      case '3-6_months': score += 5; break;
      case '6-12_months': score += 3; break;
      case 'exploring': score += 1; break;
    }

    // Buyer type (0-6)
    switch (profile.buyer_type) {
      case 'investor': score += 6; break;
      case 'relocating': score += 5; break;
      case 'end_user': score += 4; break;
      case 'vacation_home': score += 3; break;
    }

    // Financing status (0-6)
    switch (profile.financing_status) {
      case 'cash': score += 6; break;
      case 'mortgage_approved': score += 5; break;
      case 'mortgage_needed': score += 3; break;
      case 'unknown': score += 1; break;
    }

    return Math.min(score, 30);
  }

  /**
   * Calculate behavior score (0-30)
   */
  private calculateBehaviorScore(behavior: LeadBehavior): number {
    let score = 0;

    // Questions asked (0-8)
    if (behavior.questions_asked > 10) score += 8;
    else if (behavior.questions_asked > 5) score += 6;
    else if (behavior.questions_asked > 3) score += 4;
    else if (behavior.questions_asked > 0) score += 2;

    // Properties viewed (0-6)
    if (behavior.properties_viewed > 5) score += 6;
    else if (behavior.properties_viewed > 3) score += 5;
    else if (behavior.properties_viewed > 1) score += 3;
    else if (behavior.properties_viewed > 0) score += 1;

    // Appointment requests (0-8)
    if (behavior.appointments_requested > 2) score += 8;
    else if (behavior.appointments_requested > 1) score += 6;
    else if (behavior.appointments_requested > 0) score += 4;

    // Specific interest (0-4)
    if (behavior.specific_property_interest) score += 4;

    // Price discussion (0-4)
    if (behavior.price_discussed) score += 4;

    // Red flags (penalty, 0 to -10)
    score -= behavior.unresponsive_count * 2;
    score -= behavior.negative_sentiment_count;
    score -= behavior.spam_indicators * 3;

    return Math.max(0, Math.min(score, 30));
  }

  /**
   * Calculate source score (0-10)
   */
  private calculateSourceScore(profile: LeadProfile): number {
    switch (profile.source) {
      case 'referral': return 10;
      case 'organic': return 8;
      case 'whatsapp': return 7;
      case 'web': return 6;
      case 'facebook_ads': return 5;
      default: return 3;
    }
  }

  /**
   * Determine lead category
   */
  private determineCategory(score: number): 'hot' | 'warm' | 'cold' | 'unqualified' {
    if (score >= LeadScoringEngine.THRESHOLDS.hot) return 'hot';
    if (score >= LeadScoringEngine.THRESHOLDS.warm) return 'warm';
    if (score >= LeadScoringEngine.THRESHOLDS.cold) return 'cold';
    return 'unqualified';
  }

  /**
   * Calculate conversion probability using logistic regression
   */
  private calculateConversionProbability(
    score: number,
    profile: LeadProfile,
    behavior: LeadBehavior
  ): number {
    // Simplified logistic regression
    // In production, this would use a trained ML model
    
    let logit = -4.0; // Intercept
    
    // Score contribution
    logit += score * 0.08;
    
    // Profile factors
    if (profile.budget_range && profile.budget_range.min >= 500000) logit += 0.5;
    if (profile.timeline === 'immediate') logit += 1.0;
    if (profile.financing_status === 'cash') logit += 0.8;
    
    // Behavior factors
    if (behavior.appointments_requested > 0) logit += 1.5;
    if (behavior.specific_property_interest) logit += 0.7;
    if (behavior.price_discussed) logit += 0.5;
    
    // Logistic function
    const probability = 1 / (1 + Math.exp(-logit));
    
    return Math.min(Math.max(probability, 0), 1);
  }

  /**
   * Estimate deal value
   */
  private estimateValue(profile: LeadProfile, probability: number): number {
    let estimatedValue = 0;

    if (profile.budget_range) {
      // Average of budget range
      estimatedValue = (profile.budget_range.min + profile.budget_range.max) / 2;
    } else {
      // Default estimate based on property type
      switch (profile.property_type) {
        case 'villa': estimatedValue = 1500000; break;
        case 'apartment': estimatedValue = 500000; break;
        case 'land': estimatedValue = 300000; break;
        case 'commercial': estimatedValue = 800000; break;
        default: estimatedValue = 600000;
      }
    }

    // Adjust by conversion probability
    return Math.round(estimatedValue * probability);
  }

  /**
   * Identify positive and negative factors
   */
  private identifyFactors(
    profile: LeadProfile,
    behavior: LeadBehavior,
    scores: { engagement: number; profile: number; behavior: number; source: number }
  ): { positive: string[]; negative: string[] } {
    const positive: string[] = [];
    const negative: string[] = [];

    // Engagement factors
    if (scores.engagement >= 20) positive.push('High engagement');
    else if (scores.engagement < 10) negative.push('Low engagement');

    if (behavior.avg_response_time_seconds < 300) positive.push('Fast response time');
    else if (behavior.avg_response_time_seconds > 3600) negative.push('Slow response time');

    // Profile factors
    if (profile.budget_range && profile.budget_range.min >= 1000000) {
      positive.push('High budget (>1M EUR)');
    }
    
    if (profile.timeline === 'immediate') positive.push('Immediate timeline');
    else if (profile.timeline === 'exploring') negative.push('Long timeline');

    if (profile.financing_status === 'cash') positive.push('Cash buyer');

    // Behavior factors
    if (behavior.appointments_requested > 0) positive.push('Requested appointment');
    if (behavior.specific_property_interest) positive.push('Specific property interest');
    if (behavior.price_discussed) positive.push('Discussed pricing');
    
    if (behavior.unresponsive_count > 2) negative.push('Multiple unresponsive instances');
    if (behavior.spam_indicators > 0) negative.push('Spam indicators detected');

    // Source factors
    if (profile.source === 'referral') positive.push('Referral source');

    return { positive, negative };
  }

  /**
   * Determine recommended action
   */
  private determineRecommendedAction(
    category: string,
    probability: number,
    behavior: LeadBehavior
  ): 'immediate_contact' | 'nurture' | 'schedule_followup' | 'low_priority' {
    if (category === 'hot' || probability > 0.7) {
      return 'immediate_contact';
    }
    
    if (category === 'warm' || probability > 0.4) {
      const hoursSinceLastInteraction = 
        (Date.now() - behavior.last_interaction.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastInteraction < 48) {
        return 'nurture';
      }
      return 'schedule_followup';
    }
    
    return 'low_priority';
  }

  /**
   * Calculate confidence based on data completeness
   */
  private calculateConfidence(behavior: LeadBehavior): number {
    let confidence = 0;

    // More interactions = higher confidence
    if (behavior.total_messages > 20) confidence += 0.3;
    else if (behavior.total_messages > 10) confidence += 0.2;
    else if (behavior.total_messages > 5) confidence += 0.1;

    // Longer conversation = higher confidence
    if (behavior.conversation_duration_minutes > 30) confidence += 0.2;
    else if (behavior.conversation_duration_minutes > 15) confidence += 0.1;

    // More data points = higher confidence
    const dataPoints = [
      behavior.questions_asked,
      behavior.properties_viewed,
      behavior.topics_discussed.length,
    ].filter(v => v > 0).length;
    
    confidence += dataPoints * 0.1;

    // Recency matters
    const hoursSinceLastInteraction = 
      (Date.now() - behavior.last_interaction.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastInteraction < 72) confidence += 0.2;
    else if (hoursSinceLastInteraction < 168) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Cache score in Redis
   */
  private async cacheScore(score: LeadScore): Promise<void> {
    const key = `lead:score:${score.phone}`;
    await this.redis.setex(
      key,
      LeadScoringEngine.SCORE_TTL,
      JSON.stringify(score)
    );
  }

  /**
   * Get cached score
   */
  private async getCachedScore(phone: string): Promise<LeadScore | null> {
    const key = `lead:score:${phone}`;
    const cached = await this.redis.get(key);
    
    if (!cached) return null;
    
    const score = JSON.parse(cached) as LeadScore;
    
    // Check if expired
    if (new Date(score.expires_at) < new Date()) {
      await this.redis.del(key);
      return null;
    }
    
    return score;
  }

  /**
   * Invalidate cached score
   */
  async invalidateScore(phone: string): Promise<void> {
    const key = `lead:score:${phone}`;
    await this.redis.del(key);
  }

  /**
   * Get scores by category
   */
  async getLeadsByCategory(_category: 'hot' | 'warm' | 'cold'): Promise<LeadScore[]> {
    // This would typically query a database
    // For now, return empty array
    return [];
  }
}
