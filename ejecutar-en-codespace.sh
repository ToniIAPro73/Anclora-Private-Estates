#!/bin/bash

# ============================================================================
# MIGRACIÓN COMPLETA - ELIMINACIÓN COGNITIVE SOLUTIONS
# Para ejecutar en GitHub Codespace
# Rama: feat/codeespace_anclora_private
# ============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

clear

echo -e "${BLUE}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     MIGRACIÓN ELIMINACIÓN COGNITIVE SOLUTIONS                  ║
║     Anclora Private Estates                                    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Verificar prerrequisitos
echo "🔍 Verificando entorno..."
echo ""

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERROR: No se encontró package.json${NC}"
    echo "   Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
echo -e "📍 Rama actual: ${YELLOW}$CURRENT_BRANCH${NC}"

if [ "$CURRENT_BRANCH" != "feat/codeespace_anclora_private" ]; then
    echo -e "${RED}⚠️  ADVERTENCIA: No estás en la rama correcta${NC}"
    echo -e "   Rama actual: $CURRENT_BRANCH"
    echo -e "   Rama esperada: feat/codeespace_anclora_private"
    echo ""
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelado"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Entorno verificado${NC}"
echo ""

# Crear backup
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR=".migration-backup-$TIMESTAMP"

echo "============================================================================"
echo "PASO 1/7: Crear backup completo"
echo "============================================================================"
echo ""

mkdir -p "$BACKUP_DIR"

