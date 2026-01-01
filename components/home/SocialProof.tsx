'use client';

import React from 'react';
import Image from 'next/image';
import { Section } from '@/components/layout';
import { useTranslation } from '@/hooks/useTranslation';

const partners = [
  { name: 'Make.com', logo: '/assets/partners/placeholder-partner.svg' },
  { name: 'OpenAI', logo: '/assets/partners/placeholder-partner.svg' },
  { name: 'n8n', logo: '/assets/partners/placeholder-partner.svg' },
  { name: 'eXp Realty', logo: '/assets/partners/placeholder-partner.svg' },
  { name: 'MLS', logo: '/assets/partners/placeholder-partner.svg' },
];

/**
 * SocialProof Component - Homepage
 * 
 * Displays partner logos (technology + real estate)
 */
export function SocialProof() {
  const { t } = useTranslation();

  return (
    <Section background="white" padding="lg">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-4">
          {t('socialProof.headline')}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
        {partners.map((partner, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              width={200}
              height={80}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
