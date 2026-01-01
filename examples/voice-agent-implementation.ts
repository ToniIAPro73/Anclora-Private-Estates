/**
 * Voice Agent Implementation Example - Open Source Stack
 * Ejemplo completo de implementación con Vocode + Coqui + Whisper + Llama
 * 
 * Stack: 100% Open Source
 * - Vocode: Conversational AI framework
 * - Coqui XTTS v2: Text-to-Speech
 * - Whisper Large v3: Speech-to-Text
 * - Llama 3.1 70B: Language Model
 * - Twilio: Telefonía PSTN
 * 
 * Costo: €0.05/llamada (vs €0.10 propietario, 50% ahorro)
 * 
 * @module examples/voice-agent-implementation
 */

import { createAgentConfig, isAgentAvailable } from '../lib/voice-agent-config';
import {
  getScript,
  getScriptVariation,
  replaceScriptVariables,
} from '../lib/voice-agent-scripts';
import {
  evaluateEscalationTriggers,
  executeTransfer,
  handleVoicemail,
  scheduleCallback,
} from '../lib/voice-agent-routing';
import {
  generateAgentMetrics,
  extractConversationInsights,
  generateRealTimeMetrics,
} from '../lib/voice-analytics';
import type {
  VoiceAgentSession,
  SessionEvent,
  VocodeWebhookEvent,
  VocodeCall,
  VOICE_AGENT_FUNCTIONS,
} from '../types/voice-agent';
import type { AgentType } from '../lib/voice-agent-config';
import type { CallRecord } from '../lib/voice-analytics';

/**
 * 1. Setup Vocode Agent Configuration
 */
export async function setupPropertyInquiryAgent() {
  // Create agent configuration
  const config = createAgentConfig('property-inquiry');
  
  // Validate availability
  const available = isAgentAvailable(config);
  
  if (!available) {
    console.log('[AGENT] Not available during business hours');
    return null;
  }
  
  console.log('[AGENT] Property Inquiry Agent configured');
  console.log(`- Voice: ${config.voice.provider} (${config.voice.model})`);
  console.log(`- STT: ${config.stt.provider} (${config.stt.model})`);
  console.log(`- LLM: ${config.llm.provider} (${config.llm.model})`);
  
  // In production: Create Vocode conversation via API
  const vocodeConversation = {
    id: `conversation-${Date.now()}`,
    phoneNumber: '+34971234567',
    agent: {
      type: config.type,
      systemPrompt: config.systemPrompt,
      initialMessage: config.greeting,
      endConversationPhrases: config.endCallPhrases,
      maxDuration: config.maxDuration,
    },
    synthesizer: config.voice,
    transcriber: config.stt,
    llm: config.llm,
    recordingEnabled: true,
    webhookUrl: 'https://api.anclora.com/vocode/webhook',
  };
  
  console.log('[AGENT] Vocode conversation created:', vocodeConversation.id);
  
  return {
    config,
    conversation: vocodeConversation,
  };
}

/**
 * 2. Handle Incoming Call
 */
export function handleIncomingCall(
  phoneNumber: string,
  agentType: AgentType = 'property-inquiry'
): VoiceAgentSession {
  const session: VoiceAgentSession = {
    id: `session-${Date.now()}`,
    callId: `call-${Date.now()}`,
    agentType,
    phoneNumber,
    language: 'es-ES',
    startTime: new Date(),
    status: 'active',
    context: {
      callDirection: 'inbound',
      callSource: 'direct',
      conversationStage: 'greeting',
      extractedData: {},
      sentimentHistory: [],
      escalationAttempts: 0,
      escalationReasons: [],
    },
    events: [],
  };
  
  // Track call started
  session.events.push({
    id: `event-${Date.now()}`,
    timestamp: new Date(),
    type: 'call-started',
    data: { phoneNumber, agentType },
  });
  
  console.log('[SESSION] Call initiated:', session.id);
  
  return session;
}

/**
 * 3. Process Vocode Webhook Events
 */
