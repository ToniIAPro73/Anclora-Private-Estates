/**
 * Prometheus Metrics
 * 
 * Sistema centralizado de métricas para monitoreo con Prometheus
 */

import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Registry global
export const register = new Registry();

// Métricas por defecto del sistema (CPU, memoria, event loop, etc)
collectDefaultMetrics({ register, prefix: 'anclora_' });

// ============================================================================
// QUEUE METRICS
// ============================================================================

/**
 * Counter: Total de mensajes encolados
 */
export const queueMessagesTotal = new Counter({
  name: 'anclora_queue_messages_total',
  help: 'Total number of messages added to queue',
  labelNames: ['priority', 'message_type'],
  registers: [register],
});

/**
 * Counter: Mensajes procesados exitosamente
 */
export const queueMessagesProcessed = new Counter({
  name: 'anclora_queue_messages_processed_total',
  help: 'Total number of messages successfully processed',
  labelNames: ['message_type'],
  registers: [register],
});

/**
 * Counter: Mensajes fallidos
 */
export const queueMessagesFailed = new Counter({
  name: 'anclora_queue_messages_failed_total',
  help: 'Total number of failed messages',
  labelNames: ['message_type', 'error_type'],
  registers: [register],
});

/**
 * Histogram: Tiempo de procesamiento de mensajes
 */
