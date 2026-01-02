/**
 * Voice Agent Routing & Escalation System - Open Source Stack
 * Sistema de enrutamiento y escalación para Vocode + Llama 3.1
 * 
 * @module voice-agent-routing
 */

import type { AgentType } from './voice-agent-config';

/**
 * Escalation priority levels
 */
export type EscalationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * Call priority levels
 */
export type CallPriority = EscalationPriority;

/**
 * Transfer destination types
 */
export type TransferDestination = 
  | 'sales-team'
  | 'investment-team'
  | 'valuation-team'
  | 'support-team'
  | 'manager'
  | 'voicemail';

/**
 * Escalation rule
 */
export interface EscalationRule {
  id: string;
  name: string;
  triggers: string[];
  priority: EscalationPriority;
  maxRetries: number;
  destination: TransferDestination;
  message?: string;
}

/**
 * Routing rule
 */
export interface RoutingRule {
  id: string;
  name: string;
  conditions: Array<{
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
    value: string | number | boolean;
  }>;
  destination: AgentType;
  priority: number;
}

/**
 * Transfer destination configuration
 */
export interface TransferConfig {
  destination: TransferDestination;
  phoneNumber: string;
  availability: {
    enabled: boolean;
    schedule: Array<{
      day: number;
      start: string;
      end: string;
    }>;
  };
}

/**
 * Escalation rules configuration
 */
export const ESCALATION_RULES: EscalationRule[] = [
  {
    id: 'user-request',
    name: 'User Requests Human',
    triggers: [
      'hablar con una persona',
      'hablar con un humano',
      'hablar con un agente',
      'necesito hablar con alguien',
      'conectar con persona',
    ],
    priority: 'HIGH',
    maxRetries: 0,
    destination: 'sales-team',
    message: 'Entiendo. Le transfiero con un agente inmediatamente.',
  },
  {
    id: 'complexity',
    name: 'Query Too Complex',
    triggers: [
      'más información',
      'detalles específicos',
      'asesoramiento legal',
      'asesoramiento fiscal',
      'contrato',
      'documentación',
    ],
    priority: 'MEDIUM',
    maxRetries: 1,
    destination: 'sales-team',
    message: 'Esta consulta requiere un especialista. Permítame transferirle.',
  },
  {
    id: 'no-understanding',
    name: 'Comprehension Failure',
    triggers: [
      'no me entiendes',
      'no entiendes',
      'esto no funciona',
      'no sirves',
    ],
    priority: 'MEDIUM',
    maxRetries: 2,
    destination: 'support-team',
    message: 'Disculpe las molestias. Le conecto con un agente que puede ayudarle mejor.',
  },
  {
    id: 'high-value',
    name: 'High Value Client',
    triggers: [
      '5 millones',
      '10 millones',
      '15 millones',
      '20 millones',
      'presupuesto alto',
      'sin límite de presupuesto',
    ],
    priority: 'URGENT',
    maxRetries: 0,
    destination: 'manager',
    message: 'Perfecto. Le conecto con nuestro director para atenderle personalmente.',
  },
  {
    id: 'sentiment-negative',
    name: 'Negative Sentiment',
    triggers: [
      'molesto',
      'frustrado',
      'enojado',
      'indignado',
      'queja',
      'reclamación',
    ],
    priority: 'HIGH',
    maxRetries: 0,
    destination: 'manager',
    message: 'Lamento que esté teniendo esta experiencia. Le transfiero con un supervisor.',
  },
  {
    id: 'timeout',
    name: 'Call Duration Exceeded',
    triggers: [],
    priority: 'LOW',
    maxRetries: 1,
    destination: 'sales-team',
    message: 'Llevamos bastante tiempo. ¿Prefiere continuar con un agente?',
  },
];

/**
 * Routing rules configuration
 */
