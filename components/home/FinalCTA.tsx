'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { cognitiveSolutionsConfig } from '@/lib/config';

/**
 * FinalCTA Component - Homepage
 * 
 * Final call-to-action section with dual CTAs
 * Gradient background
 */
export function FinalCTA() {
  const { t } = useTranslation();

  return (
    <Section background="gradient" padding="xl">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-gray-dark mb-6">
          {t('finalCta.headline')}
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          {t('finalCta.subheadline')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/contacto?tipo=consulta">
            <Button 
              variant="primary" 
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t('finalCta.cta.primary')}
            </Button>
          </Link>

          <a 
            href={cognitiveSolutionsConfig.gptAuditUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              variant="outline" 
              size="lg"
              rightIcon={<ExternalLink className="w-5 h-5" />}
            >
              {t('finalCta.cta.secondary')}
            </Button>
          </a>
        </div>
      </div>
    </Section>
  );
}
