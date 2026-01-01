'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  href: string;
  cta: string;
}

/**
 * ServiceCard Component
 * 
 * Card display for services with icon, features and CTA
 */
export function ServiceCard({ icon: Icon, title, description, features, href, cta }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-8 hover:-translate-y-1">
      <div className="w-16 h-16 rounded-full bg-anclora-gold/10 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-anclora-gold" />
      </div>

      <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-4">
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed mb-6">
        {description}
      </p>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-anclora-gold mt-1">•</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={href}>
        <Button
          variant="outline"
          size="md"
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="w-full"
        >
          {cta}
        </Button>
      </Link>
    </div>
  );
}
