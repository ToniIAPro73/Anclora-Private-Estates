import React from 'react';
import { Header, Footer } from '@/components/layout';
import {
  Hero,
  ProblemOpportunity,
  PrivateEstates,
  CognitiveSolutions,
  SocialProof,
  FeaturedProperties,
  FinalCTA,
} from '@/components/home';

/**
 * Homepage
 * 
 * Main landing page with 7 sections:
 * 1. Hero (video background, dual CTAs)
 * 2. Problem/Opportunity (investor vs agent)
 * 3. Private Estates (B2C services)
 * 4. Cognitive Solutions (B2B AI services)
 * 5. Social Proof (partner logos)
 * 6. Featured Properties (6 properties)
 * 7. Final CTA (dual CTAs)
 */
export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await params;
  
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProblemOpportunity />
        <PrivateEstates />
        <CognitiveSolutions />
        <SocialProof />
        <FeaturedProperties />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
