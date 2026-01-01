#!/usr/bin/env ts-node
/**
 * Dead Letter Queue Manager
 * 
 * Gestiona mensajes fallidos en la DLQ
 * Uso: npm run queue:dlq
 */

import { getQueueManager } from '../lib/whatsapp-queue';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function showDLQ() {
  const queue = getQueueManager();

  console.clear();
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   DEAD LETTER QUEUE MANAGER                ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const messages = await queue.getDLQMessages(100);

  if (messages.length === 0) {
    console.log('✅ DLQ vacía - No hay mensajes fallidos\n');
    return false;
  }

  console.log(`📋 Total mensajes en DLQ: ${messages.length}\n`);

  // Mostrar primeros 10
  const display = messages.slice(0, 10);
  display.forEach((msg, index) => {
    console.log(`${index + 1}. Job ID: ${msg.jobId}`);
    console.log(`   Error: ${msg.error}`);
    console.log(`   Intentos: ${msg.attempts}`);
    console.log(`   Fecha: ${new Date(msg.failedAt).toLocaleString()}`);
    console.log(`   Teléfono: ${msg.data.recipientPhone}`);
    console.log('');
  });

  if (messages.length > 10) {
    console.log(`   ... y ${messages.length - 10} más\n`);
  }

  return true;
}

async function retryJob(jobId: string) {
  const queue = getQueueManager();
  
  try {
    const retriedJob = await queue.retryDLQMessage(jobId);
    
    if (retriedJob) {
      console.log(`\n✅ Job ${jobId} reintentado con éxito`);
      console.log(`   Nuevo Job ID: ${retriedJob.id}\n`);
    } else {
      console.log(`\n❌ Job ${jobId} no encontrado en DLQ\n`);
    }
  } catch (error) {
    console.error(`\n❌ Error reintentando job:`, error);
  }
}

async function retryAll() {
  const queue = getQueueManager();
  const messages = await queue.getDLQMessages(100);

  console.log(`\n🔄 Reintentando ${messages.length} mensajes...\n`);

  let retried = 0;
  for (const msg of messages) {
    try {
      await queue.retryDLQMessage(msg.jobId);
      retried++;
      console.log(`✅ ${retried}/${messages.length} reintentados`);
    } catch (error) {
      console.error(`❌ Error reintentando ${msg.jobId}`);
    }
  }

  console.log(`\n✅ Proceso completado: ${retried}/${messages.length} mensajes reintentados\n`);
}

async function clearDLQ() {
  const queue = getQueueManager();
  
  const confirm = await question('⚠️  ¿Seguro que quieres eliminar TODOS los mensajes de la DLQ? (s/n): ');
  
  if (confirm.toLowerCase() === 's' || confirm.toLowerCase() === 'y') {
    await queue.clearDLQ();
    console.log('\n✅ DLQ limpiada\n');
  } else {
    console.log('\n❌ Operación cancelada\n');
  }
}

async function main() {
  const queue = getQueueManager();

  try {
    const hasDLQ = await showDLQ();

    if (!hasDLQ) {
      await queue.close();
      rl.close();
      return;
    }

    console.log('════════════════════════════════════════════');
    console.log('OPCIONES:\n');
    console.log('1. Reintentar job específico');
    console.log('2. Reintentar todos los jobs');
    console.log('3. Limpiar DLQ');
    console.log('4. Salir\n');

    const choice = await question('Selecciona una opción (1-4): ');

    switch (choice) {
      case '1':
        const jobId = await question('\nIngresa Job ID: ');
        await retryJob(jobId.trim());
        break;

      case '2':
        await retryAll();
        break;

      case '3':
        await clearDLQ();
        break;

      case '4':
        console.log('\nSaliendo...\n');
        break;

      default:
        console.log('\n❌ Opción inválida\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await queue.close();
    rl.close();
  }
}

main().catch(console.error);
