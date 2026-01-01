/**
 * Unit Tests - WhatsApp Queue Manager
 */

import { Queue, Worker } from 'bullmq';
import { WhatsAppQueueManager, createQueueManager } from '../../lib/whatsapp-queue';
import { createTestMessage } from '../setup-tests';

// Mock BullMQ
jest.mock('bullmq');
jest.mock('ioredis');

describe('WhatsAppQueueManager', () => {
  let queueManager: WhatsAppQueueManager;
  let mockQueue: jest.Mocked<Queue>;
  let mockWorker: jest.Mocked<Worker>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock Queue
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-123' }),
      addBulk: jest.fn().mockResolvedValue([{ id: 'job-1' }, { id: 'job-2' }]),
      getJobs: jest.fn().mockResolvedValue([]),
      getJob: jest.fn().mockResolvedValue(null),
      pause: jest.fn().mockResolvedValue(undefined),
      resume: jest.fn().mockResolvedValue(undefined),
      drain: jest.fn().mockResolvedValue(undefined),
      clean: jest.fn().mockResolvedValue([]),
      getWaitingCount: jest.fn().mockResolvedValue(0),
      getActiveCount: jest.fn().mockResolvedValue(0),
      getCompletedCount: jest.fn().mockResolvedValue(0),
      getFailedCount: jest.fn().mockResolvedValue(0),
      getDelayedCount: jest.fn().mockResolvedValue(0),
      isPaused: jest.fn().mockResolvedValue(false),
      close: jest.fn().mockResolvedValue(undefined),
    } as any;

    // Mock Worker
    mockWorker = {
      on: jest.fn().mockReturnThis(),
      close: jest.fn().mockResolvedValue(undefined),
    } as any;

    (Queue as jest.MockedClass<typeof Queue>).mockImplementation(() => mockQueue);
    (Worker as jest.MockedClass<typeof Worker>).mockImplementation(() => mockWorker);

    queueManager = createQueueManager();
  });

  afterEach(async () => {
    await queueManager.close();
  });

  describe('addMessage', () => {
    it('should add message to queue successfully', async () => {
      const message = createTestMessage();
      const job = await queueManager.addMessage(message);

      expect(job).toBeDefined();
      expect(job.id).toBe('job-123');
      expect(mockQueue.add).toHaveBeenCalledWith(
        'whatsapp-message',
        message,
        expect.objectContaining({
          priority: 3, // normal priority
        })
      );
    });

    it('should set correct priority for critical messages', async () => {
      const message = createTestMessage({
        metadata: { priority: 'critical' },
      });

      await queueManager.addMessage(message);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'whatsapp-message',
        message,
        expect.objectContaining({
          priority: 1, // critical priority
        })
      );
    });

    it('should set correct priority for high messages', async () => {
      const message = createTestMessage({
        metadata: { priority: 'high' },
      });

      await queueManager.addMessage(message);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'whatsapp-message',
        message,
        expect.objectContaining({
          priority: 2,
        })
      );
    });

    it('should set correct priority for low messages', async () => {
      const message = createTestMessage({
        metadata: { priority: 'low' },
      });

      await queueManager.addMessage(message);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'whatsapp-message',
        message,
        expect.objectContaining({
          priority: 4,
        })
      );
    });

    it('should include metadata in job options', async () => {
      const message = createTestMessage({
        metadata: {
          contactId: 'contact-123',
          campaignId: 'campaign-456',
        },
      });

      await queueManager.addMessage(message);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'whatsapp-message',
        expect.objectContaining({
          metadata: expect.objectContaining({
            contactId: 'contact-123',
            campaignId: 'campaign-456',
          }),
        }),
        expect.any(Object)
      );
    });
  });

  describe('addBulk', () => {
    it('should add multiple messages to queue', async () => {
      const messages = [
        createTestMessage({ recipientPhone: '34600111222' }),
        createTestMessage({ recipientPhone: '34600222333' }),
      ];

      const jobs = await queueManager.addBulk(messages);

      expect(jobs).toHaveLength(2);
      expect(mockQueue.addBulk).toHaveBeenCalledWith(
        messages.map((msg) => ({
          name: 'whatsapp-message',
          data: msg,
          opts: expect.objectContaining({
            priority: 3,
          }),
        }))
      );
    });

    it('should handle empty array', async () => {
      const jobs = await queueManager.addBulk([]);

      expect(jobs).toHaveLength(0);
      expect(mockQueue.addBulk).not.toHaveBeenCalled();
    });

    it('should respect individual message priorities in bulk', async () => {
      const messages = [
        createTestMessage({ metadata: { priority: 'critical' } }),
        createTestMessage({ metadata: { priority: 'low' } }),
      ];

      await queueManager.addBulk(messages);

      expect(mockQueue.addBulk).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            opts: expect.objectContaining({ priority: 1 }),
          }),
          expect.objectContaining({
            opts: expect.objectContaining({ priority: 4 }),
          }),
        ])
      );
    });
  });

  describe('scheduleMessage', () => {
    it('should schedule message for future delivery', async () => {
      const message = createTestMessage();
      const scheduledTime = new Date(Date.now() + 3600000); // 1 hour from now

      await queueManager.scheduleMessage(message, scheduledTime);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'whatsapp-message',
        message,
        expect.objectContaining({
          delay: expect.any(Number),
        })
      );
    });

    it('should not schedule message in the past', async () => {
      const message = createTestMessage();
      const pastTime = new Date(Date.now() - 3600000); // 1 hour ago

      await expect(
        queueManager.scheduleMessage(message, pastTime)
      ).rejects.toThrow();
    });
  });

  describe('getMetrics', () => {
    it('should return queue metrics', async () => {
      mockQueue.getWaitingCount.mockResolvedValue(5);
      mockQueue.getActiveCount.mockResolvedValue(2);
      mockQueue.getCompletedCount.mockResolvedValue(100);
      mockQueue.getFailedCount.mockResolvedValue(3);
      mockQueue.getDelayedCount.mockResolvedValue(1);
      mockQueue.isPaused.mockResolvedValue(false);

      const metrics = await queueManager.getMetrics();

      expect(metrics).toEqual({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
        paused: 0,
      });
    });

    it('should return paused status correctly', async () => {
      mockQueue.isPaused.mockResolvedValue(true);

      const metrics = await queueManager.getMetrics();

      expect(metrics.paused).toBe(1);
    });
  });

  describe('getProcessingRate', () => {
    it('should calculate processing rate', async () => {
      mockQueue.getCompletedCount.mockResolvedValue(80);

      const rate = await queueManager.getProcessingRate();

      expect(rate).toBeGreaterThanOrEqual(0);
      expect(typeof rate).toBe('number');
    });
  });

  describe('pause and resume', () => {
    it('should pause the queue', async () => {
      await queueManager.pause();

      expect(mockQueue.pause).toHaveBeenCalled();
    });

    it('should resume the queue', async () => {
      await queueManager.resume();

      expect(mockQueue.resume).toHaveBeenCalled();
    });
  });

  describe('drain', () => {
    it('should drain the queue', async () => {
      await queueManager.drain();

      expect(mockQueue.drain).toHaveBeenCalled();
    });
  });

  describe('clean', () => {
    it('should clean old jobs', async () => {
      const grace = 3600000; // 1 hour
      const limit = 1000;

      await queueManager.clean(grace, limit);

      expect(mockQueue.clean).toHaveBeenCalledWith(grace, limit, 'completed');
      expect(mockQueue.clean).toHaveBeenCalledWith(grace, limit, 'failed');
    });
  });

  describe('getJobs', () => {
    it('should get jobs by state', async () => {
      const mockJobs = [
        { id: 'job-1', data: createTestMessage() },
        { id: 'job-2', data: createTestMessage() },
      ];
      mockQueue.getJobs.mockResolvedValue(mockJobs as any);

      const jobs = await queueManager.getJobs('waiting', 0, 10);

      expect(jobs).toEqual(mockJobs);
      expect(mockQueue.getJobs).toHaveBeenCalledWith('waiting', 0, 10);
    });
  });

  describe('getJob', () => {
    it('should get job by id', async () => {
      const mockJob = { id: 'job-123', data: createTestMessage() };
      mockQueue.getJob.mockResolvedValue(mockJob as any);

      const job = await queueManager.getJob('job-123');

      expect(job).toEqual(mockJob);
      expect(mockQueue.getJob).toHaveBeenCalledWith('job-123');
    });

    it('should return null for non-existent job', async () => {
      mockQueue.getJob.mockResolvedValue(null);

      const job = await queueManager.getJob('non-existent');

      expect(job).toBeNull();
    });
  });

  describe('close', () => {
    it('should close queue and worker connections', async () => {
      await queueManager.close();

      expect(mockQueue.close).toHaveBeenCalled();
      expect(mockWorker.close).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle queue errors gracefully', async () => {
      mockQueue.add.mockRejectedValue(new Error('Queue error'));

      await expect(
        queueManager.addMessage(createTestMessage())
      ).rejects.toThrow('Queue error');
    });

    it('should handle metrics errors', async () => {
      mockQueue.getWaitingCount.mockRejectedValue(new Error('Redis error'));

      await expect(queueManager.getMetrics()).rejects.toThrow('Redis error');
    });
  });
});

describe('createQueueManager', () => {
  it('should create queue manager with default config', () => {
    const manager = createQueueManager();

    expect(manager).toBeInstanceOf(WhatsAppQueueManager);
  });

  it('should create queue manager with custom config', () => {
    const config = {
      redis: {
        host: 'custom-host',
        port: 6380,
      },
      rateLimiting: {
        max: 100,
        duration: 30000,
      },
    };

    const manager = createQueueManager(config);

    expect(manager).toBeInstanceOf(WhatsAppQueueManager);
  });
});
