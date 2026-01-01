/**
 * WhatsApp Webhook Event Processor
 * 
 * Procesa eventos de Evolution API y los integra con:
 * - Bot conversacional
 * - Twenty CRM
 * - Sistema de analytics
 * - Logging de conversaciones
 * 
 * @author Anclora Private Estates
 * @version 1.0.0
 */

import crypto from 'crypto';
import { getWhatsAppBot } from './whatsapp-bot';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type EventType =
  | 'messages.upsert'
  | 'messages.update'
  | 'messages.delete'
  | 'send.message'
  | 'connection.update'
  | 'qrcode.updated'
  | 'chats.upsert'
  | 'chats.update'
  | 'chats.delete'
  | 'presence.update'
  | 'contacts.upsert'
  | 'contacts.update'
  | 'groups.upsert'
  | 'groups.update';

export interface WebhookEvent {
  event: EventType;
  instance: string;
  data: any;
  destination?: string;
  date_time?: string;
  sender?: string;
  server_url?: string;
  apikey?: string;
}

export interface MessageData {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message?: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
    imageMessage?: {
      caption?: string;
      url?: string;
    };
    videoMessage?: {
      caption?: string;
    };
    documentMessage?: {
      caption?: string;
      fileName?: string;
    };
    audioMessage?: any;
    locationMessage?: any;
    contactMessage?: any;
  };
  messageTimestamp?: number;
  pushName?: string;
  broadcast?: boolean;
}

export interface ConnectionUpdateData {
  instance: string;
  state: 'open' | 'connecting' | 'close';
  statusReason?: number;
}

export interface QRCodeData {
  instance: string;
  qrcode: {
    code: string;
    base64?: string;
  };
}

export interface ProcessResult {
  success: boolean;
  eventType: EventType;
  processed: boolean;
  error?: string;
  details?: any;
}

// ============================================================================
// WEBHOOK SIGNATURE VALIDATION
// ============================================================================

export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = `sha256=${hmac.digest('hex')}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// ============================================================================
// MESSAGE EXTRACTOR
// ============================================================================

class MessageExtractor {
  static extractText(messageData: MessageData): string | null {
    if (!messageData.message) {
      return null;
    }

    const msg = messageData.message;

    // Texto directo
    if (msg.conversation) {
      return msg.conversation;
    }

    // Texto extendido
    if (msg.extendedTextMessage?.text) {
      return msg.extendedTextMessage.text;
    }

    // Caption de imagen
    if (msg.imageMessage?.caption) {
      return msg.imageMessage.caption;
    }

    // Caption de video
    if (msg.videoMessage?.caption) {
      return msg.videoMessage.caption;
    }

    // Caption de documento
    if (msg.documentMessage?.caption) {
      return msg.documentMessage.caption;
    }

    return null;
  }

  static extractPhoneNumber(remoteJid: string): string {
    // Formato: 34600111222@s.whatsapp.net -> 34600111222
    return remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '');
  }

  static isGroup(remoteJid: string): boolean {
    return remoteJid.includes('@g.us');
  }
}

// ============================================================================
// CRM INTEGRATION
// ============================================================================

class CRMIntegration {
  private crmBaseUrl: string;
  private crmApiKey: string;

  constructor() {
    this.crmBaseUrl = process.env.TWENTY_CRM_URL || 'http://localhost:3000';
    this.crmApiKey = process.env.TWENTY_CRM_API_KEY || '';
  }

  async createOrUpdateContact(
    phoneNumber: string,
    name?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    if (!this.crmApiKey) {
      console.warn('[CRM] API key not configured, skipping');
      return;
    }

    try {
      const response = await fetch(`${this.crmBaseUrl}/rest/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.crmApiKey}`,
        },
        body: JSON.stringify({
          phone: phoneNumber,
          name: name || `Lead ${phoneNumber}`,
          source: 'whatsapp',
          metadata: {
            ...metadata,
            lastWhatsAppInteraction: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        console.error('[CRM] Error creating/updating contact:', await response.text());
      } else {
        console.log('[CRM] Contact created/updated:', phoneNumber);
      }
    } catch (error) {
      console.error('[CRM] Error:', error);
    }
  }

  async createActivity(
    phoneNumber: string,
    activityType: 'message_received' | 'message_sent' | 'appointment_booked',
    details: Record<string, any>
  ): Promise<void> {
    if (!this.crmApiKey) {
      return;
    }

    try {
      await fetch(`${this.crmBaseUrl}/rest/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.crmApiKey}`,
        },
        body: JSON.stringify({
          contactPhone: phoneNumber,
          type: activityType,
          details,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('[CRM] Error creating activity:', error);
    }
  }

  async updateLeadScore(
    phoneNumber: string,
    score: number
  ): Promise<void> {
    if (!this.crmApiKey) {
      return;
    }

    try {
      await fetch(`${this.crmBaseUrl}/rest/contacts/${phoneNumber}/score`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.crmApiKey}`,
        },
        body: JSON.stringify({ score }),
      });
    } catch (error) {
      console.error('[CRM] Error updating lead score:', error);
    }
  }
}

