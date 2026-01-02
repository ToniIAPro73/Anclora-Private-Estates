/**
 * WhatsApp Analytics System
 * 
 * Sistema completo de métricas y analytics para WhatsApp
 * - Tracking de mensajes (enviados/recibidos/fallidos/leídos)
 * - Métricas de conversación (tasa respuesta, tiempo respuesta, handoffs)
 * - Analytics de conversión (leads, citas, ventas, ROI)
 * - Métricas de campañas
 * - Reportes y time series
 * - Integración con Redis para tiempo real
 * 
 * @requires ioredis ^5.0.0
 */

import Redis from 'ioredis';

// ============================================
// INTERFACES
// ============================================

export interface MessageMetrics {
  sent: number;
  received: number;
  failed: number;
  delivered: number;
  read: number;
}

export interface ConversationMetrics {
  activeConversations: number;
  totalConversations: number;
  averageResponseTime: number;
  responseRate: number;
  handoffRate: number;
}

export interface ConversionMetrics {
  leads: number;
  qualifiedLeads: number;
  appointments: number;
  sales: number;
  conversionRate: number;
}

export interface PerformanceMetrics {
  messagesSentPerHour: number;
  messagesReceivedPerHour: number;
  averageProcessingTime: number;
  errorRate: number;
}

export interface CampaignMetrics {
  campaignId: string;
  sent: number;
  delivered: number;
  read: number;
  responses: number;
  conversions: number;
  roi: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface AnalyticsReport {
  period: 'day' | 'week' | 'month';
  startDate: Date;
  endDate: Date;
  messages: MessageMetrics;
  conversations: ConversationMetrics;
  conversions: ConversionMetrics;
  performance: PerformanceMetrics;
  topConversations: Array<{
    phone: string;
    messageCount: number;
    lastMessage: Date;
  }>;
}

// ============================================
// WHATSAPP ANALYTICS MANAGER
// ============================================

export class WhatsAppAnalyticsManager {
  private redis: Redis;
  private prefix: string = 'analytics:whatsapp';

  constructor(redisConfig?: {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
  }) {
    this.redis = new Redis({
      host: redisConfig?.host || process.env.REDIS_HOST || 'localhost',
      port: redisConfig?.port || parseInt(process.env.REDIS_PORT || '6379'),
      password: redisConfig?.password || process.env.REDIS_PASSWORD,
      db: redisConfig?.db || parseInt(process.env.REDIS_ANALYTICS_DB || '1'),
    });
  }

  // ============================================
  // TRACKING DE EVENTOS
  // ============================================

  async trackMessageSent(
    phone: string,
    messageType: string = 'text',
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const timestamp = Date.now();
    const date = new Date().toISOString().split('T')[0];

    const pipeline = this.redis.pipeline();

    pipeline.incr(`${this.prefix}:messages:sent:total`);
    pipeline.incr(`${this.prefix}:messages:sent:${date}`);
    pipeline.incr(`${this.prefix}:messages:sent:${messageType}:total`);

    pipeline.incr(`${this.prefix}:phone:${phone}:sent`);
    pipeline.zadd(`${this.prefix}:phone:${phone}:timeline`, timestamp, `sent:${timestamp}`);

    pipeline.zadd(`${this.prefix}:timeline:sent`, timestamp, `${phone}:${timestamp}`);

    if (metadata) {
      pipeline.hset(`${this.prefix}:message:${timestamp}`, metadata);
      pipeline.expire(`${this.prefix}:message:${timestamp}`, 30 * 24 * 3600);
    }

    await pipeline.exec();
  }

  async trackMessageReceived(
    phone: string,
    messageType: string = 'text',
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const timestamp = Date.now();
    const date = new Date().toISOString().split('T')[0];

    const pipeline = this.redis.pipeline();

    pipeline.incr(`${this.prefix}:messages:received:total`);
    pipeline.incr(`${this.prefix}:messages:received:${date}`);
    pipeline.incr(`${this.prefix}:messages:received:${messageType}:total`);

    pipeline.incr(`${this.prefix}:phone:${phone}:received`);
    pipeline.zadd(`${this.prefix}:phone:${phone}:timeline`, timestamp, `received:${timestamp}`);

    pipeline.zadd(`${this.prefix}:timeline:received`, timestamp, `${phone}:${timestamp}`);

    if (metadata) {
      pipeline.hset(`${this.prefix}:message:${timestamp}`, metadata);
      pipeline.expire(`${this.prefix}:message:${timestamp}`, 30 * 24 * 3600);
    }

    await pipeline.exec();
    await this.updateResponseTime(phone, timestamp);
  }

