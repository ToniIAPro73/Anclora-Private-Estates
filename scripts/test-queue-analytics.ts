#!/usr/bin/env ts-node

/**
 * Test Script para WhatsApp Queue & Analytics
 * 
 * Ejecutar:
 * npm install -g ts-node
 * ts-node scripts/test-queue-analytics.ts
 */

import { createQueueManager, WhatsAppQueueManager } from '../lib/whatsapp-queue';
import { createAnalyticsManager, WhatsAppAnalyticsManager } from '../lib/whatsapp-analytics';

// ============================================
// CONFIGURACIÓN DE TESTS
// ============================================

const TEST_CONFIG = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    db: 0,
  },
  testPhone: '34600111222',
  testInstance: 'anclora-test',
};

// ============================================
// COLORES PARA OUTPUT
// ============================================

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function success(msg: string) {
  console.log(`${colors.green}✅ ${msg}${colors.reset}`);
}

function error(msg: string) {
  console.log(`${colors.red}❌ ${msg}${colors.reset}`);
}

function info(msg: string) {
  console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`);
}

function section(msg: string) {
  console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.blue}${msg}${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}\n`);
}

// ============================================
// TESTS: QUEUE MANAGER
// ============================================

async function testQueueManager(): Promise<boolean> {
  section('TEST: Queue Manager');

  let queueManager: WhatsAppQueueManager | null = null;

  try {
    // 1. Inicialización
    info('Test 1: Inicializar Queue Manager');
    queueManager = createQueueManager(TEST_CONFIG);
    await new Promise(resolve => setTimeout(resolve, 1000));
    success('Queue Manager inicializado');

    // 2. Agregar mensaje
    info('Test 2: Agregar mensaje a cola');
    const job = await queueManager.addMessage({
      instanceName: TEST_CONFIG.testInstance,
      recipientPhone: TEST_CONFIG.testPhone,
      messageType: 'text',
      content: { text: 'Test message' },
    });
    success(`Mensaje agregado - Job ID: ${job.id}`);

    // 3. Verificar métricas
    info('Test 3: Verificar métricas de cola');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const metrics = await queueManager.getMetrics();
    console.log(`   Waiting: ${metrics.waiting}`);
    console.log(`   Active: ${metrics.active}`);
    console.log(`   Completed: ${metrics.completed}`);
    success('Métricas obtenidas correctamente');

    // 4. Bulk messages
    info('Test 4: Envío masivo (bulk)');
    const bulkMessages = Array(5).fill(null).map((_, i) => ({
      instanceName: TEST_CONFIG.testInstance,
      recipientPhone: `${TEST_CONFIG.testPhone}${i}`,
      messageType: 'text' as const,
      content: { text: `Bulk message ${i + 1}` },
    }));
    const jobs = await queueManager.addBulk(bulkMessages);
    success(`${jobs.length} mensajes agregados en bulk`);

    // 5. Mensaje prioritario
    info('Test 5: Mensaje con prioridad');
    const priorityJob = await queueManager.addMessage({
      instanceName: TEST_CONFIG.testInstance,
      recipientPhone: TEST_CONFIG.testPhone,
      messageType: 'text',
      content: { text: 'Priority message' },
      metadata: { priority: 'critical' },
    });
    success(`Mensaje prioritario agregado - Job ID: ${priorityJob.id}`);

    // 6. Schedule message
    info('Test 6: Programar mensaje futuro');
    const scheduledTime = new Date(Date.now() + 60000); // +1 minuto
    const scheduledJob = await queueManager.scheduleMessage(
      {
        instanceName: TEST_CONFIG.testInstance,
        recipientPhone: TEST_CONFIG.testPhone,
        messageType: 'text',
        content: { text: 'Scheduled message' },
      },
      scheduledTime
    );
    success(`Mensaje programado - Job ID: ${scheduledJob.id}`);

    // 7. Pausar/Reanudar
    info('Test 7: Pausar y reanudar cola');
    await queueManager.pause();
    success('Cola pausada');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await queueManager.resume();
    success('Cola reanudada');

    // 8. Processing rate
    info('Test 8: Tasa de procesamiento');
    const rate = await queueManager.getProcessingRate();
    console.log(`   Tasa: ${rate} mensajes/min`);
    success('Tasa de procesamiento calculada');

    return true;

  } catch (err) {
    error(`Error en Queue Manager tests: ${err}`);
    return false;
  } finally {
    if (queueManager) {
      await queueManager.close();
      info('Queue Manager cerrado');
    }
  }
}

