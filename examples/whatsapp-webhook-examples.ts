/**
 * WhatsApp Webhook - Ejemplos de Uso y Testing
 * 
 * Ejemplos prácticos de eventos de webhook y cómo probarlos
 */

import {
  WebhookProcessor,
  validateWebhookSignature,
  type WebhookEvent,
  type MessageData,
} from '@/lib/whatsapp-webhook-processor';

// ============================================================================
// EJEMPLOS DE EVENTOS REALES
// ============================================================================

// ----------------------------------------------------------------------------
// EJEMPLO 1: Mensaje de texto recibido
// ----------------------------------------------------------------------------

const eventoMensajeTexto: WebhookEvent = {
  event: 'messages.upsert',
  instance: 'anclora-main',
  data: {
    key: {
      remoteJid: '34600111222@s.whatsapp.net',
      fromMe: false,
      id: '3EB0F2F5E7F4A1B2C3D4',
    },
    message: {
      conversation: 'Hola, busco una villa en Mallorca',
    },
    messageTimestamp: 1704121200,
    pushName: 'Carlos Pérez',
  },
};

// ----------------------------------------------------------------------------
// EJEMPLO 2: Mensaje con imagen
// ----------------------------------------------------------------------------

const eventoMensajeImagen: WebhookEvent = {
  event: 'messages.upsert',
  instance: 'anclora-main',
  data: {
    key: {
      remoteJid: '34600222333@s.whatsapp.net',
      fromMe: false,
      id: '4FC1G3G6F8G5B2C3E4F5',
    },
    message: {
      imageMessage: {
        caption: 'Esta es la propiedad que me interesa',
        url: 'https://example.com/image.jpg',
      },
    },
    messageTimestamp: 1704121260,
    pushName: 'María García',
  },
};

// ----------------------------------------------------------------------------
// EJEMPLO 3: Actualización de conexión
// ----------------------------------------------------------------------------

const eventoConexionAbierta: WebhookEvent = {
  event: 'connection.update',
  instance: 'anclora-main',
  data: {
    instance: 'anclora-main',
    state: 'open',
  },
};

const eventoConexionCerrada: WebhookEvent = {
  event: 'connection.update',
  instance: 'anclora-main',
  data: {
    instance: 'anclora-main',
    state: 'close',
    statusReason: 401,
  },
};

// ----------------------------------------------------------------------------
// EJEMPLO 4: QR Code actualizado
// ----------------------------------------------------------------------------

const eventoQRCode: WebhookEvent = {
  event: 'qrcode.updated',
  instance: 'anclora-main',
  data: {
    instance: 'anclora-main',
    qrcode: {
      code: '1@ABC123...',
      base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...',
    },
  },
};

// ----------------------------------------------------------------------------
// EJEMPLO 5: Actualización de mensaje (leído)
// ----------------------------------------------------------------------------

const eventoMensajeLeido: WebhookEvent = {
  event: 'messages.update',
  instance: 'anclora-main',
  data: {
    key: {
      remoteJid: '34600111222@s.whatsapp.net',
      fromMe: true,
      id: '3EB0F2F5E7F4A1B2C3D4',
    },
    update: {
      status: 'READ',
      readTimestamp: 1704121300,
    },
  },
};

// ----------------------------------------------------------------------------
// EJEMPLO 6: Mensaje enviado
// ----------------------------------------------------------------------------

const eventoMensajeEnviado: WebhookEvent = {
  event: 'send.message',
  instance: 'anclora-main',
  data: {
    key: {
      remoteJid: '34600111222@s.whatsapp.net',
      fromMe: true,
      id: '5GD2H4H7G9H6C3D4F5G6',
    },
    message: {
      conversation: '¡Hola! Gracias por contactar con Anclora Private Estates.',
    },
    messageTimestamp: 1704121320,
  },
};

// ----------------------------------------------------------------------------
// EJEMPLO 7: Actualización de presencia (escribiendo)
// ----------------------------------------------------------------------------

const eventoPresenciaEscribiendo: WebhookEvent = {
  event: 'presence.update',
  instance: 'anclora-main',
  data: {
    id: '34600111222@s.whatsapp.net',
    presences: {
      '34600111222@s.whatsapp.net': {
        lastKnownPresence: 'composing',
        lastSeen: 1704121340,
      },
    },
  },
};

// ============================================================================
// TESTING WEBHOOK PROCESSOR
// ============================================================================