  async trackMessageFailed(
    phone: string,
    error: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const timestamp = Date.now();
    const date = new Date().toISOString().split('T')[0];

    const pipeline = this.redis.pipeline();

    pipeline.incr(`${this.prefix}:messages:failed:total`);
    pipeline.incr(`${this.prefix}:messages:failed:${date}`);
    pipeline.incr(`${this.prefix}:phone:${phone}:failed`);

    pipeline.zadd(`${this.prefix}:errors:timeline`, timestamp, `${phone}:${error}:${timestamp}`);

    if (metadata) {
      pipeline.hset(`${this.prefix}:error:${timestamp}`, { ...metadata, error });
      pipeline.expire(`${this.prefix}:error:${timestamp}`, 7 * 24 * 3600);
    }

    await pipeline.exec();
  }

  async trackMessageDelivered(phone: string, _messageId: string): Promise<void> {
    const date = new Date().toISOString().split('T')[0];

    await this.redis.pipeline()
      .incr(`${this.prefix}:messages:delivered:total`)
      .incr(`${this.prefix}:messages:delivered:${date}`)
      .incr(`${this.prefix}:phone:${phone}:delivered`)
      .exec();
  }

  async trackMessageRead(phone: string, _messageId: string): Promise<void> {
    const date = new Date().toISOString().split('T')[0];

    await this.redis.pipeline()
      .incr(`${this.prefix}:messages:read:total`)
      .incr(`${this.prefix}:messages:read:${date}`)
      .incr(`${this.prefix}:phone:${phone}:read`)
      .exec();
  }

  async trackConversationStarted(
    phone: string,
    source: string = 'inbound',
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const timestamp = Date.now();

    const pipeline = this.redis.pipeline();

    pipeline.incr(`${this.prefix}:conversations:total`);
    pipeline.sadd(`${this.prefix}:conversations:active`, phone);
    pipeline.hset(`${this.prefix}:conversation:${phone}`, {
      startedAt: timestamp,
      source,
      lastActivity: timestamp,
      ...metadata,
    });

    await pipeline.exec();
  }

  async trackConversationEnded(
    phone: string,
    reason: string = 'completed'
  ): Promise<void> {
    const timestamp = Date.now();

    const conversation = await this.redis.hgetall(`${this.prefix}:conversation:${phone}`);
    const duration = timestamp - parseInt(conversation.startedAt || '0');

    const pipeline = this.redis.pipeline();

    pipeline.srem(`${this.prefix}:conversations:active`, phone);
    pipeline.hset(`${this.prefix}:conversation:${phone}`, {
      endedAt: timestamp,
      reason,
      duration,
    });
    pipeline.expire(`${this.prefix}:conversation:${phone}`, 7 * 24 * 3600);

    pipeline.lpush(`${this.prefix}:conversations:durations`, duration);
    pipeline.ltrim(`${this.prefix}:conversations:durations`, 0, 999);

    await pipeline.exec();
  }

  async trackHandoff(phone: string, reason: string): Promise<void> {
    const date = new Date().toISOString().split('T')[0];

    await this.redis.pipeline()
      .incr(`${this.prefix}:handoffs:total`)
      .incr(`${this.prefix}:handoffs:${date}`)
      .hset(`${this.prefix}:conversation:${phone}`, 'handoff', reason)
      .exec();
  }

  async trackConversion(
    phone: string,
    type: 'lead' | 'qualified_lead' | 'appointment' | 'sale',
    value?: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const timestamp = Date.now();
    const date = new Date().toISOString().split('T')[0];

    const pipeline = this.redis.pipeline();

    pipeline.incr(`${this.prefix}:conversions:${type}:total`);
    pipeline.incr(`${this.prefix}:conversions:${type}:${date}`);

    if (value) {
      pipeline.incrby(`${this.prefix}:conversions:value:total`, value);
      pipeline.incrby(`${this.prefix}:conversions:value:${date}`, value);
    }

    pipeline.hset(`${this.prefix}:conversion:${phone}:${timestamp}`, {
      type,
      value: value || 0,
      timestamp,
      ...metadata,
    });

    await pipeline.exec();
  }

  async trackCampaign(
    campaignId: string,
    phone: string,
    event: 'sent' | 'delivered' | 'read' | 'response' | 'conversion'
  ): Promise<void> {
    const date = new Date().toISOString().split('T')[0];

    await this.redis.pipeline()
      .incr(`${this.prefix}:campaign:${campaignId}:${event}`)
      .incr(`${this.prefix}:campaign:${campaignId}:${event}:${date}`)
      .sadd(`${this.prefix}:campaign:${campaignId}:recipients`, phone)
      .exec();
  }

