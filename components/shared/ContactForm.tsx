'use client';

import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Input, TextArea, Checkbox, Button, Select } from '@/components/ui';
import siteConfig from '@/lib/config';

export type ContactFormType = 'general' | 'property-inquiry' | 'valuation' | 'consultation';

interface ContactFormProps {
  type?: ContactFormType;
  propertyId?: string;
  propertyUrl?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  budget?: string;
  timeline?: string;
  propertyType?: string;
  message: string;
  acceptPrivacy: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface SubmissionResponse {
  success: boolean;
  message?: string;
  error?: string;
  contactId?: string;
  dealId?: string;
  leadScore?: number;
}

/**
 * ContactForm Component
 * 
 * Form with n8n webhook integration and real-time validation
 */
export function ContactForm({ type = 'general', propertyId, propertyUrl }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    budget: '',
    timeline: '',
    propertyType: '',
    message: '',
    acceptPrivacy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Get webhook URL based on form type
  const getWebhookUrl = () => {
    const { baseUrl, endpoints } = siteConfig.integrations.n8n;
    const endpointMap = {
      'general': endpoints.contactGeneral,
      'property-inquiry': endpoints.propertyInquiry,
      'valuation': endpoints.valuation,
      'consultation': endpoints.consultation,
    };
    return `${baseUrl}${endpointMap[type]}`;
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s()-]{9,}$/;
    return phoneRegex.test(phone.trim());
  };

  const validateField = (name: string, value: any): string => {
    // Required fields validation
    if (['name', 'email', 'message'].includes(name) && !value) {
      return 'Este campo es obligatorio';
    }

    // Valuation requires phone
    if (type === 'valuation' && name === 'phone' && !value) {
      return 'El teléfono es obligatorio para valoraciones';
    }

    // Email validation
    if (name === 'email' && value && !validateEmail(value)) {
      return 'Email inválido';
    }

    // Phone validation
    if (name === 'phone' && value && !validatePhone(value)) {
      return 'Teléfono inválido';
    }

    // Privacy acceptance
    if (name === 'acceptPrivacy' && !value) {
      return 'Debes aceptar la política de privacidad';
    }

    return '';
  };

  // Handle field change with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type: inputType } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    const newValue = inputType === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Real-time validation if field was touched
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle field blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Always required
    newErrors.name = validateField('name', formData.name);
    newErrors.email = validateField('email', formData.email);
    newErrors.message = validateField('message', formData.message);
    newErrors.acceptPrivacy = validateField('acceptPrivacy', formData.acceptPrivacy);
    
    // Conditional validations
    if (type === 'valuation') {
      newErrors.phone = validateField('phone', formData.phone);
    }
    
    setErrors(newErrors);
    
    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Track analytics event
  const trackEvent = (eventName: string, data?: any) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: eventName,
        formType: type,
        ...data,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    
    // Validate
    if (!validateForm()) {
      trackEvent('form_validation_failed', { errors });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    trackEvent('form_submit_started');
    
    try {
      // Prepare payload
      const payload: any = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        message: formData.message.trim(),
        acceptPrivacy: formData.acceptPrivacy,
      };
      
      // Add type-specific fields
      if (type === 'property-inquiry') {
        payload.propertyId = propertyId;
        payload.budget = formData.budget || undefined;
        payload.timeline = formData.timeline || undefined;
        payload.propertyUrl = propertyUrl || undefined;
      }
      
      if (type === 'valuation') {
        payload.propertyType = formData.propertyType || undefined;
      }
      
      // Submit to n8n webhook
      const response = await fetch(getWebhookUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result: SubmissionResponse = await response.json();
      
      if (response.ok && result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || '¡Gracias! Te contactaremos pronto.');
        
        // Track success
        trackEvent('form_submit_success', {
          contactId: result.contactId,
          leadScore: result.leadScore,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          budget: '',
          timeline: '',
          propertyType: '',
          message: '',
          acceptPrivacy: false,
        });
        setTouched({});
        setErrors({});
        
      } else {
        throw new Error(result.error || 'Error al enviar el formulario');
      }
      
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Error al enviar. Intenta de nuevo.');
      
      trackEvent('form_submit_error', {
        error: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Budget options for property inquiry
  const budgetOptions = [
    { value: '', label: 'Selecciona un rango' },
    { value: 'under-500k', label: 'Menos de 500.000€' },
    { value: '500k-1m', label: '500.000€ - 1M€' },
    { value: '1m-2m', label: '1M€ - 2M€' },
    { value: 'over-2m', label: 'Más de 2M€' },
  ];

  // Timeline options for property inquiry
  const timelineOptions = [
    { value: '', label: 'Selecciona un plazo' },
    { value: 'immediate', label: 'Inmediato' },
    { value: '1-3-months', label: '1-3 meses' },
    { value: '3-6-months', label: '3-6 meses' },
    { value: '6-12-months', label: '6-12 meses' },
    { value: 'exploring', label: 'Solo explorando' },
  ];

  // Property type options for valuation
  const propertyTypeOptions = [
    { value: '', label: 'Selecciona un tipo' },
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartamento' },
    { value: 'penthouse', label: 'Ático' },
    { value: 'finca', label: 'Finca' },
    { value: 'land', label: 'Terreno' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Alert */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800 font-medium">¡Enviado!</p>
            <p className="text-green-700 text-sm mt-1">{submitMessage}</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{submitMessage}</p>
          </div>
        </div>
      )}

      {/* Name */}
      <Input
        label="Nombre completo"
        name="name"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name ? errors.name : undefined}
        required
        disabled={isSubmitting}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : undefined}
        required
        disabled={isSubmitting}
      />

      {/* Phone */}
      <Input
        label="Teléfono"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.phone ? errors.phone : undefined}
        required={type === 'valuation'}
        disabled={isSubmitting}
      />

      {/* Budget (property-inquiry only) */}
      {type === 'property-inquiry' && (
        <Select
          label="Presupuesto"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          options={budgetOptions}
          disabled={isSubmitting}
        />
      )}

      {/* Timeline (property-inquiry only) */}
      {type === 'property-inquiry' && (
        <Select
          label="Plazo de compra"
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          options={timelineOptions}
          disabled={isSubmitting}
        />
      )}

      {/* Property Type (valuation only) */}
      {type === 'valuation' && (
        <Select
          label="Tipo de propiedad"
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          options={propertyTypeOptions}
          disabled={isSubmitting}
        />
      )}

      {/* Message */}
      <TextArea
        label="Mensaje"
        name="message"
        value={formData.message}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.message ? errors.message : undefined}
        rows={5}
        required
        disabled={isSubmitting}
      />

      {/* Privacy */}
      <Checkbox
        name="acceptPrivacy"
        checked={formData.acceptPrivacy}
        onChange={handleChange}
        error={touched.acceptPrivacy ? errors.acceptPrivacy : undefined}
        disabled={isSubmitting}
      >
        Acepto la{' '}
        <a href="/privacidad" className="text-anclora-gold hover:underline" target="_blank">
          política de privacidad
        </a>{' '}
        y el tratamiento de mis datos
      </Checkbox>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar Consulta'
        )}
      </Button>

      {/* Info text */}
      <p className="text-xs text-gray-500 text-center">
        Responderemos en menos de{' '}
        {type === 'property-inquiry' ? '2 horas' : type === 'valuation' ? '24 horas' : '48 horas'}.
      </p>
    </form>
  );
}
