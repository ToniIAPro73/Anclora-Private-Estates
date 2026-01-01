/**
 * WhatsApp Templates System
 * 
 * Sistema de plantillas de mensajes reutilizables para WhatsApp
 * Incluye variables dinámicas, múltiples variantes y soporte bilingüe
 * 
 * @author Anclora Private Estates
 * @version 1.0.0
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type Language = 'es' | 'en';

export interface TemplateVariables {
  [key: string]: string | number | undefined;
}

export interface TemplateConfig {
  template: string;
  requiredVars: string[];
  optionalVars?: string[];
  language?: Language;
}

export interface Template {
  es: string | string[];
  en: string | string[];
  requiredVars: string[];
  optionalVars?: string[];
}

// ============================================================================
// TEMPLATE PROCESSOR
// ============================================================================

class TemplateProcessor {
  /**
   * Reemplazar variables en template
   */
  static process(
    template: string,
    variables: TemplateVariables
  ): string {
    let result = template;

    // Reemplazar variables {variable}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      result = result.replace(regex, String(value ?? ''));
    });

    // Limpiar variables no reemplazadas (opcional)
    result = result.replace(/\{[^}]+\}/g, '');

    return result.trim();
  }

  /**
   * Validar variables requeridas
   */
  static validate(
    requiredVars: string[],
    variables: TemplateVariables
  ): { valid: boolean; missing: string[] } {
    const missing = requiredVars.filter(
      varName => variables[varName] === undefined || variables[varName] === ''
    );

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Seleccionar variante aleatoria de template
   */
  static selectVariant(template: string | string[]): string {
    if (typeof template === 'string') {
      return template;
    }

    const randomIndex = Math.floor(Math.random() * template.length);
    return template[randomIndex];
  }
}

// ============================================================================
// TEMPLATES - BIENVENIDA Y SALUDOS
// ============================================================================

