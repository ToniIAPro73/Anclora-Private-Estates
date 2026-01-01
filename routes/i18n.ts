import { Router, Request, Response } from 'express';
import { I18nService, SupportedLanguage } from '../services/i18n/i18n-service';
import { MessageTemplateEngine } from '../services/i18n/message-template-engine';
import { logger } from '../monitoring/logging/logger';

/**
 * i18n API Routes
 * 
 * Endpoints:
 * GET    /api/i18n/detect                - Detect language from text
 * GET    /api/i18n/language/:phone       - Get user language
 * POST   /api/i18n/language/:phone       - Set user language
 * DELETE /api/i18n/language/:phone       - Clear user language
 * POST   /api/i18n/translate             - Translate a key
 * POST   /api/i18n/template              - Generate message template
 * GET    /api/i18n/statistics            - Language usage statistics
 */

export function createI18nRoutes(
  i18nService: I18nService,
  templateEngine: MessageTemplateEngine
): Router {
  const router = Router();

  /**
   * Detect language from text
   * GET /api/i18n/detect?text=...
   */
  router.get('/detect', (req: Request, res: Response) => {
    try {
      const { text } = req.query as { text: string };

      if (!text) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Text parameter is required',
        });
      }

      const detection = i18nService.detectLanguage(text);

      res.json({
        success: true,
        detection,
      });
    } catch (error) {
      logger.error('Error in detect language endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to detect language',
      });
    }
  });

  /**
   * Get user language
   * GET /api/i18n/language/:phone
   */
  router.get('/language/:phone', async (req: Request, res: Response) => {
    try {
      const { phone } = req.params;

      const language = await i18nService.getUserLanguage(phone);

      res.json({
        success: true,
        phone,
        language,
      });
    } catch (error) {
      logger.error('Error in get user language endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get user language',
      });
    }
  });

  /**
   * Set user language
   * POST /api/i18n/language/:phone
   */
  router.post('/language/:phone', async (req: Request, res: Response) => {
    try {
      const { phone } = req.params;
      const { language, source } = req.body as {
        language: SupportedLanguage;
        source?: 'auto' | 'manual';
      };

      if (!language || !['es', 'en', 'de'].includes(language)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Valid language (es, en, de) is required',
        });
      }

      await i18nService.setUserLanguage(phone, language, source || 'manual');

      logger.info('User language set via API', { phone, language, source });

      res.json({
        success: true,
        phone,
        language,
        message: 'Language preference updated',
      });
    } catch (error) {
      logger.error('Error in set user language endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to set user language',
      });
    }
  });

  /**
   * Clear user language preference
   * DELETE /api/i18n/language/:phone
   */
  router.delete('/language/:phone', async (req: Request, res: Response) => {
    try {
      const { phone } = req.params;

      await i18nService.clearUserLanguage(phone);

      res.json({
        success: true,
        phone,
        message: 'Language preference cleared',
      });
    } catch (error) {
      logger.error('Error in clear user language endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to clear language preference',
      });
    }
  });

  /**
   * Translate a key
   * POST /api/i18n/translate
   */
  router.post('/translate', async (req: Request, res: Response) => {
    try {
      const { key, phone, language, params } = req.body as {
        key: string;
        phone: string;
        language?: SupportedLanguage;
        params?: Record<string, any>;
      };

      if (!key || !phone) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Key and phone are required',
        });
      }

      const translation = await i18nService.translate(key, phone, {
        language,
        params,
      });

      res.json({
        success: true,
        key,
        translation,
      });
    } catch (error) {
      logger.error('Error in translate endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to translate key',
      });
    }
  });

  /**
   * Generate message template
   * POST /api/i18n/template
   */
  router.post('/template', async (req: Request, res: Response) => {
    try {
      const { template_type, phone, data } = req.body as {
        template_type: string;
        phone: string;
        data?: any;
      };

      if (!template_type || !phone) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Template type and phone are required',
        });
      }

      let template;

      switch (template_type) {
        case 'welcome':
          template = await templateEngine.getWelcomeMessage(phone, data?.name);
          break;
        case 'main_menu':
          template = await templateEngine.getMainMenu(phone);
          break;
        case 'property_type':
          template = await templateEngine.getPropertyTypeSelection(phone);
          break;
        case 'location':
          template = await templateEngine.getLocationSelection(phone);
          break;
        case 'budget':
          template = await templateEngine.getBudgetSelection(phone);
          break;
        case 'timeline':
          template = await templateEngine.getTimelineSelection(phone);
          break;
        case 'buyer_type':
          template = await templateEngine.getBuyerTypeSelection(phone);
          break;
        case 'financing':
          template = await templateEngine.getFinancingSelection(phone);
          break;
        case 'property_details':
          if (!data?.property) {
            return res.status(400).json({
              error: 'Bad Request',
              message: 'Property data is required for this template',
            });
          }
          template = await templateEngine.getPropertyDetails(phone, data.property);
          break;
        case 'appointment_confirmation':
          if (!data?.appointment) {
            return res.status(400).json({
              error: 'Bad Request',
              message: 'Appointment data is required for this template',
            });
          }
          template = await templateEngine.getAppointmentConfirmation(phone, data.appointment);
          break;
        case 'agent_handoff':
          template = await templateEngine.getAgentHandoffMessage(phone, data?.agent_name);
          break;
        case 'language_selection':
          template = await templateEngine.getLanguageSelection(phone);
          break;
        case 'error':
          template = await templateEngine.getErrorMessage(phone, data?.error_type || 'generic');
          break;
        default:
          return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid template type',
          });
      }

      res.json({
        success: true,
        template,
      });
    } catch (error) {
      logger.error('Error in template endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to generate template',
      });
    }
  });

  /**
   * Get language usage statistics
   * GET /api/i18n/statistics
   */
  router.get('/statistics', async (req: Request, res: Response) => {
    try {
      const stats = await i18nService.getLanguageStatistics();

      res.json({
        success: true,
        statistics: stats,
      });
    } catch (error) {
      logger.error('Error in statistics endpoint', { error });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get statistics',
      });
    }
  });

  return router;
}
