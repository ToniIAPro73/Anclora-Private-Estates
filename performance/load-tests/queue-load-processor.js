/**
 * Artillery Load Test Processor
 * 
 * Funciones helper para generar datos dinámicos en load tests
 */

module.exports = {
  /**
   * Genera timestamp futuro para mensajes programados
   */
  generateFutureTimestamp(context, events, done) {
    const futureDate = new Date(Date.now() + 3600000); // 1 hora en el futuro
    context.vars.futureTimestamp = futureDate.toISOString();
    return done();
  },

  /**
   * Genera prioridad aleatoria
   */
  generateRandomPriority(context, events, done) {
    const priorities = ['critical', 'high', 'normal', 'low'];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    context.vars.priority = randomPriority;
    return done();
  },

  /**
   * Genera tipo de mensaje aleatorio
   */
  generateRandomMessageType(context, events, done) {
    const types = ['text', 'image', 'video', 'audio', 'document'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    context.vars.messageType = randomType;
    return done();
  },

  /**
   * Genera contenido de mensaje aleatorio basado en tipo
   */
  generateMessageContent(context, events, done) {
    const messageType = context.vars.messageType || 'text';
    
    const contents = {
      text: {
        text: `Load test message ${Date.now()} - ${Math.random().toString(36).substring(7)}`,
      },
      image: {
        mediaUrl: 'https://picsum.photos/800/600',
        caption: 'Test image from load test',
      },
      video: {
        mediaUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        caption: 'Test video',
      },
      audio: {
        mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      },
      document: {
        mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        caption: 'Test document',
      },
    };

    context.vars.messageContent = contents[messageType];
    return done();
  },

  /**
   * Genera número de teléfono español válido
   */
  generateSpanishPhone(context, events, done) {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    context.vars.spanishPhone = `34600${randomNumber}`;
    return done();
  },

  /**
   * Log de respuesta para debugging
   */
  logResponse(requestParams, response, context, ee, next) {
    if (response.statusCode !== 200) {
      console.log(`Error ${response.statusCode}: ${response.body}`);
    }
    return next();
  },

  /**
   * Registra métricas custom
   */
  recordCustomMetrics(context, events, done) {
    const startTime = Date.now();
    context.vars.requestStartTime = startTime;
    
    events.on('response', (response) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Emitir métrica custom
      events.emit('customStat', {
        stat: 'queue.processing.time',
        value: duration,
      });
    });

    return done();
  },
};