export const queueProcessingDuration = new Histogram({
  name: 'anclora_queue_processing_duration_seconds',
  help: 'Duration of message processing in seconds',
  labelNames: ['message_type', 'priority'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

/**
 * Gauge: Mensajes en cola (waiting)
 */
export const queueWaitingMessages = new Gauge({
  name: 'anclora_queue_waiting_messages',
  help: 'Number of messages waiting in queue',
  labelNames: ['priority'],
  registers: [register],
});

/**
 * Gauge: Mensajes activos (processing)
 */
export const queueActiveMessages = new Gauge({
  name: 'anclora_queue_active_messages',
  help: 'Number of messages currently being processed',
  registers: [register],
});

/**
 * Gauge: Mensajes en DLQ
 */
export const queueDLQMessages = new Gauge({
  name: 'anclora_queue_dlq_messages',
  help: 'Number of messages in Dead Letter Queue',
  registers: [register],
});

/**
 * Counter: Bulk operations
 */
export const queueBulkOperations = new Counter({
  name: 'anclora_queue_bulk_operations_total',
  help: 'Total number of bulk operations',
  labelNames: ['batch_size_range'],
  registers: [register],
});

// ============================================================================
// ANALYTICS METRICS
// ============================================================================

/**
 * Counter: Mensajes enviados
 */
export const analyticsMessagesSent = new Counter({
  name: 'anclora_analytics_messages_sent_total',
  help: 'Total number of messages sent',
  labelNames: ['message_type', 'campaign_id'],
  registers: [register],
});

/**
 * Counter: Mensajes recibidos
 */
export const analyticsMessagesReceived = new Counter({
  name: 'anclora_analytics_messages_received_total',
  help: 'Total number of messages received',
  labelNames: ['message_type'],
  registers: [register],
});

/**
 * Counter: Mensajes entregados
 */
export const analyticsMessagesDelivered = new Counter({
  name: 'anclora_analytics_messages_delivered_total',
  help: 'Total number of messages delivered',
  registers: [register],
});

/**
 * Counter: Mensajes leídos
 */
export const analyticsMessagesRead = new Counter({
  name: 'anclora_analytics_messages_read_total',
  help: 'Total number of messages read',
  registers: [register],
});

/**
 * Counter: Conversiones
 */
export const analyticsConversions = new Counter({
  name: 'anclora_analytics_conversions_total',
  help: 'Total number of conversions',
  labelNames: ['conversion_type', 'campaign_id'],
  registers: [register],
});

/**
 * Histogram: Valor de conversiones (sales)
 */
export const analyticsConversionValue = new Histogram({
  name: 'anclora_analytics_conversion_value_euros',
  help: 'Conversion value in euros',
  labelNames: ['conversion_type'],
  buckets: [100000, 500000, 1000000, 2000000, 5000000, 10000000],
  registers: [register],
});

/**
 * Gauge: Conversaciones activas
 */
export const analyticsActiveConversations = new Gauge({
  name: 'anclora_analytics_active_conversations',
  help: 'Number of active conversations',
  registers: [register],
});

/**
 * Histogram: Tiempo de respuesta
 */
export const analyticsResponseTime = new Histogram({
  name: 'anclora_analytics_response_time_seconds',
  help: 'Response time in seconds',
  buckets: [10, 30, 60, 120, 300, 600, 1800, 3600],
  registers: [register],
});

/**
 * Counter: Handoffs a humano
 */
export const analyticsHandoffs = new Counter({
  name: 'anclora_analytics_handoffs_total',
  help: 'Total number of handoffs to human agents',
  labelNames: ['reason'],
  registers: [register],
});

// ============================================================================
// WHATSAPP CLIENT METRICS
// ============================================================================

/**
 * Counter: Llamadas a Evolution API
 */
export const whatsappApiCalls = new Counter({
  name: 'anclora_whatsapp_api_calls_total',
  help: 'Total number of Evolution API calls',
  labelNames: ['endpoint', 'method', 'status_code'],
  registers: [register],
});

/**
 * Histogram: Latencia de Evolution API
 */
export const whatsappApiLatency = new Histogram({
  name: 'anclora_whatsapp_api_latency_seconds',
  help: 'Evolution API latency in seconds',
  labelNames: ['endpoint', 'method'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

/**
 * Gauge: Instancias activas
 */
export const whatsappActiveInstances = new Gauge({
  name: 'anclora_whatsapp_active_instances',
  help: 'Number of active WhatsApp instances',
  registers: [register],
});

/**
 * Counter: Rate limit hits
 */
export const whatsappRateLimitHits = new Counter({
  name: 'anclora_whatsapp_rate_limit_hits_total',
  help: 'Total number of rate limit hits',
  labelNames: ['instance_name'],
  registers: [register],
});

/**
 * Counter: Webhooks recibidos
 */
export const whatsappWebhooksReceived = new Counter({
  name: 'anclora_whatsapp_webhooks_received_total',
  help: 'Total number of webhooks received',
  labelNames: ['event_type', 'instance_name'],
  registers: [register],
});

// ============================================================================
// REDIS METRICS
// ============================================================================

/**
 * Counter: Operaciones Redis
 */
export const redisOperations = new Counter({
  name: 'anclora_redis_operations_total',
  help: 'Total number of Redis operations',
  labelNames: ['operation', 'status'],
  registers: [register],
});

/**
 * Histogram: Latencia Redis
 */
export const redisLatency = new Histogram({
  name: 'anclora_redis_latency_seconds',
  help: 'Redis operation latency in seconds',
  labelNames: ['operation'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5],
  registers: [register],
});

/**
 * Gauge: Conexiones Redis
 */
export const redisConnections = new Gauge({
  name: 'anclora_redis_connections',
  help: 'Number of Redis connections',
  labelNames: ['pool'],
  registers: [register],
});

// ============================================================================
// BOT METRICS
// ============================================================================

/**
 * Counter: Intents detectados
 */
export const botIntentsDetected = new Counter({
  name: 'anclora_bot_intents_detected_total',
  help: 'Total number of intents detected',
  labelNames: ['intent', 'confidence_range'],
  registers: [register],
});

/**
 * Histogram: Confianza de intents
 */
export const botIntentConfidence = new Histogram({
  name: 'anclora_bot_intent_confidence',
  help: 'Bot intent detection confidence',
  labelNames: ['intent'],
  buckets: [0.3, 0.5, 0.7, 0.8, 0.9, 0.95, 1.0],
  registers: [register],
});

/**
 * Counter: Respuestas automáticas
 */
export const botAutomatedResponses = new Counter({
  name: 'anclora_bot_automated_responses_total',
  help: 'Total number of automated bot responses',
  labelNames: ['flow', 'step'],
  registers: [register],
});

// ============================================================================
// BUSINESS METRICS
// ============================================================================

/**
 * Counter: Leads capturados
 */
export const businessLeadsCaptured = new Counter({
  name: 'anclora_business_leads_captured_total',
  help: 'Total number of leads captured',
  labelNames: ['source', 'quality'],
  registers: [register],
});

/**
 * Counter: Appointments agendados
 */
export const businessAppointmentsScheduled = new Counter({
  name: 'anclora_business_appointments_scheduled_total',
  help: 'Total number of appointments scheduled',
  labelNames: ['type', 'source'],
  registers: [register],
});

/**
 * Histogram: Valor de propiedades consultadas
 */
export const businessPropertyInquiryValue = new Histogram({
  name: 'anclora_business_property_inquiry_value_euros',
  help: 'Value of properties inquired about in euros',
  buckets: [500000, 1000000, 2000000, 5000000, 10000000, 20000000],
  registers: [register],
});

/**
 * Gauge: Pipeline de ventas (leads calificados)
 */
export const businessSalesPipeline = new Gauge({
  name: 'anclora_business_sales_pipeline',
  help: 'Number of qualified leads in sales pipeline',
  labelNames: ['stage'],
  registers: [register],
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Registra una métrica de mensaje encolado
 */
export function recordQueueMessage(priority: string, messageType: string): void {
  queueMessagesTotal.inc({ priority, message_type: messageType });
}

/**
 * Registra procesamiento de mensaje
 */
export function recordQueueProcessed(messageType: string, durationSeconds: number): void {
  queueMessagesProcessed.inc({ message_type: messageType });
  queueProcessingDuration.observe({ message_type: messageType }, durationSeconds);
}

/**
 * Registra mensaje fallido
 */
export function recordQueueFailed(messageType: string, errorType: string): void {
  queueMessagesFailed.inc({ message_type: messageType, error_type: errorType });
}

/**
 * Actualiza gauge de mensajes en cola
 */
export function updateQueueGauges(waiting: number, active: number, dlq: number): void {
  queueWaitingMessages.set(waiting);
  queueActiveMessages.set(active);
  queueDLQMessages.set(dlq);
}

/**
 * Registra llamada a Evolution API
 */
export function recordWhatsAppApiCall(
  endpoint: string,
  method: string,
  statusCode: number,
  durationSeconds: number
): void {
  whatsappApiCalls.inc({ endpoint, method, status_code: statusCode.toString() });
  whatsappApiLatency.observe({ endpoint, method }, durationSeconds);
}

/**
 * Registra mensaje enviado en analytics
 */
export function recordMessageSent(messageType: string, campaignId?: string): void {
  analyticsMessagesSent.inc({
    message_type: messageType,
    campaign_id: campaignId || 'none',
  });
}

/**
 * Registra conversión
 */
export function recordConversion(
  type: string,
  value?: number,
  campaignId?: string
): void {
  analyticsConversions.inc({
    conversion_type: type,
    campaign_id: campaignId || 'none',
  });

  if (value && type === 'sale') {
    analyticsConversionValue.observe({ conversion_type: type }, value);
  }
}

/**
 * Endpoint de métricas para Prometheus
 */
export async function getMetrics(): Promise<string> {
  return register.metrics();
}

/**
 * Endpoint de content-type para Prometheus
 */
export function getMetricsContentType(): string {
  return register.contentType;
}
