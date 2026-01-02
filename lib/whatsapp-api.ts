/**
 * WhatsApp Integration Library - Evolution API
 * 
 * Client completo para interactuar con Evolution API v2
 * Incluye: envío de mensajes, media, rate limiting, retry logic
 * 
 * @author Anclora Private Estates
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface EvolutionAPIConfig {
  baseURL: string;
  apiKey: string;
  instanceName: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface WhatsAppMessage {
  number: string;
  text: string;
  delay?: number;
  quoted?: QuotedMessage;
}

export interface QuotedMessage {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: Record<string, unknown>;
}

export interface WhatsAppMediaMessage {
  number: string;
  mediatype: 'image' | 'video' | 'audio' | 'document';
  media: string; // URL or base64
  caption?: string;
  fileName?: string;
  delay?: number;
}

export interface WhatsAppContact {
  fullName: string;
  organization?: string;
  phoneNumber: string;
  email?: string;
}

export interface WhatsAppLocation {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface WhatsAppButton {
  displayText: string;
  id: string;
}

export interface WhatsAppListSection {
  title: string;
  rows: Array<{
    title: string;
    description?: string;
    rowId: string;
  }>;
}

export interface ConnectionState {
  instance: string;
  state: 'open' | 'close' | 'connecting';
}

export interface MessageResponse {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: Record<string, unknown>;
  messageTimestamp: string;
  status?: 'PENDING' | 'SERVER_ACK' | 'DELIVERY_ACK' | 'READ' | 'PLAYED';
}

export interface InstanceInfo {
  instance: {
    instanceName: string;
    owner: string;
    profileName?: string;
    profilePicUrl?: string;
    status?: string;
  };
  hash: {
    apikey: string;
  };
  webhookUrl?: string;
  websocketEnabled: boolean;
  rabbitmqEnabled: boolean;
}

export interface QRCodeResponse {
  code: string;
  base64: string;
}

// Rate Limiting
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// ============================================================================
// WHATSAPP API CLIENT
// ============================================================================

export class WhatsAppAPI {
  private client: AxiosInstance;
  private config: Required<EvolutionAPIConfig>;
  private rateLimitMap: Map<string, RateLimitInfo>;
  private readonly RATE_LIMIT_MAX = 80; // WhatsApp limit: 80 msg/min
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute in ms

  constructor(config: EvolutionAPIConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 2000,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey,
      },
    });

    this.rateLimitMap = new Map();
    this.setupInterceptors();
  }

  // ==========================================================================
  // INTERCEPTORS & ERROR HANDLING
  // ==========================================================================

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.warn(`[WhatsApp API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[WhatsApp API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.warn(`[WhatsApp API] Response ${response.status}:`, response.data);
        return response;
      },
      async (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  private async handleError(error: AxiosError): Promise<unknown> {
    const config = error.config as (AxiosError['config'] & { retry?: number });

    // Retry logic
    if (!config || !config.retry) {
      config.retry = 0;
    }

    if (config.retry >= this.config.retries) {
      console.error('[WhatsApp API] Max retries reached:', error.message);
      throw this.formatError(error);
    }

    // Retry on specific errors
    const retryableErrors = [408, 429, 500, 502, 503, 504];
    const status = error.response?.status;

    if (status && retryableErrors.includes(status)) {
      config.retry += 1;
      const delay = this.config.retryDelay * Math.pow(2, config.retry - 1);
      
      console.warn(`[WhatsApp API] Retry ${config.retry}/${this.config.retries} in ${delay}ms`);
      
      await this.sleep(delay);
      return this.client(config);
    }

    throw this.formatError(error);
  }

  private formatError(error: AxiosError): Error {
    const response = error.response;
    
    if (response) {
      const message =
        (response.data as Record<string, unknown> | undefined)?.message ||
        response.statusText;
      return new Error(`WhatsApp API Error (${response.status}): ${message}`);
    }
    
    if (error.request) {
      return new Error('WhatsApp API: No response received');
    }
    
    return new Error(`WhatsApp API: ${error.message}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================================================
  // RATE LIMITING
  // ==========================================================================

  private async checkRateLimit(key: string = 'default'): Promise<void> {
    const now = Date.now();
    const limitInfo = this.rateLimitMap.get(key);

    if (!limitInfo || now > limitInfo.resetTime) {
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW,
      });
      return;
    }

    if (limitInfo.count >= this.RATE_LIMIT_MAX) {
      const waitTime = limitInfo.resetTime - now;
      console.warn(`[WhatsApp API] Rate limit reached. Waiting ${waitTime}ms`);
      await this.sleep(waitTime);
      
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: Date.now() + this.RATE_LIMIT_WINDOW,
      });
      return;
    }

    limitInfo.count += 1;
    this.rateLimitMap.set(key, limitInfo);
  }

  // ==========================================================================
  // INSTANCE MANAGEMENT
  // ==========================================================================

  /**
   * Crear nueva instancia WhatsApp
   */
  async createInstance(instanceName?: string): Promise<InstanceInfo> {
    const name = instanceName || this.config.instanceName;
    
    const response = await this.client.post('/instance/create', {
      instanceName: name,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
    });

    return response.data;
  }

  /**
   * Obtener información de instancia
   */
  async getInstanceInfo(): Promise<InstanceInfo> {
    const response = await this.client.get(
      `/instance/fetchInstances?instanceName=${this.config.instanceName}`
    );

    const instances = response.data as InstanceInfo[];
    const match = instances.find(
      (instance) => instance.instance.instanceName === this.config.instanceName
    );

    if (!match) {
      throw new Error(`Instance not found: ${this.config.instanceName}`);
    }

    return match;
  }

  /**
   * Conectar instancia y obtener QR code
   */
  async connectInstance(): Promise<QRCodeResponse> {
    const response = await this.client.get(
      `/instance/connect/${this.config.instanceName}`
    );

    return response.data;
  }

  /**
   * Verificar estado de conexión
   */
  async getConnectionState(): Promise<ConnectionState> {
    const response = await this.client.get(
      `/instance/connectionState/${this.config.instanceName}`
    );

    return response.data;
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    await this.client.delete(`/instance/logout/${this.config.instanceName}`);
  }

  /**
   * Reiniciar instancia
   */
  async restartInstance(): Promise<void> {
    await this.client.post(`/instance/restart/${this.config.instanceName}`);
  }

  /**
   * Eliminar instancia
   */
  async deleteInstance(): Promise<void> {
    await this.client.delete(`/instance/delete/${this.config.instanceName}`);
  }

  // ==========================================================================
  // MESSAGE SENDING - TEXT
  // ==========================================================================

  /**
   * Enviar mensaje de texto
   */
  async sendText(data: WhatsAppMessage): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(data.number),
      text: data.text,
      delay: data.delay || 1000,
      quoted: data.quoted,
    };

    const response = await this.client.post(
      `/message/sendText/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  /**
   * Enviar mensaje con mención
   */
  async sendTextWithMention(
    number: string,
    text: string,
    mentionedNumbers: string[]
  ): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(number),
      text: text,
      mentioned: mentionedNumbers.map(n => this.formatPhoneNumber(n)),
    };

    const response = await this.client.post(
      `/message/sendText/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  // ==========================================================================
  // MESSAGE SENDING - MEDIA
  // ==========================================================================

  /**
   * Enviar imagen
   */
  async sendImage(data: {
    number: string;
    image: string;
    caption?: string;
    delay?: number;
  }): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(data.number),
      mediatype: 'image',
      media: data.image,
      caption: data.caption,
      delay: data.delay || 1000,
    };

    const response = await this.client.post(
      `/message/sendMedia/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  /**
   * Enviar video
   */
  async sendVideo(data: {
    number: string;
    video: string;
    caption?: string;
    delay?: number;
  }): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(data.number),
      mediatype: 'video',
      media: data.video,
      caption: data.caption,
      delay: data.delay || 1000,
    };

    const response = await this.client.post(
      `/message/sendMedia/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  /**
   * Enviar audio
   */
  async sendAudio(data: {
    number: string;
    audio: string;
    delay?: number;
  }): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(data.number),
      mediatype: 'audio',
      media: data.audio,
      delay: data.delay || 1000,
    };

    const response = await this.client.post(
      `/message/sendMedia/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  /**
   * Enviar documento
   */
  async sendDocument(data: {
    number: string;
    document: string;
    fileName?: string;
    caption?: string;
    delay?: number;
  }): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(data.number),
      mediatype: 'document',
      media: data.document,
      fileName: data.fileName || 'document.pdf',
      caption: data.caption,
      delay: data.delay || 1000,
    };

    const response = await this.client.post(
      `/message/sendMedia/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  /**
   * Enviar media genérica (imagen, video, audio, documento)
   */
  async sendMedia(data: WhatsAppMediaMessage): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(data.number),
      mediatype: data.mediatype,
      media: data.media,
      caption: data.caption,
      fileName: data.fileName,
      delay: data.delay || 1000,
    };

    const response = await this.client.post(
      `/message/sendMedia/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  // ==========================================================================
  // MESSAGE SENDING - INTERACTIVE
  // ==========================================================================

  /**
   * Enviar botones interactivos
   */
  async sendButtons(data: {
    number: string;
    title: string;
    description?: string;
    footer?: string;
    buttons: WhatsAppButton[];
  }): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(data.number),
      title: data.title,
      description: data.description,
      footer: data.footer,
      buttons: data.buttons,
    };

    const response = await this.client.post(
      `/message/sendButtons/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  /**
   * Enviar lista interactiva
   */
  async sendList(data: {
    number: string;
    title: string;
    description?: string;
    buttonText: string;
    footerText?: string;
    sections: WhatsAppListSection[];
  }): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(data.number),
      title: data.title,
      description: data.description,
      buttonText: data.buttonText,
      footerText: data.footerText,
      sections: data.sections,
    };

    const response = await this.client.post(
      `/message/sendList/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  // ==========================================================================
  // MESSAGE SENDING - SPECIAL
  // ==========================================================================

  /**
   * Enviar contacto
   */
  async sendContact(data: {
    number: string;
    contact: WhatsAppContact[];
  }): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(data.number),
      contact: data.contact,
    };

    const response = await this.client.post(
      `/message/sendContact/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  /**
   * Enviar ubicación
   */
  async sendLocation(data: {
    number: string;
    location: WhatsAppLocation;
  }): Promise<MessageResponse> {
    await this.checkRateLimit();

    const payload = {
      number: this.formatPhoneNumber(data.number),
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      name: data.location.name,
      address: data.location.address,
    };

    const response = await this.client.post(
      `/message/sendLocation/${this.config.instanceName}`,
      payload
    );

    return response.data;
  }

  /**
   * Enviar reacción a mensaje
   */
  async sendReaction(data: {
    key: QuotedMessage['key'];
    reaction: string; // emoji
  }): Promise<void> {
    const payload = {
      reactionMessage: {
        key: data.key,
        reaction: data.reaction,
      },
    };

    await this.client.post(
      `/message/sendReaction/${this.config.instanceName}`,
      payload
    );
  }

  // ==========================================================================
  // MESSAGE MANAGEMENT
  // ==========================================================================

  /**
   * Marcar mensaje como leído
   */
  async markAsRead(data: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  }): Promise<void> {
    const payload = {
      readMessages: [
        {
          remoteJid: data.remoteJid,
          fromMe: data.fromMe,
          id: data.id,
        },
      ],
    };

    await this.client.post(
      `/chat/markMessageAsRead/${this.config.instanceName}`,
      payload
    );
  }

  /**
   * Eliminar mensaje
   */
  async deleteMessage(data: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  }): Promise<void> {
    const payload = {
      key: {
        remoteJid: data.remoteJid,
        fromMe: data.fromMe,
        id: data.id,
      },
    };

    await this.client.delete(
      `/message/delete/${this.config.instanceName}`,
      { data: payload }
    );
  }

  // ==========================================================================
  // CHAT ACTIONS
  // ==========================================================================

  /**
   * Enviar estado "escribiendo..."
   */
  async sendPresence(number: string, state: 'composing' | 'recording' | 'available'): Promise<void> {
    const payload = {
      number: this.formatPhoneNumber(number),
      state: state,
      delay: 2000,
    };

    await this.client.post(
      `/chat/sendPresence/${this.config.instanceName}`,
      payload
    );
  }

  /**
   * Archivar chat
   */
  async archiveChat(number: string, archive: boolean = true): Promise<void> {
    const payload = {
      lastMessage: {
        key: {
          remoteJid: this.formatPhoneNumber(number) + '@s.whatsapp.net',
          fromMe: true,
        },
      },
      archive: archive,
    };

    await this.client.post(
      `/chat/archive/${this.config.instanceName}`,
      payload
    );
  }

  /**
   * Marcar chat como no leído
   */
  async markChatUnread(number: string): Promise<void> {
    const payload = {
      lastMessage: {
        key: {
          remoteJid: this.formatPhoneNumber(number) + '@s.whatsapp.net',
          fromMe: true,
        },
      },
    };

    await this.client.post(
      `/chat/markChatUnread/${this.config.instanceName}`,
      payload
    );
  }

  // ==========================================================================
  // PROFILE & SETTINGS
  // ==========================================================================

  /**
   * Actualizar nombre de perfil
   */
  async updateProfileName(name: string): Promise<void> {
    await this.client.post(`/chat/updateProfileName/${this.config.instanceName}`, {
      name: name,
    });
  }

  /**
   * Actualizar estado de perfil
   */
  async updateProfileStatus(status: string): Promise<void> {
    await this.client.post(`/chat/updateProfileStatus/${this.config.instanceName}`, {
      status: status,
    });
  }

  /**
   * Actualizar foto de perfil
   */
  async updateProfilePicture(image: string): Promise<void> {
    await this.client.post(`/chat/updateProfilePicture/${this.config.instanceName}`, {
      picture: image, // base64 or URL
    });
  }

  // ==========================================================================
  // WEBHOOKS
  // ==========================================================================

  /**
   * Configurar webhook
   */
  async setWebhook(webhookUrl: string, events?: string[]): Promise<void> {
    const payload: Record<string, unknown> = {
      url: webhookUrl,
      enabled: true,
      webhookByEvents: true,
    };

    if (events) {
      payload.events = events;
    }

    await this.client.post(
      `/webhook/set/${this.config.instanceName}`,
      payload
    );
  }

  /**
   * Obtener configuración webhook
   */
  async getWebhook(): Promise<Record<string, unknown>> {
    const response = await this.client.get(
      `/webhook/find/${this.config.instanceName}`
    );

    return response.data;
  }

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  /**
   * Formatear número de teléfono
   * Input: +34 600 000 000 o 34600000000
   * Output: 34600000000
   */
  private formatPhoneNumber(number: string): string {
    return number.replace(/\D/g, '');
  }

  /**
   * Validar número de teléfono
   */
  async validateNumber(number: string): Promise<boolean> {
    try {
      const response = await this.client.post(
        `/chat/whatsappNumbers/${this.config.instanceName}`,
        {
          numbers: [this.formatPhoneNumber(number)],
        }
      );

      const results = response.data;
      return results.length > 0 && results[0].exists;
    } catch (error) {
      console.error('[WhatsApp API] Error validating number:', error);
      return false;
    }
  }

  /**
   * Obtener foto de perfil de contacto
   */
  async getProfilePicture(number: string): Promise<string | null> {
    try {
      const response = await this.client.post(
        `/chat/fetchProfilePicture/${this.config.instanceName}`,
        {
          number: this.formatPhoneNumber(number),
        }
      );

      return response.data?.profilePictureUrl || null;
    } catch (error) {
      console.error('[WhatsApp API] Error fetching profile picture:', error);
      return null;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const state = await this.getConnectionState();
      return state.state === 'open';
    } catch {
      return false;
    }
  }
}

