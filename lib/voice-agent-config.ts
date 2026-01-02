/**
 * Voice Agent Configuration System - Open Source Stack
 * Sistema de configuración de agentes de voz con Vocode + Coqui + Whisper + Llama
 * 
 * Stack:
 * - Voice Platform: Vocode (Python framework, open source)
 * - TTS: Coqui XTTS v2 (open source, español nativo)
 * - STT: Whisper Large v3 (OpenAI open source)
 * - LLM: Llama 3.1 70B (Meta open source)
 * - Telephony: Twilio (números PSTN básicos)
 * 
 * Costos mensuales: €50-70 (vs €220 propietario, 73% ahorro)
 * 
 * @module voice-agent-config
 */

/**
 * Voice provider types (open source)
 */
export type VoiceProvider = 'coqui-xtts' | 'piper' | 'bark';

/**
 * STT provider types (open source)
 */
export type STTProvider = 'whisper' | 'vosk' | 'kaldi';

/**
 * LLM provider types (open source)
 */
export type LLMProvider = 'llama' | 'mistral' | 'falcon';

/**
 * Language types
 */
export type Language = 'es-ES' | 'en-US' | 'ca-ES';

/**
 * Voice agent types
 */
export type AgentType = 
  | 'property-inquiry'
  | 'appointment-booking'
  | 'general-inquiry'
  | 'property-valuation'
  | 'investor-consultation';

/**
 * Voice configuration (Coqui XTTS v2)
 */
export interface VoiceConfig {
  provider: VoiceProvider;
  model: string; // 'xtts_v2'
  voiceId?: string; // Para voice cloning
  voiceSample?: string; // Path al audio de referencia (22+ segundos)
  language: Language;
  speed: number; // 0.5-2.0
  temperature: number; // 0.1-1.0 (variabilidad)
  enableStreaming: boolean;
}

/**
 * STT configuration (Whisper Large v3)
 */
export interface STTConfig {
  provider: STTProvider;
  model: string; // 'large-v3', 'medium', 'small'
  language: Language;
  enableTimestamps: boolean;
  enableWordTimestamps: boolean;
  enableVAD: boolean; // Voice Activity Detection
  vadThreshold: number; // 0.0-1.0
}

/**
 * LLM configuration (Llama 3.1 70B)
 */
export interface LLMConfig {
  provider: LLMProvider;
  model: string; // 'llama-3.1-70b-instruct', 'llama-3.1-8b-instruct'
  temperature: number; // 0.0-1.0
  maxTokens: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
  contextWindow: number; // 128000 for Llama 3.1
  enableFunctionCalling: boolean;
}

/**
 * Agent configuration
 */
export interface VoiceAgentConfig {
  id: string;
  name: string;
  type: AgentType;
  language: Language;
  
  // Voice components (open source)
  voice: VoiceConfig;
  stt: STTConfig;
  llm: LLMConfig;
  
  // Conversation settings
  greeting: string;
  systemPrompt: string;
  maxDuration: number; // seconds
  endCallPhrases: string[];
  escalationTriggers: string[];
  
  // Business hours
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: Array<{
      day: number; // 0-6 (Sunday-Saturday)
      start: string; // HH:MM
      end: string; // HH:MM
    }>;
  };
  
  // Fallback behavior
  fallback: {
    enabled: boolean;
    message: string;
    action: 'voicemail' | 'callback' | 'transfer';
    transferNumber?: string;
  };
}

/**
 * Coqui XTTS v2 voice samples (español nativo)
 * Estas son voces pre-entrenadas en español con alta calidad
 */
export const COQUI_VOICES = {
  spanish: {
    male: {
      professional: 'es_male_professional',
      friendly: 'es_male_friendly',
      formal: 'es_male_formal',
    },
    female: {
      professional: 'es_female_professional',
      friendly: 'es_female_friendly',
      formal: 'es_female_formal',
    },
  },
  english: {
    male: {
      professional: 'en_male_professional',
      friendly: 'en_male_friendly',
    },
    female: {
      professional: 'en_female_professional',
      friendly: 'en_female_friendly',
    },
  },
};

/**
 * Default voice configurations (open source)
 */
