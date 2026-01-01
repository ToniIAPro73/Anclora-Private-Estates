/**
 * WhatsApp Conversational Bot
 * 
 * Bot inteligente con IA (Llama 3.1) para responder automáticamente
 * a consultas de WhatsApp con detección de intents y flujos conversacionales
 * 
 * @author Anclora Private Estates
 * @version 1.0.0
 */

import { WhatsAppAPI, MessageResponse } from './whatsapp-api';
import { TemplateManager, getMessage } from './whatsapp-templates';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type Intent =
  | 'property_inquiry'
  | 'appointment_booking'
  | 'general_inquiry'
  | 'property_valuation'
  | 'investor_consultation'
  | 'pricing_question'
  | 'location_question'
  | 'greeting'
  | 'farewell'
  | 'unknown';

export type ConversationState =
  | 'initial'
  | 'collecting_info'
  | 'showing_properties'
  | 'booking_appointment'
  | 'valuing_property'
  | 'investor_conversation'
  | 'handoff_to_human'
  | 'ended';

export interface ConversationContext {
  userId: string;
  phoneNumber: string;
  userName?: string;
  language: 'es' | 'en';
  state: ConversationState;
  intent: Intent;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  metadata: {
    propertyType?: string;
    budget?: string;
    location?: string;
    bedrooms?: number;
    appointmentDate?: string;
    leadScore?: number;
    [key: string]: any;
  };
  lastInteraction: Date;
  handoffRequested: boolean;
}

export interface IntentDetectionResult {
  intent: Intent;
  confidence: number;
  entities: {
    propertyType?: string;
    location?: string;
    budget?: string;
    bedrooms?: number;
    [key: string]: any;
  };
}

export interface BotConfig {
  whatsappConfig: {
    baseURL: string;
    apiKey: string;
    instanceName: string;
  };
  llmConfig: {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
  };
  businessHours: {
    timezone: string;
    weekdays: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday?: { start: string; end: string };
  };
  handoffCriteria: {
    complexityThreshold: number;
    messageCountThreshold: number;
    lowConfidenceThreshold: number;
  };
}

// ============================================================================
// INTENT DETECTION ENGINE
// ============================================================================

class IntentDetector {
  private patterns: Record<Intent, RegExp[]> = {
    property_inquiry: [
      /busco?\s+(casa|villa|apartamento|piso|finca|propiedad)/i,
      /(ver|mostrar|enseñar).+(propiedad|casa|villa|apartamento)/i,
      /qué\s+(propiedades|casas|villas).+(tienen|hay|disponibles)/i,
      /(quiero|me gustaría|estoy interesado).+(comprar|adquirir)/i,
      /property|house|villa|apartment|looking for/i,
    ],
    appointment_booking: [
      /(agendar|reservar|programar|pedir).+(cita|visita|viewing)/i,
      /(ver|visitar).+(propiedad|casa|villa)/i,
      /cuándo\s+puedo\s+(ir|ver|visitar)/i,
      /schedule|book|appointment|viewing/i,
    ],
    property_valuation: [
      /(valorar|tasar|evaluar).+(mi|nuestra)?\s+(propiedad|casa|villa)/i,
      /cuánto\s+vale\s+mi\s+(casa|propiedad)/i,
      /(precio|valor).+(mi|nuestra).+(casa|propiedad)/i,
      /valuation|appraisal|worth|value my property/i,
    ],
    investor_consultation: [
      /(inversión|invertir|inversiones)/i,
      /(rentabilidad|roi|retorno)/i,
      /(portfolio|cartera).+(propiedades|inmobiliaria)/i,
      /investment|investor|rental yield/i,
    ],
    pricing_question: [
      /(cuánto|precio|cuesta|coste|vale)/i,
      /qué\s+(precio|rango|presupuesto)/i,
      /price|cost|how much/i,
    ],
    location_question: [
      /(dónde|ubicación|zona|área)/i,
      /en\s+(palma|son vida|santa ponsa|port adriano)/i,
      /location|where|area|zone/i,
    ],
    greeting: [
      /^(hola|hey|buenos|buenas|saludos)/i,
      /^(hi|hello|good morning|good afternoon)/i,
    ],
    farewell: [
      /(gracias|adiós|hasta luego|chao)/i,
      /(thanks|bye|goodbye|see you)/i,
    ],
    general_inquiry: [
      /(información|info|detalles|datos)/i,
      /(ayuda|ayudar|asistencia)/i,
      /information|help|details/i,
    ],
    unknown: [],
  };

