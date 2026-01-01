import { Redis } from 'ioredis';
import { LeadScoringEngine, LeadProfile, LeadBehavior, LeadScore } from './scoring-engine';
import { TwentyCRMIntegration } from './crm-integration';
import { logger } from '../../monitoring/logging/logger';
import { register, Histogram, Counter } from 'prom-client';

/**
 * Lead Scoring Service
 * 
 * Main orchestration service that:
 * - Collects behavior data from analytics
 * - Enriches profile data from CRM
 * - Calculates lead scores
 * - Syncs scores back to CRM
 * - Provides scoring API
 */

export class LeadScoringService {
  private scoringEngine: LeadScoringEngine;
  private crmIntegration: TwentyCRMIntegration;
  private redis: Redis;
  private analyticsRedis: Redis;

  // Prometheus metrics
  private scoreCalculationDuration: Histogram<string>;
  private scoreCalculations: Counter<string>;
  private crmSyncDuration: Histogram<string>;
  private crmSyncErrors: Counter<string>;

  constructor(
    redis: Redis,
    analyticsRedis: Redis,
    crmConfig: {
      apiUrl: string;
      apiKey: string;
      workspace: string;
    }
  ) {
    this.redis = redis;
    this.analyticsRedis = analyticsRedis;
    this.scoringEngine = new LeadScoringEngine(redis);
    this.crmIntegration = new TwentyCRMIntegration(crmConfig);

    this.initializeMetrics();
  }

  /**
   * Initialize Prometheus metrics
   */
  private initializeMetrics(): void {
    this.scoreCalculationDuration = new Histogram({
      name: 'anclora_lead_scoring_calculation_duration_seconds',
      help: 'Duration of lead score calculations',
      labelNames: ['category'],
      registers: [register],
    });

    this.scoreCalculations = new Counter({
      name: 'anclora_lead_scoring_calculations_total',
      help: 'Total number of lead score calculations',
      labelNames: ['category', 'source'],
      registers: [register],
    });

    this.crmSyncDuration = new Histogram({
      name: 'anclora_lead_scoring_crm_sync_duration_seconds',
      help: 'Duration of CRM sync operations',
      labelNames: ['operation'],
      registers: [register],
    });

    this.crmSyncErrors = new Counter({
      name: 'anclora_lead_scoring_crm_sync_errors_total',
      help: 'Total CRM sync errors',
      labelNames: ['operation'],
      registers: [register],
    });
  }

  /**
   * Score a lead with full data enrichment
   */
  async scoreLeadWithEnrichment(phone: string): Promise<LeadScore> {
    const startTime = Date.now();

    try {
      // 1. Fetch profile from CRM (if exists)
      const crmData = await this.crmIntegration.fetchLeadData(phone);

      // 2. Get behavior data from analytics
      const behavior = await this.getLeadBehavior(phone);

      // 3. Build profile
      const profile: LeadProfile = {
        phone,
        source: 'whatsapp',
        created_at: new Date(),
        ...crmData?.profile,
      };

      // 4. Calculate score
      const score = await this.scoringEngine.calculateScore(profile, behavior);

      // 5. Sync score back to CRM
      try {
        await this.crmIntegration.updateLeadScore(score, crmData?.crmId);
      } catch (error) {
        logger.error('Failed to sync score to CRM', { error, phone });
        this.crmSyncErrors.inc({ operation: 'update_score' });
      }

      // Metrics
      const duration = (Date.now() - startTime) / 1000;
      this.scoreCalculationDuration.labels(score.category).observe(duration);
      this.scoreCalculations.inc({ 
        category: score.category, 
        source: profile.source || 'unknown',
      });

      return score;
    } catch (error) {
      logger.error('Error scoring lead with enrichment', { error, phone });
      throw error;
    }
  }