export async function processVocodeWebhook(
  event: VocodeWebhookEvent,
  session: VoiceAgentSession
): Promise<void> {
  console.log(`[WEBHOOK] Received event: ${event.type}`);
  
  switch (event.type) {
    case 'message.received':
      await handleMessageReceived(event, session);
      break;
    
    case 'function.called':
      await handleFunctionCall(event, session);
      break;
    
    case 'conversation.ended':
      await handleConversationEnded(event, session);
      break;
    
    case 'error':
      console.error('[WEBHOOK] Error:', event.data);
      break;
  }
}

/**
 * 4. Handle User Message
 */
async function handleMessageReceived(
  event: VocodeWebhookEvent,
  session: VoiceAgentSession
): Promise<void> {
  const message = event.data.text as string;
  
  // Track message
  session.events.push({
    id: `event-${Date.now()}`,
    timestamp: new Date(),
    type: 'message-received',
    data: { message },
  });
  
  // Extract data from message
  const extractedData = extractDataFromMessage(message);
  Object.assign(session.context.extractedData, extractedData);
  
  // Analyze sentiment
  const sentiment = analyzeSentiment(message);
  session.context.sentimentHistory.push({
    timestamp: new Date(),
    sentiment: sentiment.type,
    score: sentiment.score,
  });
  
  // Check for escalation triggers
  const duration = (new Date().getTime() - session.startTime.getTime()) / 1000;
  const escalationRule = evaluateEscalationTriggers(
    message,
    sentiment.type,
    duration
  );
  
  if (escalationRule) {
    await handleEscalation(escalationRule, session);
  }
}

/**
 * 5. Extract Data from Message (using Llama 3.1)
 */
function extractDataFromMessage(message: string): Record<string, any> {
  const data: Record<string, any> = {};
  const lowerMessage = message.toLowerCase();
  
  // Extract budget (using regex patterns)
  const budgetPatterns = [
    /(\d+)\s*millones?/i,
    /€\s*(\d+)m/i,
    /(\d+)m\s*euros?/i,
  ];
  
  for (const pattern of budgetPatterns) {
    const match = message.match(pattern);
    if (match) {
      data.budget = parseInt(match[1]) * 1000000;
      break;
    }
  }
  
  // Extract bedrooms
  if (lowerMessage.includes('dormitorio') || lowerMessage.includes('habitación')) {
    const bedroomMatch = message.match(/(\d+)\s*(?:dormitorios?|habitaciones?)/i);
    if (bedroomMatch) {
      data.bedrooms = parseInt(bedroomMatch[1]);
    }
  }
  
  // Extract location
  const locations = ['Son Vida', 'Puerto Portals', 'Port d\'Andratx', 'Calvià', 'Pollença'];
  for (const location of locations) {
    if (lowerMessage.includes(location.toLowerCase())) {
      data.location = location;
      break;
    }
  }
  
  // In production: Use Llama 3.1 for advanced NLP extraction
  
  return data;
}

/**
 * 6. Analyze Sentiment (using Llama 3.1)
 */
function analyzeSentiment(message: string): { type: 'positive' | 'neutral' | 'negative'; score: number } {
  const lowerMessage = message.toLowerCase();
  
  // Simple keyword-based sentiment (in production, use Llama 3.1)
  const positiveKeywords = ['excelente', 'perfecto', 'bueno', 'genial', 'gracias', 'fantástico'];
  const negativeKeywords = ['mal', 'problema', 'molesto', 'frustrado', 'no funciona'];
  
  let score = 0;
  
  for (const keyword of positiveKeywords) {
    if (lowerMessage.includes(keyword)) score += 0.3;
  }
  
  for (const keyword of negativeKeywords) {
    if (lowerMessage.includes(keyword)) score -= 0.3;
  }
  
  score = Math.max(-1, Math.min(1, score));
  
  let type: 'positive' | 'neutral' | 'negative';
  if (score > 0.2) type = 'positive';
  else if (score < -0.2) type = 'negative';
  else type = 'neutral';
  
  return { type, score };
}

