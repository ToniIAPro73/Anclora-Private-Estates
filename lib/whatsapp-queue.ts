/**
 * WhatsApp Queue Management System
 * 
 * Gestión avanzada de colas de mensajes WhatsApp usando BullMQ + Redis
 * - Procesamiento asíncrono de mensajes
 * - Rate limiting avanzado (80 msg/min WhatsApp oficial)
 * - Retry logic con backoff exponencial
 * - Priorización de mensajes
 * - Dead letter queue para mensajes fallidos
 * - Métricas y monitoreo
 * 
 * @requires bullmq ^4.0.0
 * @requires ioredis ^5.0.0
 */

import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import Redis from 'ioredis';
import { WhatsAppAPI } from './whatsapp-api';

// ============================================
// INTERFACES Y TIPOS
// ============================================

export interface WhatsAppMessage {
  instanceName: string;
  recipientPhone: string;
  messageType: 'text' | 'media' | 'template' | 'interactive';
  content: {
    text?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'audio' | 'document';
    caption?: string;
    template?: string;
    variables?: Record<string, string>;
    buttons?: Array<{ id: string; text: string }>;
  };
  metadata?: {
    contactId?: string;
    campaignId?: string;
    flowId?: string;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    scheduledFor?: Date;
  };
}

export interface QueueMetrics {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
}

export interface JobResult {
  success: boolean;
  messageId?: string;
  sentAt?: Date;
  error?: string;
  attempts?: number;
}

export interface QueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  rateLimiting: {
    max: number;
    duration: number;
  };
  retry: {
    attempts: number;
    backoff: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
  };
  concurrency: number;
}

// ============================================
// CONFIGURACIÓN
// ============================================

const DEFAULT_CONFIG: QueueConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
  },
  rateLimiting: {
    max: 80,
    duration: 60 * 1000,
  },
  retry: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
  concurrency: 5,
};

// ============================================
// WHATSAPP QUEUE MANAGER
// ============================================

export class WhatsAppQueueManager {
  private queue: Queue;
  private worker: Worker;
  private queueEvents: QueueEvents;
  private redis: Redis;
  private whatsappApi: WhatsAppAPI;
  private config: QueueConfig;

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    this.redis = new Redis({
      host: this.config.redis.host,
      port: this.config.redis.port,
      password: this.config.redis.password,
      db: this.config.redis.db,
      maxRetriesPerRequest: null,
    });

    this.whatsappApi = new WhatsAppAPI({
      baseURL: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
      apiKey: process.env.EVOLUTION_API_KEY || '',
    });

    this.queue = new Queue('whatsapp-messages', {
      connection: this.redis,
      defaultJobOptions: {
        attempts: this.config.retry.attempts,
        backoff: {
          type: this.config.retry.backoff.type,
          delay: this.config.retry.backoff.delay,
        },
        removeOnComplete: {
          count: 1000,
          age: 24 * 3600,
        },
        removeOnFail: {
          count: 5000,
        },
      },
    });

    this.worker = new Worker(
      'whatsapp-messages',
      async (job: Job<WhatsAppMessage>) => this.processMessage(job),
      {
        connection: this.redis,
        concurrency: this.config.concurrency,
        limiter: {
          max: this.config.rateLimiting.max,
          duration: this.config.rateLimiting.duration,
        },
      }
    );

    this.queueEvents = new QueueEvents('whatsapp-messages', {
      connection: this.redis,
    });

