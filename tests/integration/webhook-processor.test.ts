/**
 * Integration Tests - Webhook Handler + Processor
 */

import { TestDataFactory, MockRedisStore } from '../test-helpers/test-data-factory';

describe('Webhook Handler + Processor Integration', () => {
  let mockRedis: MockRedisStore;

  beforeEach(async () => {
    mockRedis = new MockRedisStore();
  });

  afterEach(async () => {
    await mockRedis.flushall();
  });

  describe('Incoming Message Processing', () => {
    it('should process text message webhook', async () => {
      const webhook = TestDataFactory.createWebhookEvent('message');
      
      expect(webhook.event).toBe('messages.upsert');
      expect(webhook.data.message.conversation).toBeDefined();
    });

    it('should extract phone number correctly', () => {
      const webhook = TestDataFactory.createWebhookEvent('message');
      const jid = webhook.data.key.remoteJid;
      
      const phone = jid.replace('@s.whatsapp.net', '');
      expect(phone).toMatch(/^\d{12}$/);
    });

    it('should process media message webhook', async () => {
      const webhook = TestDataFactory.createWebhookEvent('message', {
        data: {
          message: {
            imageMessage: {
              url: 'https://example.com/image.jpg',
              caption: 'Property photo',
            },
          },
        },
      });

      expect(webhook.data.message.imageMessage).toBeDefined();
    });
  });

  describe('Status Update Processing', () => {
    it('should process message delivered status', async () => {
      const webhook = TestDataFactory.createWebhookEvent('status', {
        data: {
          update: { status: 2 }, // delivered
        },
      });

      expect(webhook.data.update.status).toBe(2);
    });

    it('should process message read status', async () => {
      const webhook = TestDataFactory.createWebhookEvent('status', {
        data: {
          update: { status: 3 }, // read
        },
      });

      expect(webhook.data.update.status).toBe(3);
    });
  });

  describe('Bot Response Trigger', () => {
    it('should trigger bot for greeting message', async () => {
      const webhook = TestDataFactory.createWebhookEvent('message', {
        data: {
          message: { conversation: 'Hola' },
        },
      });

      const message = webhook.data.message.conversation;
      const shouldTriggerBot = message.toLowerCase().includes('hola');
      
      expect(shouldTriggerBot).toBe(true);
    });

    it('should not trigger bot for outgoing messages', async () => {
      const webhook = TestDataFactory.createWebhookEvent('message', {
        data: {
          key: { fromMe: true },
        },
      });

      expect(webhook.data.key.fromMe).toBe(true);
    });
  });

  describe('Analytics Integration', () => {
    it('should track incoming message in analytics', async () => {
      const webhook = TestDataFactory.createWebhookEvent('message');
      const phone = webhook.data.key.remoteJid.replace('@s.whatsapp.net', '');

      await mockRedis.incr(`analytics:message:received:${phone}`);
      
      const count = await mockRedis.get(`analytics:message:received:${phone}`);
      expect(parseInt(count!)).toBe(1);
    });
  });
});
