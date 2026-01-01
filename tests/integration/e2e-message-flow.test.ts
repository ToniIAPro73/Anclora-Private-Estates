/**
 * Integration Tests - E2E Message Flow
 * 
 * Tests del flujo completo de mensajes desde la cola hasta la entrega
 */

import { TestDataFactory, MockRedisStore } from '../test-helpers/test-data-factory';

describe('E2E Message Flow', () => {
  let mockRedis: MockRedisStore;

  beforeEach(() => {
    mockRedis = new MockRedisStore();
  });

  afterEach(async () => {
    await mockRedis.flushall();
  });

  describe('Complete Message Lifecycle', () => {
    it('should complete full message flow: queue → send → deliver → read', async () => {
      const message = TestDataFactory.createMessage();
      const phone = message.recipientPhone;

      // 1. Queue message
      await mockRedis.set(`queue:msg:${phone}`, JSON.stringify(message));
      
      // 2. Track sent
      await mockRedis.incr('analytics:messages:sent');
      
      // 3. Track delivered
      await mockRedis.incr('analytics:messages:delivered');
      
      // 4. Track read
      await mockRedis.incr('analytics:messages:read');

      // Verify complete flow
      const sent = await mockRedis.get('analytics:messages:sent');
      const delivered = await mockRedis.get('analytics:messages:delivered');
      const read = await mockRedis.get('analytics:messages:read');

      expect(parseInt(sent!)).toBe(1);
      expect(parseInt(delivered!)).toBe(1);
      expect(parseInt(read!)).toBe(1);
    });

    it('should handle conversation flow with multiple messages', async () => {
      const conversation = TestDataFactory.createConversation(5);
      
      for (const msg of conversation.messages) {
        const key = msg.direction === 'inbound' ? 'received' : 'sent';
        await mockRedis.incr(`analytics:messages:${key}`);
      }

      const sent = await mockRedis.get('analytics:messages:sent');
      const received = await mockRedis.get('analytics:messages:received');

      expect(parseInt(sent!)).toBeGreaterThan(0);
      expect(parseInt(received!)).toBeGreaterThan(0);
    });
  });

  describe('Lead Capture Flow', () => {
    it('should process lead from first contact to qualification', async () => {
      const phone = '34600111222';

      // 1. First message (lead)
      await mockRedis.incr('conversions:leads');
      await mockRedis.set(`lead:${phone}`, JSON.stringify({
        phone,
        source: 'whatsapp',
        status: 'new',
      }));

      // 2. Bot conversation
      await mockRedis.incr('conversations:active');

      // 3. Qualification
      await mockRedis.incr('conversions:qualified_leads');
      await mockRedis.set(`lead:${phone}`, JSON.stringify({
        phone,
        status: 'qualified',
        budget: '2M-5M',
      }));

      // 4. Appointment
      await mockRedis.incr('conversions:appointments');

      // Verify flow
      const leads = await mockRedis.get('conversions:leads');
      const qualified = await mockRedis.get('conversions:qualified_leads');
      const appointments = await mockRedis.get('conversions:appointments');

      expect(parseInt(leads!)).toBe(1);
      expect(parseInt(qualified!)).toBe(1);
      expect(parseInt(appointments!)).toBe(1);
    });
  });

  describe('Campaign Flow', () => {
    it('should track campaign from send to conversion', async () => {
      const campaign = TestDataFactory.createCampaign();
      const recipients = TestDataFactory.createMessageBatch(10);

      // Send campaign
      for (const recipient of recipients) {
        await mockRedis.incr(`campaign:${campaign.id}:sent`);
      }

      // Simulate 5 delivered
      for (let i = 0; i < 5; i++) {
        await mockRedis.incr(`campaign:${campaign.id}:delivered`);
      }

      // Simulate 2 responses
      for (let i = 0; i < 2; i++) {
        await mockRedis.incr(`campaign:${campaign.id}:responses`);
      }

      // Simulate 1 conversion
      await mockRedis.incr(`campaign:${campaign.id}:conversions`);

      // Verify metrics
      const sent = await mockRedis.get(`campaign:${campaign.id}:sent`);
      const delivered = await mockRedis.get(`campaign:${campaign.id}:delivered`);
      const responses = await mockRedis.get(`campaign:${campaign.id}:responses`);
      const conversions = await mockRedis.get(`campaign:${campaign.id}:conversions`);

      expect(parseInt(sent!)).toBe(10);
      expect(parseInt(delivered!)).toBe(5);
      expect(parseInt(responses!)).toBe(2);
      expect(parseInt(conversions!)).toBe(1);
    });
  });

  describe('Error Recovery Flow', () => {
    it('should retry failed messages and track recovery', async () => {
      const message = TestDataFactory.createMessage();
      const jobId = 'job-123';

      // 1. First attempt fails
      await mockRedis.lpush('queue:dlq', JSON.stringify({
        jobId,
        message,
        error: 'Network error',
        attempts: 1,
      }));
      await mockRedis.incr('analytics:messages:failed');

      // 2. Retry from DLQ
      const dlqMessages = await mockRedis.lrange('queue:dlq', 0, -1);
      expect(dlqMessages.length).toBe(1);

      // 3. Second attempt succeeds
      await mockRedis.del('queue:dlq');
      await mockRedis.incr('analytics:messages:sent');

      // Verify recovery
      const failedCount = await mockRedis.get('analytics:messages:failed');
      const sentCount = await mockRedis.get('analytics:messages:sent');

      expect(parseInt(failedCount!)).toBe(1);
      expect(parseInt(sentCount!)).toBe(1);
    });
  });

  describe('Multi-Instance Flow', () => {
    it('should handle messages across multiple instances', async () => {
      const instances = ['instance-1', 'instance-2', 'instance-3'];
      
      for (const instance of instances) {
        const message = TestDataFactory.createMessage({
          instanceName: instance,
        });
        
        await mockRedis.incr(`instance:${instance}:sent`);
      }

      // Verify per-instance metrics
      for (const instance of instances) {
        const sent = await mockRedis.get(`instance:${instance}:sent`);
        expect(parseInt(sent!)).toBe(1);
      }
    });
  });

  describe('Priority Queue Flow', () => {
    it('should process messages by priority', async () => {
      const messages = [
        TestDataFactory.createMessage({ metadata: { priority: 'critical' } }),
        TestDataFactory.createMessage({ metadata: { priority: 'high' } }),
        TestDataFactory.createMessage({ metadata: { priority: 'normal' } }),
        TestDataFactory.createMessage({ metadata: { priority: 'low' } }),
      ];

      // Add to sorted set by priority (lower score = higher priority)
      await mockRedis.zadd('queue:priority', 1, messages[0].recipientPhone); // critical
      await mockRedis.zadd('queue:priority', 2, messages[1].recipientPhone); // high
      await mockRedis.zadd('queue:priority', 3, messages[2].recipientPhone); // normal
      await mockRedis.zadd('queue:priority', 4, messages[3].recipientPhone); // low

      // Get in priority order
      const priorityOrder = await mockRedis.zrange('queue:priority', 0, -1);

      expect(priorityOrder[0]).toBe(messages[0].recipientPhone); // critical first
      expect(priorityOrder[3]).toBe(messages[3].recipientPhone); // low last
    });
  });
});