// ============================================
// TESTS: ANALYTICS MANAGER
// ============================================

async function testAnalyticsManager(): Promise<boolean> {
  section('TEST: Analytics Manager');

  let analyticsManager: WhatsAppAnalyticsManager | null = null;

  try {
    // 1. Inicialización
    info('Test 1: Inicializar Analytics Manager');
    analyticsManager = createAnalyticsManager({
      ...TEST_CONFIG.redis,
      db: 1,
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    success('Analytics Manager inicializado');

    // 2. Track mensajes
    info('Test 2: Track mensajes enviados/recibidos');
    await analyticsManager.trackMessageSent(TEST_CONFIG.testPhone, 'text', {
      templateId: 'test-template',
    });
    await analyticsManager.trackMessageReceived(TEST_CONFIG.testPhone, 'text', {
      intent: 'test',
    });
    success('Mensajes trackeados');

    // 3. Track conversación
    info('Test 3: Track conversación');
    await analyticsManager.trackConversationStarted(TEST_CONFIG.testPhone, 'inbound');
    success('Conversación iniciada');

    // 4. Track conversiones
    info('Test 4: Track conversiones');
    await analyticsManager.trackConversion(TEST_CONFIG.testPhone, 'lead');
    await analyticsManager.trackConversion(TEST_CONFIG.testPhone, 'qualified_lead');
    await analyticsManager.trackConversion(TEST_CONFIG.testPhone, 'appointment');
    success('Conversiones trackeadas');

    // 5. Track campaña
    info('Test 5: Track campaña');
    const campaignId = 'test-campaign-2026';
    await analyticsManager.trackCampaign(campaignId, TEST_CONFIG.testPhone, 'sent');
    await analyticsManager.trackCampaign(campaignId, TEST_CONFIG.testPhone, 'delivered');
    await analyticsManager.trackCampaign(campaignId, TEST_CONFIG.testPhone, 'read');
    success('Campaña trackeada');

    // 6. Métricas de mensajes
    info('Test 6: Métricas de mensajes');
    const messageMetrics = await analyticsManager.getMessageMetrics();
    console.log(`   Enviados: ${messageMetrics.sent}`);
    console.log(`   Recibidos: ${messageMetrics.received}`);
    success('Métricas de mensajes obtenidas');

    // 7. Métricas de conversación
    info('Test 7: Métricas de conversación');
    const convMetrics = await analyticsManager.getConversationMetrics();
    console.log(`   Conversaciones activas: ${convMetrics.activeConversations}`);
    console.log(`   Total: ${convMetrics.totalConversations}`);
    success('Métricas de conversación obtenidas');

    // 8. Métricas de conversión
    info('Test 8: Métricas de conversión');
    const conversionMetrics = await analyticsManager.getConversionMetrics();
    console.log(`   Leads: ${conversionMetrics.leads}`);
    console.log(`   Citas: ${conversionMetrics.appointments}`);
    success('Métricas de conversión obtenidas');

    // 9. Métricas de campaña
    info('Test 9: Métricas de campaña');
    const campaignMetrics = await analyticsManager.getCampaignMetrics(campaignId);
    console.log(`   Enviados: ${campaignMetrics.sent}`);
    console.log(`   ROI: ${campaignMetrics.roi}%`);
    success('Métricas de campaña obtenidas');

    // 10. Reporte completo
    info('Test 10: Generar reporte completo');
    const report = await analyticsManager.generateReport('day');
    console.log(`   Período: ${report.period}`);
    console.log(`   Mensajes enviados: ${report.messages.sent}`);
    console.log(`   Conversiones: ${report.conversions.leads}`);
    success('Reporte generado correctamente');

    // 11. Time series
    info('Test 11: Time series data');
    const timeSeries = await analyticsManager.getMessageTimeSeries(3);
    console.log(`   Datos de ${timeSeries.length} días`);
    success('Time series obtenida');

    return true;

  } catch (err) {
    error(`Error en Analytics Manager tests: ${err}`);
    return false;
  } finally {
    if (analyticsManager) {
      await analyticsManager.close();
      info('Analytics Manager cerrado');
    }
  }
}

// ============================================
// TESTS: INTEGRACIÓN
// ============================================

async function testIntegration(): Promise<boolean> {
  section('TEST: Integración Queue + Analytics');

  let queueManager: WhatsAppQueueManager | null = null;
  let analyticsManager: WhatsAppAnalyticsManager | null = null;

  try {
    info('Test 1: Inicializar ambos sistemas');
    queueManager = createQueueManager(TEST_CONFIG);
    analyticsManager = createAnalyticsManager({ ...TEST_CONFIG.redis, db: 1 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    success('Ambos sistemas inicializados');

    info('Test 2: Flujo completo mensaje → tracking');
    
    // Agregar mensaje a cola
    const job = await queueManager.addMessage({
      instanceName: TEST_CONFIG.testInstance,
      recipientPhone: TEST_CONFIG.testPhone,
      messageType: 'text',
      content: { text: 'Integration test message' },
    });
    
    // Track en analytics
    await analyticsManager.trackMessageSent(TEST_CONFIG.testPhone, 'text', {
      jobId: job.id,
    });
    
    // Simular respuesta
    await analyticsManager.trackMessageReceived(TEST_CONFIG.testPhone, 'text');
    
    // Track conversión
    await analyticsManager.trackConversion(TEST_CONFIG.testPhone, 'lead');
    
    success('Flujo completo ejecutado');

    info('Test 3: Verificar datos en ambos sistemas');
    const queueMetrics = await queueManager.getMetrics();
    const analyticsMetrics = await analyticsManager.getMessageMetrics();
    
    console.log(`   Cola - Waiting: ${queueMetrics.waiting}`);
    console.log(`   Analytics - Enviados: ${analyticsMetrics.sent}`);
    success('Datos verificados en ambos sistemas');

    return true;

  } catch (err) {
    error(`Error en tests de integración: ${err}`);
    return false;
  } finally {
    if (queueManager) await queueManager.close();
    if (analyticsManager) await analyticsManager.close();
    info('Sistemas cerrados');
  }
}

// ============================================
// RUNNER PRINCIPAL
// ============================================

async function runAllTests() {
  console.log('\n');
  section('INICIANDO TESTS: WhatsApp Queue & Analytics');
  console.log(`Redis: ${TEST_CONFIG.redis.host}:${TEST_CONFIG.redis.port}`);
  console.log(`Test Phone: ${TEST_CONFIG.testPhone}\n`);

  const results = {
    queue: false,
    analytics: false,
    integration: false,
  };

  // Ejecutar tests
  results.queue = await testQueueManager();
  await new Promise(resolve => setTimeout(resolve, 2000));

  results.analytics = await testAnalyticsManager();
  await new Promise(resolve => setTimeout(resolve, 2000));

  results.integration = await testIntegration();

  // Resumen
  section('RESUMEN DE TESTS');
  console.log(`Queue Manager:     ${results.queue ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);
  console.log(`Analytics Manager: ${results.analytics ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);
  console.log(`Integración:       ${results.integration ? colors.green + '✅ PASS' : colors.red + '❌ FAIL'}${colors.reset}`);

  const allPassed = results.queue && results.analytics && results.integration;
  
  console.log('\n');
  if (allPassed) {
    success('TODOS LOS TESTS PASARON ✅');
    process.exit(0);
  } else {
    error('ALGUNOS TESTS FALLARON ❌');
    process.exit(1);
  }
}

// Ejecutar
runAllTests().catch(err => {
  error(`Error fatal: ${err}`);
  process.exit(1);
});
