'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Shield, Users, ArrowRight } from 'lucide-react';
import { Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

const features = [
  {
    icon: Award,
    titleKey: 'privateEstates.features.curation.title',
    descKey: 'privateEstates.features.curation.description',
  },
  {
    icon: Shield,
    titleKey: 'privateEstates.features.confidentiality.title',
    descKey: 'privateEstates.features.confidentiality.description',
  },
  {
    icon: Users,
    titleKey: 'privateEstates.features.advisory.title',
    descKey: 'privateEstates.features.advisory.description',
  },
];

/**
 * PrivateEstates Component - Homepage
 * 
 * B2C section showcasing Anclora Private Estates services
 * Beige background with serif typography
 */
export function PrivateEstates() {
  const { t } = useTranslation();

  return (
    <Section id="private-estates" background="beige" padding="xl">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-gray-dark mb-6">
          {t('privateEstates.headline')}
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed">
          {t('privateEstates.subheadline')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-anclora-gold/10 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-anclora-gold" />
              </div>
              
              <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-4">
                {t(feature.titleKey)}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {t(feature.descKey)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Link href="/contacto?tipo=consulta">
          <Button 
            variant="primary" 
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {t('privateEstates.cta')}
          </Button>
        </Link>
      </div>
    </Section>
  );
}
