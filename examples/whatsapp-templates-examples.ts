/**
 * WhatsApp Templates - Ejemplos de Uso
 * 
 * Ejemplos prácticos de cómo usar el sistema de templates
 */

import {
  TemplateManager,
  getTemplateManager,
  getMessage,
  TEMPLATES,
} from './whatsapp-templates';
import { WhatsAppAPI } from './whatsapp-api';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const whatsappConfig = {
  baseURL: 'http://localhost:8080',
  apiKey: process.env.NEXT_EVOLUTION_API_KEY || '',
  instanceName: 'anclora-main',
};

// ============================================================================
// EJEMPLO 1: USO BÁSICO
// ============================================================================

async function ejemploUsoBasico() {
  const manager = new TemplateManager('es');

  // Mensaje de bienvenida
  const mensaje = manager.get('welcome', {
    nombre: 'Juan Pérez',
  });

  console.log(mensaje);
  // Output (una de las variantes):
  // ¡Hola Juan Pérez! 👋
  //
  // Bienvenido/a a Anclora Private Estates, tu agencia inmobiliaria de lujo en Mallorca.
  //
  // ¿En qué podemos ayudarte hoy?
}

// ============================================================================
// EJEMPLO 2: MENSAJE CON TIPO DE PROPIEDAD
// ============================================================================

async function ejemploBienvenidaConPropiedad() {
  const mensaje = getMessage('welcomeWithPropertyType', {
    nombre: 'María García',
    tipoPropiedad: 'villas de lujo',
  }, 'es');

  console.log(mensaje);
  // Output:
  // ¡Hola María García! 👋
  //
  // Veo que estás interesado/a en villas de lujo en Mallorca. ¡Excelente elección!
  //
  // Tenemos varias opciones disponibles que podrían interesarte. ¿Te gustaría conocerlas?
}

// ============================================================================
// EJEMPLO 3: INFORMACIÓN DE PROPIEDAD
// ============================================================================

async function ejemploInfoPropiedad() {
  const manager = getTemplateManager('es');

  const mensaje = manager.get('propertyInfo', {
    nombrePropiedad: 'Villa Son Vida',
    ubicacion: 'Son Vida, Palma',
    precio: '2500000',
    dormitorios: '5',
    banos: '4',
    superficie: '500',
    descripcion: 'Espectacular villa de lujo con vistas panorámicas al mar y la bahía de Palma. Jardín mediterráneo, piscina infinity y garaje para 3 vehículos.',
  });

  console.log(mensaje);
  // Output:
  // 🏡 *Villa Son Vida*
  //
  // 📍 Ubicación: Son Vida, Palma
  // 💰 Precio: 2500000€
  // 🛏️ Dormitorios: 5
  // 🛁 Baños: 4
  // 📏 Superficie: 500m²
  //
  // Espectacular villa de lujo con vistas panorámicas...
  //
  // ¿Te gustaría agendar una visita?
}

// ============================================================================
// EJEMPLO 4: CONFIRMACIÓN DE CITA
// ============================================================================

async function ejemploConfirmacionCita() {
  const mensaje = getMessage('appointmentConfirmation', {
    fecha: '15 de Enero 2026',
    hora: '11:00',
    nombrePropiedad: 'Apartamento Puerto Portals',
    asesor: 'Carlos Rodríguez',
  });

  console.log(mensaje);
}

// ============================================================================
// EJEMPLO 5: ENVÍO REAL VÍA WHATSAPP
// ============================================================================

async function ejemploEnvioRealWhatsApp() {
  const whatsapp = new WhatsAppAPI(whatsappConfig);
  const manager = new TemplateManager('es');

  // Obtener mensaje de template
  const mensaje = manager.get('newPropertyAlert', {
    nombre: 'Carlos',
    nombrePropiedad: 'Villa Bonanova',
    ubicacion: 'Bonanova',
    precio: '3200000',
  });

  // Enviar vía WhatsApp
  await whatsapp.sendText({
    number: '34600000000',
    text: mensaje,
  });

  console.log('✅ Mensaje enviado via WhatsApp');
}

// ============================================================================
// EJEMPLO 6: FLUJO COMPLETO NUEVO LEAD
// ============================================================================

