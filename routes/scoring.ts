import { Router, Request, Response } from 'express';
import { LeadScoringService } from '../services/lead-scoring/lead-scoring-service';
import { LeadProfile, LeadBehavior } from '../services/lead-scoring/scoring-engine';
import { logger } from '../monitoring/logging/logger';

/**
 * Lead Scoring API Routes
 * 
 * Endpoints:
 * POST   /api/scoring/calculate         - Calculate score for lead
 * POST   /api/scoring/calculate-auto    - Auto-calculate with enrichment
 * GET    /api/scoring/:phone            - Get cached score
 * POST   /api/scoring/behavior/update   - Update lead behavior
 * GET    /api/scoring/leads/:category   - Get leads by category
 * GET    /api/scoring/statistics        - Get scoring statistics
 * POST   /api/scoring/rescore-all       - Batch re-score all leads
 */

export function createScoringRoutes(scoringService: LeadScoringService): Router {
  const router = Router();

  /**
   * Calculate lead score with provided data
   * POST /api/scoring/calculate
   */
  router.post('/calculate', async (req: Request, res: Response) => {
    try {
      const { profile, behavior } = req.body as {
        profile: LeadProfile;
        behavior: LeadBehavior;
      };

      // Validate required fields
      if (!profile || !profile.phone) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Profile with phone number is required',
        });
      }

      if (!behavior) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Behavior data is required',
        });
      }

      // Calculate score
      const score = await scoringService.scoreLead(profile, behavior);

      logger.info('Lead score calculated via API', {
        phone: profile.phone,
        score: score.score,
        category: score.category,
      });

      res.json({
        success: true,
        score,
      });
    } catch (error) {
      logger.error('Error in calculate score endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to calculate lead score',
      });
    }
  });

  /**
   * Calculate lead score with auto-enrichment from CRM and analytics
   * POST /api/scoring/calculate-auto
   */
  router.post('/calculate-auto', async (req: Request, res: Response) => {
    try {
      const { phone } = req.body as { phone: string };

      if (!phone) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Phone number is required',
        });
      }

      // Calculate score with enrichment
      const score = await scoringService.scoreLeadWithEnrichment(phone);

      logger.info('Lead score auto-calculated via API', {
        phone,
        score: score.score,
        category: score.category,
      });

      res.json({
        success: true,
        score,
      });
    } catch (error) {
      logger.error('Error in auto-calculate score endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to calculate lead score',
      });
    }
  });

  /**
   * Get cached lead score
   * GET /api/scoring/:phone
   */
  router.get('/:phone', async (req: Request, res: Response) => {
    try {
      const { phone } = req.params;

      // Try to get from cache first, otherwise calculate
      let score = await scoringService['scoringEngine'].getCachedScore(phone);

      if (!score) {
        // Calculate new score
        score = await scoringService.scoreLeadWithEnrichment(phone);
      }

      res.json({
        success: true,
        score,
        cached: score.calculated_at < new Date(Date.now() - 60000), // Cached if older than 1 min
      });
    } catch (error) {
      logger.error('Error in get score endpoint', { error, phone: req.params.phone });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get lead score',
      });
    }
  });

  /**
   * Update lead behavior
   * POST /api/scoring/behavior/update
   */
  router.post('/behavior/update', async (req: Request, res: Response) => {
    try {
      const { phone, updates } = req.body as {
        phone: string;
        updates: Partial<LeadBehavior>;
      };

      if (!phone) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Phone number is required',
        });
      }

      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Behavior updates are required',
        });
      }

      await scoringService.updateLeadBehavior(phone, updates);

      logger.info('Lead behavior updated via API', {
        phone,
        updatedFields: Object.keys(updates),
      });

      res.json({
        success: true,
        message: 'Behavior updated successfully',
      });
    } catch (error) {
      logger.error('Error in update behavior endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update lead behavior',
      });
    }
  });

  /**
   * Get leads by category
   * GET /api/scoring/leads/:category
   */
  router.get('/leads/:category', async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!['hot', 'warm', 'cold'].includes(category)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid category. Must be hot, warm, or cold',
        });
      }

      const leads = await scoringService.getLeadsByCategory(
        category as 'hot' | 'warm' | 'cold',
        limit
      );

      res.json({
        success: true,
        category,
        count: leads.length,
        leads,
      });
    } catch (error) {
      logger.error('Error in get leads by category endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get leads by category',
      });
    }
  });

  /**
   * Get scoring statistics
   * GET /api/scoring/statistics
   */
  router.get('/statistics', async (req: Request, res: Response) => {
    try {
      const stats = await scoringService.getScoringStatistics();

      res.json({
        success: true,
        statistics: stats,
      });
    } catch (error) {
      logger.error('Error in get statistics endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get scoring statistics',
      });
    }
  });

  /**
   * Batch re-score all leads (admin only)
   * POST /api/scoring/rescore-all
   */
  router.post('/rescore-all', async (req: Request, res: Response) => {
    try {
      // In production, add admin authentication check here

      logger.info('Starting batch re-score operation via API');

      // Run async (don't wait for completion)
      scoringService.rescoreAllLeads()
        .then(result => {
          logger.info('Batch re-score completed', result);
        })
        .catch(error => {
          logger.error('Batch re-score failed', { error });
        });

      res.json({
        success: true,
        message: 'Batch re-scoring started',
      });
    } catch (error) {
      logger.error('Error in rescore-all endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to start batch rescoring',
      });
    }
  });

  /**
   * Sync lead profile to CRM
   * POST /api/scoring/sync-crm
   */
  router.post('/sync-crm', async (req: Request, res: Response) => {
    try {
      const { profile, score } = req.body as {
        profile: LeadProfile;
        score?: any;
      };

      if (!profile || !profile.phone) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Profile with phone number is required',
        });
      }

      const contactId = await scoringService.syncProfileToCRM(profile, score);

      logger.info('Lead profile synced to CRM via API', {
        phone: profile.phone,
        contactId,
      });

      res.json({
        success: true,
        contactId,
        message: 'Profile synced successfully',
      });
    } catch (error) {
      logger.error('Error in sync CRM endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to sync profile to CRM',
      });
    }
  });

  return router;
}