// ============================================================================
// CONVERSATION LOGGER
// ============================================================================

class ConversationLogger {
  async logMessage(
    phoneNumber: string,
    messageId: string,
    direction: 'inbound' | 'outbound',
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      // En producción, guardar en base de datos
      // Aquí simulamos con console.log
      
      const logEntry = {
        phoneNumber,
        messageId,
        direction,
        content,
        metadata,
        timestamp: new Date().toISOString(),
      };

      console.log('[Logger] Message logged:', logEntry);

      // TODO: Guardar en PostgreSQL/MongoDB
      /*
      await db.conversationLog.create({
        data: logEntry,
      });
      */
    } catch (error) {
      console.error('[Logger] Error logging message:', error);
    }
  }

  async logEvent(
    eventType: EventType,
    data: any
  ): Promise<void> {
    try {
      const logEntry = {
        eventType,
        data,
        timestamp: new Date().toISOString(),
      };

      console.log('[Logger] Event logged:', logEntry);

      // TODO: Guardar en base de datos
    } catch (error) {
      console.error('[Logger] Error logging event:', error);
    }
  }
}

// ============================================================================
// ANALYTICS TRACKER
// ============================================================================

class AnalyticsTracker {
  async trackMessage(
    phoneNumber: string,
    direction: 'inbound' | 'outbound',
    messageType: string
  ): Promise<void> {
    try {
      // Incrementar contador de mensajes
      // En producción, usar Redis o base de datos
      
      console.log('[Analytics] Message tracked:', {
        phoneNumber,
        direction,
        messageType,
        timestamp: new Date().toISOString(),
      });

      // TODO: Implementar métricas reales
      /*
      await redis.hincrby('whatsapp:stats:messages', direction, 1);
      await redis.hincrby(`whatsapp:stats:user:${phoneNumber}`, 'messages', 1);
      */
    } catch (error) {
      console.error('[Analytics] Error tracking message:', error);
    }
  }

  async trackEvent(
    eventType: EventType,
    instance: string
  ): Promise<void> {
    try {
      console.log('[Analytics] Event tracked:', {
        eventType,
        instance,
        timestamp: new Date().toISOString(),
      });

      // TODO: Implementar métricas reales
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error);
    }
  }
}

// ============================================================================
// MAIN WEBHOOK PROCESSOR
// ============================================================================

export class WebhookProcessor {
  private crm: CRMIntegration;
  private logger: ConversationLogger;
  private analytics: AnalyticsTracker;

  constructor() {
    this.crm = new CRMIntegration();
    this.logger = new ConversationLogger();
    this.analytics = new AnalyticsTracker();
  }

