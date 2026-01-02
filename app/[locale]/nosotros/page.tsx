'use client';

import React from 'react';
import { Award, Target, Heart, Sparkles } from 'lucide-react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { OptimizedImage } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * About Page
 */
export default function AboutPage() {
  const { t } = useTranslation();

  const values = [
    {
      icon: Award,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description'),
    },
    {
      icon: Heart,
      title: t('about.values.integrity.title'),
      description: t('about.values.integrity.description'),
    },
    {
      icon: Target,
      title: t('about.values.results.title'),
      description: t('about.values.results.description'),
    },
    {
      icon: Sparkles,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
    },
  ];

  const milestones = [
    { year: '2020', event: t('about.milestones.m1.event') },
    { year: '2021', event: t('about.milestones.m2.event') },
    { year: '2022', event: t('about.milestones.m3.event') },
    { year: '2023', event: t('about.milestones.m4.event') },
    { year: '2024', event: t('about.milestones.m5.event') },
  ];

  const team = [
    {
      name: 'Antonio García',
      role: t('about.team.member1.role'),
      bio: t('about.team.member1.bio'),
      image: '/assets/images/placeholders/property-placeholder.svg',
    },
    {
      name: 'María Sánchez',
      role: t('about.team.member2.role'),
      bio: t('about.team.member2.bio'),
      image: '/assets/images/placeholders/property-placeholder.svg',
    },
    {
      name: 'Javier Ruiz',
      role: t('about.team.member3.role'),
      bio: t('about.team.member3.bio'),
      image: '/assets/images/placeholders/property-placeholder.svg',
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="dark" padding="xl">
          <Container size="lg" className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('about.subtitle')}
            </p>
          </Container>
        </Section>

        {/* Story */}
        <Section background="white" padding="xl">
          <Container size="xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                  {t('about.story.title')}
                </h2>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>{t('about.story.p1')}</p>
                  <p>{t('about.story.p2')}</p>
                  <p>{t('about.story.p3')}</p>
                </div>
              </div>

              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <OptimizedImage
                  src="/assets/images/placeholders/hero-placeholder.svg"
                  alt="Anclora Office Mallorca"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  objectFit="cover"
                />
              </div>
            </div>
          </Container>
        </Section>

        {/* Philosophy */}
        <Section background="beige" padding="lg">
          <Container size="md" className="text-center">
            <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
              {t('about.philosophy.title')}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              {t('about.philosophy.content')}
            </p>
          </Container>
        </Section>

        {/* Values */}
        <Section background="white" padding="xl">
          <Container size="xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                {t('about.values.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-anclora-gold/10 flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-anclora-gold" />
                    </div>
                    
                    <h3 className="font-serif text-xl font-semibold text-gray-dark mb-3">
                      {value.title}
                    </h3>
                    
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* Timeline */}
        <Section background="gradient" padding="lg">
          <Container size="lg">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                {t('about.milestones.title')}
              </h2>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-anclora-gold/30 hidden md:block" />

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative">
                    <div className={`flex items-center gap-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}>
                      {/* Content */}
                      <div className={`flex-1 ${
                        index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                      }`}>
                        <div className="bg-white rounded-lg shadow-md p-6 inline-block">
                          <div className="text-2xl font-bold text-anclora-gold mb-2">
                            {milestone.year}
                          </div>
                          <div className="text-gray-700">
                            {milestone.event}
                          </div>
                        </div>
                      </div>

                      {/* Dot */}
                      <div className="hidden md:block w-4 h-4 rounded-full bg-anclora-gold border-4 border-white shadow-lg z-10" />

                      {/* Spacer */}
                      <div className="flex-1 hidden md:block" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Team */}
        <Section background="white" padding="xl">
          <Container size="xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                {t('about.team.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('about.team.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative h-80 rounded-lg overflow-hidden mb-6 shadow-md group-hover:shadow-xl transition-shadow">
                    <OptimizedImage
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      objectFit="cover"
                      className="grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  
                  <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-2">
                    {member.name}
                  </h3>
                  
                  <p className="text-anclora-gold font-medium mb-3">
                    {member.role}
                  </p>
                  
                  <p className="text-gray-600">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section background="dark" padding="lg">
          <Container size="md" className="text-center">
            <h2 className="font-serif text-4xl font-bold mb-6">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {t('about.cta.subtitle')}
            </p>
            <a
              href="/contacto"
              className="inline-block px-8 py-4 bg-anclora-gold text-white font-semibold rounded-md hover:bg-anclora-gold-dark transition-colors"
            >
              {t('about.cta.button')}
            </a>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
