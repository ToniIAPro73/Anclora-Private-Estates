/**
 * Voice Agent Type Definitions - Open Source Stack
 * Tipos para Vocode + Coqui XTTS + Whisper + Llama 3.1
 * 
 * @module types/voice-agent
 */

import type { AgentType, VoiceConfig, STTConfig, LLMConfig } from '../lib/voice-agent-config';
import type { CallPriority } from '../lib/voice-agent-routing';

/**
 * Vocode Conversation Configuration
 * github.com/vocodedev/vocode-python
 */
export interface VocodeConversationConfig {
  id: string;
  phoneNumber: string;
  agent: {
    type: AgentType;
    systemPrompt: string;
    initialMessage: string;
    endConversationPhrases: string[];
    maxDuration: number; // seconds
  };
  synthesizer: VoiceConfig;
  transcriber: STTConfig;
  llm: LLMConfig;
  recordingEnabled: boolean;
  webhookUrl?: string;
}

/**
 * Vocode Call Status
 */
export type VocodeCallStatus =
  | 'queued'
  | 'ringing'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'busy'
  | 'no-answer'
  | 'canceled';

/**
 * Vocode Call Object
 */
export interface VocodeCall {
  id: string;
  conversationId: string;
  phoneNumber: string;
  direction: 'inbound' | 'outbound';
  status: VocodeCallStatus;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number; // seconds
  transcript?: VocodeTranscript[];
  recording?: {
    url: string;
    duration: number;
    size: number; // bytes
  };
  cost: number; // euros
}

/**
 * Vocode Transcript Entry
 */
export interface VocodeTranscript {
  timestamp: Date;
  speaker: 'agent' | 'user';
  text: string;
  confidence: number; // 0-1
  duration: number; // milliseconds
}

/**
 * Vocode Webhook Event
 */
export interface VocodeWebhookEvent {
  type:
    | 'conversation.started'
    | 'conversation.ended'
    | 'message.sent'
    | 'message.received'
    | 'function.called'
    | 'transcript.updated'
    | 'error';
  conversation: {
    id: string;
    phoneNumber: string;
    agentType: AgentType;
  };
  timestamp: Date;
  data: Record<string, unknown>;
}

/**
 * Twilio Phone Number Configuration
 */
export interface TwilioPhoneNumber {
  id: string;
  number: string;
  friendlyName: string;
  voiceUrl: string; // Vocode webhook URL
  statusCallback?: string;
  capabilities: {
    voice: boolean;
    SMS: boolean;
    MMS: boolean;
  };
}

/**
 * Voice Agent Session
 */
export interface VoiceAgentSession {
  id: string;
  callId: string;
  agentType: AgentType;
  phoneNumber: string;
  language: 'es-ES' | 'en-US' | 'ca-ES';
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'paused' | 'ended';
  context: SessionContext;
  events: SessionEvent[];
}

/**
 * Session Context
 */
export interface SessionContext {
  userId?: string;
  userName?: string;
  userEmail?: string;
  callDirection: 'inbound' | 'outbound';
  callSource: 'direct' | 'website' | 'campaign' | 'referral';
  currentIntent?: string;
  currentTopic?: string;
  conversationStage: 'greeting' | 'discovery' | 'qualification' | 'closing' | 'ended';
  extractedData: {
    budget?: number;
    location?: string;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    features?: string[];
    timeline?: string;
    purpose?: string;
    financing?: string;
    citizenship?: string;
    goldenVisa?: boolean;
  };
  sentimentHistory: Array<{
    timestamp: Date;
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number; // -1 to 1
  }>;
  escalationAttempts: number;
  escalationReasons: string[];
}

/**
 * Session Event
 */
export interface SessionEvent {
  id: string;
  timestamp: Date;
  type:
    | 'call-started'
    | 'call-ended'
    | 'message-sent'
    | 'message-received'
    | 'function-called'
    | 'function-executed'
    | 'escalation-triggered'
    | 'transfer-executed'
    | 'data-extracted'
    | 'sentiment-changed'
    | 'error';
  data: Record<string, unknown>;
}