  /**
   * Procesar evento de webhook
   */
  async processEvent(event: WebhookEvent): Promise<ProcessResult> {
    const result: ProcessResult = {
      success: false,
      eventType: event.event,
      processed: false,
    };

    try {
      // Log evento
      await this.logger.logEvent(event.event, event.data);
      await this.analytics.trackEvent(event.event, event.instance);

      // Procesar según tipo de evento
      switch (event.event) {
        case 'messages.upsert':
          await this.handleMessageUpsert(event.data);
          result.processed = true;
          break;

        case 'messages.update':
          await this.handleMessageUpdate(event.data);
          result.processed = true;
          break;

        case 'send.message':
          await this.handleSendMessage(event.data);
          result.processed = true;
          break;

        case 'connection.update':
          await this.handleConnectionUpdate(event.data);
          result.processed = true;
          break;

        case 'qrcode.updated':
          await this.handleQRCodeUpdate(event.data);
          result.processed = true;
          break;

        case 'chats.upsert':
        case 'chats.update':
          await this.handleChatUpdate(event.data);
          result.processed = true;
          break;

        case 'presence.update':
          await this.handlePresenceUpdate(event.data);
          result.processed = true;
          break;

        default:
          console.log(`[Webhook] Unhandled event type: ${event.event}`);
          result.processed = false;
      }

      result.success = true;
    } catch (error) {
      console.error('[Webhook] Error processing event:', error);
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return result;
  }

  /**
   * Handler: Nuevo mensaje recibido
   */
  private async handleMessageUpsert(data: MessageData): Promise<void> {
    // Ignorar mensajes enviados por nosotros
    if (data.key.fromMe) {
      console.log('[Webhook] Ignoring outbound message');
      return;
    }

    // Ignorar mensajes de grupos (por ahora)
    if (MessageExtractor.isGroup(data.key.remoteJid)) {
      console.log('[Webhook] Ignoring group message');
      return;
    }

    // Extraer información
    const phoneNumber = MessageExtractor.extractPhoneNumber(data.key.remoteJid);
    const messageText = MessageExtractor.extractText(data);
    const userName = data.pushName;

    if (!messageText) {
      console.log('[Webhook] Message has no text content, skipping bot processing');
      return;
    }

    console.log('[Webhook] Processing message:', {
      from: phoneNumber,
      name: userName,
      text: messageText.substring(0, 50) + '...',
    });

    // Log mensaje
    await this.logger.logMessage(
      phoneNumber,
      data.key.id,
      'inbound',
      messageText,
      { userName, timestamp: data.messageTimestamp }
    );

    // Track analytics
    await this.analytics.trackMessage(phoneNumber, 'inbound', 'text');

    // Crear/actualizar contacto en CRM
    await this.crm.createOrUpdateContact(phoneNumber, userName, {
      lastMessage: messageText,
      lastMessageDate: new Date(data.messageTimestamp! * 1000).toISOString(),
    });

    // Procesar con el bot conversacional
    try {
      const bot = getWhatsAppBot();
      await bot.processMessage(phoneNumber, messageText, userName);
      
      // Registrar actividad en CRM
      await this.crm.createActivity(phoneNumber, 'message_received', {
        message: messageText,
        botProcessed: true,
      });
    } catch (error) {
      console.error('[Webhook] Error processing message with bot:', error);
      
      // Log error en CRM
      await this.crm.createActivity(phoneNumber, 'message_received', {
        message: messageText,
        botProcessed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Handler: Actualización de mensaje
   */
  private async handleMessageUpdate(data: any): Promise<void> {
    console.log('[Webhook] Message update:', data);
    
    // Aquí se manejan estados de mensajes:
    // - Entregado
    // - Leído
    // - Error
    
    const status = data.update?.status;
    const messageId = data.key?.id;

    if (status && messageId) {
      console.log(`[Webhook] Message ${messageId} status: ${status}`);
      
      // TODO: Actualizar estado en base de datos
    }
  }

  /**
   * Handler: Mensaje enviado
   */
  private async handleSendMessage(data: any): Promise<void> {
    const phoneNumber = MessageExtractor.extractPhoneNumber(data.key?.remoteJid || '');
    
    if (phoneNumber) {
      await this.analytics.trackMessage(phoneNumber, 'outbound', 'text');
      
      await this.logger.logMessage(
        phoneNumber,
        data.key?.id || 'unknown',
        'outbound',
        data.message?.conversation || '[media]',
        { timestamp: Date.now() }
      );
    }
  }

  /**
   * Handler: Actualización de conexión
   */
  private async handleConnectionUpdate(data: ConnectionUpdateData): Promise<void> {
    console.log('[Webhook] Connection update:', {
      instance: data.instance,
      state: data.state,
      statusReason: data.statusReason,
    });

    // Notificar si la conexión se pierde
    if (data.state === 'close') {
      console.error('[Webhook] WhatsApp connection closed!');
      
      // TODO: Enviar alerta al equipo (email, Slack, etc.)
      // await sendAlert('WhatsApp connection lost', data);
    }

    if (data.state === 'open') {
      console.log('[Webhook] WhatsApp connection established ✅');
    }
  }

  /**
   * Handler: QR Code actualizado
   */
  private async handleQRCodeUpdate(data: QRCodeData): Promise<void> {
    console.log('[Webhook] QR Code updated for instance:', data.instance);
    
    // El QR code está en data.qrcode.code o data.qrcode.base64
    // Aquí podrías:
    // 1. Guardar el QR en base de datos
    // 2. Enviarlo por email
    // 3. Mostrarlo en un dashboard
    
    if (data.qrcode.base64) {
      console.log('[Webhook] QR Code available as base64');
      // TODO: Guardar o enviar QR code
    }
  }

  /**
   * Handler: Actualización de chat
   */
  private async handleChatUpdate(data: any): Promise<void> {
    console.log('[Webhook] Chat update:', data);
    
    // Aquí se manejan:
    // - Nuevos chats
    // - Chats archivados
    // - Chats eliminados
    // - Cambios en configuración de chat
  }

  /**
   * Handler: Actualización de presencia
   */
  private async handlePresenceUpdate(data: any): Promise<void> {
    // Presencia del usuario:
    // - available (en línea)
    // - unavailable (desconectado)
    // - composing (escribiendo)
    // - recording (grabando audio)
    
    const phoneNumber = MessageExtractor.extractPhoneNumber(data.id || '');
    const presence = data.presences?.[data.id]?.lastKnownPresence;

    if (phoneNumber && presence) {
      console.log(`[Webhook] User ${phoneNumber} presence: ${presence}`);
      
      // TODO: Actualizar estado en tiempo real en dashboard
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function isValidPhoneNumber(phone: string): boolean {
  // Validación básica de número de teléfono
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone);
}

export function sanitizePhoneNumber(phone: string): string {
  // Eliminar caracteres no numéricos
  return phone.replace(/\D/g, '');
}

export default WebhookProcessor;