  private keywords: Record<string, string[]> = {
    propertyTypes: ['villa', 'apartamento', 'piso', 'finca', 'casa', 'chalet', 'apartment', 'house'],
    locations: ['palma', 'son vida', 'santa ponsa', 'port adriano', 'calvià', 'sóller', 'pollença', 'alcúdia'],
    budget: ['millón', 'mil', 'euro', 'euros', '€', 'million', 'thousand'],
  };

  detect(message: string): IntentDetectionResult {
    const normalizedMessage = message.toLowerCase().trim();
    let detectedIntent: Intent = 'unknown';
    let maxMatches = 0;

    // Check patterns for each intent
    for (const [intent, patterns] of Object.entries(this.patterns)) {
      const matches = patterns.filter(pattern => pattern.test(normalizedMessage)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedIntent = intent as Intent;
      }
    }

    // Extract entities
    const entities = this.extractEntities(normalizedMessage);

    // Calculate confidence
    const confidence = maxMatches > 0 ? Math.min(0.5 + (maxMatches * 0.2), 0.95) : 0.3;

    return {
      intent: detectedIntent,
      confidence,
      entities,
    };
  }

  private extractEntities(message: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract property type
    for (const type of this.keywords.propertyTypes) {
      if (message.includes(type)) {
        entities.propertyType = type;
        break;
      }
    }

    // Extract location
    for (const location of this.keywords.locations) {
      if (message.includes(location)) {
        entities.location = location;
        break;
      }
    }

    // Extract budget (simple regex)
    const budgetMatch = message.match(/(\d+(?:\.\d+)?)\s*(millón|mil|k|m|million|thousand)/i);
    if (budgetMatch) {
      entities.budget = budgetMatch[0];
    }

    // Extract bedrooms
    const bedroomMatch = message.match(/(\d+)\s*(dormitorios|habitaciones|bedrooms|rooms)/i);
    if (bedroomMatch) {
      entities.bedrooms = parseInt(bedroomMatch[1]);
    }

    return entities;
  }
}

// ============================================================================
// CONVERSATION CONTEXT MANAGER
// ============================================================================

class ConversationContextManager {
  private contexts: Map<string, ConversationContext> = new Map();
  private readonly CONTEXT_TIMEOUT = 30 * 60 * 1000; // 30 minutos

  getContext(phoneNumber: string): ConversationContext | undefined {
    const context = this.contexts.get(phoneNumber);
    
    if (context) {
      // Check if context expired
      const timeSinceLastInteraction = Date.now() - context.lastInteraction.getTime();
      if (timeSinceLastInteraction > this.CONTEXT_TIMEOUT) {
        this.contexts.delete(phoneNumber);
        return undefined;
      }
    }

    return context;
  }

  createContext(phoneNumber: string, userName?: string, language: 'es' | 'en' = 'es'): ConversationContext {
    const context: ConversationContext = {
      userId: this.generateUserId(phoneNumber),
      phoneNumber,
      userName,
      language,
      state: 'initial',
      intent: 'unknown',
      messages: [],
      metadata: {},
      lastInteraction: new Date(),
      handoffRequested: false,
    };

    this.contexts.set(phoneNumber, context);
    return context;
  }

  updateContext(phoneNumber: string, updates: Partial<ConversationContext>): void {
    const context = this.contexts.get(phoneNumber);
    if (context) {
      Object.assign(context, updates, { lastInteraction: new Date() });
      this.contexts.set(phoneNumber, context);
    }
  }

  addMessage(phoneNumber: string, role: 'user' | 'assistant', content: string): void {
    const context = this.contexts.get(phoneNumber);
    if (context) {
      context.messages.push({
        role,
        content,
        timestamp: new Date(),
      });
      context.lastInteraction = new Date();
    }
  }

  clearContext(phoneNumber: string): void {
    this.contexts.delete(phoneNumber);
  }

  private generateUserId(phoneNumber: string): string {
    return `user_${phoneNumber}_${Date.now()}`;
  }

  getAllActiveContexts(): ConversationContext[] {
    return Array.from(this.contexts.values());
  }
}