export const TEMPLATES = {
  // --------------------------------------------------------------------------
  // 1. BIENVENIDA GENERAL
  // --------------------------------------------------------------------------
  welcome: {
    es: [
      '¡Hola {nombre}! 👋\n\nBienvenido/a a Anclora Private Estates, tu agencia inmobiliaria de lujo en Mallorca.\n\n¿En qué podemos ayudarte hoy?',
      '¡Hola {nombre}! 😊\n\nGracias por contactar con Anclora Private Estates. Somos especialistas en propiedades de lujo en Mallorca.\n\n¿Qué tipo de propiedad buscas?',
      'Hola {nombre}, un placer saludarte 🏡\n\nEn Anclora Private Estates te ayudamos a encontrar la propiedad perfecta en Mallorca.\n\n¿Cuéntanos qué buscas?',
    ],
    en: [
      'Hello {nombre}! 👋\n\nWelcome to Anclora Private Estates, your luxury real estate agency in Mallorca.\n\nHow can we help you today?',
      'Hi {nombre}! 😊\n\nThank you for contacting Anclora Private Estates. We specialize in luxury properties in Mallorca.\n\nWhat type of property are you looking for?',
    ],
    requiredVars: ['nombre'],
    optionalVars: [],
  } as Template,

  // --------------------------------------------------------------------------
  // 2. BIENVENIDA CON TIPO DE PROPIEDAD
  // --------------------------------------------------------------------------
  welcomeWithPropertyType: {
    es: [
      '¡Hola {nombre}! 👋\n\nVeo que estás interesado/a en {tipoPropiedad} en Mallorca. ¡Excelente elección!\n\nTenemos varias opciones disponibles que podrían interesarte. ¿Te gustaría conocerlas?',
      'Hola {nombre} 😊\n\nGracias por tu interés en {tipoPropiedad}. En Anclora trabajamos con las mejores propiedades de lujo en Mallorca.\n\n¿Qué zona te interesa más?',
    ],
    en: [
      'Hello {nombre}! 👋\n\nI see you\'re interested in {tipoPropiedad} in Mallorca. Excellent choice!\n\nWe have several available options that might interest you. Would you like to know more?',
    ],
    requiredVars: ['nombre', 'tipoPropiedad'],
  } as Template,

  // --------------------------------------------------------------------------
  // 3. INFORMACIÓN DE PROPIEDAD ESPECÍFICA
  // --------------------------------------------------------------------------
  propertyInfo: {
    es: [
      '🏡 *{nombrePropiedad}*\n\n📍 Ubicación: {ubicacion}\n💰 Precio: {precio}€\n🛏️ Dormitorios: {dormitorios}\n🛁 Baños: {banos}\n📏 Superficie: {superficie}m²\n\n{descripcion}\n\n¿Te gustaría agendar una visita?',
      '✨ *{nombrePropiedad}*\n\nPrecio: *{precio}€*\nZona: {ubicacion}\n{dormitorios} dorm | {banos} baños | {superficie}m²\n\n{descripcion}\n\n¿Quieres más información o agendar una visita?',
    ],
    en: [
      '🏡 *{nombrePropiedad}*\n\n📍 Location: {ubicacion}\n💰 Price: €{precio}\n🛏️ Bedrooms: {dormitorios}\n🛁 Bathrooms: {banos}\n📏 Surface: {superficie}m²\n\n{descripcion}\n\nWould you like to schedule a viewing?',
    ],
    requiredVars: ['nombrePropiedad', 'ubicacion', 'precio', 'dormitorios', 'banos', 'superficie'],
    optionalVars: ['descripcion'],
  } as Template,

  // --------------------------------------------------------------------------
  // 4. CONFIRMACIÓN DE CITA
  // --------------------------------------------------------------------------
  appointmentConfirmation: {
    es: [
      '✅ *Cita Confirmada*\n\n📅 Fecha: {fecha}\n🕐 Hora: {hora}\n📍 Propiedad: {nombrePropiedad}\n👤 Asesor: {asesor}\n\nNos vemos el {fecha} a las {hora}. ¡Estamos deseando mostrarte esta propiedad!\n\n¿Necesitas indicaciones para llegar?',
      '¡Perfecto! Tu visita está confirmada ✅\n\n🗓️ {fecha} a las {hora}\n🏡 {nombrePropiedad}\n👨‍💼 Te atenderá {asesor}\n\nRecibirás un recordatorio 24h antes.\n\n¿Alguna pregunta?',
    ],
    en: [
      '✅ *Appointment Confirmed*\n\n📅 Date: {fecha}\n🕐 Time: {hora}\n📍 Property: {nombrePropiedad}\n👤 Advisor: {asesor}\n\nSee you on {fecha} at {hora}. We look forward to showing you this property!\n\nDo you need directions?',
    ],
    requiredVars: ['fecha', 'hora', 'nombrePropiedad', 'asesor'],
  } as Template,

  // --------------------------------------------------------------------------
  // 5. RECORDATORIO DE CITA
  // --------------------------------------------------------------------------
  appointmentReminder: {
    es: [
      '⏰ *Recordatorio de Cita*\n\nHola {nombre}, te recordamos tu visita mañana:\n\n📅 {fecha}\n🕐 {hora}\n📍 {nombrePropiedad}\n\nNos vemos allí. Si necesitas cancelar o reprogramar, avísanos.',
      '¡Hola {nombre}! 👋\n\nRecordatorio: Mañana tienes visita a las {hora} para ver {nombrePropiedad}.\n\nNos vemos en {direccion}.\n\n¿Todo ok?',
    ],
    en: [
      '⏰ *Appointment Reminder*\n\nHi {nombre}, reminder of your visit tomorrow:\n\n📅 {fecha}\n🕐 {hora}\n📍 {nombrePropiedad}\n\nSee you there. If you need to cancel or reschedule, let us know.',
    ],
    requiredVars: ['nombre', 'fecha', 'hora', 'nombrePropiedad'],
    optionalVars: ['direccion'],
  } as Template,

  // --------------------------------------------------------------------------
  // 6. SEGUIMIENTO POST-VISITA
  // --------------------------------------------------------------------------
  followUpAfterViewing: {
    es: [
      'Hola {nombre} 😊\n\n¿Qué te pareció {nombrePropiedad}? Me encantaría saber tu opinión.\n\n¿Tienes alguna pregunta o te gustaría ver otras opciones similares?',
      '¡Hola {nombre}! Espero que hayas disfrutado la visita a {nombrePropiedad} 🏡\n\n¿Qué impresión te llevaste? ¿Quieres que programemos una segunda visita o prefieres ver otras alternativas?',
    ],
    en: [
      'Hi {nombre} 😊\n\nWhat did you think of {nombrePropiedad}? I\'d love to hear your thoughts.\n\nDo you have any questions or would you like to see other similar options?',
    ],
    requiredVars: ['nombre', 'nombrePropiedad'],
  } as Template,

  // --------------------------------------------------------------------------
  // 7. NUEVA PROPIEDAD DISPONIBLE
  // --------------------------------------------------------------------------
  newPropertyAlert: {
    es: [
      '🆕 *Nueva Propiedad Disponible*\n\nHola {nombre}, acaba de salir al mercado una propiedad que podría interesarte:\n\n🏡 {nombrePropiedad}\n📍 {ubicacion}\n💰 {precio}€\n\n¿Te envío más detalles?',
      '¡{nombre}! Tenemos una novedad que creo que te va a encantar 🎉\n\n*{nombrePropiedad}* en {ubicacion}\nPrecio: {precio}€\n\nEs justo lo que buscabas. ¿Quieres que te cuente más?',
    ],
    en: [
      '🆕 *New Property Available*\n\nHi {nombre}, a property that might interest you just hit the market:\n\n🏡 {nombrePropiedad}\n📍 {ubicacion}\n💰 €{precio}\n\nShall I send you more details?',
    ],
    requiredVars: ['nombre', 'nombrePropiedad', 'ubicacion', 'precio'],
  } as Template,

  // --------------------------------------------------------------------------
  // 8. SOLICITUD DE INFORMACIÓN
  // --------------------------------------------------------------------------
  requestMoreInfo: {
    es: [
      'Claro {nombre}, te envío toda la información de {nombrePropiedad}.\n\nEn unos segundos recibirás:\n📸 Galería de fotos\n📄 Dossier completo\n🗺️ Ubicación exacta\n\n¿Algo específico que quieras saber?',
      '¡Por supuesto! Te preparo la documentación completa de {nombrePropiedad}.\n\n¿Prefieres que te llame para explicarte los detalles o te va bien por WhatsApp?',
    ],
    en: [
      'Sure {nombre}, I\'ll send you all the information about {nombrePropiedad}.\n\nIn a few seconds you\'ll receive:\n📸 Photo gallery\n📄 Complete dossier\n🗺️ Exact location\n\nAnything specific you want to know?',
    ],
    requiredVars: ['nombre', 'nombrePropiedad'],
  } as Template,

  // --------------------------------------------------------------------------
  // 9. RESPUESTA DISPONIBILIDAD
  // --------------------------------------------------------------------------
  availabilityResponse: {
    es: [
      'Hola {nombre}, gracias por tu mensaje.\n\nEstoy disponible de lunes a viernes de 9:00 a 19:00 y sábados de 10:00 a 14:00.\n\n¿En qué horario te viene mejor que te llame?',
      '¡Hola {nombre}! Te respondo a la brevedad posible.\n\nNuestro horario es:\n🕐 L-V: 9:00-19:00\n🕐 S: 10:00-14:00\n\n¿Prefieres que te contacte por teléfono o seguimos por aquí?',
    ],
    en: [
      'Hi {nombre}, thank you for your message.\n\nI\'m available Monday to Friday from 9:00 to 19:00 and Saturdays from 10:00 to 14:00.\n\nWhat time works best for you for a call?',
    ],
    requiredVars: ['nombre'],
  } as Template,

  // --------------------------------------------------------------------------
  // 10. FUERA DE HORARIO
  // --------------------------------------------------------------------------
  outOfOffice: {
    es: [
      'Hola {nombre} 👋\n\nGracias por tu mensaje. En este momento estamos fuera del horario de atención.\n\nNuestro horario:\n🕐 Lunes a Viernes: 9:00-19:00\n🕐 Sábados: 10:00-14:00\n\nTe responderemos lo antes posible. ¡Gracias por tu paciencia!',
      '¡Hola {nombre}! Hemos recibido tu mensaje fuera de nuestro horario de atención.\n\nTe contactaremos mañana a primera hora.\n\n¿Es urgente? Déjanos tu teléfono y te llamamos.',
    ],
    en: [
      'Hi {nombre} 👋\n\nThank you for your message. We are currently outside business hours.\n\nOur hours:\n🕐 Monday to Friday: 9:00-19:00\n🕐 Saturdays: 10:00-14:00\n\nWe\'ll respond as soon as possible. Thank you for your patience!',
    ],
    requiredVars: ['nombre'],
  } as Template,

  // --------------------------------------------------------------------------
  // 11. OFERTA ACEPTADA
  // --------------------------------------------------------------------------
  offerAccepted: {
    es: [
      '🎉 *¡Enhorabuena {nombre}!*\n\nTu oferta por {nombrePropiedad} ha sido aceptada.\n\nPróximos pasos:\n1️⃣ Firma de contrato de arras\n2️⃣ Gestión hipotecaria (si aplica)\n3️⃣ Escritura pública\n\nNuestro equipo legal se pondrá en contacto contigo en las próximas 24h.\n\n¡Felicidades por tu nueva propiedad! 🏡',
      '¡Felicidades {nombre}! 🎊\n\nEl propietario ha aceptado tu oferta de {precioOferta}€ por {nombrePropiedad}.\n\nAhora comenzamos el proceso de compraventa. Te mantendremos informado/a en cada paso.\n\n¿Tienes alguna pregunta?',
    ],
    en: [
      '🎉 *Congratulations {nombre}!*\n\nYour offer for {nombrePropiedad} has been accepted.\n\nNext steps:\n1️⃣ Deposit contract signing\n2️⃣ Mortgage management (if applicable)\n3️⃣ Public deed\n\nOur legal team will contact you within 24 hours.\n\nCongratulations on your new property! 🏡',
    ],
    requiredVars: ['nombre', 'nombrePropiedad'],
    optionalVars: ['precioOferta'],
  } as Template,

  // --------------------------------------------------------------------------
  // 12. DOCUMENTACIÓN ENVIADA
  // --------------------------------------------------------------------------
  documentationSent: {
    es: [
      '📄 *Documentación Enviada*\n\nHola {nombre}, te he enviado:\n\n✅ Dossier completo de {nombrePropiedad}\n✅ Planos de la propiedad\n✅ Certificado energético\n✅ Nota simple registral\n\n¿Has podido revisarlo? ¿Tienes alguna duda?',
      '¡Listo {nombre}! 📨\n\nYa tienes en tu correo toda la documentación de {nombrePropiedad}.\n\nRevísala con calma y cuando quieras hablamos.',
    ],
    en: [
      '📄 *Documentation Sent*\n\nHi {nombre}, I\'ve sent you:\n\n✅ Complete dossier of {nombrePropiedad}\n✅ Property plans\n✅ Energy certificate\n✅ Registry note\n\nHave you had a chance to review it? Any questions?',
    ],
    requiredVars: ['nombre', 'nombrePropiedad'],
  } as Template,

  // --------------------------------------------------------------------------
  // 13. AGRADECIMIENTO POST-VENTA
  // --------------------------------------------------------------------------
  thankYouPostSale: {
    es: [
      'Querido/a {nombre} 💙\n\nHa sido un placer ayudarte a encontrar tu propiedad perfecta en Mallorca.\n\nSi alguna vez necesitas asesoramiento o conoces a alguien que busque propiedad, estaré encantado/a de ayudar.\n\n¡Disfruta tu nuevo hogar! 🏡',
      '¡Muchas gracias {nombre}! 🙏\n\nEspero que disfrutes mucho de {nombrePropiedad}. Ha sido un placer trabajar contigo.\n\nRecuerda que estoy aquí para lo que necesites.\n\n¡Feliz estreno!',
    ],
    en: [
      'Dear {nombre} 💙\n\nIt has been a pleasure helping you find your perfect property in Mallorca.\n\nIf you ever need advice or know someone looking for property, I\'d be happy to help.\n\nEnjoy your new home! 🏡',
    ],
    requiredVars: ['nombre'],
    optionalVars: ['nombrePropiedad'],
  } as Template,

  // --------------------------------------------------------------------------
  // 14. VALORACIÓN GRATUITA
  // --------------------------------------------------------------------------
  freeValuation: {
    es: [
      'Hola {nombre} 👋\n\n¿Estás pensando en vender tu propiedad?\n\nEn Anclora te ofrecemos una valoración gratuita y sin compromiso.\n\nNuestro equipo de expertos analizará:\n✅ Valor de mercado actual\n✅ Estrategia de venta personalizada\n✅ Tendencias del mercado en tu zona\n\n¿Te interesa?',
      '¡Hola {nombre}! ¿Quieres saber cuánto vale tu propiedad? 🏡\n\nTe ofrezco una valoración profesional completamente gratis.\n\n¿Cuándo te viene bien que vaya a verla?',
    ],
    en: [
      'Hi {nombre} 👋\n\nAre you thinking about selling your property?\n\nAt Anclora we offer you a free valuation with no obligation.\n\nOur team of experts will analyze:\n✅ Current market value\n✅ Personalized sales strategy\n✅ Market trends in your area\n\nInterested?',
    ],
    requiredVars: ['nombre'],
  } as Template,

  // --------------------------------------------------------------------------
  // 15. SOLICITUD DE PRESUPUESTO
  // --------------------------------------------------------------------------
  budgetInquiry: {
    es: [
      'Perfecto {nombre}, para ayudarte mejor necesito conocer algunos detalles:\n\n1️⃣ ¿Cuál es tu presupuesto aproximado?\n2️⃣ ¿Zona preferida en Mallorca?\n3️⃣ ¿Tipo de propiedad? (villa, apartamento, finca...)\n4️⃣ ¿Cuántos dormitorios necesitas?\n\nCon esta info podré mostrarte las mejores opciones.',
      'Genial {nombre}, vamos a encontrar tu propiedad ideal 🎯\n\nCuéntame:\n• Presupuesto máximo\n• Zonas que te gustan\n• Características imprescindibles\n\nAsí te envío solo lo que realmente te interesa.',
    ],
    en: [
      'Perfect {nombre}, to help you better I need to know some details:\n\n1️⃣ What is your approximate budget?\n2️⃣ Preferred area in Mallorca?\n3️⃣ Type of property? (villa, apartment, finca...)\n4️⃣ How many bedrooms do you need?\n\nWith this info I can show you the best options.',
    ],
    requiredVars: ['nombre'],
  } as Template,

  // --------------------------------------------------------------------------
  // 16. CANCELACIÓN DE CITA
  // --------------------------------------------------------------------------
  appointmentCancellation: {
    es: [
      'Entendido {nombre}, he cancelado tu cita del {fecha} a las {hora}.\n\n¿Quieres reprogramarla para otro día?\n\nEstoy disponible:\n• {disponibilidad1}\n• {disponibilidad2}\n• {disponibilidad3}',
      'Sin problema {nombre}, cita cancelada ✅\n\n¿Prefieres que te contacte más adelante cuando tengas disponibilidad?',
    ],
    en: [
      'Understood {nombre}, I\'ve canceled your appointment on {fecha} at {hora}.\n\nWould you like to reschedule for another day?\n\nI\'m available:\n• {disponibilidad1}\n• {disponibilidad2}\n• {disponibilidad3}',
    ],
    requiredVars: ['nombre', 'fecha', 'hora'],
    optionalVars: ['disponibilidad1', 'disponibilidad2', 'disponibilidad3'],
  } as Template,

  // --------------------------------------------------------------------------
  // 17. PROPIEDAD YA VENDIDA
  // --------------------------------------------------------------------------
  propertySold: {
    es: [
      'Hola {nombre},\n\nLamento informarte que {nombrePropiedad} ya ha sido vendida.\n\nPero tengo buenas noticias: acaban de salir 3 propiedades similares que podrían interesarte.\n\n¿Te las envío?',
      'Lo siento {nombre} 😔\n\n{nombrePropiedad} se vendió ayer, fue muy rápido.\n\nPero no te preocupes, tengo otras opciones en {ubicacion} que son igual de buenas.\n\n¿Las vemos?',
    ],
    en: [
      'Hi {nombre},\n\nI regret to inform you that {nombrePropiedad} has already been sold.\n\nBut I have good news: 3 similar properties just came on the market that might interest you.\n\nShall I send them to you?',
    ],
    requiredVars: ['nombre', 'nombrePropiedad'],
    optionalVars: ['ubicacion'],
  } as Template,

  // --------------------------------------------------------------------------
  // 18. ERROR EN INFORMACIÓN
  // --------------------------------------------------------------------------
  informationError: {
    es: [
      'Disculpa {nombre}, me he equivocado en el dato anterior.\n\nLa información correcta es:\n{informacionCorrecta}\n\nGracias por tu paciencia.',
      'Perdona {nombre}, acabo de darme cuenta del error.\n\n{informacionCorrecta}\n\n¡Mis disculpas!',
    ],
    en: [
      'Sorry {nombre}, I made a mistake in the previous information.\n\nThe correct information is:\n{informacionCorrecta}\n\nThank you for your patience.',
    ],
    requiredVars: ['nombre', 'informacionCorrecta'],
  } as Template,
};