    this.setupEventListeners();
  }

  async addMessage(
    message: WhatsAppMessage,
    options: { priority?: number; delay?: number; jobId?: string } = {}
  ): Promise<Job<WhatsAppMessage>> {
    const priority = this.getPriorityValue(message.metadata?.priority || 'normal');

    const job = await this.queue.add('send-message', message, {
      priority,
      delay: options.delay,
      jobId: options.jobId,
    });

    console.warn(`[Queue] Message added: ${job.id} (Priority: ${priority})`);
    return job;
  }

  async addBulk(messages: WhatsAppMessage[]): Promise<Job<WhatsAppMessage>[]> {
    const jobs = messages.map((message, index) => ({
      name: 'send-message',
      data: message,
      opts: {
        priority: this.getPriorityValue(message.metadata?.priority || 'normal'),
        jobId: `bulk-${Date.now()}-${index}`,
      },
    }));

    const addedJobs = await this.queue.addBulk(jobs);
    console.warn(`[Queue] Bulk added: ${addedJobs.length} messages`);
    return addedJobs;
  }

  async scheduleMessage(
    message: WhatsAppMessage,
    scheduledFor: Date
  ): Promise<Job<WhatsAppMessage>> {
    const delay = scheduledFor.getTime() - Date.now();
    
    if (delay <= 0) {
      throw new Error('Scheduled time must be in the future');
    }

    return this.addMessage(message, { delay });
  }

  private async processMessage(job: Job<WhatsAppMessage>): Promise<JobResult> {
    const { instanceName, recipientPhone, messageType, content } = job.data;

    try {
      console.warn(`[Worker] Processing job ${job.id} (Attempt ${job.attemptsMade + 1}/${this.config.retry.attempts})`);

      let result;

      switch (messageType) {
        case 'text':
          result = await this.whatsappApi.sendTextMessage(
            instanceName,
            recipientPhone,
            content.text || ''
          );
          break;

        case 'media':
          if (!content.mediaUrl || !content.mediaType) {
            throw new Error('Media URL and type are required');
          }
          result = await this.whatsappApi.sendMediaMessage(
            instanceName,
            recipientPhone,
            content.mediaType,
            content.mediaUrl,
            content.caption
          );
          break;

        default:
          throw new Error(`Unknown message type: ${messageType}`);
      }

      await job.updateProgress(100);

      const jobResult: JobResult = {
        success: true,
        messageId: result.key?.id,
        sentAt: new Date(),
        attempts: job.attemptsMade + 1,
      };

      console.warn(`[Worker] Job ${job.id} completed successfully`);
      return jobResult;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Worker] Job ${job.id} failed:`, errorMessage);

      if (job.attemptsMade + 1 >= this.config.retry.attempts) {
        await this.moveToDLQ(job, errorMessage);
      }

      throw error;
    }
  }

  private async moveToDLQ(job: Job<WhatsAppMessage>, error: string): Promise<void> {
    const dlqKey = 'whatsapp:dlq';
    
    const dlqEntry = {
      jobId: job.id,
      data: job.data,
      error,
      failedAt: new Date().toISOString(),
      attempts: job.attemptsMade,
    };

    await this.redis.lpush(dlqKey, JSON.stringify(dlqEntry));
    console.warn(`[DLQ] Job ${job.id} moved to Dead Letter Queue`);
  }

  async getDLQMessages(limit: number = 100): Promise<Array<Record<string, unknown>>> {
    const dlqKey = 'whatsapp:dlq';
    const messages = await this.redis.lrange(dlqKey, 0, limit - 1);
    return messages.map(msg => JSON.parse(msg));
  }

  async retryDLQMessage(jobId: string): Promise<Job<WhatsAppMessage> | null> {
    const dlqKey = 'whatsapp:dlq';
    const messages = await this.redis.lrange(dlqKey, 0, -1);
    
    for (let i = 0; i < messages.length; i++) {
      const entry = JSON.parse(messages[i]);
      
      if (entry.jobId === jobId) {
        await this.redis.lrem(dlqKey, 1, messages[i]);
        return this.addMessage(entry.data, { jobId: `retry-${jobId}` });
      }
    }
    
    return null;
  }

  async clearDLQ(): Promise<void> {
    await this.redis.del('whatsapp:dlq');
    console.warn('[DLQ] Cleared');
  }

  async pause(): Promise<void> {
    await this.queue.pause();
    console.warn('[Queue] Paused');
  }

  async resume(): Promise<void> {
    await this.queue.resume();
    console.warn('[Queue] Resumed');
  }

  async drain(): Promise<void> {
    await this.queue.drain();
    console.warn('[Queue] Drained');
  }

  async clean(grace: number = 0, limit: number = 1000): Promise<void> {
    await this.queue.clean(grace, limit, 'completed');
    await this.queue.clean(grace, limit, 'failed');
    console.warn('[Queue] Cleaned');
  }

  async getMetrics(): Promise<QueueMetrics> {
    const counts = await this.queue.getJobCounts();
    
    return {
      waiting: counts.waiting || 0,
      active: counts.active || 0,
      completed: counts.completed || 0,
      failed: counts.failed || 0,
      delayed: counts.delayed || 0,
      paused: counts.paused || 0,
    };
  }

  async getJobs(
    state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed',
    start: number = 0,
    end: number = 10
  ): Promise<Job[]> {
    return this.queue.getJobs([state], start, end);
  }

  async getJob(jobId: string): Promise<Job | undefined> {
    return this.queue.getJob(jobId);
  }

  async getProcessingRate(): Promise<number> {
    const counts = await this.queue.getJobCounts();
    const completedKey = 'whatsapp:completed:1min';
    
    const completed = counts.completed || 0;
    const previousCompleted = parseInt(await this.redis.get(completedKey) || '0');
    
    await this.redis.setex(completedKey, 60, completed.toString());
    
    return completed - previousCompleted;
  }

  private setupEventListeners(): void {
    this.queueEvents.on('completed', ({ jobId, returnvalue }) => {
      console.warn(`[Event] Job ${jobId} completed:`, returnvalue);
    });

    this.queueEvents.on('failed', ({ jobId, failedReason }) => {
      console.error(`[Event] Job ${jobId} failed:`, failedReason);
    });

    this.worker.on('error', (error) => {
      console.error('[Worker] Error:', error);
    });

    this.worker.on('active', (job) => {
      console.warn(`[Worker] Processing job ${job.id}`);
    });

    this.queueEvents.on('stalled', ({ jobId }) => {
      console.warn(`[Event] Job ${jobId} stalled`);
    });

    this.queueEvents.on('progress', ({ jobId, data }) => {
      console.warn(`[Event] Job ${jobId} progress:`, data);
    });
  }

  private getPriorityValue(priority: string): number {
    const priorities: Record<string, number> = {
      critical: 1,
      high: 2,
      normal: 3,
      low: 4,
    };
    return priorities[priority] || priorities.normal;
  }

  async close(): Promise<void> {
    await this.worker.close();
    await this.queue.close();
    await this.queueEvents.close();
    await this.redis.quit();
    console.warn('[Queue] Closed');
  }
}

export function createQueueManager(config?: Partial<QueueConfig>): WhatsAppQueueManager {
  return new WhatsAppQueueManager(config);
}

let queueManagerInstance: WhatsAppQueueManager | null = null;

export function getQueueManager(config?: Partial<QueueConfig>): WhatsAppQueueManager {
  if (!queueManagerInstance) {
    queueManagerInstance = new WhatsAppQueueManager(config);
  }
  return queueManagerInstance;
}

export default WhatsAppQueueManager;