// ============================================================================
// LLM INTEGRATION (Llama 3.1)
// ============================================================================

class LLMService {
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: BotConfig['llmConfig']) {
    this.model = config.model;
    this.temperature = config.temperature;
    this.maxTokens = config.maxTokens;
  }

  async generateResponse(
    context: ConversationContext,
    userMessage: string
  ): Promise<string> {
    // Build conversation history
    const conversationHistory = context.messages
      .slice(-5) // Last 5 messages
      .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = this.buildSystemPrompt(context);
    const prompt = `${systemPrompt}\n\nConversación previa:\n${conversationHistory}\n\nUsuario: ${userMessage}\n\nAsistente:`;

    try {
      // Simulate Llama 3.1 API call
      // En producción, reemplazar con llamada real a Ollama/LlamaCpp
      const response = await this.callLlamaAPI(prompt);
      return response;
    } catch (error) {
      console.error('[LLM] Error generating response:', error);
      return this.getFallbackResponse(context);
    }
  }

  private buildSystemPrompt(context: ConversationContext): string {
    const basePrompt = `Eres un asistente virtual de Anclora Private Estates, una agencia inmobiliaria de lujo en Mallorca.

Tu rol:
- Ayudar a clientes a encontrar propiedades de lujo
- Responder preguntas sobre propiedades disponibles
- Agendar visitas y citas
- Proporcionar información sobre el mercado inmobiliario en Mallorca

Directrices:
- Sé profesional, amable y útil
- Responde en ${context.language === 'es' ? 'español' : 'inglés'}
- Mantén respuestas concisas (máximo 3-4 líneas)
- Si no sabes algo, ofrece conectar con un agente humano
- Usa emojis ocasionalmente para ser más cercano
- Nunca inventes información sobre propiedades o precios

Contexto actual:
- Estado: ${context.state}
- Intención detectada: ${context.intent}
${context.metadata.propertyType ? `- Tipo de propiedad buscada: ${context.metadata.propertyType}` : ''}
${context.metadata.location ? `- Ubicación preferida: ${context.metadata.location}` : ''}
${context.metadata.budget ? `- Presupuesto: ${context.metadata.budget}` : ''}`;

    return basePrompt;
  }

  private async callLlamaAPI(prompt: string): Promise<string> {
    // Placeholder para integración real con Llama 3.1
    // Opciones:
    // 1. Ollama: http://localhost:11434/api/generate
    // 2. LlamaCpp: http://localhost:8080/completion
    // 3. HuggingFace Inference API
    
    // Simulación de respuesta
    console.log('[LLM] Generating response with Llama 3.1...');
    
    // En producción, descomentar y configurar:
    /*
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      }),
    });
    
    const data = await response.json();
    return data.response;
    */

    return 'Gracias por tu consulta. Permíteme ayudarte con eso. ¿Podrías darme más detalles sobre lo que buscas?';
  }

  private getFallbackResponse(context: ConversationContext): string {
    const fallbacks = {
      es: [
        'Entiendo tu consulta. ¿Podrías darme más detalles?',
        'Permíteme ayudarte con eso. ¿Qué información adicional necesitas?',
        'Estoy aquí para ayudarte. ¿Puedes especificar un poco más?',
      ],
      en: [
        'I understand your inquiry. Could you provide more details?',
        'Let me help you with that. What additional information do you need?',
        'I\'m here to help. Could you be more specific?',
      ],
    };

    const messages = fallbacks[context.language];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

// ============================================================================
// CONVERSATION FLOWS
// ============================================================================

class ConversationFlows {
  private templateManager: TemplateManager;

  constructor(language: 'es' | 'en' = 'es') {
    this.templateManager = new TemplateManager(language);
  }

  // --------------------------------------------------------------------------
  // FLOW 1: PROPERTY INQUIRY
  // --------------------------------------------------------------------------
  async handlePropertyInquiry(
    context: ConversationContext,
    userMessage: string
  ): Promise<string[]> {
    const responses: string[] = [];

    switch (context.state) {
      case 'initial':
        // Welcome and ask for property type
        responses.push(
          getMessage('budgetInquiry', {
            nombre: context.userName || 'cliente',
          }, context.language)
        );
        context.state = 'collecting_info';
        break;

      case 'collecting_info':
        // We have some info, ask for more or show properties
        if (context.metadata.budget && context.metadata.location) {
          responses.push(
            '¡Perfecto! Tengo varias propiedades que podrían interesarte.\n\n¿Te las envío por aquí o prefieres que te llame?'
          );
          context.state = 'showing_properties';
        } else {
          responses.push(
            'Genial. ¿Hay alguna zona específica en Mallorca que te interese más?'
          );
        }
        break;

      case 'showing_properties':
        responses.push(
          'Te voy a enviar 3 propiedades que coinciden con tu búsqueda...'
        );
        // Aquí se integraría con el sistema de propiedades
        break;
    }

    return responses;
  }

  // --------------------------------------------------------------------------
  // FLOW 2: APPOINTMENT BOOKING
  // --------------------------------------------------------------------------
  async handleAppointmentBooking(
    context: ConversationContext,
    userMessage: string
  ): Promise<string[]> {
    const responses: string[] = [];

    if (!context.metadata.appointmentDate) {
      responses.push(
        '¡Perfecto! ¿Qué día te viene mejor?\n\nEstoy disponible:\n• Lunes a Viernes: 9:00-19:00\n• Sábados: 10:00-14:00'
      );
      context.state = 'booking_appointment';
    } else {
      const confirmation = getMessage('appointmentConfirmation', {
        fecha: context.metadata.appointmentDate,
        hora: context.metadata.appointmentTime || '11:00',
        nombrePropiedad: context.metadata.propertyName || 'la propiedad',
        asesor: 'María García',
      }, context.language);
      
      responses.push(confirmation);
      context.state = 'ended';
    }

    return responses;
  }

  // --------------------------------------------------------------------------
  // FLOW 3: GENERAL INQUIRY
  // --------------------------------------------------------------------------
  async handleGeneralInquiry(
    context: ConversationContext,
    userMessage: string
  ): Promise<string[]> {
    const responses: string[] = [];

    responses.push(
      '¡Claro! Estoy aquí para ayudarte.\n\nPuedo ayudarte con:\n• Buscar propiedades\n• Agendar visitas\n• Valorar tu propiedad\n• Información sobre Mallorca\n\n¿Qué te interesa?'
    );

    return responses;
  }

  // --------------------------------------------------------------------------
  // FLOW 4: PROPERTY VALUATION
  // --------------------------------------------------------------------------
  async handlePropertyValuation(
    context: ConversationContext,
    userMessage: string
  ): Promise<string[]> {
    const responses: string[] = [];

    if (context.state === 'initial') {
      const valuation = getMessage('freeValuation', {
        nombre: context.userName || 'cliente',
      }, context.language);
      
      responses.push(valuation);
      context.state = 'valuing_property';
    } else {
      responses.push(
        'Perfecto, necesito algunos datos:\n\n1. Ubicación exacta\n2. Tipo de propiedad\n3. Metros cuadrados\n4. Número de habitaciones\n\n¿Empezamos con la ubicación?'
      );
    }

    return responses;
  }

  // --------------------------------------------------------------------------
  // FLOW 5: INVESTOR CONSULTATION
  // --------------------------------------------------------------------------
  async handleInvestorConsultation(
    context: ConversationContext,
    userMessage: string
  ): Promise<string[]> {
    const responses: string[] = [];

    responses.push(
      '¡Excelente! 📊\n\nEn Anclora asesoramos a inversores en:\n• Propiedades de alto rendimiento\n• Análisis de rentabilidad\n• Gestión de portfolio\n• Inversión en construcción\n\n¿Qué tipo de inversión te interesa?'
    );
    context.state = 'investor_conversation';

    return responses;
  }
}

// ============================================================================
// MAIN BOT CLASS
// ============================================================================

export class WhatsAppBot {
  private whatsapp: WhatsAppAPI;
  private intentDetector: IntentDetector;
  private contextManager: ConversationContextManager;
  private llmService: LLMService;
  private flows: ConversationFlows;
  private config: BotConfig;

  constructor(config: BotConfig) {
    this.config = config;
    this.whatsapp = new WhatsAppAPI(config.whatsappConfig);
    this.intentDetector = new IntentDetector();
    this.contextManager = new ConversationContextManager();
    this.llmService = new LLMService(config.llmConfig);
    this.flows = new ConversationFlows('es');
  }

  /**
   * Procesar mensaje entrante de WhatsApp
   */
  async processMessage(
    phoneNumber: string,
    message: string,
    userName?: string
  ): Promise<void> {
    try {
      // Get or create conversation context
      let context = this.contextManager.getContext(phoneNumber);
      if (!context) {
        context = this.contextManager.createContext(phoneNumber, userName);
      }

      // Add user message to context
      this.contextManager.addMessage(phoneNumber, 'user', message);

      // Check if outside business hours
      if (!this.isBusinessHours() && context.state === 'initial') {
        await this.sendOutOfOfficeMessage(phoneNumber, userName);
        return;
      }

      // Detect intent
      const intentResult = this.intentDetector.detect(message);
      
      // Update context with intent and entities
      this.contextManager.updateContext(phoneNumber, {
        intent: intentResult.intent,
        metadata: {
          ...context.metadata,
          ...intentResult.entities,
        },
      });

      // Check if handoff needed
      if (this.shouldHandoffToHuman(context, intentResult)) {
        await this.handoffToHuman(phoneNumber, context);
        return;
      }

      // Generate response
      const responses = await this.generateResponse(context, message, intentResult);

      // Send responses with delays
      for (let i = 0; i < responses.length; i++) {
        // Show typing indicator
        await this.whatsapp.sendPresence(phoneNumber, 'composing');
        
        // Natural delay
        await this.sleep(1000 + (responses[i].length * 20)); // ~20ms per character
        
        // Send message
        await this.whatsapp.sendText({
          number: phoneNumber,
          text: responses[i],
        });

        // Add to context
        this.contextManager.addMessage(phoneNumber, 'assistant', responses[i]);

        // Small delay between messages
        if (i < responses.length - 1) {
          await this.sleep(1000);
        }
      }

    } catch (error) {
      console.error('[Bot] Error processing message:', error);
      await this.sendErrorMessage(phoneNumber);
    }
  }

  /**
   * Generar respuesta basada en intent y contexto
   */
  private async generateResponse(
    context: ConversationContext,
    message: string,
    intentResult: IntentDetectionResult
  ): Promise<string[]> {
    // Handle greetings
    if (intentResult.intent === 'greeting') {
      const greeting = getMessage('welcome', {
        nombre: context.userName || 'cliente',
      }, context.language);
      return [greeting];
    }

    // Handle farewells
    if (intentResult.intent === 'farewell') {
      const farewell = context.language === 'es'
        ? '¡Gracias por contactar con Anclora! 🏡\n\nEstamos aquí cuando nos necesites.'
        : 'Thank you for contacting Anclora! 🏡\n\nWe\'re here when you need us.';
      
      this.contextManager.clearContext(context.phoneNumber);
      return [farewell];
    }

    // Route to appropriate flow
    switch (intentResult.intent) {
      case 'property_inquiry':
        return this.flows.handlePropertyInquiry(context, message);
      
      case 'appointment_booking':
        return this.flows.handleAppointmentBooking(context, message);
      
      case 'property_valuation':
        return this.flows.handlePropertyValuation(context, message);
      
      case 'investor_consultation':
        return this.flows.handleInvestorConsultation(context, message);
      
      case 'general_inquiry':
        return this.flows.handleGeneralInquiry(context, message);
      
      default:
        // Use LLM for unknown intents
        const llmResponse = await this.llmService.generateResponse(context, message);
        return [llmResponse];
    }
  }

  /**
   * Determinar si se debe escalar a humano
   */
  private shouldHandoffToHuman(
    context: ConversationContext,
    intentResult: IntentDetectionResult
  ): boolean {
    // Already requested handoff
    if (context.handoffRequested) {
      return true;
    }

    // Low confidence in intent detection
    if (intentResult.confidence < this.config.handoffCriteria.lowConfidenceThreshold) {
      return true;
    }

    // Too many messages without resolution
    if (context.messages.length > this.config.handoffCriteria.messageCountThreshold) {
      return true;
    }

    // Complex inquiries
    const complexKeywords = ['legal', 'contrato', 'hipoteca', 'financiación', 'mortgage', 'contract'];
    const messageText = context.messages[context.messages.length - 1].content.toLowerCase();
    if (complexKeywords.some(keyword => messageText.includes(keyword))) {
      return true;
    }

    return false;
  }

  /**
   * Escalar conversación a agente humano
   */
  private async handoffToHuman(
    phoneNumber: string,
    context: ConversationContext
  ): Promise<void> {
    const message = context.language === 'es'
      ? '¡Perfecto! Voy a conectarte con uno de nuestros asesores especializados.\n\nTe contactaremos en breve. 👨‍💼'
      : 'Perfect! I\'ll connect you with one of our specialized advisors.\n\nWe\'ll contact you shortly. 👨‍💼';

    await this.whatsapp.sendText({
      number: phoneNumber,
      text: message,
    });

    // Mark for handoff
    this.contextManager.updateContext(phoneNumber, {
      handoffRequested: true,
      state: 'handoff_to_human',
    });

    // Notify team (integrar con CRM/notificaciones)
    console.log(`[Bot] Handoff requested for ${phoneNumber}`);
    // TODO: Send notification to team via Twenty CRM or Slack
  }

  /**
   * Mensaje fuera de horario
   */
  private async sendOutOfOfficeMessage(
    phoneNumber: string,
    userName?: string
  ): Promise<void> {
    const message = getMessage('outOfOffice', {
      nombre: userName || 'cliente',
    });

    await this.whatsapp.sendText({
      number: phoneNumber,
      text: message,
    });
  }

  /**
   * Mensaje de error
   */
  private async sendErrorMessage(phoneNumber: string): Promise<void> {
    await this.whatsapp.sendText({
      number: phoneNumber,
      text: 'Disculpa, he tenido un problema técnico. ¿Puedes repetir tu mensaje?',
    });
  }

  /**
   * Verificar si estamos en horario de atención
   */
  private isBusinessHours(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;

    // Sunday
    if (day === 0) {
      return this.config.businessHours.sunday !== undefined;
    }

    // Saturday
    if (day === 6) {
      const [startH, startM] = this.config.businessHours.saturday.start.split(':').map(Number);
      const [endH, endM] = this.config.businessHours.saturday.end.split(':').map(Number);
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;
      return currentTime >= start && currentTime < end;
    }

    // Weekdays
    const [startH, startM] = this.config.businessHours.weekdays.start.split(':').map(Number);
    const [endH, endM] = this.config.businessHours.weekdays.end.split(':').map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;
    return currentTime >= start && currentTime < end;
  }

  /**
   * Obtener estadísticas del bot
   */
  getStats(): {
    activeConversations: number;
    totalMessages: number;
    handoffRate: number;
  } {
    const contexts = this.contextManager.getAllActiveContexts();
    
    const totalMessages = contexts.reduce((sum, ctx) => sum + ctx.messages.length, 0);
    const handoffs = contexts.filter(ctx => ctx.handoffRequested).length;

    return {
      activeConversations: contexts.length,
      totalMessages,
      handoffRate: contexts.length > 0 ? handoffs / contexts.length : 0,
    };
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_BOT_CONFIG: BotConfig = {
  whatsappConfig: {
    baseURL: process.env.NEXT_PUBLIC_EVOLUTION_API_URL || 'http://localhost:8080',
    apiKey: process.env.NEXT_EVOLUTION_API_KEY || '',
    instanceName: process.env.INSTANCE_NAME || 'anclora-main',
  },
  llmConfig: {
    model: 'llama-3.1-70b',
    temperature: 0.7,
    maxTokens: 200,
    systemPrompt: '',
  },
  businessHours: {
    timezone: 'Europe/Madrid',
    weekdays: { start: '09:00', end: '19:00' },
    saturday: { start: '10:00', end: '14:00' },
  },
  handoffCriteria: {
    complexityThreshold: 0.8,
    messageCountThreshold: 10,
    lowConfidenceThreshold: 0.4,
  },
};

// ============================================================================
// SINGLETON & FACTORY
// ============================================================================

let botInstance: WhatsAppBot | null = null;

export function getWhatsAppBot(config?: BotConfig): WhatsAppBot {
  if (!botInstance) {
    botInstance = new WhatsAppBot(config || DEFAULT_BOT_CONFIG);
  }
  return botInstance;
}

export function createWhatsAppBot(config: BotConfig): WhatsAppBot {
  return new WhatsAppBot(config);
}

export default WhatsAppBot;