/**
 * Lead Qualification Result
 */
export interface LeadQualificationResult {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  classification: 'investor' | 'end-user' | 'b2b-agent' | 'unqualified';
  confidence: number; // 0-1
  factors: {
    budget: number; // 0-25
    timeline: number; // 0-20
    intent: number; // 0-25
    engagement: number; // 0-15
    dataQuality: number; // 0-15
  };
  recommendations: string[];
  nextAction: 'immediate-contact' | 'scheduled-callback' | 'nurture' | 'disqualify';
  priority: CallPriority;
}

/**
 * Conversation Analysis
 */
export interface ConversationAnalysis {
  speech: {
    userTalkTime: number; // percentage
    agentTalkTime: number; // percentage
    silenceTime: number; // percentage
    interruptions: number;
    talkSpeed: number; // words per minute
  };
  content: {
    topics: string[];
    questions: {
      asked: number;
      answered: number;
      unanswered: number;
    };
    objections: string[];
    positiveSignals: string[];
    negativeSignals: string[];
  };
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    score: number; // -1 to 1
    trajectory: 'improving' | 'stable' | 'declining';
    keyMoments: Array<{
      timestamp: Date;
      sentiment: 'positive' | 'neutral' | 'negative';
      trigger: string;
    }>;
  };
  outcome: {
    achieved: boolean;
    type: string;
    confidence: number;
    nextSteps: string[];
  };
  quality: {
    score: number; // 0-100
    completeness: number; // 0-1
    clarity: number; // 0-1
    professionalism: number; // 0-1
  };
}

/**
 * Voice Agent Settings
 */
export interface VoiceAgentSettings {
  personality: {
    tone: 'professional' | 'friendly' | 'formal';
    verbosity: 'concise' | 'balanced' | 'detailed';
    empathy: number; // 0-1
    assertiveness: number; // 0-1
  };
  conversation: {
    maxTurns: number;
    maxDuration: number; // seconds
    idleTimeout: number; // seconds
    confirmationRequired: boolean;
    repeatTolerance: number;
  };
  language: {
    primary: 'es-ES' | 'en-US' | 'ca-ES';
    fallback: 'es-ES' | 'en-US';
    autoDetect: boolean;
    multilingualSupport: boolean;
  };
  integration: {
    crmEnabled: boolean;
    crmSystem: 'twenty' | 'hubspot' | 'salesforce';
    calendarEnabled: boolean;
    calendarSystem: 'google' | 'outlook';
    whatsappEnabled: boolean;
    emailEnabled: boolean;
  };
  compliance: {
    recordingDisclosure: boolean;
    dataRetention: number; // days
    gdprCompliant: boolean;
    hipaaCompliant: boolean;
    callRecording: boolean;
  };
}

/**
 * Function Definition (for Llama 3.1 function calling)
 */
export interface LlamaFunction {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
      required?: boolean;
    }>;
    required: string[];
  };
}

/**
 * Available Functions
 */
