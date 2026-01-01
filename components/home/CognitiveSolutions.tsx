'use client';

import React from 'react';
import { Bot, Workflow, BarChart, ExternalLink } from 'lucide-react';
import { Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import siteConfig from '@/lib/config';

const features = [
  {
    icon: Bot,
    titleKey: 'cognitiveSolutions.features.aiAgent.title',
    descKey: 'cognitiveSolutions.features.aiAgent.description',
  },
  {
    icon: Workflow,
    titleKey: 'cognitiveSolutions.features.automation.title',
    descKey: 'cognitiveSolutions.features.automation.description',
  },
  {
    icon: BarChart,
    titleKey: 'cognitiveSolutions.features.dashboard.title',
    descKey: 'cognitiveSolutions.features.dashboard.description',
  },
];

/**
 * CognitiveSolutions Component - Homepage
 * 
 * B2B section showcasing AI services for real estate agencies
 * Dark background with sans-serif typography
 */
export function CognitiveSolutions() {
  const { t } = useTranslation();

  return (
    <Section id="cognitive-solutions" background="dark" padding="xl">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="font-sans text-5xl md:text-6xl font-bold mb-6">
          {t('cognitiveSolutions.headline')}
        </h2>
        <p className="text-xl text-gray-300 leading-relaxed">
          {t('cognitiveSolutions.subheadline')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index} 
              className="bg-gray-800 rounded-lg p-8 border border-anclora-gold/20 hover:border-anclora-gold/50 transition-colors duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-anclora-gold/10 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-anclora-gold" />
              </div>
              
              <h3 className="font-sans text-2xl font-semibold mb-4">
                {t(feature.titleKey)}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {t(feature.descKey)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <a 
          href={siteConfig.cognitiveSolutionsConfig.gptAuditUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button 
            variant="primary" 
            size="lg"
            rightIcon={<ExternalLink className="w-5 h-5" />}
          >
            {t('cognitiveSolutions.cta')}
          </Button>
        </a>
      </div>
    </Section>
  );
}