# Archivos a respaldar
FILES=(
    "components/home/Hero.tsx"
    "components/home/ProblemOpportunity.tsx"
    "components/home/index.ts"
    "components/home/CognitiveSolutions.tsx"
    "components/ui/Logo.tsx"
    "lib/config.ts"
    "app/[locale]/page.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        mkdir -p "$BACKUP_DIR/$(dirname $file)"
        cp "$file" "$BACKUP_DIR/$file"
        echo -e "  ${GREEN}✓${NC} $file"
    fi
done

echo ""
echo -e "${GREEN}✅ Backup creado en: $BACKUP_DIR${NC}"
echo ""

# Paso 2: Eliminar componente
echo "============================================================================"
echo "PASO 2/7: Eliminar CognitiveSolutions.tsx"
echo "============================================================================"
echo ""

if [ -f "components/home/CognitiveSolutions.tsx" ]; then
    rm "components/home/CognitiveSolutions.tsx"
    echo -e "${GREEN}✅ Eliminado: components/home/CognitiveSolutions.tsx${NC}"
else
    echo -e "${YELLOW}ℹ️  Ya eliminado (no existe)${NC}"
fi

echo ""

# Paso 3: Hero.tsx
echo "============================================================================"
echo "PASO 3/7: Actualizar Hero.tsx"
echo "============================================================================"
echo ""

cat > components/home/Hero.tsx << 'EOFHERO'
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
 * Hero section with video background, Nexus Group logo, and primary CTA
 * ACTUALIZADO: Eliminado CTA secundario a Cognitive Solutions
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

        {/* CTAs - Enfoque único en Private Estates */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
          <Link href="/propiedades">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t('hero.cta.primary')}
            </Button>
          </Link>

          <Link href="/contacto">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black"
              rightIcon={<Phone className="w-5 h-5" />}
            >
              {t('hero.cta.contact')}
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
EOFHERO

echo -e "${GREEN}✅ Hero.tsx actualizado${NC}"
echo ""

# Paso 4: ProblemOpportunity.tsx
echo "============================================================================"
echo "PASO 4/7: Actualizar ProblemOpportunity.tsx"
echo "============================================================================"
echo ""

cat > components/home/ProblemOpportunity.tsx << 'EOFPROBLEM'
'use client';

import React from 'react';
import { TrendingUp, BarChart, Target, Shield, Clock } from 'lucide-react';
import { Section } from '@/components/layout';
import { useTranslation } from '@/hooks/useTranslation';

const investorChallenges = [
  { icon: TrendingUp, key: 'investor.challenge1' },
  { icon: BarChart, key: 'investor.challenge2' },
  { icon: Target, key: 'investor.challenge3' },
];

const sellerChallenges = [
  { icon: Shield, key: 'seller.challenge1' },
  { icon: Target, key: 'seller.challenge2' },
  { icon: Clock, key: 'seller.challenge3' },
];

/**
 * ProblemOpportunity Component - Homepage
 * 
 * Two-column section showing investor needs vs seller needs
 * ACTUALIZADO: Reorientado de "agents" a "sellers"
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

        {/* Seller Column */}
        <div className="space-y-6">
          <div className="inline-block px-4 py-2 bg-anclora-gold text-white text-sm font-semibold rounded-full mb-4">
            {t('problemOpportunity.seller.badge')}
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-dark mb-6">
            {t('problemOpportunity.seller.headline')}
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {t('problemOpportunity.seller.description')}
          </p>

          <div className="space-y-4">
            {sellerChallenges.map((challenge, index) => {
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
      </div>
    </Section>
  );
}
EOFPROBLEM

echo -e "${GREEN}✅ ProblemOpportunity.tsx actualizado${NC}"
echo ""

# Paso 5: index.ts
echo "============================================================================"
echo "PASO 5/7: Actualizar index.ts"
echo "============================================================================"
echo ""

cat > components/home/index.ts << 'EOFINDEX'
/**
 * HOME COMPONENTS INDEX
 * 
 * ACTUALIZADO: Eliminada exportación de CognitiveSolutions
 */

export * from './Hero';
export * from './ProblemOpportunity';
export * from './PrivateEstates';
export * from './SocialProof';
export * from './FeaturedProperties';
export * from './FinalCTA';
EOFINDEX

echo -e "${GREEN}✅ index.ts actualizado${NC}"
echo ""

# Paso 6: page.tsx
echo "============================================================================"
echo "PASO 6/7: Actualizar page.tsx"
echo "============================================================================"
echo ""

cat > app/[locale]/page.tsx << 'EOFPAGE'
import React from 'react';
import { Header, Footer } from '@/components/layout';
import {
  Hero,
  ProblemOpportunity,
  PrivateEstates,
  SocialProof,
  FeaturedProperties,
  FinalCTA,
} from '@/components/home';

/**
 * Homepage - Anclora Private Estates
 * 
 * ACTUALIZADO: Eliminada sección Cognitive Solutions
 * Enfoque 100% B2C servicios inmobiliarios de lujo
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
        <SocialProof />
        <FeaturedProperties />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
EOFPAGE

echo -e "${GREEN}✅ page.tsx actualizado${NC}"
echo ""

# Paso 7: Resumen
echo "============================================================================"
echo "PASO 7/7: Resumen de cambios"
echo "============================================================================"
echo ""

echo -e "${GREEN}✅ CAMBIOS AUTOMÁTICOS COMPLETADOS${NC}"
echo ""
echo "Archivos modificados:"
echo "  ✅ components/home/Hero.tsx"
echo "  ✅ components/home/ProblemOpportunity.tsx"
echo "  ✅ components/home/index.ts"
echo "  ✅ app/[locale]/page.tsx"
echo "  ❌ components/home/CognitiveSolutions.tsx (eliminado)"
echo ""

echo -e "${YELLOW}⚠️  PENDIENTES (actualización manual):${NC}"
echo ""
echo "1. components/ui/Logo.tsx"
echo "   Eliminar variant 'cognitive-solutions'"
echo ""
echo "2. lib/config.ts"
echo "   Eliminar cognitiveSolutionsConfig"
echo ""
echo "3. Traducciones (locales/*/translation.json)"
echo "   - Eliminar sección 'cognitiveSolutions'"
echo "   - Cambiar 'hero.cta.secondary' → 'hero.cta.contact'"
echo "   - Cambiar 'problemOpportunity.agent' → 'problemOpportunity.seller'"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}PRÓXIMOS PASOS:${NC}"
echo ""
echo "1. Revisar cambios:"
echo "   git status"
echo "   git diff"
echo ""
echo "2. Actualizar archivos manualmente (ver arriba)"
echo ""
echo "3. Testing:"
echo "   npm run dev"
echo ""
echo "4. Commit:"
echo "   git add ."
echo "   git commit -m 'feat: Remove Cognitive Solutions B2B references'"
echo ""
echo "5. Push:"
echo "   git push origin feat/codeespace_anclora_private"
echo ""
echo "6. Crear PR desde GitHub UI"
echo ""
echo -e "${GREEN}Backup guardado en:${NC} $BACKUP_DIR"
echo ""
echo "Para restaurar backup:"
echo "  cp -r $BACKUP_DIR/* ."
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
