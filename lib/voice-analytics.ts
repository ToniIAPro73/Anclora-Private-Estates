/**
 * Voice Agent Analytics System - Open Source Stack
 * Sistema de analíticas para Vocode + Coqui + Whisper + Llama
 * 
 * Costos: €0.05/llamada (vs €0.10 propietario, 50% ahorro)
 * 
 * @module voice-analytics
 */

import type { AgentType } from './voice-agent-config';
import type { CallPriority } from './voice-agent-routing';

/**
 * Call status types
 */
export type CallStatus = 
  | 'answered'
  | 'missed'
  | 'voicemail'
  | 'transferred'
  | 'completed'
  | 'failed';

/**
 * Call outcome types
 */
export type CallOutcome =
  | 'lead-captured'
  | 'appointment-booked'
  | 'information-provided'
  | 'transferred'
  | 'voicemail'
  | 'abandoned';

/**
 * Sentiment types
 */
export type Sentiment = 'positive' | 'neutral' | 'negative';

/**
 * Call record
 */
export interface CallRecord {
  id: string;
  agentType: AgentType;
  phoneNumber: string;
  startTime: Date;
  endTime: Date;
  duration: number; // seconds
  status: CallStatus;
  outcome: CallOutcome;
  priority: CallPriority;
  sentiment: Sentiment;
  transcript: string;
  summary: string;
  extractedData: Record<string, unknown>;
  escalated: boolean;
  escalationReason?: string;
  transferDestination?: string;
  recordingUrl?: string;
  cost: number; // euros
}

/**
 * Agent metrics
 */
export interface AgentMetrics {
  agentType: AgentType;
  period: { start: Date; end: Date };
  
  calls: {
    total: number;
    answered: number;
    missed: number;
    voicemail: number;
    transferred: number;
    avgDuration: number; // seconds
  };
  
  outcomes: {
    leadsCaptured: number;
    appointmentsBooked: number;
    informationProvided: number;
    transferred: number;
    abandoned: number;
  };
  
  quality: {
    avgSentiment: number; // -1 to 1
    positiveRate: number; // 0-1
    escalationRate: number; // 0-1
    resolutionRate: number; // 0-1
  };
  
  performance: {
    avgResponseTime: number; // milliseconds
    avgHandleTime: number; // seconds
    peakHour: number; // 0-23
    busyDays: number[]; // 0-6
  };
  
  costs: {
    total: number; // euros
    perCall: number; // euros
    perMinute: number; // euros
  };
}

/**
 * Real-time metrics
 */
export interface RealTimeMetrics {
  timestamp: Date;
  activeCalls: number;
  queuedCalls: number;
  avgWaitTime: number; // seconds
  callsToday: number;
  leadsToday: number;
  conversionRate: number; // 0-1
}

/**
 * Performance KPIs
 */
export interface PerformanceKPIs {
  availability: number; // 0-1
  answerRate: number; // 0-1
  leadCaptureRate: number; // 0-1
  appointmentBookingRate: number; // 0-1
  escalationRate: number; // 0-1
  customerSatisfaction: number; // 1-5
  avgHandleTime: number; // seconds
  costPerLead: number; // euros
  roi: number; // percentage
}

/**
 * Conversation insights
 */
export interface ConversationInsights {
  topics: Array<{
    topic: string;
    confidence: number;
    mentions: number;
  }>;
  intents: Array<{
    intent: string;
    confidence: number;
  }>;
  entities: {
    budget?: number;
    location?: string;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    timeline?: string;
    purpose?: string;
    financing?: string;
    citizenship?: string;
    goldenVisa?: boolean;
  };
  keyPhrases: string[];
  actionItems: string[];
  followUpRequired: boolean;
  qualityScore: number; // 0-100
}

/**
 * Calculate call metrics
 */
