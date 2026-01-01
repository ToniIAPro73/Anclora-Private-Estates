'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/ui';
import { Container } from './Container';
import { mainNavigation } from '@/data';
import { useTranslation, useLanguageToggle } from '@/hooks/useTranslation';

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <Container size="xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo variant="private-estates" size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {mainNavigation.map((item) => (
              <div key={item.href} className="relative group">
                {item.children ? (
                  <>
                    <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-anclora-gold transition-colors">
                      {tr(item.label)}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-beige hover:text-anclora-gold transition-colors"
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
                    className="text-sm font-medium text-gray-700 hover:text-anclora-gold transition-colors"
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
              className="text-sm font-medium text-gray-700 hover:text-anclora-gold transition-colors"
            >
              {currentLanguage === 'es' ? 'EN' : 'ES'}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-700 hover:text-anclora-gold"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {mainNavigation.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-beige hover:text-anclora-gold transition-colors rounded-md"
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
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-beige hover:text-anclora-gold transition-colors rounded-md"
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
