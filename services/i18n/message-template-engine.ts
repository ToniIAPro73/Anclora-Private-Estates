import { I18nService, SupportedLanguage } from './i18n-service';

/**
 * Message Template Engine
 * 
 * Generates structured WhatsApp messages in multiple languages:
 * - Welcome flows
 * - Property search flows
 * - Appointment booking flows
 * - Agent handoff messages
 * - Error messages
 */

export interface MessageTemplate {
  text: string;
  buttons?: Array<{
    id: string;
    text: string;
  }>;
  quick_replies?: string[];
}

export class MessageTemplateEngine {
  constructor(private i18nService: I18nService) {}

  /**
   * Generate welcome message
   */
  async getWelcomeMessage(phone: string, name?: string): Promise<MessageTemplate> {
    const language = await this.i18nService.getUserLanguage(phone);

    const greeting = await this.i18nService.translate('welcome.greeting', phone, { language });
    const intro = await this.i18nService.translate('welcome.intro', phone, { language });

    let text = `${greeting}\n\n${intro}`;

    if (!name) {
      const askName = await this.i18nService.translate('welcome.ask_name', phone, { language });
      text += `\n\n${askName}`;
    }

    return { text };
  }

  /**
   * Generate main menu
   */
  async getMainMenu(phone: string): Promise<MessageTemplate> {
    const menu = await this.i18nService.getMenuOptions(phone);

    return {
      text: menu.title,
      buttons: menu.options,
    };
  }

  /**
   * Generate property type selection
   */
  async getPropertyTypeSelection(phone: string): Promise<MessageTemplate> {
    const language = await this.i18nService.getUserLanguage(phone);

    const translations = await this.i18nService.translateMultiple(
      [
        'search.property_type',
        'search.types.villa',
        'search.types.apartment',
        'search.types.land',
        'search.types.commercial',
      ],
      phone,
      { language }
    );

    return {
      text: translations['search.property_type'],
      buttons: [
        { id: 'villa', text: translations['search.types.villa'] },
        { id: 'apartment', text: translations['search.types.apartment'] },
        { id: 'land', text: translations['search.types.land'] },
        { id: 'commercial', text: translations['search.types.commercial'] },
      ],
    };
  }

  /**
   * Generate location selection
   */
  async getLocationSelection(phone: string): Promise<MessageTemplate> {
    const language = await this.i18nService.getUserLanguage(phone);

    const translations = await this.i18nService.translateMultiple(
      [
        'search.location',
        'search.locations.palma',
        'search.locations.southwest',
        'search.locations.north',
        'search.locations.east',
        'search.locations.center',
      ],
      phone,
      { language }
    );

    return {
      text: translations['search.location'],
      buttons: [
        { id: 'palma', text: translations['search.locations.palma'] },
        { id: 'southwest', text: translations['search.locations.southwest'] },
        { id: 'north', text: translations['search.locations.north'] },
        { id: 'east', text: translations['search.locations.east'] },
        { id: 'center', text: translations['search.locations.center'] },
      ],
    };
  }

  /**
   * Generate budget selection
   */
  async getBudgetSelection(phone: string): Promise<MessageTemplate> {
    const language = await this.i18nService.getUserLanguage(phone);

    const translations = await this.i18nService.translateMultiple(
      [
        'search.budget',
        'search.budget_ranges.under_500k',
        'search.budget_ranges.500k_1m',
        'search.budget_ranges.1m_2m',
        'search.budget_ranges.2m_5m',
        'search.budget_ranges.over_5m',
      ],
      phone,
      { language }
    );

    return {
      text: translations['search.budget'],
      buttons: [
        { id: 'under_500k', text: translations['search.budget_ranges.under_500k'] },
        { id: '500k_1m', text: translations['search.budget_ranges.500k_1m'] },
        { id: '1m_2m', text: translations['search.budget_ranges.1m_2m'] },
        { id: '2m_5m', text: translations['search.budget_ranges.2m_5m'] },
        { id: 'over_5m', text: translations['search.budget_ranges.over_5m'] },
      ],
    };
  }

  /**
   * Generate timeline selection
   */
  async getTimelineSelection(phone: string): Promise<MessageTemplate> {
    const language = await this.i18nService.getUserLanguage(phone);

    const translations = await this.i18nService.translateMultiple(
      [
        'search.timeline',
        'search.timelines.immediate',
        'search.timelines.1_3_months',
        'search.timelines.3_6_months',
        'search.timelines.6_12_months',
        'search.timelines.exploring',
      ],
      phone,
      { language }
    );

    return {
      text: translations['search.timeline'],
      buttons: [
        { id: 'immediate', text: translations['search.timelines.immediate'] },
        { id: '1_3_months', text: translations['search.timelines.1_3_months'] },
        { id: '3_6_months', text: translations['search.timelines.3_6_months'] },
        { id: '6_12_months', text: translations['search.timelines.6_12_months'] },
        { id: 'exploring', text: translations['search.timelines.exploring'] },
      ],
    };
  }

  /**
   * Generate buyer type qualification
   */
  async getBuyerTypeSelection(phone: string): Promise<MessageTemplate> {
    const language = await this.i18nService.getUserLanguage(phone);

    const translations = await this.i18nService.translateMultiple(
      [
        'buyer_qualification.buyer_type',
        'buyer_qualification.types.investor',
        'buyer_qualification.types.end_user',
        'buyer_qualification.types.relocating',
        'buyer_qualification.types.vacation',
      ],
      phone,
      { language }
    );

    return {
      text: translations['buyer_qualification.buyer_type'],
      buttons: [
        { id: 'investor', text: translations['buyer_qualification.types.investor'] },
        { id: 'end_user', text: translations['buyer_qualification.types.end_user'] },
        { id: 'relocating', text: translations['buyer_qualification.types.relocating'] },
        { id: 'vacation', text: translations['buyer_qualification.types.vacation'] },
      ],
    };
  }

