'use client';

import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/ui';
import { Container } from './Container';
import { mainNavigation } from '@/data';
import { useTranslation, useLanguageToggle } from '@/hooks/useTranslation';
import { Link } from '@/i18n/navigation';

/**
 * Header Component
 *
 * Main site header with navigation, logo, and language toggle
 * Responsive with mobile menu
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { tr } = useTranslation();
  const { getToggleUrl, currentLanguage } = useLanguageToggle();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <Container size="xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo variant="private-estates" size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 lg:flex">
            {mainNavigation.map((item) => (
              <div key={item.href} className="group relative">
                {item.children ? (
                  <>
                    <button className="flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-anclora-gold">
                      {tr(item.label)}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {/* Dropdown */}
                    <div className="invisible absolute left-0 mt-2 w-56 rounded-md bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                      <div className="py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="hover:bg-beige block px-4 py-2 text-sm text-gray-700 transition-colors hover:text-anclora-gold"
                          >
                            {tr(child.label)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-700 transition-colors hover:text-anclora-gold"
                  >
                    {tr(item.label)}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right side: Language toggle + Mobile menu button */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <Link
              href={getToggleUrl()}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-anclora-gold"
            >
              {currentLanguage === 'es'
                ? 'EN'
                : currentLanguage === 'en'
                  ? 'DE'
                  : 'ES'}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="p-2 text-gray-700 hover:text-anclora-gold lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 lg:hidden">
            <div className="space-y-2">
              {mainNavigation.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:bg-beige block rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-anclora-gold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {tr(item.label)}
                  </Link>
                  {item.children && (
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="hover:bg-beige block rounded-md px-4 py-2 text-sm text-gray-600 transition-colors hover:text-anclora-gold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {tr(child.label)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
