'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/assets/images/placeholders/hero-placeholder.svg"
        >
          <source src="/assets/videos/hero-background.mp4" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <Container size="lg" className="relative z-10 text-center text-white">
        {/* Nexus Group Logo */}
        <div className="mb-8 flex justify-center">
          <Logo 
            variant="nexus-group" 
            size="lg" 
            className="brightness-0 invert opacity-90"
          />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
          {t('hero.headline')}
        </h1>

        {/* Subheadline */}
        <p className="font-sans text-xl md:text-2xl font-light mb-12 max-w-3xl mx-auto text-gray-200 animate-slide-up">
          {t('hero.subheadline')}
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
          <Link href="#private-estates">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t('hero.cta.primary')}
            </Button>
          </Link>

          <Link href="#cognitive-solutions">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t('hero.cta.secondary')}
            </Button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1.5 h-2 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </Container>
    </section>
  );
}