export const ROUTING_RULES: RoutingRule[] = [
  {
    id: 'high-value-investor',
    name: 'High Value Investor',
    conditions: [
      { field: 'budget', operator: 'gte', value: 5000000 },
    ],
    destination: 'investor-consultation',
    priority: 100,
  },
  {
    id: 'golden-visa',
    name: 'Golden Visa Interest',
    conditions: [
      { field: 'intent', operator: 'contains', value: 'golden visa' },
    ],
    destination: 'investor-consultation',
    priority: 95,
  },
  {
    id: 'investment-inquiry',
    name: 'Investment Inquiry',
    conditions: [
      { field: 'intent', operator: 'contains', value: 'inversión' },
    ],
    destination: 'investor-consultation',
    priority: 90,
  },
  {
    id: 'valuation-request',
    name: 'Valuation Request',
    conditions: [
      { field: 'intent', operator: 'contains', value: 'valoración' },
    ],
    destination: 'property-valuation',
    priority: 80,
  },
  {
    id: 'appointment-request',
    name: 'Appointment Request',
    conditions: [
      { field: 'intent', operator: 'contains', value: 'cita' },
    ],
    destination: 'appointment-booking',
    priority: 70,
  },
  {
    id: 'property-search',
    name: 'Property Search',
    conditions: [
      { field: 'intent', operator: 'contains', value: 'comprar' },
    ],
    destination: 'property-inquiry',
    priority: 60,
  },
  {
    id: 'default-general',
    name: 'Default General',
    conditions: [],
    destination: 'general-inquiry',
    priority: 1,
  },
];

/**
 * Transfer destinations
 */
export const TRANSFER_DESTINATIONS: TransferConfig[] = [
  {
    destination: 'sales-team',
    phoneNumber: process.env.SALES_TEAM_NUMBER || '+34971234567',
    availability: {
      enabled: true,
      schedule: [
        { day: 1, start: '09:00', end: '19:00' },
        { day: 2, start: '09:00', end: '19:00' },
        { day: 3, start: '09:00', end: '19:00' },
        { day: 4, start: '09:00', end: '19:00' },
        { day: 5, start: '09:00', end: '19:00' },
        { day: 6, start: '10:00', end: '14:00' },
      ],
    },
  },
  {
    destination: 'investment-team',
    phoneNumber: process.env.INVESTMENT_TEAM_NUMBER || '+34971234568',
    availability: {
      enabled: true,
      schedule: [
        { day: 1, start: '09:00', end: '19:00' },
        { day: 2, start: '09:00', end: '19:00' },
        { day: 3, start: '09:00', end: '19:00' },
        { day: 4, start: '09:00', end: '19:00' },
        { day: 5, start: '09:00', end: '19:00' },
      ],
    },
  },
  {
    destination: 'valuation-team',
    phoneNumber: process.env.VALUATION_TEAM_NUMBER || '+34971234569',
    availability: {
      enabled: true,
      schedule: [
        { day: 1, start: '09:00', end: '19:00' },
        { day: 2, start: '09:00', end: '19:00' },
        { day: 3, start: '09:00', end: '19:00' },
        { day: 4, start: '09:00', end: '19:00' },
        { day: 5, start: '09:00', end: '19:00' },
      ],
    },
  },
  {
    destination: 'support-team',
    phoneNumber: process.env.SUPPORT_TEAM_NUMBER || '+34971234570',
    availability: {
      enabled: true,
      schedule: [
        { day: 1, start: '09:00', end: '19:00' },
        { day: 2, start: '09:00', end: '19:00' },
        { day: 3, start: '09:00', end: '19:00' },
        { day: 4, start: '09:00', end: '19:00' },
        { day: 5, start: '09:00', end: '19:00' },
        { day: 6, start: '10:00', end: '14:00' },
      ],
    },
  },
  {
    destination: 'manager',
    phoneNumber: process.env.MANAGER_NUMBER || '+34971234571',
    availability: {
      enabled: true,
      schedule: [
        { day: 1, start: '09:00', end: '19:00' },
        { day: 2, start: '09:00', end: '19:00' },
        { day: 3, start: '09:00', end: '19:00' },
        { day: 4, start: '09:00', end: '19:00' },
        { day: 5, start: '09:00', end: '19:00' },
      ],
    },
  },
  {
    destination: 'voicemail',
    phoneNumber: process.env.VOICEMAIL_NUMBER || '+34971234572',
    availability: {
      enabled: true,
      schedule: Array.from({ length: 7 }, (_, i) => ({
        day: i,
        start: '00:00',
        end: '23:59',
      })),
    },
  },
];

