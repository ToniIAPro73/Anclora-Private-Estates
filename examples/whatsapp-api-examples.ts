/**
 * WhatsApp API - Ejemplos de Uso
 * 
 * Ejemplos prácticos de cómo usar la librería whatsapp-api.ts
 */

import {
  WhatsAppAPI,
  getWhatsAppClient,
  sendWhatsAppMessage,
  sendWhatsAppImage,
  hasWhatsApp,
  type EvolutionAPIConfig,
} from './whatsapp-api';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const config: EvolutionAPIConfig = {
  baseURL: process.env.NEXT_PUBLIC_EVOLUTION_API_URL || 'http://localhost:8080',
  apiKey: process.env.NEXT_EVOLUTION_API_KEY || '',
  instanceName: process.env.INSTANCE_NAME || 'anclora-main',
  timeout: 30000,
  retries: 3,
  retryDelay: 2000,
};

// ============================================================================
// EJEMPLO 1: ENVÍO BÁSICO DE MENSAJES
// ============================================================================

async function ejemploEnvioBasico() {
  const client = new WhatsAppAPI(config);

  // Enviar texto simple
  const response = await client.sendText({
    number: '34600000000',
    text: '¡Hola! Gracias por contactar con Anclora Private Estates 🏡',
  });

  console.log('Mensaje enviado:', response.key.id);
}

// ============================================================================
// EJEMPLO 2: ENVÍO DE MEDIA
// ============================================================================

async function ejemploEnvioMedia() {
  const client = getWhatsAppClient(config);

  // Enviar imagen con caption
  await client.sendImage({
    number: '34600000000',
    image: 'https://anclora.es/images/properties/villa-son-vida.jpg',
    caption: '🏡 Villa de Lujo en Son Vida - 2.5M€\n5 dormitorios | 4 baños | 500m²',
  });

  // Enviar PDF de propiedad
  await client.sendDocument({
    number: '34600000000',
    document: 'https://anclora.es/documents/villa-brochure.pdf',
    fileName: 'Villa_Son_Vida_Brochure.pdf',
    caption: 'Aquí está el dossier completo de la propiedad',
  });

  // Enviar audio
  await client.sendAudio({
    number: '34600000000',
    audio: 'https://anclora.es/audio/property-tour.ogg',
  });
}

// ============================================================================
// EJEMPLO 3: MENSAJES INTERACTIVOS
// ============================================================================

async function ejemploMensajesInteractivos() {
  const client = getWhatsAppClient(config);

  // Enviar botones
  await client.sendButtons({
    number: '34600000000',
    title: '¿Qué tipo de propiedad buscas?',
    description: 'Selecciona una opción para ayudarte mejor',
    footer: 'Anclora Private Estates',
    buttons: [
      { displayText: '🏡 Villa', id: 'btn_villa' },
      { displayText: '🏢 Apartamento', id: 'btn_apartment' },
      { displayText: '🏰 Finca', id: 'btn_finca' },
    ],
  });

  // Enviar lista
  await client.sendList({
    number: '34600000000',
    title: 'Propiedades Disponibles',
    description: 'Elige una zona de tu interés',
    buttonText: 'Ver zonas',
    footerText: 'Anclora Private Estates',
    sections: [
      {
        title: 'Palma Centro',
        rows: [
          {
            title: 'Santa Catalina',
            description: '12 propiedades disponibles',
            rowId: 'zone_santa_catalina',
          },
          {
            title: 'Son Armadams',
            description: '8 propiedades disponibles',
            rowId: 'zone_son_armadams',
          },
        ],
      },
      {
        title: 'Costa',
        rows: [
          {
            title: 'Port Adriano',
            description: '15 propiedades disponibles',
            rowId: 'zone_port_adriano',
          },
          {
            title: 'Puerto Portals',
            description: '6 propiedades disponibles',
            rowId: 'zone_puerto_portals',
          },
        ],
      },
    ],
  });
}

// ============================================================================
// EJEMPLO 4: UBICACIÓN Y CONTACTO
// ============================================================================

async function ejemploUbicacionContacto() {
  const client = getWhatsAppClient(config);

  // Enviar ubicación de oficina
  await client.sendLocation({
    number: '34600000000',
    location: {
      latitude: 39.5696,
      longitude: 2.6502,
      name: 'Anclora Private Estates',
      address: 'Paseo Marítimo, 29, Palma de Mallorca',
    },
  });

  // Enviar contacto de agente
  await client.sendContact({
    number: '34600000000',
    contact: [
      {
        fullName: 'María García',
        organization: 'Anclora Private Estates',
        phoneNumber: '+34971123456',
        email: 'maria@anclora.es',
      },
    ],
  });
}

// ============================================================================
// EJEMPLO 5: GESTIÓN DE CHAT
// ============================================================================

async function ejemploGestionChat() {
  const client = getWhatsAppClient(config);

  const numero = '34600000000';

  // Enviar estado "escribiendo..."
  await client.sendPresence(numero, 'composing');

  // Esperar 2 segundos
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Enviar mensaje
  await client.sendText({
    number: numero,
    text: 'Aquí está la información que solicitaste...',
  });

  // Marcar como leído
  await client.markAsRead({
    remoteJid: `${numero}@s.whatsapp.net`,
    fromMe: false,
    id: 'mensaje_id_recibido',
  });

  // Archivar chat
  await client.archiveChat(numero, true);
}

// ============================================================================
// EJEMPLO 6: VALIDACIÓN Y UTILIDADES
// ============================================================================

