#!/usr/bin/env ts-node
/**
 * Queue Metrics Dashboard
 * 
 * Muestra métricas de la cola en tiempo real
 * Uso: npm run queue:metrics
 */

import { getQueueManager } from '../lib/whatsapp-queue';

async function showMetrics() {
  const queue = getQueueManager();

  console.clear();
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   WHATSAPP QUEUE METRICS DASHBOARD         ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    const metrics = await queue.getMetrics();
    const rate = await queue.getProcessingRate();

    console.log('📊 ESTADO DE LA COLA\n');
    console.log(`   ⏳ Esperando:    ${metrics.waiting.toString().padStart(6)}`);
    console.log(`   ⚡ Activos:      ${metrics.active.toString().padStart(6)}`);
    console.log(`   ✅ Completados:  ${metrics.completed.toString().padStart(6)}`);
    console.log(`   ❌ Fallidos:     ${metrics.failed.toString().padStart(6)}`);
    console.log(`   ⏰ Programados:  ${metrics.delayed.toString().padStart(6)}`);
    console.log(`   ⏸️  Pausados:     ${metrics.paused.toString().padStart(6)}\n`);

    console.log('📈 RENDIMIENTO\n');
    console.log(`   Tasa procesamiento: ${rate} msg/min`);
    
    const total = metrics.completed + metrics.failed;
    const successRate = total > 0 
      ? ((metrics.completed / total) * 100).toFixed(2)
      : '0.00';
    console.log(`   Tasa éxito:         ${successRate}%`);

    const errorRate = total > 0
      ? ((metrics.failed / total) * 100).toFixed(2)
      : '0.00';
    console.log(`   Tasa error:         ${errorRate}%\n`);

    // Últimos 5 jobs waiting
    const waitingJobs = await queue.getJobs('waiting', 0, 4);
    if (waitingJobs.length > 0) {
      console.log('📋 ÚLTIMOS JOBS EN ESPERA\n');
      waitingJobs.forEach((job, i) => {
        const priority = job.opts.priority || 3;
        const priorityLabel = ['', 'CRITICAL', 'HIGH', 'NORMAL', 'LOW'][priority];
        console.log(`   ${i + 1}. ${job.id} - ${priorityLabel}`);
      });
      console.log('');
    }

    // Últimos 5 jobs fallidos
    const failedJobs = await queue.getJobs('failed', 0, 4);
    if (failedJobs.length > 0) {
      console.log('❌ ÚLTIMOS JOBS FALLIDOS\n');
      failedJobs.forEach((job, i) => {
        console.log(`   ${i + 1}. ${job.id} - ${job.failedReason?.substring(0, 50)}`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error obteniendo métricas:', error);
  }

  console.log('════════════════════════════════════════════');
  console.log('Presiona Ctrl+C para salir');
  console.log('Actualizando cada 5 segundos...\n');
}

async function main() {
  // Mostrar métricas cada 5 segundos
  setInterval(showMetrics, 5000);
  await showMetrics();
}

// Cerrar conexiones al salir
process.on('SIGINT', async () => {
  console.log('\n\nCerrando conexiones...');
  const queue = getQueueManager();
  await queue.close();
  process.exit(0);
});

main().catch(console.error);