  /**
   * Score a lead with provided data (no enrichment)
   */
  async scoreLead(profile: LeadProfile, behavior: LeadBehavior): Promise<LeadScore> {
    const startTime = Date.now();

    try {
      const score = await this.scoringEngine.calculateScore(profile, behavior);

      // Metrics
      const duration = (Date.now() - startTime) / 1000;
      this.scoreCalculationDuration.labels(score.category).observe(duration);
      this.scoreCalculations.inc({ 
        category: score.category, 
        source: profile.source || 'unknown',
      });

      return score;
    } catch (error) {
      logger.error('Error scoring lead', { error, phone: profile.phone });
      throw error;
    }
  }

  /**
   * Get lead behavior from analytics
   */
  private async getLeadBehavior(phone: string): Promise<LeadBehavior> {
    try {
      // Fetch analytics data from Redis
      const analyticsKey = `analytics:lead:${phone}`;
      const data = await this.analyticsRedis.hgetall(analyticsKey);

      if (!data || Object.keys(data).length === 0) {
        // Return default behavior for new leads
        return this.getDefaultBehavior();
      }

      // Parse behavior data
      const behavior: LeadBehavior = {
        total_messages: parseInt(data.total_messages || '0'),
        messages_sent: parseInt(data.messages_sent || '0'),
        messages_received: parseInt(data.messages_received || '0'),
        avg_response_time_seconds: parseFloat(data.avg_response_time_seconds || '0'),
        last_interaction: data.last_interaction ? 
          new Date(data.last_interaction) : 
          new Date(),
        
        questions_asked: parseInt(data.questions_asked || '0'),
        properties_viewed: parseInt(data.properties_viewed || '0'),
        brochures_requested: parseInt(data.brochures_requested || '0'),
        appointments_requested: parseInt(data.appointments_requested || '0'),
        
        conversation_duration_minutes: parseFloat(data.conversation_duration_minutes || '0'),
        topics_discussed: data.topics_discussed ? 
          JSON.parse(data.topics_discussed) : 
          [],
        specific_property_interest: data.specific_property_interest === 'true',
        price_discussed: data.price_discussed === 'true',
        
        unresponsive_count: parseInt(data.unresponsive_count || '0'),
        negative_sentiment_count: parseInt(data.negative_sentiment_count || '0'),
        spam_indicators: parseInt(data.spam_indicators || '0'),
      };

      return behavior;
    } catch (error) {
      logger.error('Error fetching lead behavior', { error, phone });
      return this.getDefaultBehavior();
    }
  }

  /**
   * Get default behavior for new leads
   */
  private getDefaultBehavior(): LeadBehavior {
    return {
      total_messages: 0,
      messages_sent: 0,
      messages_received: 0,
      avg_response_time_seconds: 0,
      last_interaction: new Date(),
      questions_asked: 0,
      properties_viewed: 0,
      brochures_requested: 0,
      appointments_requested: 0,
      conversation_duration_minutes: 0,
      topics_discussed: [],
      specific_property_interest: false,
      price_discussed: false,
      unresponsive_count: 0,
      negative_sentiment_count: 0,
      spam_indicators: 0,
    };
  }

