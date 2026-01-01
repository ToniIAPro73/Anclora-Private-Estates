/**
 * WhatsApp Queue & Analytics - Ejemplos de Uso
 */

import { getQueueManager } from '../lib/whatsapp-queue';
import { getAnalyticsManager } from '../lib/whatsapp-analytics';

// EJEMPLO: Envío con cola
async function sendWithQueue() {
  const queue = getQueueManager();
  
  await queue.addMessage({
    instanceName: 'anclora-main',
    recipientPhone: '34600111222',
    messageType: 'text',
    content: { text: 'Hola desde la cola!' },
    metadata: { priority: 'normal' },
  });
  
  const metrics = await queue.getMetrics();
  console.log('Cola:', metrics);
  
  await queue.close();
}

// EJEMPLO: Analytics tracking
async function trackAnalytics() {
  const analytics = getAnalyticsManager();
  
  await analytics.trackMessageSent('34600111222', 'text');
  await analytics.trackMessageReceived('34600111222', 'text');
  await analytics.trackConversion('34600111222', 'lead');
  
  const report = await analytics.generateReport('day');
  console.log('Reporte:', report);
  
  await analytics.close();
}

sendWithQueue();
trackAnalytics();