async function flujoCompletoNuevoLead(
  numero: string,
  nombre: string,
  tipoPropiedad: string
) {
  const whatsapp = new WhatsAppAPI(whatsappConfig);
  const manager = new TemplateManager('es');

  // 1. Bienvenida
  const bienvenida = manager.get('welcomeWithPropertyType', {
    nombre,
    tipoPropiedad,
  });

  await whatsapp.sendText({ number, text: bienvenida });
  await sleep(3000);

  // 2. Solicitar presupuesto
  const presupuesto = manager.get('budgetInquiry', { nombre });
  
  await whatsapp.sendText({ number, text: presupuesto });
  
  console.log('✅ Flujo de bienvenida completado');
}

// ============================================================================
// EJEMPLO 7: MÚLTIPLES IDIOMAS
// ============================================================================

async function ejemploMultiplesIdiomas() {
  const managerES = new TemplateManager('es');
  const managerEN = new TemplateManager('en');

  const variables = {
    nombre: 'John Smith',
    nombrePropiedad: 'Luxury Villa',
    ubicacion: 'Puerto Portals',
    precio: '4500000',
  };

  // Español
  const mensajeES = managerES.get('newPropertyAlert', variables);
  console.log('Español:', mensajeES);

  // Inglés
  const mensajeEN = managerEN.get('newPropertyAlert', variables);
  console.log('English:', mensajeEN);

  // O usando helper con idioma específico
  const mensaje = getMessage('newPropertyAlert', variables, 'en');
  console.log('Using helper:', mensaje);
}

// ============================================================================
// EJEMPLO 8: MANEJO DE ERRORES
// ============================================================================

async function ejemploManejoErrores() {
  const manager = new TemplateManager('es');

  try {
    // Intentar sin variables requeridas
    const mensaje = manager.get('propertyInfo', {
      nombrePropiedad: 'Villa Test',
      // Faltan: ubicacion, precio, dormitorios, banos, superficie
    });
  } catch (error) {
    console.error('Error:', error);
    // Output: Variables requeridas faltantes: ubicacion, precio, dormitorios, banos, superficie
  }

  try {
    // Template inexistente
    const mensaje = manager.get('templateInexistente' as any, {});
  } catch (error) {
    console.error('Error:', error);
    // Output: Template "templateInexistente" no encontrado
  }
}

// ============================================================================
// EJEMPLO 9: LISTAR TEMPLATES DISPONIBLES
// ============================================================================

async function ejemploListarTemplates() {
  const manager = getTemplateManager();

  // Listar todos los templates
  const templates = manager.listTemplates();
  console.log('Templates disponibles:', templates);

  // Obtener info de un template específico
  const info = manager.getTemplateInfo('propertyInfo');
  console.log('Información de propertyInfo:', info);
  // Output:
  // {
  //   requiredVars: ['nombrePropiedad', 'ubicacion', 'precio', 'dormitorios', 'banos', 'superficie'],
  //   optionalVars: ['descripcion'],
  //   languages: ['es', 'en']
  // }
}

// ============================================================================
// EJEMPLO 10: INTEGRACIÓN CON CRM
// ============================================================================

async function ejemploIntegracionCRM() {
  const whatsapp = new WhatsAppAPI(whatsappConfig);
  const manager = new TemplateManager('es');

  // Simular datos del CRM
  const lead = {
    nombre: 'Laura Martínez',
    telefono: '34600111222',
    idioma: 'es' as const,
    tipoPropiedad: 'apartamento de lujo',
  };

  const propiedad = {
    id: 'prop_123',
    nombre: 'Apartamento Paseo Marítimo',
    ubicacion: 'Paseo Marítimo, Palma',
    precio: 850000,
    dormitorios: 3,
    banos: 2,
    superficie: 120,
    descripcion: 'Apartamento completamente reformado con vistas al mar.',
  };

  // 1. Bienvenida personalizada
  const bienvenida = getMessage('welcomeWithPropertyType', {
    nombre: lead.nombre,
    tipoPropiedad: lead.tipoPropiedad,
  }, lead.idioma);

  await whatsapp.sendText({
    number: lead.telefono,
    text: bienvenida,
  });

  await sleep(3000);

  // 2. Enviar información de propiedad
  const infoPropiedad = getMessage('propertyInfo', {
    nombrePropiedad: propiedad.nombre,
    ubicacion: propiedad.ubicacion,
    precio: propiedad.precio.toString(),
    dormitorios: propiedad.dormitorios.toString(),
    banos: propiedad.banos.toString(),
    superficie: propiedad.superficie.toString(),
    descripcion: propiedad.descripcion,
  }, lead.idioma);

  await whatsapp.sendText({
    number: lead.telefono,
    text: infoPropiedad,
  });

  // 3. Enviar imagen de la propiedad
  await whatsapp.sendImage({
    number: lead.telefono,
    image: `https://anclora.es/properties/${propiedad.id}/main.jpg`,
    caption: `${propiedad.nombre} - ${propiedad.precio}€`,
  });

  console.log('✅ Secuencia de mensajes enviada al lead');
}