// ============================================================================
// TEMPLATE MANAGER
// ============================================================================

export class TemplateManager {
  private language: Language;

  constructor(language: Language = 'es') {
    this.language = language;
  }

  /**
   * Obtener template procesado
   */
  get(
    templateName: keyof typeof TEMPLATES,
    variables: TemplateVariables,
    language?: Language
  ): string {
    const lang = language || this.language;
    const template = TEMPLATES[templateName];

    if (!template) {
      throw new Error(`Template "${templateName}" no encontrado`);
    }

    // Validar variables requeridas
    const validation = TemplateProcessor.validate(
      template.requiredVars,
      variables
    );

    if (!validation.valid) {
      throw new Error(
        `Variables requeridas faltantes: ${validation.missing.join(', ')}`
      );
    }

    // Seleccionar template según idioma
    const templateText = template[lang];
    
    if (!templateText) {
      throw new Error(`Template "${templateName}" no disponible en idioma "${lang}"`);
    }

    // Seleccionar variante
    const selectedTemplate = TemplateProcessor.selectVariant(templateText);

    // Procesar variables
    return TemplateProcessor.process(selectedTemplate, variables);
  }

  /**
   * Cambiar idioma por defecto
   */
  setLanguage(language: Language): void {
    this.language = language;
  }