async function ejemploValidacion() {
  const client = getWhatsAppClient(config);

  // Validar si número tiene WhatsApp
  const numero = '34600000000';
  const tieneWhatsApp = await client.validateNumber(numero);

  if (tieneWhatsApp) {
    console.log('✅ Número válido, enviando mensaje...');
    await client.sendText({
      number: numero,
      text: 'Hola, te contactamos desde Anclora',
    });
  } else {
    console.log('❌ Número no tiene WhatsApp');
  }

  // Obtener foto de perfil
  const profilePic = await client.getProfilePicture(numero);
  console.log('Foto de perfil:', profilePic);

  // Health check
  const isHealthy = await client.healthCheck();
  console.log('Estado WhatsApp:', isHealthy ? '✅ Conectado' : '❌ Desconectado');
}

// ============================================================================
// EJEMPLO 7: MANEJO DE ERRORES
// ============================================================================

async function ejemploManejoErrores() {
  const client = getWhatsAppClient(config);

  try {
    await client.sendText({
      number: 'numero_invalido',
      text: 'Esto fallará',
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error enviando mensaje:', error.message);
      
      // Reintento manual
      console.log('Reintentando en 5 segundos...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Reintentar
      await client.sendText({
        number: '34600000000',
        text: 'Mensaje de respaldo',
      });
    }
  }
}

// ============================================================================
// EJEMPLO 8: FLUJO COMPLETO - NUEVO LEAD
// ============================================================================

async function flujoNuevoLead(
  numero: string,
  nombre: string,
  tipoPropiedad: string
) {
  const client = getWhatsAppClient(config);

  // 1. Validar número
  const valido = await client.validateNumber(numero);
  if (!valido) {
    throw new Error('Número no tiene WhatsApp');
  }

  // 2. Mensaje de bienvenida
  await client.sendPresence(numero, 'composing');
  await new Promise(resolve => setTimeout(resolve, 2000));

  await client.sendText({
    number: numero,
    text: `¡Hola ${nombre}! 👋\n\nGracias por tu interés en nuestras propiedades de lujo en Mallorca.\n\nVeo que buscas una ${tipoPropiedad}. Déjame mostrarte algunas opciones disponibles.`,
  });

  // 3. Enviar opciones interactivas
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await client.sendButtons({
    number: numero,
    title: '¿Qué zona te interesa más?',
    description: 'Selecciona tu preferencia',
    footer: 'Anclora Private Estates',
    buttons: [
      { displayText: '🏖️ Primera línea mar', id: 'zone_beach' },
      { displayText: '🏙️ Centro Palma', id: 'zone_center' },
      { displayText: '🏔️ Serra de Tramuntana', id: 'zone_mountains' },
    ],
  });

  // 4. Enviar imagen de ejemplo
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await client.sendImage({
    number: numero,
    image: 'https://anclora.es/images/featured-property.jpg',
    caption: '🏡 Propiedad destacada de esta semana\n\nVilla en Port Adriano - 3.8M€\n6 dorm | 5 baños | 650m² | Vistas al mar',
  });

  // 5. Ofrecer contacto directo
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await client.sendText({
    number: numero,
    text: '¿Te gustaría agendar una visita o videollamada con uno de nuestros asesores?',
  });

  console.log(`✅ Flujo de bienvenida completado para ${nombre}`);
}

// ============================================================================
// EJEMPLO 9: HELPERS RÁPIDOS
// ============================================================================

async function ejemploHelpers() {
  // Helper de envío rápido
  await sendWhatsAppMessage(
    '34600000000',
    'Mensaje rápido usando helper',
    config
  );

  // Helper de imagen rápida
  await sendWhatsAppImage(
    '34600000000',
    'https://anclora.es/image.jpg',
    'Caption de la imagen',
    config
  );

  // Helper de validación
  const tieneWA = await hasWhatsApp('34600000000', config);
  console.log('Tiene WhatsApp:', tieneWA);
}

// ============================================================================
// EJEMPLO 10: GESTIÓN DE INSTANCIA
// ============================================================================

async function ejemploGestionInstancia() {
  const client = new WhatsAppAPI(config);

  // Obtener información de instancia
  const info = await client.getInstanceInfo();
  console.log('Instancia:', info.instance.instanceName);
  console.log('Nombre perfil:', info.instance.profileName);

  // Verificar estado
  const state = await client.getConnectionState();
  console.log('Estado conexión:', state.state);

  if (state.state !== 'open') {
    // Reconectar
    console.log('Reconectando...');
    const qr = await client.connectInstance();
    console.log('QR Code:', qr.code);
  }

  // Actualizar perfil
  await client.updateProfileName('Anclora Private Estates');
  await client.updateProfileStatus('🏡 Propiedades de lujo en Mallorca');

  // Configurar webhook
  await client.setWebhook('https://anclora.es/api/whatsapp/webhook', [
    'messages.upsert',
    'messages.update',
    'send.message',
  ]);

  console.log('✅ Instancia configurada correctamente');
}

// ============================================================================
// EXPORTAR EJEMPLOS
// ============================================================================

export {
  ejemploEnvioBasico,
  ejemploEnvioMedia,
  ejemploMensajesInteractivos,
  ejemploUbicacionContacto,
  ejemploGestionChat,
  ejemploValidacion,
  ejemploManejoErrores,
  flujoNuevoLead,
  ejemploHelpers,
  ejemploGestionInstancia,
};

// ============================================================================
// EJECUCIÓN DE PRUEBA (comentar en producción)
// ============================================================================

// Descomentar para probar
/*
async function main() {
  try {
    // await ejemploEnvioBasico();
    // await ejemploMensajesInteractivos();
    // await flujoNuevoLead('34600000000', 'Juan Pérez', 'villa');
    console.log('✅ Ejemplos ejecutados correctamente');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
*/