/**
 * Evaluate escalation triggers
 */
export function evaluateEscalationTriggers(
  transcript: string,
  sentiment: 'positive' | 'neutral' | 'negative',
  duration: number
): EscalationRule | null {
  const lowerTranscript = transcript.toLowerCase();
  
  // Check sentiment-based escalation
  if (sentiment === 'negative') {
    const sentimentRule = ESCALATION_RULES.find(r => r.id === 'sentiment-negative');
    if (sentimentRule) return sentimentRule;
  }
  
  // Check duration timeout (9 minutes = 540 seconds)
  if (duration > 540) {
    const timeoutRule = ESCALATION_RULES.find(r => r.id === 'timeout');
    if (timeoutRule) return timeoutRule;
  }
  
  // Check trigger phrases
  for (const rule of ESCALATION_RULES) {
    for (const trigger of rule.triggers) {
      if (lowerTranscript.includes(trigger.toLowerCase())) {
        return rule;
      }
    }
  }
  
  return null;
}

/**
 * Determine routing destination
 */
export function determineRoutingDestination(
  context: Record<string, string | number | boolean | undefined>
): AgentType {
  // Sort rules by priority (highest first)
  const sortedRules = [...ROUTING_RULES].sort((a, b) => b.priority - a.priority);
  
  for (const rule of sortedRules) {
    let allConditionsMet = true;
    
    for (const condition of rule.conditions) {
      const value = context[condition.field];
      
      switch (condition.operator) {
        case 'eq':
          if (value !== condition.value) allConditionsMet = false;
          break;
        case 'ne':
          if (value === condition.value) allConditionsMet = false;
          break;
        case 'gt':
          if (!(value > condition.value)) allConditionsMet = false;
          break;
        case 'lt':
          if (!(value < condition.value)) allConditionsMet = false;
          break;
        case 'gte':
          if (!(value >= condition.value)) allConditionsMet = false;
          break;
        case 'lte':
          if (!(value <= condition.value)) allConditionsMet = false;
          break;
        case 'contains':
          if (!String(value).toLowerCase().includes(String(condition.value).toLowerCase())) {
            allConditionsMet = false;
          }
          break;
      }
      
      if (!allConditionsMet) break;
    }
    
    if (allConditionsMet) {
      return rule.destination;
    }
  }
  
  return 'general-inquiry';
}

/**
 * Calculate call priority
 */
export function calculateCallPriority(
  budget: number,
  sentiment: 'positive' | 'neutral' | 'negative',
  retries: number
): CallPriority {
  // URGENT: Very high budget OR (negative sentiment + high budget)
  if (budget >= 10000000 || (sentiment === 'negative' && budget >= 2000000)) {
    return 'URGENT';
  }
  
  // HIGH: High budget OR negative sentiment OR multiple retries
  if (budget >= 5000000 || sentiment === 'negative' || retries > 1) {
    return 'HIGH';
  }
  
  // MEDIUM: Medium budget OR some retries
  if (budget >= 2000000 || retries > 0) {
    return 'MEDIUM';
  }
  
  return 'LOW';
}

/**
 * Check team availability
 */
export function checkTeamAvailability(
  destination: TransferDestination,
  date: Date = new Date()
): { available: boolean; nextAvailable: Date | null; currentLoad: number; maxCapacity: number } {
  const config = TRANSFER_DESTINATIONS.find(d => d.destination === destination);
  
  if (!config || !config.availability.enabled) {
    return { available: false, nextAvailable: null, currentLoad: 0, maxCapacity: 0 };
  }
  
  const day = date.getDay();
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  
  const schedule = config.availability.schedule.find(s => s.day === day);
  
  if (!schedule) {
    return { available: false, nextAvailable: getNextAvailableTime(config, date), currentLoad: 0, maxCapacity: 0 };
  }
  
  const isAvailable = time >= schedule.start && time <= schedule.end;
  
  // Mock current load (in production, fetch from CRM/queue)
  const currentLoad = Math.floor(Math.random() * 8);
  const maxCapacity = 10;
  
  return {
    available: isAvailable && currentLoad < maxCapacity,
    nextAvailable: isAvailable ? null : getNextAvailableTime(config, date),
    currentLoad,
    maxCapacity,
  };
}