export function calculateCallMetrics(calls: CallRecord[]): AgentMetrics['calls'] {
  const total = calls.length;
  const answered = calls.filter(c => c.status === 'answered' || c.status === 'completed').length;
  const missed = calls.filter(c => c.status === 'missed').length;
  const voicemail = calls.filter(c => c.status === 'voicemail').length;
  const transferred = calls.filter(c => c.status === 'transferred').length;
  
  const totalDuration = calls.reduce((sum, c) => sum + c.duration, 0);
  const avgDuration = total > 0 ? totalDuration / total : 0;
  
  return {
    total,
    answered,
    missed,
    voicemail,
    transferred,
    avgDuration,
  };
}

/**
 * Calculate outcome metrics
 */
export function calculateOutcomeMetrics(calls: CallRecord[]): AgentMetrics['outcomes'] {
  return {
    leadsCaptured: calls.filter(c => c.outcome === 'lead-captured').length,
    appointmentsBooked: calls.filter(c => c.outcome === 'appointment-booked').length,
    informationProvided: calls.filter(c => c.outcome === 'information-provided').length,
    transferred: calls.filter(c => c.outcome === 'transferred').length,
    abandoned: calls.filter(c => c.outcome === 'abandoned').length,
  };
}

/**
 * Calculate quality metrics
 */
export function calculateQualityMetrics(calls: CallRecord[]): AgentMetrics['quality'] {
  if (calls.length === 0) {
    return {
      avgSentiment: 0,
      positiveRate: 0,
      escalationRate: 0,
      resolutionRate: 0,
    };
  }
  
  // Convert sentiment to numeric values
  const sentimentValues = calls.map(c => {
    switch (c.sentiment) {
      case 'positive': return 1;
      case 'neutral': return 0;
      case 'negative': return -1;
    }
  });
  
  const avgSentiment = sentimentValues.reduce((sum, v) => sum + v, 0) / calls.length;
  const positiveRate = calls.filter(c => c.sentiment === 'positive').length / calls.length;
  const escalationRate = calls.filter(c => c.escalated).length / calls.length;
  
  const resolved = calls.filter(c => 
    c.outcome === 'lead-captured' || 
    c.outcome === 'appointment-booked' ||
    c.outcome === 'information-provided'
  ).length;
  const resolutionRate = resolved / calls.length;
  
  return {
    avgSentiment,
    positiveRate,
    escalationRate,
    resolutionRate,
  };
}

/**
 * Calculate performance metrics
 */
export function calculatePerformanceMetrics(calls: CallRecord[]): AgentMetrics['performance'] {
  // Average response time (mock, in production measure actual latency)
  const avgResponseTime = 2500; // 2.5 seconds (Vocode + Whisper + Llama + Coqui)
  
  // Average handle time
  const totalDuration = calls.reduce((sum, c) => sum + c.duration, 0);
  const avgHandleTime = calls.length > 0 ? totalDuration / calls.length : 0;
  
  // Peak hour analysis
  const hourCounts = new Array(24).fill(0);
  calls.forEach(c => {
    const hour = c.startTime.getHours();
    hourCounts[hour]++;
  });
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  
  // Busy days analysis
  const dayCounts = new Array(7).fill(0);
  calls.forEach(c => {
    const day = c.startTime.getDay();
    dayCounts[day]++;
  });
  const avgCallsPerDay = dayCounts.reduce((sum, c) => sum + c, 0) / 7;
  const busyDays = dayCounts
    .map((count, day) => ({ day, count }))
    .filter(d => d.count > avgCallsPerDay)
    .map(d => d.day);
  
  return {
    avgResponseTime,
    avgHandleTime,
    peakHour,
    busyDays,
  };
}

/**
 * Calculate cost metrics (Open Source Stack)
 */
