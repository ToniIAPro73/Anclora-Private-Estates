/**
 * Unit Tests - WhatsApp Analytics Manager
 */

import { WhatsAppAnalyticsManager, createAnalyticsManager } from '../../lib/whatsapp-analytics';
import { createMockRedis, createTestPhone } from '../setup-tests';

// Mock IORedis
jest.mock('ioredis');

describe('WhatsAppAnalyticsManager', () => {
  let analyticsManager: WhatsAppAnalyticsManager;
  let mockRedis: ReturnType<typeof createMockRedis>;

  beforeEach(() => {
    mockRedis = createMockRedis();
    
    // Mock IORedis constructor
    const IORedis = require('ioredis');
    IORedis.mockImplementation(() => mockRedis);

    analyticsManager = createAnalyticsManager();
  });

  afterEach(async () => {
    await analyticsManager.close();
  });

  describe('trackMessageSent', () => {
    it('should track message sent successfully', async () => {
      const phone = createTestPhone();
      
      await analyticsManager.trackMessageSent(phone, 'text');

      expect(mockRedis.pipeline).toHaveBeenCalled();
      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('sent')
      );
    });

    it('should track message with metadata', async () => {
      const phone = createTestPhone();
      const metadata = {
        templateId: 'welcome',
        campaignId: 'campaign-123',
      };

      await analyticsManager.trackMessageSent(phone, 'text', metadata);

      expect(mockRedis.pipeline).toHaveBeenCalled();
    });

    it('should track different message types', async () => {
      const phone = createTestPhone();

      await analyticsManager.trackMessageSent(phone, 'text');
      await analyticsManager.trackMessageSent(phone, 'image');
      await analyticsManager.trackMessageSent(phone, 'video');

      expect(mockRedis.incr).toHaveBeenCalledTimes(3);
    });
  });

  describe('trackMessageReceived', () => {
    it('should track message received successfully', async () => {
      const phone = createTestPhone();

      await analyticsManager.trackMessageReceived(phone, 'text');

      expect(mockRedis.pipeline).toHaveBeenCalled();
      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('received')
      );
    });

    it('should calculate response time', async () => {
      const phone = createTestPhone();

      // First send
      await analyticsManager.trackMessageSent(phone, 'text');
      
      // Then receive (response)
      await analyticsManager.trackMessageReceived(phone, 'text');

      expect(mockRedis.lpush).toHaveBeenCalled();
    });
  });

  describe('trackMessageFailed', () => {
    it('should track failed message', async () => {
      const phone = createTestPhone();
      const error = 'Number not on WhatsApp';

      await analyticsManager.trackMessageFailed(phone, error);

      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('failed')
      );
    });

    it('should store error metadata', async () => {
      const phone = createTestPhone();
      const error = 'Rate limit exceeded';
      const metadata = { errorCode: 429 };

      await analyticsManager.trackMessageFailed(phone, error, metadata);

      expect(mockRedis.set).toHaveBeenCalled();
    });
  });

  describe('trackMessageDelivered', () => {
    it('should track delivered message', async () => {
      const phone = createTestPhone();
      const messageId = 'msg-123';

      await analyticsManager.trackMessageDelivered(phone, messageId);

      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('delivered')
      );
    });
  });

  describe('trackMessageRead', () => {
    it('should track read message', async () => {
      const phone = createTestPhone();
      const messageId = 'msg-123';

      await analyticsManager.trackMessageRead(phone, messageId);

      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('read')
      );
    });
  });

  describe('trackConversationStarted', () => {
    it('should track conversation started', async () => {
      const phone = createTestPhone();

      await analyticsManager.trackConversationStarted(phone, 'inbound');

      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('conversations:total')
      );
      expect(mockRedis.set).toHaveBeenCalled();
    });

    it('should add to active conversations', async () => {
      const phone = createTestPhone();

      await analyticsManager.trackConversationStarted(phone, 'outbound');

      expect(mockRedis.zadd).toHaveBeenCalled();
    });
  });

  describe('trackConversationEnded', () => {
    it('should track conversation ended', async () => {
      const phone = createTestPhone();

      // Start conversation first
      mockRedis.get.mockResolvedValue(
        JSON.stringify({
          startedAt: Date.now() - 60000, // 1 minute ago
          source: 'inbound',
        })
      );

      await analyticsManager.trackConversationEnded(phone, 'completed');

      expect(mockRedis.del).toHaveBeenCalled();
      expect(mockRedis.lpush).toHaveBeenCalled();
    });
  });

  describe('trackHandoff', () => {
    it('should track handoff to human', async () => {
      const phone = createTestPhone();

      await analyticsManager.trackHandoff(phone, 'complex_inquiry');

      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('handoffs')
      );
    });
  });

  describe('trackConversion', () => {
    it('should track lead conversion', async () => {
      const phone = createTestPhone();

      await analyticsManager.trackConversion(phone, 'lead');

      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('conversions:lead')
      );
    });

    it('should track qualified lead conversion', async () => {
      const phone = createTestPhone();

      await analyticsManager.trackConversion(phone, 'qualified_lead');

      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('conversions:qualified_lead')
      );
    });

    it('should track appointment conversion', async () => {
      const phone = createTestPhone();

      await analyticsManager.trackConversion(phone, 'appointment');

      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('conversions:appointment')
      );
    });

    it('should track sale with value', async () => {
      const phone = createTestPhone();
      const value = 500000; // €500k

      await analyticsManager.trackConversion(phone, 'sale', value);

      expect(mockRedis.incr).toHaveBeenCalled();
      expect(mockRedis.set).toHaveBeenCalled();
    });
  });

  describe('trackCampaign', () => {
    it('should track campaign sent event', async () => {
      const campaignId = 'campaign-123';
      const phone = createTestPhone();

      await analyticsManager.trackCampaign(campaignId, phone, 'sent');

      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining(campaignId)
      );
    });

    it('should track campaign response event', async () => {
      const campaignId = 'campaign-123';
      const phone = createTestPhone();

      await analyticsManager.trackCampaign(campaignId, phone, 'response');

      expect(mockRedis.incr).toHaveBeenCalled();
    });

    it('should track campaign conversion event', async () => {
      const campaignId = 'campaign-123';
      const phone = createTestPhone();

      await analyticsManager.trackCampaign(campaignId, phone, 'conversion');

      expect(mockRedis.incr).toHaveBeenCalled();
    });
  });

  describe('getMessageMetrics', () => {
    it('should return message metrics', async () => {
      mockRedis.get
        .mockResolvedValueOnce('100') // sent
        .mockResolvedValueOnce('80')  // received
        .mockResolvedValueOnce('5')   // failed
        .mockResolvedValueOnce('95')  // delivered
        .mockResolvedValueOnce('75'); // read

      const metrics = await analyticsManager.getMessageMetrics();

      expect(metrics).toEqual({
        sent: 100,
        received: 80,
        failed: 5,
        delivered: 95,
        read: 75,
      });
    });

    it('should return metrics for specific date', async () => {
      const date = '2026-01-01';
      
      mockRedis.get.mockResolvedValue('50');

      const metrics = await analyticsManager.getMessageMetrics(date);

      expect(metrics.sent).toBe(50);
      expect(mockRedis.get).toHaveBeenCalledWith(
        expect.stringContaining(date)
      );
    });
  });

  describe('getConversationMetrics', () => {
    it('should return conversation metrics', async () => {
      mockRedis.zcard.mockResolvedValue(10); // active
      mockRedis.get
        .mockResolvedValueOnce('100') // total
        .mockResolvedValueOnce('50')  // handoffs
        .mockResolvedValueOnce(JSON.stringify([30, 40, 50])); // response times

      const metrics = await analyticsManager.getConversationMetrics();

      expect(metrics.activeConversations).toBe(10);
      expect(metrics.totalConversations).toBe(100);
    });
  });

  describe('getConversionMetrics', () => {
    it('should return conversion metrics', async () => {
      mockRedis.get
        .mockResolvedValueOnce('50')  // leads
        .mockResolvedValueOnce('30')  // qualified
        .mockResolvedValueOnce('15')  // appointments
        .mockResolvedValueOnce('5');  // sales

      const metrics = await analyticsManager.getConversionMetrics();

      expect(metrics).toEqual({
        leads: 50,
        qualifiedLeads: 30,
        appointments: 15,
        sales: 5,
        conversionRate: expect.any(Number),
      });
    });
  });

  describe('getCampaignMetrics', () => {
    it('should return campaign metrics', async () => {
      const campaignId = 'campaign-123';

      mockRedis.get
        .mockResolvedValueOnce('100') // sent
        .mockResolvedValueOnce('95')  // delivered
        .mockResolvedValueOnce('80')  // read
        .mockResolvedValueOnce('40')  // responses
        .mockResolvedValueOnce('10'); // conversions

      const metrics = await analyticsManager.getCampaignMetrics(campaignId);

      expect(metrics).toEqual({
        campaignId,
        sent: 100,
        delivered: 95,
        read: 80,
        responses: 40,
        conversions: 10,
        roi: expect.any(Number),
      });
    });
  });

  describe('generateReport', () => {
    it('should generate daily report', async () => {
      mockRedis.get.mockResolvedValue('10');
      mockRedis.zcard.mockResolvedValue(5);

      const report = await analyticsManager.generateReport('day');

      expect(report.period).toBe('day');
      expect(report.startDate).toBeInstanceOf(Date);
      expect(report.endDate).toBeInstanceOf(Date);
      expect(report.messages).toBeDefined();
      expect(report.conversations).toBeDefined();
      expect(report.conversions).toBeDefined();
    });

    it('should generate weekly report', async () => {
      mockRedis.get.mockResolvedValue('50');

      const report = await analyticsManager.generateReport('week');

      expect(report.period).toBe('week');
    });

    it('should generate monthly report', async () => {
      mockRedis.get.mockResolvedValue('200');

      const report = await analyticsManager.generateReport('month');

      expect(report.period).toBe('month');
    });
  });

  describe('cleanup', () => {
    it('should cleanup old data', async () => {
      mockRedis.keys.mockResolvedValue([
        'analytics:whatsapp:message:123',
        'analytics:whatsapp:message:456',
      ]);

      await analyticsManager.cleanup(30);

      expect(mockRedis.del).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close Redis connection', async () => {
      await analyticsManager.close();

      expect(mockRedis.quit).toHaveBeenCalled();
    });
  });
});

describe('createAnalyticsManager', () => {
  it('should create analytics manager with default config', () => {
    const manager = createAnalyticsManager();

    expect(manager).toBeInstanceOf(WhatsAppAnalyticsManager);
  });

  it('should create analytics manager with custom config', () => {
    const config = {
      host: 'custom-host',
      port: 6380,
      db: 2,
    };

    const manager = createAnalyticsManager(config);

    expect(manager).toBeInstanceOf(WhatsAppAnalyticsManager);
  });
});