export const DEFAULT_VOICE_CONFIGS: Record<Language, VoiceConfig> = {
  'es-ES': {
    provider: 'coqui-xtts',
    model: 'xtts_v2',
    voiceId: COQUI_VOICES.spanish.male.professional,
    language: 'es-ES',
    speed: 1.0,
    temperature: 0.65,
    enableStreaming: true,
  },
  'en-US': {
    provider: 'coqui-xtts',
    model: 'xtts_v2',
    voiceId: COQUI_VOICES.english.male.professional,
    language: 'en-US',
    speed: 1.0,
    temperature: 0.65,
    enableStreaming: true,
  },
  'ca-ES': {
    provider: 'coqui-xtts',
    model: 'xtts_v2',
    voiceId: COQUI_VOICES.spanish.male.professional,
    language: 'es-ES',
    speed: 1.0,
    temperature: 0.65,
    enableStreaming: true,
  },
};

/**
 * Default STT configurations (Whisper)
 */
export const DEFAULT_STT_CONFIGS: Record<Language, STTConfig> = {
  'es-ES': {
    provider: 'whisper',
    model: 'large-v3',
    language: 'es-ES',
    enableTimestamps: true,
    enableWordTimestamps: false,
    enableVAD: true,
    vadThreshold: 0.5,
  },
  'en-US': {
    provider: 'whisper',
    model: 'large-v3',
    language: 'en-US',
    enableTimestamps: true,
    enableWordTimestamps: false,
    enableVAD: true,
    vadThreshold: 0.5,
  },
  'ca-ES': {
    provider: 'whisper',
    model: 'large-v3',
    language: 'es-ES',
    enableTimestamps: true,
    enableWordTimestamps: false,
    enableVAD: true,
    vadThreshold: 0.5,
  },
};

/**
 * Default LLM configurations (Llama 3.1)
 */
export const DEFAULT_LLM_CONFIGS: Record<string, LLMConfig> = {
  'high-quality': {
    provider: 'llama',
    model: 'llama-3.1-70b-instruct',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    topK: 50,
    repeatPenalty: 1.1,
    contextWindow: 128000,
    enableFunctionCalling: true,
  },
  'fast': {
    provider: 'llama',
    model: 'llama-3.1-8b-instruct',
    temperature: 0.7,
    maxTokens: 1024,
    topP: 0.9,
    topK: 50,
    repeatPenalty: 1.1,
    contextWindow: 128000,
    enableFunctionCalling: true,
  },
  'balanced': {
    provider: 'llama',
    model: 'llama-3.1-70b-instruct',
    temperature: 0.6,
    maxTokens: 1536,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    contextWindow: 128000,
    enableFunctionCalling: true,
  },
};

/**
 * Predefined agent configurations (open source stack)
 */