  /**
   * Generate financing selection
   */
  async getFinancingSelection(phone: string): Promise<MessageTemplate> {
    const language = await this.i18nService.getUserLanguage(phone);

    const translations = await this.i18nService.translateMultiple(
      [
        'buyer_qualification.financing',
        'buyer_qualification.financing_options.cash',
        'buyer_qualification.financing_options.mortgage_approved',
        'buyer_qualification.financing_options.mortgage_needed',
        'buyer_qualification.financing_options.other',
      ],
      phone,
      { language }
    );

    return {
      text: translations['buyer_qualification.financing'],
      buttons: [
        { id: 'cash', text: translations['buyer_qualification.financing_options.cash'] },
        { id: 'mortgage_approved', text: translations['buyer_qualification.financing_options.mortgage_approved'] },
        { id: 'mortgage_needed', text: translations['buyer_qualification.financing_options.mortgage_needed'] },
        { id: 'other', text: translations['buyer_qualification.financing_options.other'] },
      ],
    };
  }

  /**
   * Generate search results message
   */
  async getSearchResults(
    phone: string,
    count: number,
    properties: Array<{
      id: string;
      title: string;
      price: number;
      location: string;
    }>
  ): Promise<MessageTemplate> {
    const language = await this.i18nService.getUserLanguage(phone);

    let text = await this.i18nService.translate('search.results', phone, {
      language,
      params: { count },
    });

    text += '\n\n';

    // Add property summaries
    for (const property of properties.slice(0, 5)) {
      text += `📍 ${property.title}\n`;
      text += `💰 ${property.price.toLocaleString()}€\n`;
      text += `📌 ${property.location}\n\n`;
    }

    return { text };
  }

  /**
   * Generate property details
   */
  async getPropertyDetails(
    phone: string,
    property: {
      title: string;
      price: number;
      size: number;
      bedrooms: number;
      bathrooms: number;
      location: string;
      description: string;
    }
  ): Promise<MessageTemplate> {
    const text = await this.i18nService.formatPropertyDetails(phone, property);

    const scheduleVisit = await this.i18nService.translate('property.schedule_visit', phone);
    const requestInfo = await this.i18nService.translate('property.request_info', phone);
    const similar = await this.i18nService.translate('property.similar', phone);

    return {
      text,
      buttons: [
        { id: 'schedule', text: scheduleVisit },
        { id: 'info', text: requestInfo },
        { id: 'similar', text: similar },
      ],
    };
  }

  /**
   * Generate appointment confirmation
   */
  async getAppointmentConfirmation(
    phone: string,
    appointment: {
      date: string;
      time: string;
      property: string;
    }
  ): Promise<MessageTemplate> {
    const text = await this.i18nService.formatAppointmentConfirmation(phone, appointment);
    return { text };
  }

  /**
   * Generate agent handoff message
   */
  async getAgentHandoffMessage(phone: string, agentName?: string): Promise<MessageTemplate> {
    const language = await this.i18nService.getUserLanguage(phone);

    let text: string;

    if (agentName) {
      text = await this.i18nService.translate('handoff.agent_connected', phone, {
        language,
        params: { agent_name: agentName },
      });
    } else {
      const transferring = await this.i18nService.translate('handoff.transferring', phone, { language });
      const waitTime = await this.i18nService.translate('handoff.wait_time', phone, {
        language,
        params: { minutes: 5 },
      });
      text = `${transferring}\n\n${waitTime}`;
    }

    return { text };
  }

  /**
   * Generate agent unavailable message
   */
  async getAgentUnavailableMessage(phone: string): Promise<MessageTemplate> {
    const language = await this.i18nService.getUserLanguage(phone);

    const unavailable = await this.i18nService.translate('handoff.agent_unavailable', phone, { language });
    const leaveMessage = await this.i18nService.translate('handoff.leave_message', phone, { language });

    const yes = await this.i18nService.translate('confirmation.yes', phone, { language });
    const no = await this.i18nService.translate('confirmation.no', phone, { language });

    return {
      text: `${unavailable}\n\n${leaveMessage}`,
      buttons: [
        { id: 'yes', text: yes },
        { id: 'no', text: no },
      ],
    };
  }

  /**
   * Generate language selection menu
   */
  async getLanguageSelection(phone: string): Promise<MessageTemplate> {
    const languageOptions = await this.i18nService.getLanguageOptions(phone);

    return {
      text: `${languageOptions.current}\n\n`,
      buttons: languageOptions.options.map(opt => ({
        id: opt.id,
        text: opt.text,
      })),
    };
  }

  /**
   * Generate language changed confirmation
   */
  async getLanguageChangedMessage(phone: string, newLanguage: SupportedLanguage): Promise<MessageTemplate> {
    const text = await this.i18nService.translate('language.changed', phone, {
      language: newLanguage,
    });

    return { text };
  }

  /**
   * Generate error message
   */
  async getErrorMessage(
    phone: string,
    errorType: 'generic' | 'invalid_input' | 'property_not_found' | 'system_error' | 'timeout' | 'rate_limit'
  ): Promise<MessageTemplate> {
    const text = await this.i18nService.getErrorMessage(phone, errorType);
    return { text };
  }

  /**
   * Generate no results message
   */
  async getNoResultsMessage(phone: string): Promise<MessageTemplate> {
    const text = await this.i18nService.translate('search.no_results', phone);

    const yes = await this.i18nService.translate('confirmation.yes', phone);
    const no = await this.i18nService.translate('confirmation.no', phone);

    return {
      text,
      buttons: [
        { id: 'yes', text: yes },
        { id: 'no', text: no },
      ],
    };
  }
}
