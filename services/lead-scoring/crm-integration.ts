import axios, { AxiosInstance } from 'axios';
import { LeadProfile, LeadScore } from './scoring-engine';
import { logger } from '../../monitoring/logging/logger';

/**
 * Twenty CRM Integration
 * 
 * Handles bidirectional sync between lead scoring system and Twenty CRM:
 * - Fetch lead data from CRM
 * - Update lead scores in CRM
 * - Create/update contact records
 * - Sync custom fields
 */

interface TwentyCRMConfig {
  apiUrl: string;
  apiKey: string;
  workspace: string;
}

interface TwentyContact {
  id: string;
  name?: {
    firstName?: string;
    lastName?: string;
  };
  email?: string;
  phone?: string;
  company?: string;
  
  // Custom fields
  customFields: {
    leadScore?: number;
    leadCategory?: string;
    leadSource?: string;
    budgetRange?: string;
    propertyType?: string;
    timeline?: string;
    buyerType?: string;
    conversionProbability?: number;
    estimatedValue?: number;
    lastScoreUpdate?: string;
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  owner?: {
    id: string;
    name: string;
  };
}

interface CRMLeadData {
  profile: Partial<LeadProfile>;
  lastUpdate: Date;
  crmId: string;
}

export class TwentyCRMIntegration {
  private client: AxiosInstance;
  private config: TwentyCRMConfig;