export const AGENT_CONFIGS: Record<AgentType, Omit<VoiceAgentConfig, 'id'>> = {
  'property-inquiry': {
    name: 'Asistente de Propiedades',
    type: 'property-inquiry',
    language: 'es-ES',
    voice: DEFAULT_VOICE_CONFIGS['es-ES'],
    stt: DEFAULT_STT_CONFIGS['es-ES'],
    llm: DEFAULT_LLM_CONFIGS['high-quality'],
    greeting: 'Buenos días, le habla el asistente virtual de Anclora Private Estates. ¿En qué puedo ayudarle hoy?',
    systemPrompt: `Eres un asistente virtual profesional de Anclora Private Estates, una agencia inmobiliaria de lujo en Mallorca.

Tu objetivo es:
1. Saludar de forma cálida y profesional
2. Identificar qué tipo de propiedad busca el cliente
3. Recopilar información clave: presupuesto, zona preferida, características deseadas
4. Ofrecer agendar una visita o reunión con un agente
5. Capturar datos de contacto para seguimiento

Comportamiento:
- Sé cortés, profesional y servicial
- Habla de forma natural y fluida
- Haz preguntas abiertas para entender las necesidades
- Si no sabes algo, di que un agente especializado le ayudará
- Nunca inventes información sobre propiedades
- Si el cliente pide hablar con un humano, transfiere inmediatamente

Información de la empresa:
- Anclora Private Estates se especializa en propiedades de lujo en Mallorca
- Zonas principales: Puerto Portals, Son Vida, Calvià, Port d'Andratx, Pollença
- Presupuestos típicos: desde €1M hasta €20M+
- Servicios: compra, venta, inversión, golden visa

Tienes acceso a las siguientes funciones que puedes llamar:
- search_properties: Buscar propiedades por criterios
- create_lead: Crear lead en el CRM
- book_appointment: Agendar cita
- send_property_info: Enviar información por email/WhatsApp
- transfer_to_human: Transferir a agente humano`,
    maxDuration: 600,
    endCallPhrases: ['hasta luego', 'adiós', 'gracias por su tiempo', 'no necesito nada más', 'eso es todo'],
    escalationTriggers: ['hablar con un humano', 'hablar con un agente', 'no entiendes', 'esto no funciona', 'quiero hablar con alguien', 'conectar con persona'],
    businessHours: {
      enabled: true,
      timezone: 'Europe/Madrid',
      schedule: [
        { day: 1, start: '09:00', end: '19:00' },
        { day: 2, start: '09:00', end: '19:00' },
        { day: 3, start: '09:00', end: '19:00' },
        { day: 4, start: '09:00', end: '19:00' },
        { day: 5, start: '09:00', end: '19:00' },
        { day: 6, start: '10:00', end: '14:00' },
      ],
    },
    fallback: {
      enabled: true,
      message: 'En este momento nuestros agentes no están disponibles. ¿Desea dejar un mensaje o que le llamemos mañana?',
      action: 'voicemail',
    },
  },

  'appointment-booking': {
    name: 'Asistente de Citas',
    type: 'appointment-booking',
    language: 'es-ES',
    voice: DEFAULT_VOICE_CONFIGS['es-ES'],
    stt: DEFAULT_STT_CONFIGS['es-ES'],
    llm: DEFAULT_LLM_CONFIGS['fast'],
    greeting: 'Buenos días, soy el asistente de citas de Anclora Private Estates. ¿Le gustaría agendar una visita a una propiedad o una reunión con nuestro equipo?',
    systemPrompt: `Eres un asistente especializado en agendar citas para Anclora Private Estates.

Tu objetivo es:
1. Confirmar qué tipo de cita desea (visita propiedad, reunión oficina, videollamada)
2. Recopilar fecha y hora preferida
3. Confirmar datos de contacto (nombre, teléfono, email)
4. Enviar confirmación

Disponibilidad:
- Lunes a Viernes: 09:00 - 19:00
- Sábados: 10:00 - 14:00
- Domingos: Cerrado

Comportamiento:
- Sé eficiente pero amable
- Confirma todos los detalles antes de finalizar
- Si la fecha no está disponible, ofrece alternativas
- Recuerda los datos de contacto para la confirmación

Tipos de cita:
- Visita a propiedad: Requiere dirección de la propiedad
- Reunión en oficina: Oficina en Palma de Mallorca
- Videollamada: Zoom o Google Meet`,
    maxDuration: 300,
    endCallPhrases: ['confirmado', 'perfecto', 'hasta luego', 'gracias'],
    escalationTriggers: ['hablar con un humano', 'cambiar la cita', 'cancelar'],
    businessHours: {
      enabled: true,
      timezone: 'Europe/Madrid',
      schedule: [
        { day: 1, start: '09:00', end: '19:00' },
        { day: 2, start: '09:00', end: '19:00' },
        { day: 3, start: '09:00', end: '19:00' },
        { day: 4, start: '09:00', end: '19:00' },
        { day: 5, start: '09:00', end: '19:00' },
        { day: 6, start: '10:00', end: '14:00' },
      ],
    },
    fallback: {
      enabled: true,
      message: 'Puedo tomar nota de su solicitud y un agente le contactará en horario de oficina.',
      action: 'callback',
    },
  },

  'general-inquiry': {
    name: 'Asistente General',
    type: 'general-inquiry',
    language: 'es-ES',
    voice: DEFAULT_VOICE_CONFIGS['es-ES'],
    stt: DEFAULT_STT_CONFIGS['es-ES'],
    llm: DEFAULT_LLM_CONFIGS['balanced'],
    greeting: 'Buenos días, le habla Anclora Private Estates. ¿En qué puedo ayudarle?',
    systemPrompt: `Eres el asistente virtual general de Anclora Private Estates.

Puedes ayudar con:
- Información general sobre la empresa
- Servicios ofrecidos
- Proceso de compra/venta
- Golden Visa
- Inversión inmobiliaria en Mallorca
- Dirigir a departamentos específicos

Información general:
- Anclora Private Estates: Inmobiliaria de lujo en Mallorca desde 2018
- Especialización: Propiedades premium €1M - €20M+
- Servicios: Compra, venta, inversión, golden visa, gestión patrimonial
- Ubicación: Palma de Mallorca
- Equipo: Agentes especializados multilingües

Golden Visa:
- Inversión mínima: €500,000 en propiedad
- Beneficios: Residencia en España para toda la familia
- Proceso: 3-6 meses
- Anclora gestiona todo el proceso

Comportamiento:
- Sé informativo y profesional
- Si la consulta es compleja, ofrece transferir a un especialista
- Captura datos de contacto para seguimiento`,
    maxDuration: 600,
    endCallPhrases: ['gracias por la información', 'eso es todo', 'hasta luego'],
    escalationTriggers: ['hablar con especialista', 'más información', 'hablar con agente'],
    businessHours: {
      enabled: true,
      timezone: 'Europe/Madrid',
      schedule: [
        { day: 1, start: '09:00', end: '19:00' },
        { day: 2, start: '09:00', end: '19:00' },
        { day: 3, start: '09:00', end: '19:00' },
        { day: 4, start: '09:00', end: '19:00' },
        { day: 5, start: '09:00', end: '19:00' },
        { day: 6, start: '10:00', end: '14:00' },
      ],
    },
    fallback: {
      enabled: true,
      message: 'Nuestros agentes no están disponibles. ¿Desea que le enviemos información por WhatsApp o email?',
      action: 'voicemail',
    },
  },

  'property-valuation': {
    name: 'Asistente de Valoración',
    type: 'property-valuation',
    language: 'es-ES',
    voice: DEFAULT_VOICE_CONFIGS['es-ES'],
    stt: DEFAULT_STT_CONFIGS['es-ES'],
    llm: DEFAULT_LLM_CONFIGS['balanced'],
    greeting: 'Buenos días, soy el asistente de valoraciones de Anclora. ¿Desea conocer el valor de mercado de su propiedad?',
    systemPrompt: `Eres un asistente especializado en valoraciones de propiedades.

Tu objetivo es:
1. Recopilar información básica de la propiedad
2. Agendar visita para valoración presencial (gratuita)
3. Capturar datos de contacto del propietario

Información a recopilar:
- Ubicación exacta (zona, calle si es posible)
- Tipo de propiedad (villa, apartamento, terreno)
- Metros cuadrados
- Número de dormitorios y baños
- Características especiales (piscina, vistas, jardín)
- Estado de conservación
- Año de construcción (aproximado)

Proceso:
- La valoración presencial es gratuita y sin compromiso
- Un agente especializado visitará la propiedad
- Valoración completa en 24-48 horas
- Informe detallado de mercado incluido

Comportamiento:
- Sé profesional y detallado
- Explica que la valoración presencial es más precisa
- Ofrece agendar visita en fecha conveniente`,
    maxDuration: 600,
    endCallPhrases: ['gracias', 'perfecto', 'nos vemos'],
    escalationTriggers: ['valoración urgente', 'hablar con tasador', 'más información'],
    businessHours: {
      enabled: true,
      timezone: 'Europe/Madrid',
      schedule: [
        { day: 1, start: '09:00', end: '19:00' },
        { day: 2, start: '09:00', end: '19:00' },
        { day: 3, start: '09:00', end: '19:00' },
        { day: 4, start: '09:00', end: '19:00' },
        { day: 5, start: '09:00', end: '19:00' },
      ],
    },
    fallback: {
      enabled: true,
      message: 'Podemos enviarle información sobre nuestro servicio de valoración. ¿Prefiere WhatsApp o email?',
      action: 'callback',
    },
  },

  'investor-consultation': {
    name: 'Asistente de Inversión',
    type: 'investor-consultation',
    language: 'es-ES',
    voice: DEFAULT_VOICE_CONFIGS['es-ES'],
    stt: DEFAULT_STT_CONFIGS['es-ES'],
    llm: DEFAULT_LLM_CONFIGS['high-quality'],
    greeting: 'Buenos días, soy el asistente de inversiones de Anclora. ¿Está interesado en invertir en propiedades de lujo en Mallorca?',
    systemPrompt: `Eres un asistente especializado en inversión inmobiliaria de lujo.

Tu objetivo es:
1. Identificar el perfil de inversión
2. Recopilar información sobre presupuesto y objetivos
3. Agendar consultoría con especialista en inversión

Perfiles de inversión:
- Buy-to-let (alquiler vacacional/largo plazo)
- Capital appreciation (revalorización)
- Golden Visa (residencia + inversión)
- Diversificación de portfolio

Información a recopilar:
- Presupuesto de inversión
- Objetivo principal (rentabilidad, residencia, diversificación)
- Horizonte temporal
- Preferencia de zona
- Experiencia previa en inversión inmobiliaria

Servicios de Anclora para inversores:
- Análisis de mercado personalizado
- Proyecciones de rentabilidad
- Gestión integral de alquiler
- Asesoría fiscal y legal
- Golden Visa assistance
- Due diligence completo

Comportamiento:
- Sé profesional y conocedor
- Enfócate en objetivos financieros
- Ofrece análisis personalizado con especialista
- Menciona casos de éxito (ROI 8-12% anual típico)`,
    maxDuration: 900,
    endCallPhrases: ['gracias', 'perfecto', 'hasta pronto'],
    escalationTriggers: ['hablar con especialista', 'consultoría ahora', 'más detalles'],
    businessHours: {
      enabled: true,
      timezone: 'Europe/Madrid',
      schedule: [
        { day: 1, start: '09:00', end: '19:00' },
        { day: 2, start: '09:00', end: '19:00' },
        { day: 3, start: '09:00', end: '19:00' },
        { day: 4, start: '09:00', end: '19:00' },
        { day: 5, start: '09:00', end: '19:00' },
      ],
    },
    fallback: {
      enabled: true,
      message: 'Podemos enviarle nuestro dossier de inversión. ¿Prefiere recibirlo por email?',
      action: 'callback',
    },
  },
};

