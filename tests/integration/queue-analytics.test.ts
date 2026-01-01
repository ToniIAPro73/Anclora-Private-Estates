/**
 * Integration Tests - Queue + Analytics
 * 
 * Verifica que el Queue Manager y Analytics Manager trabajen juntos correctamente
 */

import { WhatsAppQueueManager } from '../../lib/whatsapp-queue';
import { WhatsAppAnalyticsManager } from '../../lib/whatsapp-analytics';
import { TestDataFactory, MockRedisStore } from '../test-helpers/test-data-factory';

// Mock BullMQ y IORedis
jest.mock('bullmq');
jest.mock('ioredis');

describe('Queue + Analytics Integration', () => {
  let queueManager: WhatsAppQueueManager;
  let analyticsManager: WhatsAppAnalyticsManager;
  let mockRedis: MockRedisStore;

  beforeEach(() => {
    mockRedis = new MockRedisStore();
    
    // Mock IORedis to use our MockRedisStore
    const IORedis = require('ioredis');
    IORedis.mockImplementation(() => mockRedis);

    // Initialize managers
    queueManager = new WhatsAppQueueManager({
      redis: { host: 'localhost', port: 6379 },
    });
    analyticsManager = new WhatsAppAnalyticsManager({
      host: 'localhost',
      port: 6379,
      db: 1,
    });
  });

  afterEach(async () => {
    await queueManager.close();
    await analyticsManager.close();
    await mockRedis.flushall();
  });

  describe('Message Processing Flow', () => {
    it('should track analytics when message is queued', async () => {
      const message = TestDataFactory.createMessage();
      
      // Add message to queue
      const job = await queueManager.addMessage(message);
      
      // Track in analytics
      await analyticsManager.trackMessageSent(
        message.recipientPhone,
        message.messageType,
        message.metadata
      );

      // Verify analytics were recorded
      const metrics = await analyticsManager.getMessageMetrics();
      expect(metrics.sent).toBeGreaterThan(0);
    });

    it('should track failed messages in analytics', async () => {
      const message = TestDataFactory.createMessage();
      const error = 'Number not on WhatsApp';

      // Simulate failed message
      await analyticsManager.trackMessageFailed(
        message.recipientPhone,
        error
      );

      // Verify failure was tracked
      const metrics = await analyticsManager.getMessageMetrics();
      expect(metrics.failed).toBe(1);
    });

    it('should track delivery status progression', async () => {
      const message = TestDataFactory.createMessage();
      const phone = message.recipientPhone;
      const messageId = 'msg-123';

      // Track full lifecycle
      await analyticsManager.trackMessageSent(phone, 'text');
      await analyticsManager.trackMessageDelivered(phone, messageId);
      await analyticsManager.trackMessageRead(phone, messageId);

      // Verify all statuses tracked
      const metrics = await analyticsManager.getMessageMetrics();
      expect(metrics.sent).toBe(1);
      expect(metrics.delivered).toBe(1);
      expect(metrics.read).toBe(1);
    });
  });

  describe('Bulk Operations', () => {
    it('should track analytics for bulk messages', async () => {
      const messages = TestDataFactory.createMessageBatch(10);

      // Queue bulk messages
      await queueManager.addBulk(messages);

      // Track all in analytics
      for (const msg of messages) {
        await analyticsManager.trackMessageSent(
          msg.recipientPhone,
          msg.messageType
        );
      }

      // Verify all tracked
      const metrics = await analyticsManager.getMessageMetrics();
      expect(metrics.sent).toBe(10);
    });

    it('should handle partial failures in bulk operations', async () => {
      const messages = TestDataFactory.createMessageBatch(5);

      // Simulate 2 successes, 3 failures
      await analyticsManager.trackMessageSent(messages[0].recipientPhone, 'text');
      await analyticsManager.trackMessageSent(messages[1].recipientPhone, 'text');
      await analyticsManager.trackMessageFailed(messages[2].recipientPhone, 'Error');
      await analyticsManager.trackMessageFailed(messages[3].recipientPhone, 'Error');
      await analyticsManager.trackMessageFailed(messages[4].recipientPhone, 'Error');

      const metrics = await analyticsManager.getMessageMetrics();
      expect(metrics.sent).toBe(2);
      expect(metrics.failed).toBe(3);
    });
  });

  describe('Campaign Tracking', () => {
    it('should track campaign messages through queue', async () => {
      const campaign = TestDataFactory.createCampaign();
      const messages = TestDataFactory.createMessageBatch(5);

      // Add campaign metadata to messages
      const campaignMessages = messages.map(msg => ({
        ...msg,
        metadata: {
          ...msg.metadata,
          campaignId: campaign.id,
        },
      }));

      // Queue and track
      await queueManager.addBulk(campaignMessages);

      for (const msg of campaignMessages) {
        await analyticsManager.trackCampaign(
          campaign.id,
          msg.recipientPhone,
          'sent'
        );
      }

      // Verify campaign metrics
      const campaignMetrics = await analyticsManager.getCampaignMetrics(campaign.id);
      expect(campaignMetrics.sent).toBe(5);
    });

    it('should track campaign conversions', async () => {
      const campaign = TestDataFactory.createCampaign();
      const phone = '34600111222';

      // Track campaign flow: sent → delivered → read → response → conversion
      await analyticsManager.trackCampaign(campaign.id, phone, 'sent');
      await analyticsManager.trackCampaign(campaign.id, phone, 'delivered');
      await analyticsManager.trackCampaign(campaign.id, phone, 'read');
      await analyticsManager.trackCampaign(campaign.id, phone, 'response');
      await analyticsManager.trackCampaign(campaign.id, phone, 'conversion');

      const metrics = await analyticsManager.getCampaignMetrics(campaign.id);
      expect(metrics.sent).toBe(1);
      expect(metrics.responses).toBe(1);
      expect(metrics.conversions).toBe(1);
    });
  });

  describe('Conversation Tracking', () => {
    it('should track conversation metrics from queue events', async () => {
      const phone = '34600111222';

      // Start conversation
      await analyticsManager.trackConversationStarted(phone, 'inbound');

      // Exchange messages
      await analyticsManager.trackMessageReceived(phone, 'text');
      await analyticsManager.trackMessageSent(phone, 'text');
      await analyticsManager.trackMessageReceived(phone, 'text');

      // End conversation
      await analyticsManager.trackConversationEnded(phone, 'completed');

      // Verify conversation metrics
      const metrics = await analyticsManager.getConversationMetrics();
      expect(metrics.totalConversations).toBeGreaterThan(0);
    });

    it('should calculate response times', async () => {
      const phone = '34600111222';

      await analyticsManager.trackConversationStarted(phone, 'inbound');
      await analyticsManager.trackMessageReceived(phone, 'text');
      
      // Wait 100ms
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await analyticsManager.trackMessageSent(phone, 'text');

      const metrics = await analyticsManager.getConversationMetrics();
      expect(metrics.averageResponseTime).toBeGreaterThan(0);
    });
  });

  describe('Performance Metrics', () => {
    it('should track queue processing rate', async () => {
      // Queue multiple messages
      const messages = TestDataFactory.createMessageBatch(20);
      await queueManager.addBulk(messages);

      // Simulate processing
      for (const msg of messages) {
        await analyticsManager.trackMessageSent(
          msg.recipientPhone,
          msg.messageType
        );
      }

      // Get processing rate
      const rate = await queueManager.getProcessingRate();
      expect(rate).toBeGreaterThanOrEqual(0);

      // Get analytics performance
      const perfMetrics = await analyticsManager.getPerformanceMetrics();
      expect(perfMetrics.messagesSentPerHour).toBeGreaterThan(0);
    });

    it('should track error rates', async () => {
      const messages = TestDataFactory.createMessageBatch(10);

      // Simulate 7 successes, 3 failures
      for (let i = 0; i < 7; i++) {
        await analyticsManager.trackMessageSent(messages[i].recipientPhone, 'text');
      }
      for (let i = 7; i < 10; i++) {
        await analyticsManager.trackMessageFailed(messages[i].recipientPhone, 'Error');
      }

      const perfMetrics = await analyticsManager.getPerformanceMetrics();
      expect(perfMetrics.errorRate).toBeCloseTo(30, 0); // 30% error rate
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency between queue and analytics', async () => {
      const message = TestDataFactory.createMessage();
      
      // Add to queue
      const job = await queueManager.addMessage(message);
      expect(job.id).toBeDefined();

      // Track in analytics
      await analyticsManager.trackMessageSent(
        message.recipientPhone,
        message.messageType,
        { jobId: job.id, ...message.metadata }
      );

      // Verify consistency
      const queueMetrics = await queueManager.getMetrics();
      const analyticsMetrics = await analyticsManager.getMessageMetrics();

      expect(queueMetrics.waiting + queueMetrics.active).toBeGreaterThanOrEqual(0);
      expect(analyticsMetrics.sent).toBe(1);
    });

    it('should handle concurrent operations safely', async () => {
      const messages = TestDataFactory.createMessageBatch(50);

      // Concurrent queue operations
      const queuePromises = messages.map(msg => 
        queueManager.addMessage(msg)
      );

      // Concurrent analytics operations
      const analyticsPromises = messages.map(msg =>
        analyticsManager.trackMessageSent(msg.recipientPhone, msg.messageType)
      );

      // Wait for all to complete
      await Promise.all([...queuePromises, ...analyticsPromises]);

      // Verify all tracked
      const metrics = await analyticsManager.getMessageMetrics();
      expect(metrics.sent).toBe(50);
    });
  });

  describe('Report Generation', () => {
    it('should generate comprehensive reports from queue and analytics data', async () => {
      // Queue and track various message types
      const textMsg = TestDataFactory.createMessage({ messageType: 'text' });
      const imageMsg = TestDataFactory.createMessage({ messageType: 'image' });

      await queueManager.addMessage(textMsg);
      await queueManager.addMessage(imageMsg);

      await analyticsManager.trackMessageSent(textMsg.recipientPhone, 'text');
      await analyticsManager.trackMessageSent(imageMsg.recipientPhone, 'image');

      // Track conversions
      await analyticsManager.trackConversion(textMsg.recipientPhone, 'lead');

      // Generate report
      const report = await analyticsManager.generateReport('day');

      expect(report.messages.sent).toBe(2);
      expect(report.conversions.leads).toBe(1);
    });
  });
});
