import { LeadScoringEngine, LeadProfile, LeadBehavior } from '../../services/lead-scoring/scoring-engine';
import Redis from 'ioredis-mock';

describe('LeadScoringEngine', () => {
  let redis: Redis;
  let engine: LeadScoringEngine;

  beforeEach(() => {
    redis = new Redis();
    engine = new LeadScoringEngine(redis);
  });

  afterEach(async () => {
    await redis.flushall();
    redis.disconnect();
  });

  describe('calculateScore', () => {
    it('should calculate score for high-value lead', async () => {
      const profile: LeadProfile = {
        phone: '34600123456',
        name: 'John Investor',
        source: 'referral',
        property_type: 'villa',
        budget_range: { min: 2000000, max: 3000000 },
        timeline: 'immediate',
        buyer_type: 'investor',
        financing_status: 'cash',
        created_at: new Date(),
      };

      const behavior: LeadBehavior = {
        total_messages: 25,
        messages_sent: 15,
        messages_received: 10,
        avg_response_time_seconds: 120,
        last_interaction: new Date(),
        questions_asked: 12,
        properties_viewed: 8,
        brochures_requested: 3,
        appointments_requested: 2,
        conversation_duration_minutes: 45,
        topics_discussed: ['location', 'price', 'financing', 'views'],
        specific_property_interest: true,
        price_discussed: true,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const score = await engine.calculateScore(profile, behavior);

      expect(score.score).toBeGreaterThan(80);
      expect(score.category).toBe('hot');
      expect(score.probability_conversion).toBeGreaterThan(0.7);
      expect(score.recommended_action).toBe('immediate_contact');
      expect(score.breakdown.engagement_score).toBeGreaterThan(20);
      expect(score.breakdown.profile_score).toBeGreaterThan(25);
      expect(score.breakdown.behavior_score).toBeGreaterThan(20);
    });

    it('should calculate score for medium-value lead', async () => {
      const profile: LeadProfile = {
        phone: '34600234567',
        source: 'web',
        property_type: 'apartment',
        budget_range: { min: 300000, max: 500000 },
        timeline: '3-6_months',
        buyer_type: 'end_user',
        created_at: new Date(),
      };

      const behavior: LeadBehavior = {
        total_messages: 8,
        messages_sent: 5,
        messages_received: 3,
        avg_response_time_seconds: 1800,
        last_interaction: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        questions_asked: 3,
        properties_viewed: 2,
        brochures_requested: 1,
        appointments_requested: 0,
        conversation_duration_minutes: 15,
        topics_discussed: ['location', 'price'],
        specific_property_interest: false,
        price_discussed: true,
        unresponsive_count: 1,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const score = await engine.calculateScore(profile, behavior);

      expect(score.score).toBeGreaterThanOrEqual(40);
      expect(score.score).toBeLessThan(80);
      expect(score.category).toMatch(/warm|cold/);
      expect(score.probability_conversion).toBeLessThan(0.7);
    });

    it('should classify low-quality lead as unqualified', async () => {
      const profile: LeadProfile = {
        phone: '34600345678',
        source: 'facebook_ads',
        timeline: 'exploring',
        created_at: new Date(),
      };

      const behavior: LeadBehavior = {
        total_messages: 2,
        messages_sent: 1,
        messages_received: 1,
        avg_response_time_seconds: 7200,
        last_interaction: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        questions_asked: 0,
        properties_viewed: 0,
        brochures_requested: 0,
        appointments_requested: 0,
        conversation_duration_minutes: 2,
        topics_discussed: [],
        specific_property_interest: false,
        price_discussed: false,
        unresponsive_count: 3,
        negative_sentiment_count: 1,
        spam_indicators: 2,
      };

      const score = await engine.calculateScore(profile, behavior);

      expect(score.score).toBeLessThan(40);
      expect(score.category).toBe('unqualified');
      expect(score.recommended_action).toBe('low_priority');
    });

    it('should cache calculated scores', async () => {
      const profile: LeadProfile = {
        phone: '34600456789',
        source: 'whatsapp',
        created_at: new Date(),
      };

      const behavior: LeadBehavior = {
        total_messages: 10,
        messages_sent: 6,
        messages_received: 4,
        avg_response_time_seconds: 300,
        last_interaction: new Date(),
        questions_asked: 5,
        properties_viewed: 3,
        brochures_requested: 1,
        appointments_requested: 1,
        conversation_duration_minutes: 20,
        topics_discussed: ['location'],
        specific_property_interest: true,
        price_discussed: false,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const score1 = await engine.calculateScore(profile, behavior);
      const score2 = await engine['getCachedScore'](profile.phone);

      expect(score2).not.toBeNull();
      expect(score2?.phone).toBe(score1.phone);
      expect(score2?.score).toBe(score1.score);
    });

    it('should include positive and negative factors', async () => {
      const profile: LeadProfile = {
        phone: '34600567890',
        source: 'referral',
        budget_range: { min: 1500000, max: 2000000 },
        timeline: 'immediate',
        financing_status: 'cash',
        created_at: new Date(),
      };

      const behavior: LeadBehavior = {
        total_messages: 20,
        messages_sent: 12,
        messages_received: 8,
        avg_response_time_seconds: 180,
        last_interaction: new Date(),
        questions_asked: 10,
        properties_viewed: 5,
        brochures_requested: 2,
        appointments_requested: 1,
        conversation_duration_minutes: 35,
        topics_discussed: ['location', 'price'],
        specific_property_interest: true,
        price_discussed: true,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const score = await engine.calculateScore(profile, behavior);

      expect(score.factors.positive.length).toBeGreaterThan(0);
      expect(score.factors.positive).toContain('High budget (>1M EUR)');
      expect(score.factors.positive).toContain('Cash buyer');
      expect(score.factors.positive).toContain('Referral source');
    });
  });

  describe('engagement scoring', () => {
    it('should reward high message volume', async () => {
      const profile: LeadProfile = {
        phone: '34600678901',
        source: 'whatsapp',
        created_at: new Date(),
      };

      const highVolume: LeadBehavior = {
        total_messages: 30,
        messages_sent: 18,
        messages_received: 12,
        avg_response_time_seconds: 300,
        last_interaction: new Date(),
        questions_asked: 5,
        properties_viewed: 2,
        brochures_requested: 0,
        appointments_requested: 0,
        conversation_duration_minutes: 20,
        topics_discussed: [],
        specific_property_interest: false,
        price_discussed: false,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const lowVolume: LeadBehavior = {
        ...highVolume,
        total_messages: 3,
        messages_sent: 2,
        messages_received: 1,
      };

      const scoreHigh = await engine.calculateScore(profile, highVolume);
      const scoreLow = await engine.calculateScore(profile, lowVolume);

      expect(scoreHigh.breakdown.engagement_score).toBeGreaterThan(
        scoreLow.breakdown.engagement_score
      );
    });

    it('should reward fast response time', async () => {
      const profile: LeadProfile = {
        phone: '34600789012',
        source: 'whatsapp',
        created_at: new Date(),
      };

      const baseBehavior: LeadBehavior = {
        total_messages: 10,
        messages_sent: 6,
        messages_received: 4,
        avg_response_time_seconds: 120,
        last_interaction: new Date(),
        questions_asked: 3,
        properties_viewed: 1,
        brochures_requested: 0,
        appointments_requested: 0,
        conversation_duration_minutes: 10,
        topics_discussed: [],
        specific_property_interest: false,
        price_discussed: false,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const fastResponse = await engine.calculateScore(profile, {
        ...baseBehavior,
        avg_response_time_seconds: 120, // 2 minutes
      });

      const slowResponse = await engine.calculateScore(profile, {
        ...baseBehavior,
        avg_response_time_seconds: 7200, // 2 hours
      });

      expect(fastResponse.breakdown.engagement_score).toBeGreaterThan(
        slowResponse.breakdown.engagement_score
      );
    });

    it('should reward recent interaction', async () => {
      const profile: LeadProfile = {
        phone: '34600890123',
        source: 'whatsapp',
        created_at: new Date(),
      };

      const baseBehavior: LeadBehavior = {
        total_messages: 10,
        messages_sent: 6,
        messages_received: 4,
        avg_response_time_seconds: 300,
        last_interaction: new Date(),
        questions_asked: 3,
        properties_viewed: 1,
        brochures_requested: 0,
        appointments_requested: 0,
        conversation_duration_minutes: 10,
        topics_discussed: [],
        specific_property_interest: false,
        price_discussed: false,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const recent = await engine.calculateScore(profile, {
        ...baseBehavior,
        last_interaction: new Date(), // Now
      });

      const old = await engine.calculateScore(profile, {
        ...baseBehavior,
        last_interaction: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      });

      expect(recent.breakdown.engagement_score).toBeGreaterThan(
        old.breakdown.engagement_score
      );
    });
  });

  describe('profile scoring', () => {
    it('should reward high budget', async () => {
      const baseBehavior: LeadBehavior = {
        total_messages: 10,
        messages_sent: 6,
        messages_received: 4,
        avg_response_time_seconds: 300,
        last_interaction: new Date(),
        questions_asked: 3,
        properties_viewed: 1,
        brochures_requested: 0,
        appointments_requested: 0,
        conversation_duration_minutes: 10,
        topics_discussed: [],
        specific_property_interest: false,
        price_discussed: false,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const highBudget = await engine.calculateScore(
        {
          phone: '34600901234',
          source: 'web',
          budget_range: { min: 2000000, max: 3000000 },
          created_at: new Date(),
        },
        baseBehavior
      );

      const lowBudget = await engine.calculateScore(
        {
          phone: '34600012345',
          source: 'web',
          budget_range: { min: 100000, max: 200000 },
          created_at: new Date(),
        },
        baseBehavior
      );

      expect(highBudget.breakdown.profile_score).toBeGreaterThan(
        lowBudget.breakdown.profile_score
      );
    });

    it('should reward immediate timeline', async () => {
      const baseBehavior: LeadBehavior = {
        total_messages: 10,
        messages_sent: 6,
        messages_received: 4,
        avg_response_time_seconds: 300,
        last_interaction: new Date(),
        questions_asked: 3,
        properties_viewed: 1,
        brochures_requested: 0,
        appointments_requested: 0,
        conversation_duration_minutes: 10,
        topics_discussed: [],
        specific_property_interest: false,
        price_discussed: false,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const immediate = await engine.calculateScore(
        {
          phone: '34601234567',
          source: 'web',
          timeline: 'immediate',
          created_at: new Date(),
        },
        baseBehavior
      );

      const exploring = await engine.calculateScore(
        {
          phone: '34602345678',
          source: 'web',
          timeline: 'exploring',
          created_at: new Date(),
        },
        baseBehavior
      );

      expect(immediate.breakdown.profile_score).toBeGreaterThan(
        exploring.breakdown.profile_score
      );
    });

    it('should reward cash buyers', async () => {
      const baseBehavior: LeadBehavior = {
        total_messages: 10,
        messages_sent: 6,
        messages_received: 4,
        avg_response_time_seconds: 300,
        last_interaction: new Date(),
        questions_asked: 3,
        properties_viewed: 1,
        brochures_requested: 0,
        appointments_requested: 0,
        conversation_duration_minutes: 10,
        topics_discussed: [],
        specific_property_interest: false,
        price_discussed: false,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const cash = await engine.calculateScore(
        {
          phone: '34603456789',
          source: 'web',
          financing_status: 'cash',
          created_at: new Date(),
        },
        baseBehavior
      );

      const mortgage = await engine.calculateScore(
        {
          phone: '34604567890',
          source: 'web',
          financing_status: 'mortgage_needed',
          created_at: new Date(),
        },
        baseBehavior
      );

      expect(cash.breakdown.profile_score).toBeGreaterThan(
        mortgage.breakdown.profile_score
      );
    });
  });

  describe('behavior scoring', () => {
    it('should reward appointment requests', async () => {
      const profile: LeadProfile = {
        phone: '34605678901',
        source: 'whatsapp',
        created_at: new Date(),
      };

      const withAppointment: LeadBehavior = {
        total_messages: 10,
        messages_sent: 6,
        messages_received: 4,
        avg_response_time_seconds: 300,
        last_interaction: new Date(),
        questions_asked: 5,
        properties_viewed: 2,
        brochures_requested: 1,
        appointments_requested: 2,
        conversation_duration_minutes: 20,
        topics_discussed: [],
        specific_property_interest: true,
        price_discussed: true,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const withoutAppointment: LeadBehavior = {
        ...withAppointment,
        appointments_requested: 0,
      };

      const scoreWith = await engine.calculateScore(profile, withAppointment);
      const scoreWithout = await engine.calculateScore(profile, withoutAppointment);

      expect(scoreWith.breakdown.behavior_score).toBeGreaterThan(
        scoreWithout.breakdown.behavior_score
      );
      expect(scoreWith.probability_conversion).toBeGreaterThan(
        scoreWithout.probability_conversion
      );
    });

    it('should penalize spam indicators', async () => {
      const profile: LeadProfile = {
        phone: '34606789012',
        source: 'whatsapp',
        created_at: new Date(),
      };

      const clean: LeadBehavior = {
        total_messages: 10,
        messages_sent: 6,
        messages_received: 4,
        avg_response_time_seconds: 300,
        last_interaction: new Date(),
        questions_asked: 3,
        properties_viewed: 1,
        brochures_requested: 0,
        appointments_requested: 0,
        conversation_duration_minutes: 10,
        topics_discussed: [],
        specific_property_interest: false,
        price_discussed: false,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      const spam: LeadBehavior = {
        ...clean,
        spam_indicators: 3,
        unresponsive_count: 2,
      };

      const scoreClean = await engine.calculateScore(profile, clean);
      const scoreSpam = await engine.calculateScore(profile, spam);

      expect(scoreClean.breakdown.behavior_score).toBeGreaterThan(
        scoreSpam.breakdown.behavior_score
      );
    });
  });

  describe('invalidateScore', () => {
    it('should clear cached score', async () => {
      const profile: LeadProfile = {
        phone: '34607890123',
        source: 'whatsapp',
        created_at: new Date(),
      };

      const behavior: LeadBehavior = {
        total_messages: 10,
        messages_sent: 6,
        messages_received: 4,
        avg_response_time_seconds: 300,
        last_interaction: new Date(),
        questions_asked: 3,
        properties_viewed: 1,
        brochures_requested: 0,
        appointments_requested: 0,
        conversation_duration_minutes: 10,
        topics_discussed: [],
        specific_property_interest: false,
        price_discussed: false,
        unresponsive_count: 0,
        negative_sentiment_count: 0,
        spam_indicators: 0,
      };

      // Calculate and cache
      await engine.calculateScore(profile, behavior);

      // Verify cached
      let cached = await engine['getCachedScore'](profile.phone);
      expect(cached).not.toBeNull();

      // Invalidate
      await engine.invalidateScore(profile.phone);

      // Verify cleared
      cached = await engine['getCachedScore'](profile.phone);
      expect(cached).toBeNull();
    });
  });
});