/**
 * Create agent configuration
 */
export function createAgentConfig(
  type: AgentType,
  overrides?: Partial<VoiceAgentConfig>
): VoiceAgentConfig {
  const baseConfig = AGENT_CONFIGS[type];
  const id = `agent-${type}-${Date.now()}`;
  
  return {
    id,
    ...baseConfig,
    ...overrides,
  };
}

/**
 * Validate agent configuration
 */
export function validateAgentConfig(
  config: VoiceAgentConfig
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.id) errors.push('Agent ID is required');
  if (!config.name) errors.push('Agent name is required');
  if (!config.greeting) errors.push('Greeting is required');
  if (!config.systemPrompt) errors.push('System prompt is required');
  
  if (config.maxDuration < 60 || config.maxDuration > 3600) {
    errors.push('Max duration must be between 60 and 3600 seconds');
  }
  
  if (!config.voice.provider) errors.push('Voice provider is required');
  if (!config.voice.model) errors.push('Voice model is required');
  if (!config.stt.provider) errors.push('STT provider is required');
  if (!config.stt.model) errors.push('STT model is required');
  if (!config.llm.provider) errors.push('LLM provider is required');
  if (!config.llm.model) errors.push('LLM model is required');
  
  if (config.businessHours.enabled) {
    if (!config.businessHours.timezone) {
      errors.push('Timezone is required when business hours enabled');
    }
    if (config.businessHours.schedule.length === 0) {
      errors.push('At least one business hour schedule is required');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if agent is available
 */
export function isAgentAvailable(
  config: VoiceAgentConfig,
  date: Date = new Date()
): boolean {
  if (!config.businessHours.enabled) return true;
  
  const day = date.getDay();
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const schedule = config.businessHours.schedule.find(s => s.day === day);
  
  if (!schedule) return false;
  return time >= schedule.start && time <= schedule.end;
}

/**
 * Get next available slot
 */
export function getNextAvailableSlot(
  config: VoiceAgentConfig,
  fromDate: Date = new Date()
): Date | null {
  if (!config.businessHours.enabled) return fromDate;
  
  const maxDaysToCheck = 7;
  const currentDate = new Date(fromDate);
  
  for (let i = 0; i < maxDaysToCheck; i++) {
    const day = currentDate.getDay();
    const schedule = config.businessHours.schedule.find(s => s.day === day);
    
    if (schedule) {
      const [startHour, startMinute] = schedule.start.split(':').map(Number);
      const availableDate = new Date(currentDate);
      availableDate.setHours(startHour, startMinute, 0, 0);
      
      if (availableDate > fromDate) return availableDate;
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0);
  }
  
  return null;
}

const voiceAgentConfig = {
  COQUI_VOICES,
  DEFAULT_VOICE_CONFIGS,
  DEFAULT_STT_CONFIGS,
  DEFAULT_LLM_CONFIGS,
  AGENT_CONFIGS,
  createAgentConfig,
  validateAgentConfig,
  isAgentAvailable,
  getNextAvailableSlot,
};

export default voiceAgentConfig;
