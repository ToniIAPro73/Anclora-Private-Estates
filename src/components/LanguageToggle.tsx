import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe, X } from 'lucide-react';
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
  const [currency, setCurrency] = useState(() => window.localStorage.getItem('anclora-pe-currency') || 'EUR');
  const [unit, setUnit] = useState(() => window.localStorage.getItem('anclora-pe-unit') || 'metric');

  const unitLabel = unit === 'imperial' ? 'Sqft' : currentCode === 'en' ? 'Sqm' : 'm²';

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
  };

  const handleCurrencyChange = (nextCurrency: string) => {
    setCurrency(nextCurrency);
    window.localStorage.setItem('anclora-pe-currency', nextCurrency);
  };

  const handleUnitChange = (nextUnit: string) => {
    setUnit(nextUnit);
    window.localStorage.setItem('anclora-pe-unit', nextUnit);
  };

  return (
    <div ref={panelRef} className="language-toggle-governance">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`language-toggle-trigger ${isOpen ? 'is-open' : ''} ${compact ? 'is-compact' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={t('languageToggle.preferencesLabel')}
      >
        <Globe className="w-4 h-4" aria-hidden />
        <span className="language-toggle-trigger__text">
          <strong>{currentLang.nativeName}</strong>
          {!compact && <span>{currency} · {unitLabel}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {isOpen && (
        <div className="language-toggle-panel" role="dialog" aria-label={t('languageToggle.preferencesDialogLabel')}>
          <div className="language-toggle-panel__header">
            <div>
              <p>{t('languageToggle.eyebrow')}</p>
              <h2>{t('languageToggle.settingsTitle')}</h2>
            </div>
            <button type="button" className="language-toggle-close" onClick={() => setIsOpen(false)} aria-label={t('languageToggle.closeLabel')}>
              <X className="w-4 h-4" aria-hidden />
            </button>
          </div>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-anclora-gold">
            {t('languageToggle.languageLabel')}
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-anclora-teal-bg px-3 py-2 text-sm normal-case tracking-normal text-white"
              value={currentCode}
              onChange={(event) => handleLanguageChange(event.target.value as ActiveAncloraLocale)}
            >
            {ULTRA_PREMIUM_LOCALES.map((code) => {
              const lang = ANCLORA_LOCALE_LABELS[code];
              const isEnabled = ACTIVE_LOCALES.includes(code as ActiveAncloraLocale);

              return (
            <option
              key={code}
              disabled={!isEnabled}
              value={code}
            >
              {lang.nativeName} - {lang.englishName}{isEnabled ? '' : ` - ${t('languageToggle.pendingLabel')}`}
            </option>
              );
            })}
            </select>
          </label>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-anclora-gold">
            {t('languageToggle.currencyLabel')}
            <select className="mt-2 w-full rounded-xl border border-white/10 bg-anclora-teal-bg px-3 py-2 text-sm normal-case tracking-normal text-white" value={currency} onChange={(event) => handleCurrencyChange(event.target.value)}>
              <option value="EUR">{t('languageToggle.currency.eur')}</option>
              <option value="USD">{t('languageToggle.currency.usd')}</option>
              <option value="GBP">{t('languageToggle.currency.gbp')}</option>
              <option value="CHF">{t('languageToggle.currency.chf')}</option>
              <option value="SEK">{t('languageToggle.currency.sek')}</option>
              <option value="DKK">{t('languageToggle.currency.dkk')}</option>
              <option value="NOK">{t('languageToggle.currency.nok')}</option>
            </select>
          </label>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-anclora-gold">
            {t('languageToggle.unitsLabel')}
            <select className="mt-2 w-full rounded-xl border border-white/10 bg-anclora-teal-bg px-3 py-2 text-sm normal-case tracking-normal text-white" value={unit} onChange={(event) => handleUnitChange(event.target.value)}>
              <option value="metric">{t('languageToggle.units.metric')}</option>
              <option value="imperial">{t('languageToggle.units.imperial')}</option>
            </select>
          </label>

          <button type="button" className="language-toggle-save" onClick={() => setIsOpen(false)}>
            {t('languageToggle.saveLabel')}
          </button>
        </div>
      )}
    </div>
  );
}