// ============================================================================
// EJEMPLO 11: RECORDATORIOS AUTOMÁTICOS
// ============================================================================

async function ejemploRecordatorioAutomatico() {
  const whatsapp = new WhatsAppAPI(whatsappConfig);
  const manager = new TemplateManager('es');

  // Simular cita programada para mañana
  const cita = {
    leadNombre: 'Pedro González',
    leadTelefono: '34600333444',
    fecha: '16 de Enero 2026',
    hora: '10:30',
    nombrePropiedad: 'Villa Santa Ponsa',
    direccion: 'Calle Mar Mediterráneo 15, Santa Ponsa',
  };

  // Enviar recordatorio
  const recordatorio = manager.get('appointmentReminder', {
    nombre: cita.leadNombre,
    fecha: cita.fecha,
    hora: cita.hora,
    nombrePropiedad: cita.nombrePropiedad,
    direccion: cita.direccion,
  });

  await whatsapp.sendText({
    number: cita.leadTelefono,
    text: recordatorio,
  });

  // Enviar ubicación
  await whatsapp.sendLocation({
    number: cita.leadTelefono,
    location: {
      latitude: 39.5321,
      longitude: 2.4832,
      name: cita.nombrePropiedad,
      address: cita.direccion,
    },
  });

  console.log('✅ Recordatorio enviado');
}

// ============================================================================
// EJEMPLO 12: SEGUIMIENTO POST-VISITA
// ============================================================================

async function ejemploSeguimientoPostVisita() {
  const whatsapp = new WhatsAppAPI(whatsappConfig);
  const manager = new TemplateManager('es');

  const datos = {
    nombre: 'Ana Ruiz',
    telefono: '34600555666',
    nombrePropiedad: 'Finca Sóller',
  };

  // Mensaje de seguimiento
  const seguimiento = manager.get('followUpAfterViewing', {
    nombre: datos.nombre,
    nombrePropiedad: datos.nombrePropiedad,
  });

  await whatsapp.sendText({
    number: datos.telefono,
    text: seguimiento,
  });

  // Enviar botones de opciones
  await whatsapp.sendButtons({
    number: datos.telefono,
    title: '¿Qué te gustaría hacer?',
    description: 'Selecciona una opción',
    footer: 'Anclora Private Estates',
    buttons: [
      { displayText: '📅 Segunda visita', id: 'btn_segunda_visita' },
      { displayText: '🏡 Ver similares', id: 'btn_similares' },
      { displayText: '💰 Hacer oferta', id: 'btn_oferta' },
    ],
  });

  console.log('✅ Seguimiento post-visita enviado');
}

// ============================================================================
// HELPER FUNCTION
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EXPORTAR EJEMPLOS
// ============================================================================

export {
  ejemploUsoBasico,
  ejemploBienvenidaConPropiedad,
  ejemploInfoPropiedad,
  ejemploConfirmacionCita,
  ejemploEnvioRealWhatsApp,
  flujoCompletoNuevoLead,
  ejemploMultiplesIdiomas,
  ejemploManejoErrores,
  ejemploListarTemplates,
  ejemploIntegracionCRM,
  ejemploRecordatorioAutomatico,
  ejemploSeguimientoPostVisita,
};

// ============================================================================
// EJECUTAR EJEMPLOS (comentar en producción)
// ============================================================================

/*
async function main() {
  try {
    await ejemploUsoBasico();
    await ejemploInfoPropiedad();
    await ejemploMultiplesIdiomas();
    await ejemploListarTemplates();
    console.log('✅ Ejemplos ejecutados correctamente');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
*/