// ============================================================================
// FACTORY & SINGLETON
// ============================================================================

let whatsappClient: WhatsAppAPI | null = null;

export function getWhatsAppClient(config?: EvolutionAPIConfig): WhatsAppAPI {
  if (!whatsappClient) {
    if (!config) {
      throw new Error('WhatsApp API config required for first initialization');
    }
    whatsappClient = new WhatsAppAPI(config);
  }
  return whatsappClient;
}

export function createWhatsAppClient(config: EvolutionAPIConfig): WhatsAppAPI {
  return new WhatsAppAPI(config);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Enviar mensaje de texto simple (helper)
 */
export async function sendWhatsAppMessage(
  number: string,
  text: string,
  config?: EvolutionAPIConfig
): Promise<MessageResponse> {
  const client = getWhatsAppClient(config);
  return client.sendText({ number, text });
}

/**
 * Enviar imagen simple (helper)
 */
export async function sendWhatsAppImage(
  number: string,
  image: string,
  caption?: string,
  config?: EvolutionAPIConfig
): Promise<MessageResponse> {
  const client = getWhatsAppClient(config);
  return client.sendImage({ number, image, caption });
}

/**
 * Validar si número tiene WhatsApp (helper)
 */
export async function hasWhatsApp(
  number: string,
  config?: EvolutionAPIConfig
): Promise<boolean> {
  const client = getWhatsAppClient(config);
  return client.validateNumber(number);
}

export default WhatsAppAPI;
