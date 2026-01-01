/**
 * WhatsApp Bot - Ejemplos de Uso
 * 
 * Ejemplos prácticos de cómo usar el bot conversacional
 */

import {
  WhatsAppBot,
  getWhatsAppBot,
  DEFAULT_BOT_CONFIG,
  type BotConfig,
} from './whatsapp-bot';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const customConfig: BotConfig = {
  whatsappConfig: {
    baseURL: 'http://localhost:8080',
    apiKey: process.env.NEXT_EVOLUTION_API_KEY || '',
    instanceName: 'anclora-main',
  },
  llmConfig: {
    model: 'llama-3.1-70b',
    temperature: 0.7,
    maxTokens: 200,
    systemPrompt: 'Eres un asistente experto en inmobiliaria de lujo',
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
// EJEMPLO 1: INICIALIZACIÓN BÁSICA
// ============================================================================

async function ejemploInicializacion() {
  // Opción 1: Usar configuración por defecto
  const bot1 = getWhatsAppBot();

  // Opción 2: Configuración personalizada
  const bot2 = new WhatsAppBot(customConfig);

  // Opción 3: Factory con config
  const bot3 = getWhatsAppBot(customConfig);

  console.log('✅ Bot inicializado correctamente');
}

// ============================================================================
// EJEMPLO 2: PROCESAR MENSAJE SIMPLE
// ============================================================================

async function ejemploMensajeSimple() {
  const bot = getWhatsAppBot(customConfig);

  // Simular mensaje entrante
  await bot.processMessage(
    '34600111222',
    'Hola, busco una villa en Mallorca',
    'Carlos Pérez'
  );

  // El bot detectará:
  // - Intent: property_inquiry
  // - Entity: propertyType = "villa"
  // - Y responderá automáticamente con el template de bienvenida + preguntas
}

// ============================================================================
// EJEMPLO 3: CONVERSACIÓN COMPLETA - BÚSQUEDA DE PROPIEDAD
// ============================================================================

async function ejemploConversacionBusqueda() {
  const bot = getWhatsAppBot(customConfig);
  const numero = '34600222333';
  const nombre = 'María García';

  // Mensaje 1: Inicial
  console.log('\n--- Usuario: Hola, busco apartamento ---');
  await bot.processMessage(numero, 'Hola, busco apartamento', nombre);
  await sleep(2000);

  // Mensaje 2: Responder presupuesto
  console.log('\n--- Usuario: Mi presupuesto es 800k €---');
  await bot.processMessage(numero, 'Mi presupuesto es 800k €');
  await sleep(2000);

  // Mensaje 3: Zona
  console.log('\n--- Usuario: Prefiero Palma centro ---');
  await bot.processMessage(numero, 'Prefiero Palma centro');
  await sleep(2000);

  // Mensaje 4: Habitaciones
  console.log('\n--- Usuario: 3 dormitorios ---');
  await bot.processMessage(numero, '3 dormitorios');

  console.log('\n✅ Conversación completada');
}

// ============================================================================
// EJEMPLO 4: AGENDAR CITA
// ============================================================================

async function ejemploAgendarCita() {
  const bot = getWhatsAppBot(customConfig);
  const numero = '34600333444';

  // Usuario quiere agendar visita
  console.log('\n--- Usuario: Quiero visitar una propiedad ---');
  await bot.processMessage(numero, 'Quiero visitar una propiedad', 'Juan López');
  await sleep(2000);

  // Responder con fecha
  console.log('\n--- Usuario: El martes que viene a las 11 ---');
  await bot.processMessage(numero, 'El martes que viene a las 11');

  console.log('\n✅ Cita agendada');
}

// ============================================================================
// EJEMPLO 5: SOLICITAR VALORACIÓN
// ============================================================================

async function ejemploValoracion() {
  const bot = getWhatsAppBot(customConfig);
  const numero = '34600444555';

  console.log('\n--- Usuario: Quiero valorar mi casa ---');
  await bot.processMessage(numero, 'Quiero valorar mi casa', 'Ana Ruiz');
  await sleep(2000);

  console.log('\n--- Usuario: Está en Santa Ponsa ---');
  await bot.processMessage(numero, 'Está en Santa Ponsa');
  await sleep(2000);

  console.log('\n--- Usuario: Es una villa de 400m² ---');
  await bot.processMessage(numero, 'Es una villa de 400m²');

  console.log('\n✅ Solicitud de valoración procesada');
}

// ============================================================================
// EJEMPLO 6: CONSULTA DE INVERSIÓN
// ============================================================================

async function ejemploInversion() {
  const bot = getWhatsAppBot(customConfig);
  const numero = '34600555666';

  console.log('\n--- Usuario: Me interesa invertir en propiedades ---');
  await bot.processMessage(
    numero,
    'Me interesa invertir en propiedades',
    'Roberto Investor'
  );
  await sleep(2000);

  console.log('\n--- Usuario: ¿Qué rentabilidad puedo esperar? ---');
  await bot.processMessage(numero, '¿Qué rentabilidad puedo esperar?');

  console.log('\n✅ Consulta de inversión iniciada');
}

// ============================================================================
// EJEMPLO 7: FUERA DE HORARIO
// ============================================================================

async function ejemploFueraHorario() {
  const bot = getWhatsAppBot(customConfig);
  const numero = '34600666777';

  // Simular mensaje fuera de horario (domingo 23:00)
  // En producción, el bot detectará automáticamente si es fuera de horario
  
  console.log('\n--- Usuario escribe fuera de horario ---');
  await bot.processMessage(numero, 'Hola, tengo una duda', 'Pedro Noche');

  // El bot enviará mensaje de fuera de horario automáticamente
  console.log('\n✅ Mensaje de fuera de horario enviado');
}

// ============================================================================
// EJEMPLO 8: ESCALACIÓN A HUMANO (HANDOFF)
// ============================================================================

async function ejemploEscalacion() {
  const bot = getWhatsAppBot(customConfig);
  const numero = '34600777888';

  // Mensaje complejo que requiere humano
  console.log('\n--- Usuario: Pregunta compleja sobre contrato ---');
  await bot.processMessage(
    numero,
    'Necesito información sobre los aspectos legales del contrato de compraventa y las condiciones de la hipoteca',
    'Laura Legal'
  );

  // El bot detectará keywords complejos (legal, contrato, hipoteca)
  // y escalará automáticamente a un agente humano

  console.log('\n✅ Conversación escalada a agente humano');
}

// ============================================================================
// EJEMPLO 9: CONVERSACIÓN MULTILINGÜE
// ============================================================================

async function ejemploMultilingue() {
  const bot = getWhatsAppBot(customConfig);
  
  // Cliente en inglés
  const numeroEN = '44700111222';
  console.log('\n--- User: Hello, I\'m looking for a luxury villa ---');
  await bot.processMessage(numeroEN, 'Hello, I\'m looking for a luxury villa', 'John Smith');

  await sleep(2000);

  // Cliente en español
  const numeroES = '34600888999';
  console.log('\n--- Usuario: Hola, busco una villa de lujo ---');
  await bot.processMessage(numeroES, 'Hola, busco una villa de lujo', 'Carlos Martínez');

  console.log('\n✅ Bot responde en idioma detectado');
}

// ============================================================================
// EJEMPLO 10: ESTADÍSTICAS DEL BOT
// ============================================================================

async function ejemploEstadisticas() {
  const bot = getWhatsAppBot(customConfig);

  // Simular varias conversaciones
  await bot.processMessage('34600111111', 'Busco casa', 'Usuario 1');
  await bot.processMessage('34600222222', 'Quiero visita', 'Usuario 2');
  await bot.processMessage('34600333333', 'Valorar mi piso', 'Usuario 3');

  // Obtener estadísticas
  const stats = bot.getStats();
  
  console.log('\n📊 Estadísticas del Bot:');
  console.log(`- Conversaciones activas: ${stats.activeConversations}`);
  console.log(`- Total mensajes procesados: ${stats.totalMessages}`);
  console.log(`- Tasa de escalación: ${(stats.handoffRate * 100).toFixed(1)}%`);
}

// ============================================================================
// EJEMPLO 11: INTEGRACIÓN CON WEBHOOK
// ============================================================================

async function ejemploIntegracionWebhook() {
  const bot = getWhatsAppBot(customConfig);

  // Simular evento de webhook
  const webhookEvent = {
    event: 'messages.upsert',
    instance: 'anclora-main',
    data: {
      key: {
        remoteJid: '34600999000@s.whatsapp.net',
        fromMe: false,
        id: 'msg_123',
      },
      message: {
        conversation: 'Hola, busco una villa',
      },
      pushName: 'Cliente Nuevo',
    },
  };

  // Extraer datos
  const phoneNumber = webhookEvent.data.key.remoteJid.replace('@s.whatsapp.net', '');
  const message = webhookEvent.data.message.conversation;
  const userName = webhookEvent.data.pushName;

  // Procesar con el bot
  await bot.processMessage(phoneNumber, message, userName);

  console.log('\n✅ Webhook procesado correctamente');
}

// ============================================================================
// EJEMPLO 12: FLUJO COMPLETO E2E
// ============================================================================

async function ejemploFlujoCompleto() {
  const bot = getWhatsAppBot(customConfig);
  const numero = '34600123456';
  const nombre = 'Isabel Torres';

  console.log('\n🤖 INICIO DE CONVERSACIÓN COMPLETA\n');
  console.log('='.repeat(50));

  // 1. Saludo inicial
  console.log('\n👤 Usuario: Hola');
  await bot.processMessage(numero, 'Hola', nombre);
  await sleep(2000);

  // 2. Expresar interés
  console.log('\n👤 Usuario: Busco apartamento en primera línea de mar');
  await bot.processMessage(numero, 'Busco apartamento en primera línea de mar');
  await sleep(3000);

  // 3. Presupuesto
  console.log('\n👤 Usuario: Mi presupuesto es de 1.5 millones');
  await bot.processMessage(numero, 'Mi presupuesto es de 1.5 millones');
  await sleep(2000);

  // 4. Zona
  console.log('\n👤 Usuario: Me interesa Port Adriano o Puerto Portals');
  await bot.processMessage(numero, 'Me interesa Port Adriano o Puerto Portals');
  await sleep(2000);

  // 5. Características
  console.log('\n👤 Usuario: 3 dormitorios y terraza grande');
  await bot.processMessage(numero, '3 dormitorios y terraza grande');
  await sleep(3000);

  // 6. Agendar visita
  console.log('\n👤 Usuario: ¿Puedo ver alguna esta semana?');
  await bot.processMessage(numero, '¿Puedo ver alguna esta semana?');
  await sleep(2000);

  // 7. Confirmar día
  console.log('\n👤 Usuario: El jueves a las 11 me va bien');
  await bot.processMessage(numero, 'El jueves a las 11 me va bien');
  await sleep(2000);

  // 8. Agradecer
  console.log('\n👤 Usuario: Perfecto, gracias!');
  await bot.processMessage(numero, 'Perfecto, gracias!');

  console.log('\n='.repeat(50));
  console.log('\n✅ CONVERSACIÓN COMPLETA FINALIZADA');

  // Mostrar estadísticas
  const stats = bot.getStats();
  console.log('\n📊 Resumen:');
  console.log(`   - Mensajes intercambiados: ${stats.totalMessages}`);
  console.log(`   - Estado: ${stats.handoffRate === 0 ? 'Resuelta automáticamente ✅' : 'Escalada a humano'}`);
}

// ============================================================================
// EJEMPLO 13: MANEJO DE ERRORES
// ============================================================================

async function ejemploManejoErrores() {
  const bot = getWhatsAppBot(customConfig);

  try {
    // Intentar procesar mensaje vacío
    await bot.processMessage('34600000000', '');
  } catch (error) {
    console.log('❌ Error capturado:', error);
  }

  try {
    // Número inválido
    await bot.processMessage('numero_invalido', 'Hola');
  } catch (error) {
    console.log('❌ Error capturado:', error);
  }

  console.log('\n✅ Manejo de errores validado');
}

// ============================================================================
// HELPERS
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EXPORTAR EJEMPLOS
// ============================================================================

export {
  ejemploInicializacion,
  ejemploMensajeSimple,
  ejemploConversacionBusqueda,
  ejemploAgendarCita,
  ejemploValoracion,
  ejemploInversion,
  ejemploFueraHorario,
  ejemploEscalacion,
  ejemploMultilingue,
  ejemploEstadisticas,
  ejemploIntegracionWebhook,
  ejemploFlujoCompleto,
  ejemploManejoErrores,
};

// ============================================================================
// EJECUTAR EJEMPLOS (comentar en producción)
// ============================================================================

/*
async function main() {
  try {
    // await ejemploInicializacion();
    // await ejemploMensajeSimple();
    // await ejemploConversacionBusqueda();
    // await ejemploAgendarCita();
    // await ejemploFlujoCompleto();
    console.log('\n✅ Todos los ejemplos ejecutados correctamente');
  } catch (error) {
    console.error('\n❌ Error ejecutando ejemplos:', error);
  }
}

main();
*/