async function testWebhookProcessor() {
  console.log('🧪 Testing Webhook Processor\n');
  console.log('='.repeat(60));

  const processor = new WebhookProcessor();

  // Test 1: Procesar mensaje de texto
  console.log('\n📝 Test 1: Mensaje de texto recibido');
  const result1 = await processor.processEvent(eventoMensajeTexto);
  console.log('Result:', result1);

  // Test 2: Procesar mensaje con imagen
  console.log('\n📸 Test 2: Mensaje con imagen recibido');
  const result2 = await processor.processEvent(eventoMensajeImagen);
  console.log('Result:', result2);

  // Test 3: Procesar actualización de conexión
  console.log('\n🔌 Test 3: Conexión abierta');
  const result3 = await processor.processEvent(eventoConexionAbierta);
  console.log('Result:', result3);

  // Test 4: Procesar QR code
  console.log('\n📱 Test 4: QR Code actualizado');
  const result4 = await processor.processEvent(eventoQRCode);
  console.log('Result:', result4);

  // Test 5: Procesar mensaje leído
  console.log('\n✅ Test 5: Mensaje leído');
  const result5 = await processor.processEvent(eventoMensajeLeido);
  console.log('Result:', result5);

  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests completados\n');
}

// ============================================================================
// TESTING SIGNATURE VALIDATION
// ============================================================================

function testSignatureValidation() {
  console.log('🔐 Testing Signature Validation\n');
  console.log('='.repeat(60));

  const secret = 'my-webhook-secret-key';
  const payload = JSON.stringify(eventoMensajeTexto);

  // Generar firma válida
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const validSignature = `sha256=${hmac.digest('hex')}`;

  // Test 1: Firma válida
  console.log('\n✅ Test 1: Firma válida');
  const isValid = validateWebhookSignature(payload, validSignature, secret);
  console.log('Result:', isValid ? 'VÁLIDA' : 'INVÁLIDA');

  // Test 2: Firma inválida
  console.log('\n❌ Test 2: Firma inválida');
  const invalidSignature = 'sha256=invalid_signature';
  const isInvalid = validateWebhookSignature(payload, invalidSignature, secret);
  console.log('Result:', isInvalid ? 'VÁLIDA' : 'INVÁLIDA');

  // Test 3: Secret incorrecto
  console.log('\n❌ Test 3: Secret incorrecto');
  const wrongSecret = validateWebhookSignature(payload, validSignature, 'wrong-secret');
  console.log('Result:', wrongSecret ? 'VÁLIDA' : 'INVÁLIDA');

  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests de firma completados\n');
}

// ============================================================================
// SIMULACIÓN DE REQUEST HTTP
// ============================================================================

async function simulateWebhookRequest() {
  console.log('🌐 Simulating HTTP Webhook Request\n');
  console.log('='.repeat(60));

  const webhookUrl = 'http://localhost:3000/api/whatsapp/webhook';
  const secret = 'my-webhook-secret-key';
  const payload = eventoMensajeTexto;

  // Generar firma
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const signature = `sha256=${hmac.digest('hex')}`;

  console.log('\n📤 Enviando request POST:');
  console.log('URL:', webhookUrl);
  console.log('Signature:', signature.substring(0, 30) + '...');
  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': signature,
      },
      body: JSON.stringify(payload),
    });

    console.log('\n📥 Response:');
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Body:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('\n❌ Error:', error);
  }

  console.log('\n' + '='.repeat(60));
}

// ============================================================================
// CURL EXAMPLES PARA TESTING
// ============================================================================

function printCurlExamples() {
  console.log('📋 CURL Examples for Testing\n');
  console.log('='.repeat(60));

  console.log('\n1️⃣ Test básico (sin firma):');
  console.log(`
curl -X POST http://localhost:3000/api/whatsapp/webhook \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "messages.upsert",
    "instance": "anclora-main",
    "data": {
      "key": {
        "remoteJid": "34600111222@s.whatsapp.net",
        "fromMe": false,
        "id": "TEST123"
      },
      "message": {
        "conversation": "Test message"
      },
      "pushName": "Test User"
    }
  }'
  `.trim());

  console.log('\n\n2️⃣ Test con firma (producción):');
  console.log(`
# Primero generar firma:
PAYLOAD='{"event":"messages.upsert","instance":"anclora-main"}'
SECRET="my-webhook-secret-key"
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

# Luego enviar request:
curl -X POST http://localhost:3000/api/whatsapp/webhook \\
  -H "Content-Type: application/json" \\
  -H "x-webhook-signature: sha256=$SIGNATURE" \\
  -d "$PAYLOAD"
  `.trim());

  console.log('\n\n3️⃣ Test verificación GET:');
  console.log(`
curl "http://localhost:3000/api/whatsapp/webhook?hub.challenge=test123&hub.verify_token=my-webhook-secret-key"
  `.trim());

  console.log('\n' + '='.repeat(60));
}

// ============================================================================
// POSTMAN COLLECTION
// ============================================================================

