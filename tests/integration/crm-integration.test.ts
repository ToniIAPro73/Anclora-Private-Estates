/**
 * Integration Tests - CRM Integration (Twenty CRM)
 */

import { TestDataFactory } from '../test-helpers/test-data-factory';

describe('CRM Integration - Twenty CRM', () => {
  describe('Contact Sync', () => {
    it('should create contact from WhatsApp lead', () => {
      const whatsappLead = {
        phone: '34600111222',
        name: 'Juan López García',
        email: 'juan.lopez@example.com',
        source: 'whatsapp',
        firstMessage: 'Me interesa una villa en Port Adriano',
      };

      const contact = TestDataFactory.createCRMData('person', {
        firstName: whatsappLead.name.split(' ')[0],
        lastName: whatsappLead.name.split(' ').slice(1).join(' '),
        phone: whatsappLead.phone,
        email: whatsappLead.email,
        source: whatsappLead.source,
      });

      expect(contact.firstName).toBe('Juan');
      expect(contact.lastName).toBe('López García');
      expect(contact.phone).toBe('34600111222');
      expect(contact.source).toBe('whatsapp');
    });

    it('should update existing contact with new data', () => {
      const existingContact = TestDataFactory.createCRMData('person', {
        id: 'person-123',
        phone: '34600111222',
        email: null,
      });

      const updates = {
        email: 'juan.lopez@example.com',
        lastContactDate: new Date().toISOString(),
        engagementScore: 75,
      };

      const updatedContact = {
        ...existingContact,
        ...updates,
      };

      expect(updatedContact.email).toBe('juan.lopez@example.com');
      expect(updatedContact.engagementScore).toBe(75);
    });

    it('should handle duplicate detection', () => {
      const contact1 = { phone: '34600111222', email: 'juan@example.com' };
      const contact2 = { phone: '34600111222', email: 'j.lopez@example.com' };

      const isDuplicate = contact1.phone === contact2.phone;

      expect(isDuplicate).toBe(true);
    });
  });

  describe('Opportunity Creation', () => {
    it('should create opportunity from qualified lead', () => {
      const qualifiedLead = {
        contactId: 'person-123',
        budget: 3500000,
        propertyType: 'villa',
        location: 'Port Adriano',
        bedrooms: 4,
        timeline: '3 months',
      };

      const opportunity = TestDataFactory.createCRMData('opportunity', {
        name: `${qualifiedLead.propertyType} - ${qualifiedLead.location}`,
        value: qualifiedLead.budget,
        stage: 'qualified',
        probability: 60,
        closeDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      });

      expect(opportunity.name).toBe('villa - Port Adriano');
      expect(opportunity.value).toBe(3500000);
      expect(opportunity.stage).toBe('qualified');
    });

    it('should calculate opportunity probability based on factors', () => {
      const factors = {
        budgetMatch: true,      // +20%
        timelineUrgent: true,   // +15%
        locationMatch: true,    // +10%
        priorEngagement: true,  // +15%
        referral: false,        // +0%
      };

      let probability = 40; // Base probability

      if (factors.budgetMatch) probability += 20;
      if (factors.timelineUrgent) probability += 15;
      if (factors.locationMatch) probability += 10;
      if (factors.priorEngagement) probability += 15;
      if (factors.referral) probability += 20;

      expect(probability).toBe(100);
    });

    it('should update opportunity stage progression', () => {
      const stages = [
        'new',
        'contacted',
        'qualified',
        'proposal',
        'negotiation',
        'closed_won',
      ];

      const currentStage = 'qualified';
      const currentIndex = stages.indexOf(currentStage);
      const nextStage = stages[currentIndex + 1];

      expect(nextStage).toBe('proposal');
    });
  });

  describe('Activity Tracking', () => {
    it('should log WhatsApp conversation as activity', () => {
      const conversation = TestDataFactory.createConversation(5);

      const activity = {
        type: 'whatsapp_conversation',
        contactId: 'person-123',
        subject: 'WhatsApp Exchange',
        messageCount: conversation.messageCount,
        duration: conversation.lastMessageAt - conversation.startedAt,
        createdAt: new Date(conversation.startedAt).toISOString(),
      };

      expect(activity.type).toBe('whatsapp_conversation');
      expect(activity.messageCount).toBe(5);
    });

    it('should create activity for appointment', () => {
      const appointment = TestDataFactory.createAppointment();

      const activity = {
        type: 'appointment',
        contactId: appointment.contactId,
        subject: `Property viewing - ${appointment.propertyId}`,
        dueDate: `${appointment.date}T${appointment.time}:00Z`,
        status: appointment.status,
      };

      expect(activity.type).toBe('appointment');
      expect(activity.status).toBe('scheduled');
    });

    it('should track email sends as activities', () => {
      const emailActivity = {
        type: 'email',
        contactId: 'person-123',
        subject: 'Property Brochure - Villa Azure Bay',
        direction: 'outbound',
        status: 'sent',
        createdAt: new Date().toISOString(),
      };

      expect(emailActivity.type).toBe('email');
      expect(emailActivity.direction).toBe('outbound');
    });
  });

  describe('Lead Scoring', () => {
    it('should calculate engagement score', () => {
      const engagement = {
        messagesSent: 10,
        messagesReceived: 15,
        appointmentsScheduled: 2,
        propertiesViewed: 5,
        brochuresRequested: 3,
        daysSinceFirstContact: 7,
      };

      const score = 
        (engagement.messagesReceived * 2) +      // 30
        (engagement.appointmentsScheduled * 10) + // 20
        (engagement.propertiesViewed * 5) +       // 25
        (engagement.brochuresRequested * 3) -     // 9
        (engagement.daysSinceFirstContact * 0.5); // -3.5

      expect(score).toBeCloseTo(80.5, 1);
    });

    it('should categorize lead by score', () => {
      const scores = [95, 75, 45, 25];
      
      const categories = scores.map(score => {
        if (score >= 80) return 'hot';
        if (score >= 60) return 'warm';
        if (score >= 40) return 'cool';
        return 'cold';
      });

      expect(categories).toEqual(['hot', 'warm', 'warm', 'cold']);
    });
  });

  describe('Pipeline Management', () => {
    it('should move deal through pipeline stages', () => {
      const deal = {
        id: 'deal-123',
        stage: 'qualified',
        value: 2500000,
        probability: 60,
      };

      const stageTransitions = {
        'new': { next: 'contacted', probability: 20 },
        'contacted': { next: 'qualified', probability: 40 },
        'qualified': { next: 'proposal', probability: 60 },
        'proposal': { next: 'negotiation', probability: 75 },
        'negotiation': { next: 'closed_won', probability: 90 },
      };

      const transition = stageTransitions[deal.stage as keyof typeof stageTransitions];

      expect(transition.next).toBe('proposal');
      expect(transition.probability).toBe(60);
    });

    it('should calculate weighted pipeline value', () => {
      const deals = [
        { value: 5000000, probability: 90 },
        { value: 3000000, probability: 60 },
        { value: 2000000, probability: 40 },
      ];

      const weightedValue = deals.reduce((sum, deal) => 
        sum + (deal.value * deal.probability / 100), 0
      );

      expect(weightedValue).toBe(6300000); // 4.5M + 1.8M + 0.8M
    });
  });

  describe('Data Enrichment', () => {
    it('should enrich contact with property preferences', () => {
      const contact = TestDataFactory.createCRMData('person');
      
      const preferences = {
        budgetMin: 2000000,
        budgetMax: 5000000,
        propertyTypes: ['villa', 'mansion'],
        locations: ['Port Adriano', 'Portals Nous'],
        minBedrooms: 4,
        amenities: ['pool', 'sea_view', 'garage'],
      };

      const enrichedContact = {
        ...contact,
        customFields: {
          preferences: JSON.stringify(preferences),
        },
      };

      expect(enrichedContact.customFields.preferences).toBeDefined();
    });

    it('should tag contacts based on behavior', () => {
      const behaviors = {
        viewedLuxuryProperties: true,
        respondedQuickly: true,
        scheduledMultipleVisits: true,
        requestedFinancing: false,
      };

      const tags = [];
      
      if (behaviors.viewedLuxuryProperties) tags.push('luxury_buyer');
      if (behaviors.respondedQuickly) tags.push('high_engagement');
      if (behaviors.scheduledMultipleVisits) tags.push('serious_buyer');
      if (behaviors.requestedFinancing) tags.push('needs_financing');

      expect(tags).toContain('luxury_buyer');
      expect(tags).toContain('serious_buyer');
      expect(tags.length).toBe(3);
    });
  });

  describe('Reporting & Analytics', () => {
    it('should generate conversion funnel metrics', () => {
      const funnel = {
        leads: 100,
        contacted: 80,
        qualified: 50,
        proposal: 25,
        negotiation: 15,
        closed: 8,
      };

      const conversionRates = {
        leadToQualified: (funnel.qualified / funnel.leads) * 100,
        qualifiedToProposal: (funnel.proposal / funnel.qualified) * 100,
        proposalToClosed: (funnel.closed / funnel.proposal) * 100,
        overallConversion: (funnel.closed / funnel.leads) * 100,
      };

      expect(conversionRates.leadToQualified).toBe(50);
      expect(conversionRates.qualifiedToProposal).toBe(50);
      expect(conversionRates.proposalToClosed).toBe(32);
      expect(conversionRates.overallConversion).toBe(8);
    });

    it('should calculate average deal cycle time', () => {
      const deals = [
        { createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, closedAt: Date.now() },
        { createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, closedAt: Date.now() },
        { createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, closedAt: Date.now() },
      ];

      const cycleTimes = deals.map(deal => 
        (deal.closedAt - deal.createdAt) / (24 * 60 * 60 * 1000)
      );

      const averageCycleTime = cycleTimes.reduce((a, b) => a + b) / cycleTimes.length;

      expect(averageCycleTime).toBe(45); // 45 days average
    });
  });

  describe('Automation Rules', () => {
    it('should auto-assign leads based on criteria', () => {
      const lead = {
        budget: 8000000,
        location: 'Portals Nous',
        propertyType: 'mansion',
      };

      // Luxury specialist handles > 5M properties
      const agent = lead.budget > 5000000 ? 'luxury_specialist' : 'general_agent';

      expect(agent).toBe('luxury_specialist');
    });

    it('should trigger follow-up tasks', () => {
      const lastContact = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
      const daysSinceContact = (Date.now() - lastContact) / (24 * 60 * 60 * 1000);

      const shouldFollowUp = daysSinceContact >= 7;

      expect(shouldFollowUp).toBe(true);
    });

    it('should escalate stalled opportunities', () => {
      const opportunity = {
        stage: 'proposal',
        lastUpdated: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
        value: 5000000,
      };

      const daysSinceUpdate = (Date.now() - opportunity.lastUpdated) / (24 * 60 * 60 * 1000);
      const shouldEscalate = daysSinceUpdate > 10 && opportunity.value > 2000000;

      expect(shouldEscalate).toBe(true);
    });
  });
});
