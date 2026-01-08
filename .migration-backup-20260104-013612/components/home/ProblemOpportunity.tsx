'use client';

import React from 'react';
import { TrendingUp, BarChart, Target, Zap } from 'lucide-react';
import { Section } from '@/components/layout';
import { useTranslation } from '@/hooks/useTranslation';

const investorChallenges = [
  { icon: TrendingUp, key: 'investor.challenge1' },
  { icon: BarChart, key: 'investor.challenge2' },
  { icon: Target, key: 'investor.challenge3' },
];

const agentChallenges = [
  { icon: Zap, key: 'agent.challenge1' },
  { icon: TrendingUp, key: 'agent.challenge2' },
  { icon: Target, key: 'agent.challenge3' },
];

/**
 * ProblemOpportunity Component - Homepage
 * 
 * Two-column section showing investor needs vs agent needs
 */
export function ProblemOpportunity() {
  const { t } = useTranslation();

  return (
    <Section background="white" padding="xl">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Investor Column */}
        <div className="space-y-6">
          <div className="inline-block px-4 py-2 bg-anclora-gold/10 text-anclora-gold text-sm font-semibold rounded-full mb-4">
            {t('problemOpportunity.investor.badge')}
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-dark mb-6">
            {t('problemOpportunity.investor.headline')}
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {t('problemOpportunity.investor.description')}
          </p>

          <div className="space-y-4">
            {investorChallenges.map((challenge, index) => {
              const Icon = challenge.icon;
              return (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-anclora-gold/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-anclora-gold" />
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {t(challenge.key)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Column */}
        <div className="space-y-6">
          <div className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold rounded-full mb-4">
            {t('problemOpportunity.agent.badge')}
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-dark mb-6">
            {t('problemOpportunity.agent.headline')}
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {t('problemOpportunity.agent.description')}
          </p>

          <div className="space-y-4">
            {agentChallenges.map((challenge, index) => {
              const Icon = challenge.icon;
              return (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-dark text-white flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {t(challenge.key)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