/**
 * 7. Handle Function Calls (Llama 3.1 function calling)
 */
async function handleFunctionCall(
  event: VocodeWebhookEvent,
  session: VoiceAgentSession
): Promise<void> {
  const functionName = event.data.function as string;
  const arguments_ = event.data.arguments as Record<string, any>;
  
  console.log(`[FUNCTION] Calling: ${functionName}`, arguments_);
  
  let result: any;
  
  switch (functionName) {
    case 'search_properties':
      result = await searchProperties(arguments_);
      break;
    
    case 'check_availability':
      result = await checkAvailability(arguments_);
      break;
    
    case 'book_appointment':
      result = await bookAppointment(arguments_);
      break;
    
    case 'create_lead':
      result = await createLead(arguments_);
      break;
    
    case 'send_property_info':
      result = await sendPropertyInfo(arguments_);
      break;
    
    case 'transfer_to_human':
      result = await transferToHuman(arguments_, session);
      break;
    
    default:
      result = { error: 'Unknown function' };
  }
  
  // Track function execution
  session.events.push({
    id: `event-${Date.now()}`,
    timestamp: new Date(),
    type: 'function-executed',
    data: { functionName, arguments: arguments_, result },
  });
  
  console.log(`[FUNCTION] Result:`, result);
}

/**
 * Mock Function Implementations
 */

async function searchProperties(params: any): Promise<any> {
  console.log('[SEARCH] Properties:', params);
  
  // Mock results
  return {
    success: true,
    count: 2,
    properties: [
      {
        id: 'prop-001',
        title: 'Villa de lujo en Son Vida',
        location: 'Son Vida',
        type: 'villa',
        price: 2500000,
        bedrooms: 5,
        bathrooms: 4,
        size: 450,
        features: ['piscina', 'jardín', 'vistas al mar'],
      },
      {
        id: 'prop-002',
        title: 'Villa moderna en Puerto Portals',
        location: 'Puerto Portals',
        type: 'villa',
        price: 3200000,
        bedrooms: 4,
        bathrooms: 3,
        size: 380,
        features: ['piscina', 'garaje', 'cerca del mar'],
      },
    ],
  };
}

async function checkAvailability(params: any): Promise<any> {
  console.log('[AVAILABILITY] Check:', params);
  
  return {
    success: true,
    available: true,
    slots: [
      { date: params.date, time: '10:00', available: true },
      { date: params.date, time: '12:00', available: true },
      { date: params.date, time: '16:00', available: true },
    ],
  };
}

async function bookAppointment(params: any): Promise<any> {
  console.log('[APPOINTMENT] Book:', params);
  
  return {
    success: true,
    appointmentId: `apt-${Date.now()}`,
    date: params.date,
    time: params.time,
    type: params.type,
    contact: params.contact_name,
    confirmationSent: true,
  };
}

async function createLead(params: any): Promise<any> {
  console.log('[LEAD] Create:', params);
  
  // In production: Create in Twenty CRM
  return {
    success: true,
    leadId: `lead-${Date.now()}`,
    name: params.name,
    phone: params.phone,
    email: params.email,
    createdAt: new Date().toISOString(),
  };
}

async function sendPropertyInfo(params: any): Promise<any> {
  console.log('[INFO] Send:', params);
  
  return {
    success: true,
    sentVia: params.contact_method,
    messageId: `msg-${Date.now()}`,
  };
}

async function transferToHuman(params: any, session: VoiceAgentSession): Promise<any> {
  console.log('[TRANSFER] To:', params.department);
  
  const result = await executeTransfer(
    `${params.department}-team` as any,
    session.callId,
    params.reason
  );
  
  return result;
}

/**
 * 8. Handle Escalation
 */