  /**
   * Obtener idioma actual
   */
  getLanguage(): Language {
    return this.language;
  }

  /**
   * Listar templates disponibles
   */
  listTemplates(): string[] {
    return Object.keys(TEMPLATES);
  }

  /**
   * Obtener información de template
   */
  getTemplateInfo(templateName: keyof typeof TEMPLATES): {
    requiredVars: string[];
    optionalVars: string[];
    languages: Language[];
  } {
    const template = TEMPLATES[templateName];
    
    if (!template) {
      throw new Error(`Template "${templateName}" no encontrado`);
    }

    return {
      requiredVars: template.requiredVars,
      optionalVars: template.optionalVars || [],
      languages: Object.keys(template).filter(
        k => k === 'es' || k === 'en'
      ) as Language[],
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let templateManager: TemplateManager | null = null;

export function getTemplateManager(language?: Language): TemplateManager {
  if (!templateManager) {
    templateManager = new TemplateManager(language);
  }
  return templateManager;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtener mensaje procesado rápidamente
 */
export function getMessage(
  templateName: keyof typeof TEMPLATES,
  variables: TemplateVariables,
  language: Language = 'es'
): string {
  const manager = getTemplateManager(language);
  return manager.get(templateName, variables);
}

/**
 * Validar si template existe
 */
export function templateExists(templateName: string): boolean {
  return templateName in TEMPLATES;
}

export default TemplateManager;