  // ============================================
  // MÉTRICAS Y REPORTES
  // ============================================

  async getMessageMetrics(date?: string): Promise<MessageMetrics> {
    const key = date ? `:${date}` : ':total';

    const results = await this.redis.mget(
      `${this.prefix}:messages:sent${key}`,
      `${this.prefix}:messages:received${key}`,
      `${this.prefix}:messages:failed${key}`,
      `${this.prefix}:messages:delivered${key}`,
      `${this.prefix}:messages:read${key}`
    );

    return {
      sent: parseInt(results[0] || '0'),
      received: parseInt(results[1] || '0'),
      failed: parseInt(results[2] || '0'),
      delivered: parseInt(results[3] || '0'),
      read: parseInt(results[4] || '0'),
    };
  }

  async getConversationMetrics(): Promise<ConversationMetrics> {
    const activeCount = await this.redis.scard(`${this.prefix}:conversations:active`);
    const totalCount = parseInt(await this.redis.get(`${this.prefix}:conversations:total`) || '0');
    const responseTimes = await this.redis.lrange(`${this.prefix}:response:times`, 0, 999);
    const handoffsTotal = parseInt(await this.redis.get(`${this.prefix}:handoffs:total`) || '0');

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + parseInt(time), 0) / responseTimes.length
      : 0;

    const messagesReceived = parseInt(await this.redis.get(`${this.prefix}:messages:received:total`) || '0');
    const messagesSent = parseInt(await this.redis.get(`${this.prefix}:messages:sent:total`) || '0');
    const responseRate = messagesReceived > 0 ? (messagesSent / messagesReceived) * 100 : 0;
    const handoffRate = totalCount > 0 ? (handoffsTotal / totalCount) * 100 : 0;

    return {
      activeConversations: activeCount,
      totalConversations: totalCount,
      averageResponseTime: Math.round(avgResponseTime / 1000),
      responseRate: Math.round(responseRate * 100) / 100,
      handoffRate: Math.round(handoffRate * 100) / 100,
    };
  }

  async getConversionMetrics(): Promise<ConversionMetrics> {
    const results = await this.redis.mget(
      `${this.prefix}:conversions:lead:total`,
      `${this.prefix}:conversions:qualified_lead:total`,
      `${this.prefix}:conversions:appointment:total`,
      `${this.prefix}:conversions:sale:total`,
      `${this.prefix}:conversations:total`
    );

    const leads = parseInt(results[0] || '0');
    const qualifiedLeads = parseInt(results[1] || '0');
    const appointments = parseInt(results[2] || '0');
    const sales = parseInt(results[3] || '0');
    const totalConversations = parseInt(results[4] || '0');

    const conversionRate = totalConversations > 0
      ? (sales / totalConversations) * 100
      : 0;

    return {
      leads,
      qualifiedLeads,
      appointments,
      sales,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  }

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const now = Date.now();
    const oneHourAgo = now - (3600 * 1000);

    const sentCount = await this.redis.zcount(
      `${this.prefix}:timeline:sent`,
      oneHourAgo,
      now
    );

    const receivedCount = await this.redis.zcount(
      `${this.prefix}:timeline:received`,
      oneHourAgo,
      now
    );

    const processingTimes = await this.redis.lrange(`${this.prefix}:processing:times`, 0, 999);
    const avgProcessingTime = processingTimes.length > 0
      ? processingTimes.reduce((sum, time) => sum + parseInt(time), 0) / processingTimes.length
      : 0;

    const totalMessages = parseInt(await this.redis.get(`${this.prefix}:messages:sent:total`) || '0');
    const failedMessages = parseInt(await this.redis.get(`${this.prefix}:messages:failed:total`) || '0');
    const errorRate = totalMessages > 0 ? (failedMessages / totalMessages) * 100 : 0;

    return {
      messagesSentPerHour: sentCount,
      messagesReceivedPerHour: receivedCount,
      averageProcessingTime: Math.round(avgProcessingTime),
      errorRate: Math.round(errorRate * 100) / 100,
    };
  }

