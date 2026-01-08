'use client';

import React from 'react';
import { Linkedin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Logo } from '@/components/ui';
import { Container } from './Container';
import { footerNavigation, socialLinks } from '@/data';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from '@/i18n/navigation';

const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
};

/**
 * Footer Component
 *
 * Site footer with navigation, contact info, and compliance
 */
export function Footer() {
  const { tr, t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <Container size="xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Logo
              variant="private-estates"
              size="md"
              className="mb-4 brightness-0 invert"
            />
            <p className="mb-6 text-sm text-gray-400">
              {t('footer.description')}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors hover:text-anclora-gold"
                    aria-label={tr(social.label)}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 font-semibold">
              {tr(footerNavigation.company.title)}
            </h3>
            <ul className="space-y-2">
              {footerNavigation.company.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-anclora-gold"
                  >
                    {tr(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="mb-4 font-semibold">
              {tr(footerNavigation.services.title)}
            </h3>
            <ul className="space-y-2">
              {footerNavigation.services.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-anclora-gold"
                  >
                    {tr(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 font-semibold">
              {tr(footerNavigation.legal.title)}
            </h3>
            <ul className="space-y-2">
              {footerNavigation.legal.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-anclora-gold"
                  >
                    {tr(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-400 md:flex-row">
            <p>{t('footer.copyright', { year: currentYear })}</p>
            <p className="text-xs opacity-70">{t('footer.brokeredBy')}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