function generatePostmanCollection() {
  const collection = {
    info: {
      name: 'WhatsApp Webhook API',
      description: 'Collection para testing del webhook de WhatsApp',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [
      {
        name: 'Webhook - Mensaje de Texto',
        request: {
          method: 'POST',
          header: [
            {
              key: 'Content-Type',
              value: 'application/json',
            },
          ],
          body: {
            mode: 'raw',
            raw: JSON.stringify(eventoMensajeTexto, null, 2),
          },
          url: {
            raw: 'http://localhost:3000/api/whatsapp/webhook',
            protocol: 'http',
            host: ['localhost'],
            port: '3000',
            path: ['api', 'whatsapp', 'webhook'],
          },
        },
      },
      {
        name: 'Webhook - Conexión Abierta',
        request: {
          method: 'POST',
          header: [
            {
              key: 'Content-Type',
              value: 'application/json',
            },
          ],
          body: {
            mode: 'raw',
            raw: JSON.stringify(eventoConexionAbierta, null, 2),
          },
          url: {
            raw: 'http://localhost:3000/api/whatsapp/webhook',
            protocol: 'http',
            host: ['localhost'],
            port: '3000',
            path: ['api', 'whatsapp', 'webhook'],
          },
        },
      },
      {
        name: 'Webhook - Verificación',
        request: {
          method: 'GET',
          url: {
            raw: 'http://localhost:3000/api/whatsapp/webhook?hub.challenge=test123&hub.verify_token=my-secret',
            protocol: 'http',
            host: ['localhost'],
            port: '3000',
            path: ['api', 'whatsapp', 'webhook'],
            query: [
              {
                key: 'hub.challenge',
                value: 'test123',
              },
              {
                key: 'hub.verify_token',
                value: 'my-secret',
              },
            ],
          },
        },
      },
    ],
  };

  console.log('\n📦 Postman Collection:\n');
  console.log(JSON.stringify(collection, null, 2));
  console.log('\n💾 Guardar como: whatsapp-webhook.postman_collection.json');
}

// ============================================================================
// CONFIGURACIÓN EVOLUTION API
// ============================================================================

function printEvolutionAPIConfig() {
  console.log('\n⚙️ Configuración en Evolution API\n');
  console.log('='.repeat(60));

  console.log(`
Para configurar el webhook en Evolution API:

1. Via API:

curl -X POST http://localhost:8080/webhook/set/anclora-main \\
  -H "Content-Type: application/json" \\
  -H "apikey: YOUR_API_KEY" \\
  -d '{
    "url": "https://tu-dominio.com/api/whatsapp/webhook",
    "webhook_by_events": false,
    "webhook_base64": false,
    "events": [
      "QRCODE_UPDATED",
      "MESSAGES_UPSERT",
      "MESSAGES_UPDATE",
      "SEND_MESSAGE",
      "CONNECTION_UPDATE"
    ]
  }'

2. Variables de entorno (.env):

WEBHOOK_URL=https://tu-dominio.com/api/whatsapp/webhook
WEBHOOK_SECRET=my-webhook-secret-key
WEBHOOK_BY_EVENTS=false
WEBHOOK_BASE64=false

3. Eventos disponibles:
   - QRCODE_UPDATED
   - MESSAGES_UPSERT
   - MESSAGES_UPDATE
   - MESSAGES_DELETE
   - SEND_MESSAGE
   - CONTACTS_SET
   - CONTACTS_UPSERT
   - CONTACTS_UPDATE
   - PRESENCE_UPDATE
   - CHATS_SET
   - CHATS_UPSERT
   - CHATS_UPDATE
   - CHATS_DELETE
   - GROUPS_UPSERT
   - GROUPS_UPDATE
   - GROUP_PARTICIPANTS_UPDATE
   - CONNECTION_UPDATE
   - CALL
   - NEW_JWT_TOKEN
  `.trim());

  console.log('\n' + '='.repeat(60));
}

// ============================================================================
// EXPORTAR EJEMPLOS
// ============================================================================

export {
  eventoMensajeTexto,
  eventoMensajeImagen,
  eventoConexionAbierta,
  eventoConexionCerrada,
  eventoQRCode,
  eventoMensajeLeido,
  eventoMensajeEnviado,
  eventoPresenciaEscribiendo,
  testWebhookProcessor,
  testSignatureValidation,
  simulateWebhookRequest,
  printCurlExamples,
  generatePostmanCollection,
  printEvolutionAPIConfig,
};

// ============================================================================
// EJECUTAR TESTS (comentar en producción)
// ============================================================================

/*
async function runAllTests() {
  console.log('\n🚀 Running All Tests\n');
  
  await testWebhookProcessor();
  testSignatureValidation();
  printCurlExamples();
  printEvolutionAPIConfig();
  generatePostmanCollection();
  
  console.log('\n✅ All tests completed\n');
}

runAllTests();
*/
