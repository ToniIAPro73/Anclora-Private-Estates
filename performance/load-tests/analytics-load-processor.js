/**
 * Analytics Load Test Processor
 */

module.exports = {
  generatePhone(context, events, done) {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    context.vars.phone = `34600${randomNumber}`;
    return done();
  },

  generateMessageType(context, events, done) {
    const types = ['text', 'image', 'video', 'audio', 'document'];
    context.vars.messageType = types[Math.floor(Math.random() * types.length)];
    return done();
  },

  generateConversionType(context, events, done) {
    const types = ['lead', 'qualified_lead', 'appointment', 'sale'];
    const type = types[Math.floor(Math.random() * types.length)];
    context.vars.conversionType = type;
    
    // Generate value based on type
    const values = {
      lead: 0,
      qualified_lead: 0,
      appointment: 0,
      sale: Math.floor(Math.random() * 5000000) + 500000, // 500K-5.5M
    };
    context.vars.conversionValue = values[type];
    
    return done();
  },
};