export const VOICE_AGENT_FUNCTIONS: LlamaFunction[] = [
  {
    name: 'search_properties',
    description: 'Search for properties in the database based on criteria',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'Location/zone in Mallorca (e.g., "Son Vida", "Puerto Portals")',
          required: true,
        },
        min_budget: {
          type: 'number',
          description: 'Minimum budget in euros',
        },
        max_budget: {
          type: 'number',
          description: 'Maximum budget in euros',
        },
        property_type: {
          type: 'string',
          description: 'Type of property',
          enum: ['villa', 'apartment', 'penthouse', 'land', 'commercial'],
        },
        bedrooms: {
          type: 'number',
          description: 'Minimum number of bedrooms',
        },
      },
      required: ['location'],
    },
  },
  {
    name: 'check_availability',
    description: 'Check availability for appointments or viewings',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Preferred date in YYYY-MM-DD format',
          required: true,
        },
        time_preference: {
          type: 'string',
          description: 'Time preference',
          enum: ['morning', 'afternoon', 'evening'],
        },
        appointment_type: {
          type: 'string',
          description: 'Type of appointment',
          enum: ['property-viewing', 'office-meeting', 'video-call'],
          required: true,
        },
      },
      required: ['date', 'appointment_type'],
    },
  },
  {
    name: 'book_appointment',
    description: 'Book an appointment for property viewing or meeting',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Appointment date in YYYY-MM-DD format',
          required: true,
        },
        time: {
          type: 'string',
          description: 'Appointment time in HH:MM format',
          required: true,
        },
        type: {
          type: 'string',
          description: 'Type of appointment',
          enum: ['property-viewing', 'office-meeting', 'video-call'],
          required: true,
        },
        contact_name: {
          type: 'string',
          description: 'Contact person name',
          required: true,
        },
        contact_phone: {
          type: 'string',
          description: 'Contact phone number',
          required: true,
        },
        contact_email: {
          type: 'string',
          description: 'Contact email address',
        },
        notes: {
          type: 'string',
          description: 'Additional notes or comments',
        },
      },
      required: ['date', 'time', 'type', 'contact_name', 'contact_phone'],
    },
  },
  {
    name: 'create_lead',
    description: 'Create a new lead in the CRM system',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Lead name',
          required: true,
        },
        phone: {
          type: 'string',
          description: 'Phone number',
          required: true,
        },
        email: {
          type: 'string',
          description: 'Email address',
        },
        budget: {
          type: 'number',
          description: 'Budget in euros',
        },
        location_preference: {
          type: 'string',
          description: 'Preferred location',
        },
        property_type: {
          type: 'string',
          description: 'Type of property interested in',
        },
        timeline: {
          type: 'string',
          description: 'Purchase timeline',
        },
        notes: {
          type: 'string',
          description: 'Additional notes',
        },
      },
      required: ['name', 'phone'],
    },
  },
  {
    name: 'send_property_info',
    description: 'Send property information to client via email or WhatsApp',
    parameters: {
      type: 'object',
      properties: {
        contact_method: {
          type: 'string',
          description: 'How to send the information',
          enum: ['email', 'whatsapp', 'both'],
          required: true,
        },
        email: {
          type: 'string',
          description: 'Email address (required if contact_method includes email)',
        },
        phone: {
          type: 'string',
          description: 'Phone number (required if contact_method includes whatsapp)',
        },
        property_ids: {
          type: 'array',
          description: 'List of property IDs to send information about',
        },
      },
      required: ['contact_method'],
    },
  },
  {
    name: 'transfer_to_human',
    description: 'Transfer the call to a human agent',
    parameters: {
      type: 'object',
      properties: {
        department: {
          type: 'string',
          description: 'Department to transfer to',
          enum: ['sales', 'investment', 'valuation', 'support', 'manager'],
          required: true,
        },
        reason: {
          type: 'string',
          description: 'Reason for transfer',
          required: true,
        },
        priority: {
          type: 'string',
          description: 'Transfer priority level',
          enum: ['low', 'medium', 'high', 'urgent'],
        },
      },
      required: ['department', 'reason'],
    },
  },
];

/**
 * Error types
 */
export class VoiceAgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'VoiceAgentError';
  }
}

export class VocodeAPIError extends VoiceAgentError {
  constructor(
    message: string,
    public statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message, 'VOCODE_API_ERROR', details);
    this.name = 'VocodeAPIError';
  }
}

export class EscalationError extends VoiceAgentError {
  constructor(
    message: string,
    public reason: string,
    details?: Record<string, unknown>
  ) {
    super(message, 'ESCALATION_ERROR', details);
    this.name = 'EscalationError';
  }
}

/**
 * Export all types
 */
export type {
  VocodeConversationConfig,
  VocodeCallStatus,
  VocodeCall,
  VocodeTranscript,
  VocodeWebhookEvent,
  TwilioPhoneNumber,
  VoiceAgentSession,
  SessionContext,
  SessionEvent,
  LeadQualificationResult,
  ConversationAnalysis,
  VoiceAgentSettings,
  LlamaFunction,
};

export {
  VOICE_AGENT_FUNCTIONS,
  VoiceAgentError,
  VocodeAPIError,
  EscalationError,
};
