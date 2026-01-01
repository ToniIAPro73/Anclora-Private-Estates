#!/usr/bin/env ts-node
/**
 * Analytics Dashboard
 * 
 * Dashboard en tiempo real de métricas WhatsApp
 * Uso: npm run analytics:dashboard
 */

import { getAnalyticsManager } from '../lib/whatsapp-analytics';

async function showDashboard() {
  const analytics = getAnalyticsManager();

  console.clear();
  console.log('╔═════════════════════════════════════════════════════════╗');
  console.log('║   WHATSAPP ANALYTICS DASHBOARD - TIEMPO REAL            ║');
  console.log('╚═════════════════════════════════════════════════════════╝\n');

  try {
    // Obtener todas las métricas en paralelo
    const [
      messageMetrics,
      convMetrics,
      conversionMetrics,
      perfMetrics,
      topConversations
    ] = await Promise.all([
      analytics.getMessageMetrics(),
      analytics.getConversationMetrics(),
      analytics.getConversionMetrics(),
      analytics.getPerformanceMetrics(),
      analytics.getTopConversations(5),
    ]);

    // MENSAJES
    console.log('💬 MENSAJES\n');
    console.log(`   Enviados:    ${messageMetrics.sent.toString().padStart(8)}`);
    console.log(`   Recibidos:   ${messageMetrics.received.toString().padStart(8)}`);
    console.log(`   Entregados:  ${messageMetrics.delivered.toString().padStart(8)}`);
    console.log(`   Leídos:      ${messageMetrics.read.toString().padStart(8)}`);
    console.log(`   Fallidos:    ${messageMetrics.failed.toString().padStart(8)}`);

    const deliveryRate = messageMetrics.sent > 0
      ? ((messageMetrics.delivered / messageMetrics.sent) * 100).toFixed(2)
      : '0.00';
    const readRate = messageMetrics.delivered > 0
      ? ((messageMetrics.read / messageMetrics.delivered) * 100).toFixed(2)
      : '0.00';

    console.log(`\n   📊 Tasa entrega: ${deliveryRate}%`);
    console.log(`   📖 Tasa lectura:  ${readRate}%\n`);

    // CONVERSACIONES
    console.log('💭 CONVERSACIONES\n');
    console.log(`   Activas:         ${convMetrics.activeConversations.toString().padStart(8)}`);
    console.log(`   Total:           ${convMetrics.totalConversations.toString().padStart(8)}`);
    console.log(`   Tiempo respuesta: ${convMetrics.averageResponseTime}s`);
    console.log(`   Tasa respuesta:   ${convMetrics.responseRate}%`);
    console.log(`   Tasa handoff:     ${convMetrics.handoffRate}%\n`);

    // CONVERSIONES
    console.log('🎯 CONVERSIONES\n');
    console.log(`   Leads:            ${conversionMetrics.leads.toString().padStart(8)}`);
    console.log(`   Leads calificados: ${conversionMetrics.qualifiedLeads.toString().padStart(7)}`);
    console.log(`   Citas agendadas:   ${conversionMetrics.appointments.toString().padStart(7)}`);
    console.log(`   Ventas:            ${conversionMetrics.sales.toString().padStart(7)}`);
    console.log(`   Tasa conversión:   ${conversionMetrics.conversionRate}%\n`);

    // PERFORMANCE
    console.log('⚡ PERFORMANCE\n');
    console.log(`   Enviados/hora:     ${perfMetrics.messagesSentPerHour.toString().padStart(8)}`);
    console.log(`   Recibidos/hora:    ${perfMetrics.messagesReceivedPerHour.toString().padStart(8)}`);
    console.log(`   Tiempo proc:       ${perfMetrics.averageProcessingTime}ms`);
    console.log(`   Tasa error:        ${perfMetrics.errorRate}%\n`);

    // TOP CONVERSACIONES
    if (topConversations.length > 0) {
      console.log('🔥 TOP 5 CONVERSACIONES ACTIVAS\n');
      topConversations.forEach((conv, index) => {
        const phone = conv.phone.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})$/, '+$1 $2 $3 $4');
        const lastMsg = conv.lastMessage.toLocaleTimeString();
        console.log(`   ${index + 1}. ${phone} - ${conv.messageCount} mensajes (${lastMsg})`);
      });
      console.log('');
    }

    // GRÁFICO ASCII DE MENSAJES (últimos 7 días)
    const timeSeries = await analytics.getMessageTimeSeries(7);
    if (timeSeries.length > 0) {
      console.log('📈 MENSAJES ÚLTIMOS 7 DÍAS\n');
      
      const maxValue = Math.max(...timeSeries.map(d => d.value), 1);
      const scale = 40; // Ancho del gráfico

      timeSeries.forEach(data => {
        const date = new Date(data.timestamp).toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        });
        const barLength = Math.round((data.value / maxValue) * scale);
        const bar = '█'.repeat(barLength);
        console.log(`   ${date.padEnd(10)} │${bar} ${data.value}`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error obteniendo métricas:', error);
  }

  console.log('═════════════════════════════════════════════════════════');
  console.log(`Actualizado: ${new Date().toLocaleString()}`);
  console.log('Presiona Ctrl+C para salir');
  console.log('Actualizando cada 5 segundos...\n');
}

async function main() {
  // Mostrar dashboard cada 5 segundos
  setInterval(showDashboard, 5000);
  await showDashboard();
}

// Cerrar conexiones al salir
process.on('SIGINT', async () => {
  console.log('\n\nCerrando conexiones...');
  const analytics = getAnalyticsManager();
  await analytics.close();
  process.exit(0);
});

main().catch(console.error);