async function handleEscalation(
  rule: any,
  session: VoiceAgentSession
): Promise<void> {
  session.context.escalationAttempts++;
  session.context.escalationReasons.push(rule.name);
  
  // Track escalation
  session.events.push({
    id: `event-${Date.now()}`,
    timestamp: new Date(),
    type: 'escalation-triggered',
    data: { rule: rule.name, priority: rule.priority },
  });
  
  // Check if should transfer
  if (session.context.escalationAttempts > rule.maxRetries) {
    const result = await executeTransfer(
      rule.destination,
      session.callId,
      rule.name
    );
    
    session.events.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'transfer-executed',
      data: result,
    });
  }
}

/**
 * 9. Handle Conversation End
 */
async function handleConversationEnded(
  event: VocodeWebhookEvent,
  session: VoiceAgentSession
): Promise<void> {
  session.status = 'ended';
  session.endTime = new Date();
  
  const duration = (session.endTime.getTime() - session.startTime.getTime()) / 1000;
  
  // Create call record
  const callRecord: CallRecord = {
    id: session.callId,
    agentType: session.agentType,
    phoneNumber: session.phoneNumber,
    startTime: session.startTime,
    endTime: session.endTime,
    duration,
    status: 'completed',
    outcome: 'lead-captured', // Determine from session
    priority: 'MEDIUM',
    sentiment: session.context.sentimentHistory[session.context.sentimentHistory.length - 1]?.sentiment || 'neutral',
    transcript: '', // Would come from Vocode
    summary: 'Call completed successfully',
    extractedData: session.context.extractedData,
    escalated: session.context.escalationAttempts > 0,
    escalationReason: session.context.escalationReasons.join(', '),
    cost: 0.05, // €0.05 per call (open source)
  };
  
  // Extract insights
  const insights = await extractConversationInsights('', callRecord.extractedData);
  
  console.log('[CALL] Ended:', callRecord);
  console.log('[INSIGHTS]:', insights);
  
  // Save to database (in production)
  // await saveCallRecord(callRecord);
  
  // Trigger follow-up workflow if needed
  if (insights.followUpRequired) {
    console.log('[FOLLOW-UP] Required for:', session.phoneNumber);
  }
}

/**
 * 10. Example Usage
 */
export async function voiceAgentExample() {
  console.log('=== Voice Agent Example - Open Source Stack ===\n');
  
  // 1. Setup agent
  const agent = await setupPropertyInquiryAgent();
  if (!agent) {
    console.log('Agent not available');
    return;
  }
  
  // 2. Handle incoming call
  const session = handleIncomingCall('+34612345678');
  
  // 3. Simulate user message
  const mockEvent: VocodeWebhookEvent = {
    type: 'message.received',
    conversation: {
      id: agent.conversation.id,
      phoneNumber: session.phoneNumber,
      agentType: session.agentType,
    },
    timestamp: new Date(),
    data: {
      text: 'Busco una villa con 4 dormitorios en Son Vida, presupuesto de 3 millones',
    },
  };
  
  await processVocodeWebhook(mockEvent, session);
  
  console.log('\n[EXTRACTED DATA]:', session.context.extractedData);
  
  // 4. Simulate function call
  const functionEvent: VocodeWebhookEvent = {
    type: 'function.called',
    conversation: {
      id: agent.conversation.id,
      phoneNumber: session.phoneNumber,
      agentType: session.agentType,
    },
    timestamp: new Date(),
    data: {
      function: 'search_properties',
      arguments: {
        location: 'Son Vida',
        bedrooms: 4,
        min_budget: 2000000,
        max_budget: 4000000,
      },
    },
  };
  
  await processVocodeWebhook(functionEvent, session);
  
  // 5. End conversation
  const endEvent: VocodeWebhookEvent = {
    type: 'conversation.ended',
    conversation: {
      id: agent.conversation.id,
      phoneNumber: session.phoneNumber,
      agentType: session.agentType,
    },
    timestamp: new Date(),
    data: {},
  };
  
  await processVocodeWebhook(endEvent, session);
  
  console.log('\n=== Example Complete ===');
}

// Run example
if (require.main === module) {
  voiceAgentExample().catch(console.error);
}

export default {
  setupPropertyInquiryAgent,
  handleIncomingCall,
  processVocodeWebhook,
  voiceAgentExample,
};