  /**
   * Update lead behavior (called from analytics events)
   */
  async updateLeadBehavior(
    phone: string,
    updates: Partial<LeadBehavior>
  ): Promise<void> {
    try {
      const analyticsKey = `analytics:lead:${phone}`;

      // Convert updates to Redis hash format
      const hashUpdates: Record<string, string> = {};
      
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !(value instanceof Date)) {
            hashUpdates[key] = JSON.stringify(value);
          } else if (value instanceof Date) {
            hashUpdates[key] = value.toISOString();
          } else {
            hashUpdates[key] = String(value);
          }
        }
      }

      if (Object.keys(hashUpdates).length > 0) {
        await this.analyticsRedis.hmset(analyticsKey, hashUpdates);
        
        // Set expiry: 90 days
        await this.analyticsRedis.expire(analyticsKey, 90 * 24 * 60 * 60);

        // Invalidate cached score
        await this.scoringEngine.invalidateScore(phone);

        logger.debug('Updated lead behavior', { phone, updates: Object.keys(hashUpdates) });
      }
    } catch (error) {
      logger.error('Error updating lead behavior', { error, phone });
      throw error;
    }
  }

  /**
   * Get leads by category
   */
  async getLeadsByCategory(
    category: 'hot' | 'warm' | 'cold',
    limit: number = 50
  ): Promise<LeadScore[]> {
    try {
      // Search for leads with this category in Redis
      const pattern = 'lead:score:*';
      const keys = await this.redis.keys(pattern);

      const scores: LeadScore[] = [];

      for (const key of keys.slice(0, limit * 2)) {
        const data = await this.redis.get(key);
        if (!data) continue;

        const score = JSON.parse(data) as LeadScore;
        
        if (score.category === category) {
          scores.push(score);
          if (scores.length >= limit) break;
        }
      }

      // Sort by score descending
      scores.sort((a, b) => b.score - a.score);

      return scores.slice(0, limit);
    } catch (error) {
      logger.error('Error getting leads by category', { error, category });
      throw error;
    }
  }

  /**
   * Re-score all leads (batch operation)
   */
  async rescoreAllLeads(): Promise<{ processed: number; errors: number }> {
    let processed = 0;
    let errors = 0;

    try {
      logger.info('Starting batch re-scoring of all leads');

      // Get all lead behavior keys
      const pattern = 'analytics:lead:*';
      const keys = await this.analyticsRedis.keys(pattern);

      for (const key of keys) {
        const phone = key.split(':').pop();
        if (!phone) continue;

        try {
          await this.scoreLeadWithEnrichment(phone);
          processed++;

          // Rate limit: 10 leads per second
          if (processed % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          errors++;
          logger.error('Error rescoring lead in batch', { error, phone });
        }
      }

      logger.info('Batch re-scoring completed', { processed, errors });

      return { processed, errors };
    } catch (error) {
      logger.error('Error in batch rescoring', { error });
      throw error;
    }
  }

  /**
   * Get scoring statistics
   */
  async getScoringStatistics(): Promise<{
    total_leads: number;
    hot_leads: number;
    warm_leads: number;
    cold_leads: number;
    unqualified_leads: number;
    avg_score: number;
    avg_conversion_probability: number;
  }> {
    try {
      const pattern = 'lead:score:*';
      const keys = await this.redis.keys(pattern);

      let hot = 0, warm = 0, cold = 0, unqualified = 0;
      let totalScore = 0;
      let totalProbability = 0;
      let count = 0;

      for (const key of keys) {
        const data = await this.redis.get(key);
        if (!data) continue;

        const score = JSON.parse(data) as LeadScore;
        
        switch (score.category) {
          case 'hot': hot++; break;
          case 'warm': warm++; break;
          case 'cold': cold++; break;
          case 'unqualified': unqualified++; break;
        }

        totalScore += score.score;
        totalProbability += score.probability_conversion;
        count++;
      }

      return {
        total_leads: count,
        hot_leads: hot,
        warm_leads: warm,
        cold_leads: cold,
        unqualified_leads: unqualified,
        avg_score: count > 0 ? Math.round(totalScore / count) : 0,
        avg_conversion_probability: count > 0 ? totalProbability / count : 0,
      };
    } catch (error) {
      logger.error('Error getting scoring statistics', { error });
      throw error;
    }
  }

  /**
   * Sync profile to CRM
   */
  async syncProfileToCRM(profile: LeadProfile, score?: LeadScore): Promise<string> {
    const startTime = Date.now();

    try {
      const contactId = await this.crmIntegration.syncLeadProfile(profile, score);
      
      const duration = (Date.now() - startTime) / 1000;
      this.crmSyncDuration.labels('sync_profile').observe(duration);

      return contactId;
    } catch (error) {
      this.crmSyncErrors.inc({ operation: 'sync_profile' });
      throw error;
    }
  }
}
