/**
 * WhatsApp Webhook Handler
 * 
 * API Route para recibir y procesar eventos de Evolution API
 * Integra con el bot conversacional y el CRM
 * 
 * @route POST /api/whatsapp/webhook
 * @author Anclora Private Estates
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  WebhookProcessor, 
  validateWebhookSignature,
  type WebhookEvent 
} from '@/lib/whatsapp-webhook-processor';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const ENABLE_SIGNATURE_VALIDATION = process.env.NODE_ENV === 'production';

// ============================================================================
// RATE LIMITING
// ============================================================================

const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minuto

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + RATE_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 1. Rate Limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    if (!checkRateLimit(clientIp)) {
      console.warn(`[Webhook] Rate limit exceeded for ${clientIp}`);
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // 2. Parse body
    let body: WebhookEvent;
    try {
      body = await request.json();
    } catch (error) {
      console.error('[Webhook] Invalid JSON body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // 3. Validar firma (en producción)
    if (ENABLE_SIGNATURE_VALIDATION) {
      const signature = request.headers.get('x-webhook-signature') || '';
      const isValid = validateWebhookSignature(
        JSON.stringify(body),
        signature,
        WEBHOOK_SECRET
      );

      if (!isValid) {
        console.warn('[Webhook] Invalid signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // 4. Log evento recibido
    console.warn('[Webhook] Event received:', {
      event: body.event,
      instance: body.instance,
      timestamp: new Date().toISOString(),
    });

    // 5. Procesar evento
    const processor = new WebhookProcessor();
    const result = await processor.processEvent(body);

    // 6. Respuesta
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({
      received: true,
      event: body.event,
      processed: result.success,
      processingTime: `${processingTime}ms`,
      ...(result.error && { error: result.error }),
    });

  } catch (error) {
    console.error('[Webhook] Unexpected error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET HANDLER (Para verificación)
// ============================================================================

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const challenge = searchParams.get('hub.challenge');
  const verifyToken = searchParams.get('hub.verify_token');

  // Verificación de webhook (estilo Facebook/WhatsApp)
  if (challenge && verifyToken === WEBHOOK_SECRET) {
    console.warn('[Webhook] Verification successful');
    return new NextResponse(challenge, { status: 200 });
  }

  // Info del webhook
  return NextResponse.json({
    service: 'WhatsApp Webhook',
    status: 'active',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// OPCIONES CORS (si se necesita)
// ============================================================================

export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-webhook-signature',
    },
  });
}
