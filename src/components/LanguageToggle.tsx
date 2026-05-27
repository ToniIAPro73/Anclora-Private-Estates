import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ACTIVE_LOCALES,
  ANCLORA_LOCALE_LABELS,
  ULTRA_PREMIUM_LOCALES,
  type ActiveAncloraLocale,
} from '../lib/ancloraLanguageToggle';

type LanguageToggleProps = {
  currentLanguage: string;
  onLanguageChange: (language: ActiveAncloraLocale) => void;
  compact?: boolean;
};

export function LanguageToggle({ currentLanguage, onLanguageChange, compact = false }: LanguageToggleProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const currentCode = ACTIVE_LOCALES.find((locale) => currentLanguage.toLowerCase().startsWith(locale)) ?? 'es';
  const currentLang = ANCLORA_LOCALE_LABELS[currentCode];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLanguageChange = (code: ActiveAncloraLocale) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div ref={panelRef} className="language-toggle-governance">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`language-toggle-trigger ${isOpen ? 'is-open' : ''} ${compact ? 'is-compact' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={t('languageToggle.groupLabel')}
      >
        <Globe className="w-4 h-4" aria-hidden />
        <span className="language-toggle-trigger__text">
          <strong>{currentLang.short}</strong>
          {!compact && <span>{currentLang.nativeName}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {isOpen && (
        <div className="language-toggle-panel" role="dialog" aria-label={t('languageToggle.groupLabel')}>
          <div className="language-toggle-panel__header">
            <div>
              <p>{t('languageToggle.eyebrow')}</p>
              <h2>{t('languageToggle.title')}</h2>
            </div>
            <button type="button" className="language-toggle-close" onClick={() => setIsOpen(false)} aria-label={t('languageToggle.closeLabel')}>
              <X className="w-4 h-4" aria-hidden />
            </button>
          </div>

          <div className="language-toggle-list" role="listbox" aria-label="Idiomas disponibles">
            {ULTRA_PREMIUM_LOCALES.map((code) => {
              const lang = ANCLORA_LOCALE_LABELS[code];
              const isActive = currentCode === code;
              const isEnabled = ACTIVE_LOCALES.includes(code as ActiveAncloraLocale);

              return (
            <button
              key={code}
              type="button"
              onClick={() => isEnabled && handleLanguageChange(code as ActiveAncloraLocale)}
              className={`language-toggle-option ${isActive ? 'is-active' : ''}`}
              disabled={!isEnabled}
              role="option"
              aria-selected={isActive}
            >
              <span className="language-toggle-option__short">{lang.short}</span>
              <span className="language-toggle-option__label">
                <strong>{lang.nativeName}</strong>
                <small>{lang.englishName}</small>
              </span>
              {!isEnabled && <span className="language-toggle-option__pending">{t('languageToggle.pendingLabel')}</span>}
              {isActive && <Check className="language-toggle-option__check" aria-hidden />}
            </button>
              );
            })}
          </div>

          <button type="button" className="language-toggle-save" onClick={() => setIsOpen(false)}>
            {t('languageToggle.saveLabel')}
          </button>
        </div>
      )}
    </div>
  );
}
