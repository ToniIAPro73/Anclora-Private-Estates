/**
 * Voice Agent Conversation Scripts - Open Source Stack
 * Scripts y flujos conversacionales para agentes Vocode + Llama 3.1
 * 
 * @module voice-agent-scripts
 */

import type { AgentType } from './voice-agent-config';

/**
 * Script section types
 */
export type ScriptSection = 
  | 'greeting'
  | 'discovery'
  | 'qualification'
  | 'objection-handling'
  | 'closing'
  | 'escalation'
  | 'error-recovery';

/**
 * Script scenario within a section
 */
export interface ConversationScript {
  section: ScriptSection;
  scenario: string;
  agentType: AgentType;
  prompt: string;
  expectedResponses: string[];
  nextSteps: string[];
  variations: string[];
}

/**
 * All conversation scripts by agent type
 */
export const CONVERSATION_SCRIPTS: Record<AgentType, ConversationScript[]> = {
  'property-inquiry': [
    // GREETING
    {
      section: 'greeting',
      scenario: 'initial-greeting',
      agentType: 'property-inquiry',
      prompt: 'Buenos días, le habla el asistente virtual de Anclora Private Estates. ¿En qué puedo ayudarle hoy?',
      expectedResponses: [
        'busco propiedad',
        'quiero comprar',
        'información sobre viviendas',
        'estoy interesado',
      ],
      nextSteps: [
        'discovery:property-type',
        'discovery:location',
      ],
      variations: [
        'Bienvenido a Anclora Private Estates. Soy su asistente virtual. ¿Cómo puedo ayudarle?',
        'Anclora Private Estates, buenos días. ¿Le puedo ayudar a encontrar su propiedad ideal?',
      ],
    },
    {
      section: 'greeting',
      scenario: 'return-caller',
      agentType: 'property-inquiry',
      prompt: 'Bienvenido de nuevo. ¿Desea continuar con su búsqueda anterior o empezar una nueva?',
      expectedResponses: [
        'continuar',
        'nueva búsqueda',
        'recordar mi búsqueda',
      ],
      nextSteps: [
        'discovery:property-type',
        'closing:confirm-next-steps',
      ],
      variations: [
        'Me alegra escucharle de nuevo. ¿Quiere que retomemos donde lo dejamos?',
        '¡Hola otra vez! ¿Continuamos con su búsqueda de {property_type} en {location}?',
      ],
    },

    // DISCOVERY
    {
      section: 'discovery',
      scenario: 'property-type',
      agentType: 'property-inquiry',
      prompt: '¿Qué tipo de propiedad le interesa? Villa, apartamento, penthouse o terreno?',
      expectedResponses: [
        'villa',
        'apartamento',
        'piso',
        'penthouse',
        'ático',
        'terreno',
        'parcela',
      ],
      nextSteps: [
        'discovery:location',
        'discovery:budget',
      ],
      variations: [
        '¿Tiene en mente algún tipo de propiedad específico?',
        '¿Está buscando una villa, un apartamento o quizás un terreno?',
      ],
    },
    {
      section: 'discovery',
      scenario: 'location',
      agentType: 'property-inquiry',
      prompt: '¿En qué zona de Mallorca prefiere? Nuestras zonas principales son Son Vida, Puerto Portals, Port d\'Andratx, Calvià y Pollença.',
      expectedResponses: [
        'Son Vida',
        'Puerto Portals',
        'Port d\'Andratx',
        'Calvià',
        'Pollença',
        'Palma',
        'Costa',
        'no sé',
      ],
      nextSteps: [
        'discovery:budget',
        'discovery:features',
      ],
      variations: [
        '¿Tiene alguna preferencia de zona en Mallorca?',
        '¿Le interesa alguna ubicación específica? Palma, costa norte, suroeste...',
      ],
    },
    {
      section: 'discovery',
      scenario: 'budget',
      agentType: 'property-inquiry',
      prompt: '¿Cuál es su presupuesto aproximado? Nuestras propiedades van desde 1 millón hasta más de 20 millones de euros.',
      expectedResponses: [
        'un millón',
        'dos millones',
        'cinco millones',
        'no tengo límite',
        'depende',
      ],
      nextSteps: [
        'discovery:features',
        'qualification:purpose',
      ],
      variations: [
        '¿Qué rango de inversión está considerando?',
        '¿Podría indicarme su presupuesto para que le muestre opciones adecuadas?',
      ],
    },
    {
      section: 'discovery',
      scenario: 'features',
      agentType: 'property-inquiry',
      prompt: '¿Qué características son importantes para usted? Número de dormitorios, piscina, vistas al mar, jardín...',
      expectedResponses: [
        'dormitorios',
        'piscina',
        'vistas',
        'jardín',
        'garaje',
        'playa',
      ],
      nextSteps: [
        'discovery:timeline',
        'qualification:purpose',
      ],
      variations: [
        '¿Hay alguna característica que sea imprescindible para usted?',
        '¿Qué debe tener sí o sí su propiedad ideal?',
      ],
    },
    {
      section: 'discovery',
      scenario: 'timeline',
      agentType: 'property-inquiry',
      prompt: '¿En qué plazo está pensando hacer la compra? Inmediato, 3 meses, 6 meses o más adelante?',
      expectedResponses: [
        'inmediato',
        'urgente',
        '3 meses',
        '6 meses',
        'sin prisa',
        'flexible',
      ],
      nextSteps: [
        'qualification:purpose',
        'closing:book-viewing',
      ],
      variations: [
        '¿Tiene alguna fecha límite para la compra?',
        '¿Cuándo le gustaría tener su propiedad?',
      ],
    },

    // QUALIFICATION
    {
      section: 'qualification',
      scenario: 'purpose',
      agentType: 'property-inquiry',
      prompt: '¿Es para residencia habitual, segunda residencia, inversión o golden visa?',
      expectedResponses: [
        'vivir',
        'segunda residencia',
        'vacaciones',
        'inversión',
        'alquilar',
        'golden visa',
      ],
      nextSteps: [
        'qualification:financing',
        'qualification:golden-visa',
      ],
      variations: [
        '¿Cuál es el objetivo principal de esta compra?',
        '¿Va a ser su hogar o es una inversión?',
      ],
    },
    {
      section: 'qualification',
      scenario: 'financing',
      agentType: 'property-inquiry',
      prompt: '¿Cómo va a financiar la compra? Pago al contado, hipoteca o combinado?',
      expectedResponses: [
        'efectivo',
        'contado',
        'hipoteca',
        'financiación',
        'mixto',
      ],
      nextSteps: [
        'closing:book-viewing',
        'closing:capture-contact',
      ],
      variations: [
        '¿Necesita financiación o será pago al contado?',
        '¿Ha pensado en cómo va a estructurar el pago?',
      ],
    },
    {
      section: 'qualification',
      scenario: 'golden-visa',
      agentType: 'property-inquiry',
      prompt: 'Veo que le interesa golden visa. ¿Sabía que con una inversión de 500.000€ puede obtener residencia en España? Anclora gestiona todo el proceso.',
      expectedResponses: [
        'sí sé',
        'cuénteme más',
        'me interesa',
        'qué requisitos',
      ],
      nextSteps: [
        'escalation:transfer-to-agent',
        'closing:capture-contact',
      ],
      variations: [
        'El golden visa le permite residir en España. ¿Le gustaría que un especialista le explique el proceso?',
      ],
    },

    // OBJECTION HANDLING
    {
      section: 'objection-handling',
      scenario: 'price-too-high',
      agentType: 'property-inquiry',
      prompt: 'Entiendo su preocupación por el precio. En Mallorca, las propiedades de lujo se revalorizan un 8-12% anual. ¿Le gustaría ver un análisis de ROI?',
      expectedResponses: [
        'sí',
        'no',
        'necesito pensarlo',
      ],
      nextSteps: [
        'closing:capture-contact',
        'escalation:transfer-to-agent',
      ],
      variations: [
        'Las propiedades en {location} han aumentado un 10% este año. Es una excelente inversión.',
      ],
    },

    // CLOSING
    {
      section: 'closing',
      scenario: 'book-viewing',
      agentType: 'property-inquiry',
      prompt: '¿Le gustaría agendar una visita para ver las propiedades? Tenemos disponibilidad esta semana.',
      expectedResponses: [
        'sí',
        'cuándo',
        'qué días',
      ],
      nextSteps: [
        'closing:capture-contact',
        'closing:confirm-next-steps',
      ],
      variations: [
        '¿Prefiere visitarlas en persona o empezamos con un video tour virtual?',
      ],
    },
    {
      section: 'closing',
      scenario: 'capture-contact',
      agentType: 'property-inquiry',
      prompt: 'Perfecto. Para enviarle la información, ¿me podría dar su email y número de WhatsApp?',
      expectedResponses: [
        'email',
        'teléfono',
        'whatsapp',
      ],
      nextSteps: [
        'closing:confirm-next-steps',
      ],
      variations: [
        '¿Cómo prefiere que le enviemos la documentación? Email, WhatsApp o ambos?',
      ],
    },
    {
      section: 'closing',
      scenario: 'confirm-next-steps',
      agentType: 'property-inquiry',
      prompt: 'Excelente. Le enviaré el dossier completo de propiedades y un agente le contactará mañana para coordinar la visita. ¿Hay algo más en lo que pueda ayudarle?',
      expectedResponses: [
        'no',
        'sí',
        'eso es todo',
      ],
      nextSteps: [],
      variations: [
        'Perfecto, tiene toda la información. Nos vemos en la visita. ¡Hasta pronto!',
      ],
    },

    // ESCALATION
    {
      section: 'escalation',
      scenario: 'transfer-to-agent',
      agentType: 'property-inquiry',
      prompt: 'Entiendo. Le transfiero con un agente especializado que puede ayudarle mejor. Un momento por favor.',
      expectedResponses: [],
      nextSteps: [],
      variations: [
        'Por supuesto, le conecto con nuestro equipo de ventas inmediatamente.',
      ],
    },
    {
      section: 'escalation',
      scenario: 'outside-business-hours',
      agentType: 'property-inquiry',
      prompt: 'Nuestro horario es de lunes a viernes de 9 a 19h y sábados de 10 a 14h. ¿Desea dejar un mensaje o prefiere que le llamemos mañana?',
      expectedResponses: [
        'mensaje',
        'llamar',
        'mañana',
      ],
      nextSteps: [
        'closing:capture-contact',
      ],
      variations: [
        'Estamos fuera de horario. Puedo agendar una llamada para mañana a primera hora.',
      ],
    },

    // ERROR RECOVERY
    {
      section: 'error-recovery',
      scenario: 'didnt-understand',
      agentType: 'property-inquiry',
      prompt: 'Disculpe, no he entendido bien. ¿Podría repetirlo?',
      expectedResponses: [],
      nextSteps: [],
      variations: [
        'Perdone, ¿puede decirlo de otra manera?',
        'No he captado eso. ¿Podría explicarlo nuevamente?',
      ],
    },
    {
      section: 'error-recovery',
      scenario: 'technical-issue',
      agentType: 'property-inquiry',
      prompt: 'Parece que tenemos un problema técnico. ¿Prefiere que le llame en unos minutos o le transfiero directamente con un agente?',
      expectedResponses: [
        'llamar',
        'transferir',
        'esperar',
      ],
      nextSteps: [
        'escalation:transfer-to-agent',
        'closing:capture-contact',
      ],
      variations: [],
    },
  ],

  'appointment-booking': [
    {
      section: 'greeting',
      scenario: 'initial-greeting',
      agentType: 'appointment-booking',
      prompt: 'Buenos días, soy el asistente de citas de Anclora. ¿Le gustaría agendar una visita a una propiedad o una reunión con nuestro equipo?',
      expectedResponses: [
        'visita',
        'reunión',
        'cita',
      ],
      nextSteps: [
        'discovery:date-preference',
      ],
      variations: [],
    },
    {
      section: 'discovery',
      scenario: 'date-preference',
      agentType: 'appointment-booking',
      prompt: '¿Qué día le vendría bien? Tenemos disponibilidad toda esta semana.',
      expectedResponses: [
        'hoy',
        'mañana',
        'lunes',
        'martes',
      ],
      nextSteps: [
        'discovery:time-preference',
      ],
      variations: [],
    },
    {
      section: 'discovery',
      scenario: 'time-preference',
      agentType: 'appointment-booking',
      prompt: '¿Prefiere por la mañana o por la tarde?',
      expectedResponses: [
        'mañana',
        'tarde',
        '10:00',
        '15:00',
      ],
      nextSteps: [
        'closing:confirm-details',
      ],
      variations: [],
    },
    {
      section: 'closing',
      scenario: 'confirm-details',
      agentType: 'appointment-booking',
      prompt: 'Perfecto. He agendado su cita para el {date} a las {time}. Le enviaré confirmación por WhatsApp. ¿Su número es {phone}?',
      expectedResponses: [
        'sí',
        'correcto',
        'confirmo',
      ],
      nextSteps: [],
      variations: [],
    },
  ],

  'general-inquiry': [
    {
      section: 'greeting',
      scenario: 'initial-greeting',
      agentType: 'general-inquiry',
      prompt: 'Buenos días, le habla Anclora Private Estates. ¿En qué puedo ayudarle?',
      expectedResponses: [
        'información',
        'servicios',
        'golden visa',
        'inversión',
      ],
      nextSteps: [
        'discovery:company-info',
        'discovery:services',
      ],
      variations: [],
    },
    {
      section: 'discovery',
      scenario: 'company-info',
      agentType: 'general-inquiry',
      prompt: 'Anclora Private Estates es una inmobiliaria especializada en propiedades de lujo en Mallorca desde 2018. ¿Le gustaría saber sobre algún servicio específico?',
      expectedResponses: [
        'compra',
        'venta',
        'inversión',
        'golden visa',
      ],
      nextSteps: [
        'discovery:services',
        'escalation:transfer-to-agent',
      ],
      variations: [],
    },
    {
      section: 'discovery',
      scenario: 'services',
      agentType: 'general-inquiry',
      prompt: 'Ofrecemos compra, venta, inversión, golden visa y gestión patrimonial. ¿Cuál le interesa?',
      expectedResponses: [
        'compra',
        'venta',
        'inversión',
        'golden visa',
      ],
      nextSteps: [
        'escalation:transfer-to-agent',
        'closing:capture-contact',
      ],
      variations: [],
    },
  ],

  'property-valuation': [
    {
      section: 'greeting',
      scenario: 'initial-greeting',
      agentType: 'property-valuation',
      prompt: 'Buenos días, soy el asistente de valoraciones de Anclora. ¿Desea conocer el valor de mercado de su propiedad?',
      expectedResponses: [
        'sí',
        'valoración',
        'cuánto vale',
      ],
      nextSteps: [
        'discovery:property-details',
      ],
      variations: [],
    },
    {
      section: 'discovery',
      scenario: 'property-details',
      agentType: 'property-valuation',
      prompt: '¿Me podría decir la ubicación, tipo de propiedad y metros cuadrados aproximados?',
      expectedResponses: [
        'ubicación',
        'villa',
        'apartamento',
      ],
      nextSteps: [
        'closing:book-viewing',
      ],
      variations: [],
    },
  ],

  'investor-consultation': [
    {
      section: 'greeting',
      scenario: 'initial-greeting',
      agentType: 'investor-consultation',
      prompt: 'Buenos días, soy el asistente de inversiones de Anclora. ¿Está interesado en invertir en propiedades de lujo en Mallorca?',
      expectedResponses: [
        'sí',
        'inversión',
        'rentabilidad',
        'golden visa',
      ],
      nextSteps: [
        'discovery:investment-profile',
      ],
      variations: [],
    },
    {
      section: 'discovery',
      scenario: 'investment-profile',
      agentType: 'investor-consultation',
      prompt: '¿Su objetivo es rentabilidad por alquiler, revalorización o golden visa?',
      expectedResponses: [
        'alquiler',
        'revalorización',
        'golden visa',
        'ambos',
      ],
      nextSteps: [
        'qualification:budget',
        'escalation:transfer-to-agent',
      ],
      variations: [],
    },
  ],
};

