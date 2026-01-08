'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Button, Logo } from '@/components/ui';
import { Container } from '@/components/layout';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Hero Component - Homepage
 *
 * Hero section with video background, Nexus Group logo, and dual CTAs
 */
export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/images/placeholders/hero-placeholder.svg')",
          backgroundColor: '#1a1a1a',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <Container
        size="lg"
        className="relative z-10 flex h-full flex-col justify-center px-4 text-center text-white"
      >
        {/* Private Estates Logo */}
        <div className="mb-6 flex justify-center">
          <Logo
            variant="private-estates"
            size="lg"
            className="opacity-90 brightness-0 invert"
          />
        </div>

        {/* Headline */}
        <h1 className="mb-4 animate-fade-in font-serif text-4xl font-bold md:text-5xl lg:text-6xl">
          {t('hero.headline')}
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-8 max-w-2xl animate-slide-up font-sans text-lg font-light text-gray-200 md:text-xl">
          {t('hero.subheadline')}
        </p>

        {/* Dual CTAs */}
        <div className="mb-12 flex animate-slide-up flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="#private-estates">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {t('hero.cta.primary')}
            </Button>
          </Link>

          <Link href="/contacto">
            <Button
              variant="outline"
              size="md"
              className="border-white text-white hover:bg-white hover:text-black"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {t('hero.cta.contact')}
            </Button>
          </Link>
        </div>
      </Container>

      {/* Scroll Indicator - Positioned at bottom */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/50">
          <div className="mt-2 h-2 w-1.5 rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}