  async getCampaignMetrics(campaignId: string): Promise<CampaignMetrics> {
    const results = await this.redis.mget(
      `${this.prefix}:campaign:${campaignId}:sent`,
      `${this.prefix}:campaign:${campaignId}:delivered`,
      `${this.prefix}:campaign:${campaignId}:read`,
      `${this.prefix}:campaign:${campaignId}:response`,
      `${this.prefix}:campaign:${campaignId}:conversion`
    );

    const sent = parseInt(results[0] || '0');
    const delivered = parseInt(results[1] || '0');
    const read = parseInt(results[2] || '0');
    const responses = parseInt(results[3] || '0');
    const conversions = parseInt(results[4] || '0');

    const roi = sent > 0 ? (conversions / sent) * 100 : 0;

    return {
      campaignId,
      sent,
      delivered,
      read,
      responses,
      conversions,
      roi: Math.round(roi * 100) / 100,
    };
  }

  async getTopConversations(limit: number = 10): Promise<Array<{
    phone: string;
    messageCount: number;
    lastMessage: Date;
  }>> {
    const activePhones = await this.redis.smembers(`${this.prefix}:conversations:active`);
    
    const conversations = await Promise.all(
      activePhones.map(async (phone) => {
        const sent = parseInt(await this.redis.get(`${this.prefix}:phone:${phone}:sent`) || '0');
        const received = parseInt(await this.redis.get(`${this.prefix}:phone:${phone}:received`) || '0');
        const lastTimestamp = await this.redis.hget(`${this.prefix}:conversation:${phone}`, 'lastActivity');

        return {
          phone,
          messageCount: sent + received,
          lastMessage: new Date(parseInt(lastTimestamp || '0')),
        };
      })
    );

    return conversations
      .sort((a, b) => b.messageCount - a.messageCount)
      .slice(0, limit);
  }

  async generateReport(
    period: 'day' | 'week' | 'month',
    date?: Date
  ): Promise<AnalyticsReport> {
    const endDate = date || new Date();
    const startDate = new Date(endDate);

    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    const [messages, conversations, conversions, performance, topConversations] = await Promise.all([
      this.getMessageMetrics(),
      this.getConversationMetrics(),
      this.getConversionMetrics(),
      this.getPerformanceMetrics(),
      this.getTopConversations(),
    ]);

    return {
      period,
      startDate,
      endDate,
      messages,
      conversations,
      conversions,
      performance,
      topConversations,
    };
  }

  async getMessageTimeSeries(days: number = 7): Promise<TimeSeriesData[]> {
    const result: TimeSeriesData[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const sent = parseInt(await this.redis.get(`${this.prefix}:messages:sent:${dateStr}`) || '0');
      const received = parseInt(await this.redis.get(`${this.prefix}:messages:received:${dateStr}`) || '0');

      result.unshift({
        timestamp: dateStr,
        value: sent + received,
      });
    }

    return result;
  }

  // ============================================
  // UTILIDADES PRIVADAS
  // ============================================

  private async updateResponseTime(phone: string, timestamp: number): Promise<void> {
    const lastSentStr = await this.redis.get(`${this.prefix}:phone:${phone}:lastSent`);
    
    if (lastSentStr) {
      const lastSent = parseInt(lastSentStr);
      const responseTime = timestamp - lastSent;

      await this.redis.pipeline()
        .lpush(`${this.prefix}:response:times`, responseTime)
        .ltrim(`${this.prefix}:response:times`, 0, 999)
        .exec();
    }

    await this.redis.set(`${this.prefix}:phone:${phone}:lastReceived`, timestamp);
  }

  async trackProcessingTime(duration: number): Promise<void> {
    await this.redis.pipeline()
      .lpush(`${this.prefix}:processing:times`, duration)
      .ltrim(`${this.prefix}:processing:times`, 0, 999)
      .exec();
  }

  async cleanup(days: number = 30): Promise<void> {
    const cutoffTimestamp = Date.now() - (days * 24 * 3600 * 1000);

    await this.redis.pipeline()
      .zremrangebyscore(`${this.prefix}:timeline:sent`, 0, cutoffTimestamp)
      .zremrangebyscore(`${this.prefix}:timeline:received`, 0, cutoffTimestamp)
      .zremrangebyscore(`${this.prefix}:errors:timeline`, 0, cutoffTimestamp)
      .exec();

    console.warn(`[Analytics] Cleaned up data older than ${days} days`);
  }

  async close(): Promise<void> {
    await this.redis.quit();
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createAnalyticsManager(config?: {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
}): WhatsAppAnalyticsManager {
  return new WhatsAppAnalyticsManager(config);
}

let analyticsManagerInstance: WhatsAppAnalyticsManager | null = null;

export function getAnalyticsManager(config?: {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
}): WhatsAppAnalyticsManager {
  if (!analyticsManagerInstance) {
    analyticsManagerInstance = new WhatsAppAnalyticsManager(config);
  }
  return analyticsManagerInstance;
}

export default WhatsAppAnalyticsManager;
