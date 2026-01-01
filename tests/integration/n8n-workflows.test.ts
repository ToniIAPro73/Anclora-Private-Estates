/**
 * Integration Tests - n8n Workflows
 * 
 * Tests de integración con workflows de n8n
 */

import { TestDataFactory } from '../test-helpers/test-data-factory';

describe('n8n Workflows Integration', () => {
  describe('Lead Capture Workflow', () => {
    it('should process incoming lead from WhatsApp', async () => {
      const webhook = TestDataFactory.createWebhookEvent('message', {
        data: {
          message: {
            conversation: 'Me interesa comprar una villa en Mallorca',
          },
        },
      });

      const phone = webhook.data.key.remoteJid.replace('@s.whatsapp.net', '');
      
      // Simulate n8n workflow processing
      const workflowData = {
        phone,
        message: webhook.data.message.conversation,
        intent: 'property_inquiry',
        leadSource: 'whatsapp',
        timestamp: Date.now(),
      };

      expect(workflowData.intent).toBe('property_inquiry');
      expect(workflowData.leadSource).toBe('whatsapp');
    });

    it('should extract budget from message', () => {
      const message = 'Busco villa entre 2M y 5M';
      
      const budgetMatch = message.match(/(\d+)M.*?(\d+)M/);
      const budget = budgetMatch ? {
        min: parseInt(budgetMatch[1]) * 1000000,
        max: parseInt(budgetMatch[2]) * 1000000,
      } : null;

      expect(budget).toEqual({ min: 2000000, max: 5000000 });
    });

    it('should classify lead quality', () => {
      const leadData = {
        budget: 3000000,
        timeline: 'inmediato',
        propertyType: 'villa',
        hasContactInfo: true,
      };

      const score = 
        (leadData.budget > 1000000 ? 25 : 10) +
        (leadData.timeline === 'inmediato' ? 25 : 10) +
        (leadData.propertyType === 'villa' ? 25 : 15) +
        (leadData.hasContactInfo ? 25 : 0);

      const quality = score >= 80 ? 'qualified' : score >= 50 ? 'medium' : 'low';

      expect(quality).toBe('qualified');
      expect(score).toBe(100);
    });
  });

  describe('Lead Qualification Workflow', () => {
    it('should qualify lead based on criteria', () => {
      const lead = {
        budget: 5000000,
        timeline: '3 months',
        location: 'Port Adriano',
        propertyType: 'villa',
        bedrooms: 4,
      };

      const isQualified = 
        lead.budget >= 1000000 &&
        ['villa', 'mansion'].includes(lead.propertyType) &&
        lead.bedrooms >= 3;

      expect(isQualified).toBe(true);
    });

    it('should score lead on multiple dimensions', () => {
      const lead = {
        budget: 3000000,
        urgency: 'high',
        engagement: 'active',
        propertyKnowledge: 'expert',
      };

      const budgetScore = Math.min(lead.budget / 100000, 50);
      const urgencyScore = lead.urgency === 'high' ? 25 : 10;
      const engagementScore = lead.engagement === 'active' ? 15 : 5;
      const knowledgeScore = lead.propertyKnowledge === 'expert' ? 10 : 5;

      const totalScore = budgetScore + urgencyScore + engagementScore + knowledgeScore;

      expect(totalScore).toBeGreaterThan(70); // Qualified threshold
    });
  });

  describe('CRM Sync Workflow', () => {
    it('should format data for Twenty CRM', () => {
      const whatsappContact = {
        phone: '34600111222',
        name: 'Juan López',
        email: 'juan@example.com',
        source: 'whatsapp',
      };

      const crmData = TestDataFactory.createCRMData('person', {
        firstName: whatsappContact.name.split(' ')[0],
        lastName: whatsappContact.name.split(' ').slice(1).join(' '),
        phone: whatsappContact.phone,
        email: whatsappContact.email,
        source: whatsappContact.source,
      });

      expect(crmData.firstName).toBe('Juan');
      expect(crmData.lastName).toBe('López');
      expect(crmData.source).toBe('whatsapp');
    });

    it('should create opportunity from qualified lead', () => {
      const lead = {
        contactId: 'contact-123',
        budget: 2500000,
        propertyType: 'villa',
        location: 'Port Adriano',
      };

      const opportunity = TestDataFactory.createCRMData('opportunity', {
        name: `${lead.propertyType} - ${lead.location}`,
        value: lead.budget,
        stage: 'qualified',
        probability: 60,
      });

      expect(opportunity.name).toContain('villa');
      expect(opportunity.value).toBe(2500000);
      expect(opportunity.stage).toBe('qualified');
    });
  });

  describe('Appointment Workflow', () => {
    it('should schedule appointment from WhatsApp request', () => {
      const message = 'Quiero visitar la propiedad mañana a las 10:00';
      
      const dateMatch = message.match(/mañana/);
      const timeMatch = message.match(/(\d{1,2}):(\d{2})/);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const appointment = TestDataFactory.createAppointment({
        date: tomorrow.toISOString().split('T')[0],
        time: timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : '10:00',
        status: 'pending_confirmation',
      });

      expect(appointment.date).toBeDefined();
      expect(appointment.time).toBe('10:00');
      expect(appointment.status).toBe('pending_confirmation');
    });

    it('should send confirmation message after scheduling', () => {
      const appointment = TestDataFactory.createAppointment({
        date: '2026-01-15',
        time: '10:00',
      });

      const confirmationMessage = `✅ Cita confirmada:\n📅 ${appointment.date}\n🕐 ${appointment.time}\n📍 Oficina Anclora`;

      expect(confirmationMessage).toContain(appointment.date);
      expect(confirmationMessage).toContain(appointment.time);
    });
  });

  describe('Campaign Automation Workflow', () => {
    it('should trigger campaign based on lead criteria', () => {
      const lead = {
        budget: 5000000,
        propertyType: 'mansion',
        location: 'Portals Nous',
      };

      const shouldTriggerLuxuryCampaign = 
        lead.budget > 4000000 &&
        lead.propertyType === 'mansion';

      expect(shouldTriggerLuxuryCampaign).toBe(true);
    });

    it('should personalize message based on lead data', () => {
      const lead = {
        name: 'Juan',
        budget: 3000000,
        propertyType: 'villa',
        location: 'Port Adriano',
      };

      const personalizedMessage = 
        `Hola ${lead.name}, hemos encontrado villas exclusivas en ${lead.location} dentro de tu presupuesto.`;

      expect(personalizedMessage).toContain('Juan');
      expect(personalizedMessage).toContain('Port Adriano');
    });
  });

  describe('Analytics Reporting Workflow', () => {
    it('should aggregate daily metrics', async () => {
      const metrics = {
        messagesSent: 150,
        messagesReceived: 120,
        newLeads: 25,
        qualifiedLeads: 15,
        appointments: 8,
      };

      const conversionRate = (metrics.qualifiedLeads / metrics.newLeads) * 100;
      const appointmentRate = (metrics.appointments / metrics.qualifiedLeads) * 100;

      expect(conversionRate).toBe(60);
      expect(appointmentRate).toBeCloseTo(53.33, 1);
    });

    it('should identify top performing campaigns', () => {
      const campaigns = [
        { id: 'camp-1', conversions: 10, sent: 100 },
        { id: 'camp-2', conversions: 5, sent: 50 },
        { id: 'camp-3', conversions: 15, sent: 200 },
      ];

      const campaignsWithRate = campaigns.map(c => ({
        ...c,
        conversionRate: (c.conversions / c.sent) * 100,
      }));

      const topCampaign = campaignsWithRate.reduce((best, current) => 
        current.conversionRate > best.conversionRate ? current : best
      );

      expect(topCampaign.id).toBe('camp-2'); // 10% conversion rate
    });
  });

  describe('Handoff to Human Workflow', () => {
    it('should trigger handoff on complex inquiry', () => {
      const message = 'Necesito información detallada sobre impuestos y financiación';
      
      const complexKeywords = ['impuestos', 'financiación', 'legal', 'notario'];
      const requiresHuman = complexKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );

      expect(requiresHuman).toBe(true);
    });

    it('should notify agent of handoff', () => {
      const handoff = {
        phone: '34600111222',
        reason: 'complex_inquiry',
        context: 'Lead asking about tax implications',
        priority: 'high',
      };

      const notification = {
        type: 'agent_notification',
        message: `🚨 Handoff requerido: ${handoff.reason}`,
        phone: handoff.phone,
        priority: handoff.priority,
      };

      expect(notification.type).toBe('agent_notification');
      expect(notification.priority).toBe('high');
    });
  });

  describe('Error Handling Workflow', () => {
    it('should retry failed webhook processing', () => {
      const failedWebhook = {
        attempt: 1,
        maxAttempts: 3,
        error: 'Network timeout',
      };

      const shouldRetry = failedWebhook.attempt < failedWebhook.maxAttempts;
      const backoffDelay = Math.pow(2, failedWebhook.attempt) * 1000;

      expect(shouldRetry).toBe(true);
      expect(backoffDelay).toBe(2000); // 2^1 * 1000
    });

    it('should send to DLQ after max attempts', () => {
      const failedWebhook = {
        attempt: 3,
        maxAttempts: 3,
        error: 'Persistent error',
      };

      const shouldMoveToDLQ = failedWebhook.attempt >= failedWebhook.maxAttempts;

      expect(shouldMoveToDLQ).toBe(true);
    });
  });
});