export function calculateCostMetrics(calls: CallRecord[]): AgentMetrics['costs'] {
  /**
   * Open Source Cost Structure:
   * - Vocode: €0.00 (self-hosted)
   * - Coqui XTTS: €0.00 (self-hosted)
   * - Whisper: €0.00 (self-hosted)
   * - Llama 3.1: €0.00 (self-hosted)
   * - Twilio: €0.05/llamada (PSTN)
   * 
   * Total: €0.05/llamada (vs €0.10 propietario)
   */
  
  const twilioPerCall = 0.05; // €0.05 per call
  const total = calls.length * twilioPerCall;
  const perCall = twilioPerCall;
  
  const totalMinutes = calls.reduce((sum, c) => sum + (c.duration / 60), 0);
  const perMinute = totalMinutes > 0 ? total / totalMinutes : 0;
  
  return {
    total,
    perCall,
    perMinute,
  };
}

/**
 * Generate agent metrics for period
 */
export function generateAgentMetrics(
  agentType: AgentType,
  calls: CallRecord[],
  period: { start: Date; end: Date }
): AgentMetrics {
  const filteredCalls = calls.filter(c => 
    c.agentType === agentType &&
    c.startTime >= period.start &&
    c.startTime <= period.end
  );
  
  return {
    agentType,
    period,
    calls: calculateCallMetrics(filteredCalls),
    outcomes: calculateOutcomeMetrics(filteredCalls),
    quality: calculateQualityMetrics(filteredCalls),
    performance: calculatePerformanceMetrics(filteredCalls),
    costs: calculateCostMetrics(filteredCalls),
  };
}

/**
 * Calculate performance KPIs
 */
export function calculatePerformanceKPIs(
  metrics: AgentMetrics
): PerformanceKPIs {
  const { calls, outcomes, quality, performance, costs } = metrics;
  
  // Availability (uptime)
  const availability = 0.995; // 99.5% (open source slightly lower than 99.9% SaaS)
  
  // Answer rate
  const answerRate = calls.total > 0 ? calls.answered / calls.total : 0;
  
  // Lead capture rate
  const leadCaptureRate = calls.answered > 0 ? outcomes.leadsCaptured / calls.answered : 0;
  
  // Appointment booking rate
  const appointmentBookingRate = calls.answered > 0 ? outcomes.appointmentsBooked / calls.answered : 0;
  
  // Customer satisfaction (based on sentiment)
  const customerSatisfaction = ((quality.avgSentiment + 1) / 2) * 5; // Map -1:1 to 1:5
  
  // Cost per lead
  const costPerLead = outcomes.leadsCaptured > 0 ? costs.total / outcomes.leadsCaptured : 0;
  
  // ROI calculation
  const avgPropertyCommission = 90000; // €90k average commission
  const conversionRate = 0.03; // 3% of leads convert to sales
  const estimatedDeals = outcomes.leadsCaptured * conversionRate;
  const revenue = estimatedDeals * avgPropertyCommission;
  const roi = costs.total > 0 ? ((revenue - costs.total) / costs.total) * 100 : 0;
  
  return {
    availability,
    answerRate,
    leadCaptureRate,
    appointmentBookingRate,
    escalationRate: quality.escalationRate,
    customerSatisfaction,
    avgHandleTime: performance.avgHandleTime,
    costPerLead,
    roi,
  };
}

/**
 * Extract conversation insights (using Llama 3.1 for NLP)
 */
export async function extractConversationInsights(
  transcript: string,
  extractedData: Record<string, unknown>
): Promise<ConversationInsights> {
  // In production, use Llama 3.1 for actual NLP analysis
  // For now, mock implementation
  
  const insights: ConversationInsights = {
    topics: [
      { topic: 'property-search', confidence: 0.92, mentions: 3 },
      { topic: 'budget', confidence: 0.88, mentions: 2 },
      { topic: 'location', confidence: 0.85, mentions: 2 },
    ],
    intents: [
      { intent: 'buy-property', confidence: 0.95 },
      { intent: 'schedule-viewing', confidence: 0.78 },
    ],
    entities: extractedData,
    keyPhrases: [
      'propiedades con vistas al mar',
      'presupuesto hasta 3 millones',
      'zona de Puerto Portals',
    ],
    actionItems: [
      'Enviar dossier de propiedades',
      'Agendar visita para próxima semana',
      'Contactar con agente especialista',
    ],
    followUpRequired: true,
    qualityScore: 85,
  };
  
  return insights;
}