/**
 * Get scripts by agent type
 */
export function getScriptsByAgentType(agentType: AgentType): ConversationScript[] {
  return CONVERSATION_SCRIPTS[agentType] || [];
}

/**
 * Get specific script
 */
export function getScript(
  agentType: AgentType,
  section: ScriptSection,
  scenario: string
): ConversationScript | undefined {
  const scripts = getScriptsByAgentType(agentType);
  return scripts.find(s => s.section === section && s.scenario === scenario);
}

/**
 * Get random script variation
 */
export function getScriptVariation(script: ConversationScript): string {
  if (script.variations.length === 0) {
    return script.prompt;
  }
  
  const allOptions = [script.prompt, ...script.variations];
  const randomIndex = Math.floor(Math.random() * allOptions.length);
  return allOptions[randomIndex];
}

/**
 * Replace variables in script
 */
export function replaceScriptVariables(
  script: string,
  variables: Record<string, string>
): string {
  let result = script;
  
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  
  return result;
}

/**
 * Build conversation flow
 */
export function buildConversationFlow(
  agentType: AgentType,
  currentSection: ScriptSection,
  currentScenario: string
): ConversationScript[] {
  const script = getScript(agentType, currentSection, currentScenario);
  
  if (!script) {
    return [];
  }
  
  const flow: ConversationScript[] = [script];
  
  // Add next steps
  for (const nextStep of script.nextSteps) {
    const [section, scenario] = nextStep.split(':') as [ScriptSection, string];
    const nextScript = getScript(agentType, section, scenario);
    
    if (nextScript) {
      flow.push(nextScript);
    }
  }
  
  return flow;
}

export default {
  CONVERSATION_SCRIPTS,
  getScriptsByAgentType,
  getScript,
  getScriptVariation,
  replaceScriptVariables,
  buildConversationFlow,
};