  constructor(config: TwentyCRMConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  /**
   * Fetch lead data from CRM
   */
  async fetchLeadData(phone: string): Promise<CRMLeadData | null> {
    try {
      const response = await this.client.get<TwentyContact>(
        `/api/contacts/phone/${encodeURIComponent(phone)}`,
        {
          params: {
            workspace: this.config.workspace,
          },
        }
      );

      const contact = response.data;

      const profile: Partial<LeadProfile> = {
        phone: contact.phone || phone,
        name: contact.name ? 
          `${contact.name.firstName || ''} ${contact.name.lastName || ''}`.trim() : 
          undefined,
        email: contact.email,
        source: this.mapCRMSource(contact.customFields.leadSource),
        property_type: this.mapPropertyType(contact.customFields.propertyType),
        timeline: this.mapTimeline(contact.customFields.timeline),
        buyer_type: this.mapBuyerType(contact.customFields.buyerType),
      };

      // Parse budget range if available
      if (contact.customFields.budgetRange) {
        profile.budget_range = this.parseBudgetRange(contact.customFields.budgetRange);
      }

      logger.info('Fetched lead data from CRM', { phone, crmId: contact.id });

      return {
        profile,
        lastUpdate: new Date(contact.updatedAt),
        crmId: contact.id,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        logger.debug('Lead not found in CRM', { phone });
        return null;
      }
      
      logger.error('Error fetching lead from CRM', { error, phone });
      throw error;
    }
  }

  /**
   * Update lead score in CRM
   */
  async updateLeadScore(score: LeadScore, crmId?: string): Promise<void> {
    try {
      // Find or create contact
      let contactId = crmId;
      
      if (!contactId) {
        const existingContact = await this.fetchLeadData(score.phone);
        contactId = existingContact?.crmId;
      }

      const payload = {
        customFields: {
          leadScore: score.score,
          leadCategory: score.category,
          conversionProbability: Math.round(score.probability_conversion * 100),
          estimatedValue: score.estimated_value,
          lastScoreUpdate: score.calculated_at.toISOString(),
        },
        tags: this.generateTags(score),
      };

      if (contactId) {
        // Update existing contact
        await this.client.patch(
          `/api/contacts/${contactId}`,
          payload,
          {
            params: {
              workspace: this.config.workspace,
            },
          }
        );

        logger.info('Updated lead score in CRM', { 
          phone: score.phone, 
          contactId, 
          score: score.score,
          category: score.category,
        });
      } else {
        // Create new contact
        const createPayload = {
          phone: score.phone,
          ...payload,
        };

        const response = await this.client.post<TwentyContact>(
          '/api/contacts',
          createPayload,
          {
            params: {
              workspace: this.config.workspace,
            },
          }
        );

        logger.info('Created new contact in CRM with score', {
          phone: score.phone,
          contactId: response.data.id,
          score: score.score,
        });
      }
    } catch (error) {
      logger.error('Error updating lead score in CRM', { error, phone: score.phone });
      throw error;
    }
  }

  /**
   * Sync lead profile to CRM
   */
  async syncLeadProfile(profile: LeadProfile, score?: LeadScore): Promise<string> {
    try {
      const existingContact = await this.fetchLeadData(profile.phone);

      const payload: Partial<TwentyContact> = {
        name: profile.name ? {
          firstName: profile.name.split(' ')[0],
          lastName: profile.name.split(' ').slice(1).join(' '),
        } : undefined,
        email: profile.email,
        phone: profile.phone,
        customFields: {
          leadSource: profile.source,
          propertyType: profile.property_type,
          timeline: profile.timeline,
          buyerType: profile.buyer_type,
          budgetRange: profile.budget_range ? 
            `${profile.budget_range.min}-${profile.budget_range.max}` : 
            undefined,
        },
      };

      // Include score if provided
      if (score) {
        payload.customFields = {
          ...payload.customFields,
          leadScore: score.score,
          leadCategory: score.category,
          conversionProbability: Math.round(score.probability_conversion * 100),
          estimatedValue: score.estimated_value,
          lastScoreUpdate: score.calculated_at.toISOString(),
        };
        payload.tags = this.generateTags(score);
      }

      let contactId: string;

      if (existingContact) {
        // Update existing
        await this.client.patch(
          `/api/contacts/${existingContact.crmId}`,
          payload,
          {
            params: {
              workspace: this.config.workspace,
            },
          }
        );
        contactId = existingContact.crmId;

        logger.info('Updated lead profile in CRM', { phone: profile.phone, contactId });
      } else {
        // Create new
        const response = await this.client.post<TwentyContact>(
          '/api/contacts',
          payload,
          {
            params: {
              workspace: this.config.workspace,
            },
          }
        );
        contactId = response.data.id;

        logger.info('Created new lead profile in CRM', { phone: profile.phone, contactId });
      }

      return contactId;
    } catch (error) {
      logger.error('Error syncing lead profile to CRM', { error, phone: profile.phone });
      throw error;
    }
  }

  /**
   * Bulk update scores in CRM
   */
  async bulkUpdateScores(scores: LeadScore[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const score of scores) {
      try {
        await this.updateLeadScore(score);
        success++;
      } catch (error) {
        failed++;
        logger.error('Failed to update score in bulk operation', {
          phone: score.phone,
          error,
        });
      }
    }

    logger.info('Bulk score update completed', { 
      total: scores.length, 
      success, 
      failed,
    });

    return { success, failed };
  }

  /**
   * Get high-value leads from CRM
   */
  async getHighValueLeads(minScore: number = 70): Promise<CRMLeadData[]> {
    try {
      const response = await this.client.get<TwentyContact[]>(
        '/api/contacts',
        {
          params: {
            workspace: this.config.workspace,
            filter: JSON.stringify({
              'customFields.leadScore': { $gte: minScore },
            }),
            sort: '-customFields.leadScore',
            limit: 100,
          },
        }
      );

      return response.data.map(contact => ({
        profile: {
          phone: contact.phone!,
          name: contact.name ? 
            `${contact.name.firstName} ${contact.name.lastName}` : 
            undefined,
          email: contact.email,
          source: this.mapCRMSource(contact.customFields.leadSource),
        },
        lastUpdate: new Date(contact.updatedAt),
        crmId: contact.id,
      }));
    } catch (error) {
      logger.error('Error fetching high-value leads from CRM', { error });
      throw error;
    }
  }

  /**
   * Map CRM source to internal source type
   */
  private mapCRMSource(
    source?: string
  ): 'whatsapp' | 'web' | 'referral' | 'facebook_ads' | 'organic' {
    switch (source?.toLowerCase()) {
      case 'whatsapp': return 'whatsapp';
      case 'website': return 'web';
      case 'referral': return 'referral';
      case 'facebook': case 'facebook_ads': return 'facebook_ads';
      case 'organic': return 'organic';
      default: return 'web';
    }
  }

  /**
   * Map property type
   */
  private mapPropertyType(type?: string): 'villa' | 'apartment' | 'land' | 'commercial' | undefined {
    switch (type?.toLowerCase()) {
      case 'villa': return 'villa';
      case 'apartment': return 'apartment';
      case 'land': return 'land';
      case 'commercial': return 'commercial';
      default: return undefined;
    }
  }

  /**
   * Map timeline
   */
  private mapTimeline(
    timeline?: string
  ): 'immediate' | '1-3_months' | '3-6_months' | '6-12_months' | 'exploring' | undefined {
    switch (timeline?.toLowerCase()) {
      case 'immediate': return 'immediate';
      case '1-3_months': return '1-3_months';
      case '3-6_months': return '3-6_months';
      case '6-12_months': return '6-12_months';
      case 'exploring': return 'exploring';
      default: return undefined;
    }
  }

  /**
   * Map buyer type
   */
  private mapBuyerType(
    type?: string
  ): 'investor' | 'end_user' | 'relocating' | 'vacation_home' | undefined {
    switch (type?.toLowerCase()) {
      case 'investor': return 'investor';
      case 'end_user': return 'end_user';
      case 'relocating': return 'relocating';
      case 'vacation_home': return 'vacation_home';
      default: return undefined;
    }
  }

  /**
   * Parse budget range string
   */
  private parseBudgetRange(budgetStr: string): { min: number; max: number } | undefined {
    const match = budgetStr.match(/(\d+)-(\d+)/);
    if (match) {
      return {
        min: parseInt(match[1]),
        max: parseInt(match[2]),
      };
    }
    return undefined;
  }

  /**
   * Generate tags based on score
   */
  private generateTags(score: LeadScore): string[] {
    const tags: string[] = [];

    // Category tag
    tags.push(`lead:${score.category}`);

    // Probability tag
    if (score.probability_conversion > 0.7) {
      tags.push('high-probability');
    } else if (score.probability_conversion > 0.4) {
      tags.push('medium-probability');
    }

    // Value tag
    if (score.estimated_value > 1000000) {
      tags.push('high-value');
    } else if (score.estimated_value > 500000) {
      tags.push('medium-value');
    }

    // Action tag
    tags.push(`action:${score.recommended_action}`);

    return tags;
  }
}