/**
 * Generate real-time metrics
 */
export function generateRealTimeMetrics(
  activeCalls: number,
  callsToday: CallRecord[]
): RealTimeMetrics {
  const leadsToday = callsToday.filter(c => c.outcome === 'lead-captured').length;
  const answeredToday = callsToday.filter(c => c.status === 'answered' || c.status === 'completed').length;
  const conversionRate = answeredToday > 0 ? leadsToday / answeredToday : 0;
  
  return {
    timestamp: new Date(),
    activeCalls,
    queuedCalls: 0, // Mock, in production fetch from queue
    avgWaitTime: 0, // Mock, calculate from queue
    callsToday: callsToday.length,
    leadsToday,
    conversionRate,
  };
}

/**
 * Track call event (send to analytics endpoint)
 */
export async function trackCallEvent(
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  const analyticsEndpoint = process.env.ANALYTICS_ENDPOINT || 'http://localhost:8000/api/analytics/voice';
  
  try {
    await fetch(analyticsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data,
      }),
    });
  } catch (error) {
    console.error('[ANALYTICS] Failed to track event:', error);
  }
}

/**
 * Cost comparison: Open Source vs Proprietary
 */
export const COST_COMPARISON = {
  proprietary: {
    vapi: 0.05,
    elevenlabs: 0.03,
    gpt4: 0.02,
    total: 0.10,
  },
  openSource: {
    vocode: 0.00,
    coqui: 0.00,
    whisper: 0.00,
    llama: 0.00,
    twilio: 0.05,
    total: 0.05,
  },
  savings: {
    perCall: 0.05,
    percentage: 50,
    monthly200Calls: 10.00, // €10/month saved
    annual200Calls: 120.00, // €120/year saved
  },
};

/**
 * Monthly cost projection
 */
export function calculateMonthlyCosts(callsPerMonth: number): {
  proprietary: number;
  openSource: number;
  savings: number;
  savingsPercentage: number;
} {
  const proprietary = callsPerMonth * COST_COMPARISON.proprietary.total;
  const openSource = callsPerMonth * COST_COMPARISON.openSource.total;
  const savings = proprietary - openSource;
  const savingsPercentage = (savings / proprietary) * 100;
  
  return {
    proprietary,
    openSource,
    savings,
    savingsPercentage,
  };
}

/**
 * ROI projection
 */
export function calculateROI(
  callsPerMonth: number,
  leadCaptureRate: number = 0.40,
  conversionRate: number = 0.03,
  avgCommission: number = 90000
): {
  monthlyLeads: number;
  monthlyDeals: number;
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  roi: number;
} {
  const monthlyLeads = callsPerMonth * leadCaptureRate;
  const monthlyDeals = monthlyLeads * conversionRate;
  const monthlyRevenue = monthlyDeals * avgCommission;
  const monthlyCost = callsPerMonth * COST_COMPARISON.openSource.total;
  const monthlyProfit = monthlyRevenue - monthlyCost;
  const roi = monthlyCost > 0 ? (monthlyProfit / monthlyCost) * 100 : 0;
  
  return {
    monthlyLeads,
    monthlyDeals,
    monthlyRevenue,
    monthlyCost,
    monthlyProfit,
    roi,
  };
}

const voiceAnalytics = {
  calculateCallMetrics,
  calculateOutcomeMetrics,
  calculateQualityMetrics,
  calculatePerformanceMetrics,
  calculateCostMetrics,
  generateAgentMetrics,
  calculatePerformanceKPIs,
  extractConversationInsights,
  generateRealTimeMetrics,
  trackCallEvent,
  COST_COMPARISON,
  calculateMonthlyCosts,
  calculateROI,
};

export default voiceAnalytics;