/**
 * Get next available time for team
 */
function getNextAvailableTime(config: TransferConfig, fromDate: Date): Date | null {
  const maxDaysToCheck = 7;
  const currentDate = new Date(fromDate);
  
  for (let i = 0; i < maxDaysToCheck; i++) {
    const day = currentDate.getDay();
    const schedule = config.availability.schedule.find(s => s.day === day);
    
    if (schedule) {
      const [startHour, startMinute] = schedule.start.split(':').map(Number);
      const availableDate = new Date(currentDate);
      availableDate.setHours(startHour, startMinute, 0, 0);
      
      if (availableDate > fromDate) {
        return availableDate;
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0);
  }
  
  return null;
}

/**
 * Execute transfer
 */
export async function executeTransfer(
  destination: TransferDestination,
  callId: string,
  reason: string
): Promise<{ success: boolean; transferNumber?: string; message: string }> {
  const availability = checkTeamAvailability(destination);
  
  if (!availability.available) {
    return {
      success: false,
      message: `El equipo de ${destination} no está disponible. ${
        availability.nextAvailable
          ? `Próxima disponibilidad: ${availability.nextAvailable.toLocaleString('es-ES')}`
          : 'No hay disponibilidad en los próximos 7 días.'
      }`,
    };
  }
  
  const config = TRANSFER_DESTINATIONS.find(d => d.destination === destination);
  
  if (!config) {
    return {
      success: false,
      message: 'Destino de transferencia no configurado.',
    };
  }
  
  // In production, execute actual transfer via Vocode/Twilio
  console.warn(`[TRANSFER] Call ${callId} transferring to ${destination} (${config.phoneNumber}) - Reason: ${reason}`);
  
  return {
    success: true,
    transferNumber: config.phoneNumber,
    message: `Transfiriendo a ${destination}...`,
  };
}

/**
 * Handle voicemail
 */
export async function handleVoicemail(
  callId: string,
  phoneNumber: string,
  transcription: string
): Promise<{ success: boolean; message: string }> {
  console.warn(`[VOICEMAIL] Call ${callId} from ${phoneNumber}`);
  console.warn(`[VOICEMAIL] Transcription: ${transcription}`);
  
  // In production:
  // 1. Save voicemail recording
  // 2. Create lead in CRM (Twenty)
  // 3. Schedule follow-up task
  // 4. Send confirmation SMS/email
  
  return {
    success: true,
    message: 'Hemos recibido su mensaje. Un agente le contactará dentro de 24 horas.',
  };
}

/**
 * Schedule callback
 */
export async function scheduleCallback(
  phoneNumber: string,
  preferredDate: Date,
  notes: string
): Promise<{ success: boolean; scheduledTime: Date; message: string }> {
  // Find next available slot
  const availability = checkTeamAvailability('sales-team', preferredDate);
  
  let scheduledTime = preferredDate;
  
  if (!availability.available && availability.nextAvailable) {
    scheduledTime = availability.nextAvailable;
  }
  
  console.warn(`[CALLBACK] Scheduled for ${phoneNumber} at ${scheduledTime.toISOString()}`);
  console.warn(`[CALLBACK] Notes: ${notes}`);
  
  // In production:
  // 1. Create task in CRM
  // 2. Send calendar invite
  // 3. Set reminder
  // 4. Send confirmation SMS
  
  return {
    success: true,
    scheduledTime,
    message: `Hemos agendado su llamada para el ${scheduledTime.toLocaleString('es-ES')}. Recibirá una confirmación por SMS.`,
  };
}

const voiceAgentRouting = {
  ESCALATION_RULES,
  ROUTING_RULES,
  TRANSFER_DESTINATIONS,
  evaluateEscalationTriggers,
  determineRoutingDestination,
  calculateCallPriority,
  checkTeamAvailability,
  executeTransfer,
  handleVoicemail,
  scheduleCallback,
};

export default voiceAgentRouting;
