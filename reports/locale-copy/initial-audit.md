# Initial Audit — Ultra Premium Locale Copy

**Date:** 2026-05-28  
**Branch:** feat/ultra-premium-app-missing-locales-copy  
**Base branch:** feat/global-preferences-toggle-governance

---

## 1. i18n System Detected

- **Framework:** i18next + react-i18next (lazy-loading pattern)
- **Entry file:** `src/i18n/index.ts`
- **Locale toggle:** `src/lib/ancloraLanguageToggle.ts`
- **Locale directory:** `src/i18n/locales/`

### Before this task

**Active locales:** `es`, `en`, `de`  
**Type alias:** `ActiveAncloraLocale = 'es' | 'en' | 'de'`  
**ACTIVE_LOCALES array:** `['es', 'en', 'de']`  
**ULTRA_PREMIUM_LOCALES:** already defined as all 11 but not yet active

### JSON files present before task

| File    | Status   |
|---------|----------|
| es.json | Present  |
| en.json | Present  |
| de.json | Present  |
| ca.json | MISSING  |
| sv.json | MISSING  |
| fr.json | MISSING  |
| it.json | MISSING  |
| da.json | MISSING  |
| nl.json | MISSING  |
| no.json | MISSING  |
| pt.json | MISSING  |

---

## 2. Key Structure (200 flat keys per locale)

Top-level sections detected in ES:
- `nav` — Navigation labels
- `hero` — Hero section
- `search` — Property search widget
- `philosophy` — Investment philosophy (3 pillars)
- `properties` — Featured properties section
- `investment` — Investment thesis section
- `neighborhood` — Neighborhood spotlight
- `valuation` — Valuation service + form
- `insights` — Market insights + newsletter
- `contact` — Contact info + form
- `aboutSection` — About section (3 pillars)
- `menuOverlay` — Full-screen nav overlay
- `footer` — Footer with legal links + disclaimer
- `language` — Language names (partial list)
- `languageToggle` — Language/preferences modal
- `social` — Social media labels
- `scroll` — Scroll controls
- `newsletter` — Newsletter widget
- `cookie` — Cookie consent banner (UI copy) ⚠️ LEGAL_REVIEW_REQUIRED

---

## 3. CookieBanner Analysis

- **File:** `src/components/CookieBanner.tsx`
- **Status:** Uses `useTranslation()` — all text is i18n-driven via `cookie.*` keys
- **Assessment:** Cookie consent copy is in JSON (translatable). All `cookie.*` keys are flagged as LEGAL_REVIEW_REQUIRED in the quality report.

---

## 4. Legal Pages — INLINE TEXT DETECTED

The following legal pages contain **fully inline text** (not using i18n):

| Page | File | Status |
|------|------|--------|
| Privacy Policy | `src/pages/legal/PrivacyPage.tsx` | INLINE — LEGAL_REVIEW_REQUIRED |
| Cookies Policy | `src/pages/legal/CookiesPage.tsx` | INLINE — LEGAL_REVIEW_REQUIRED |
| Terms of Use | `src/pages/legal/TermsPage.tsx` | INLINE — LEGAL_REVIEW_REQUIRED |
| Disclaimer | `src/pages/legal/DisclaimerPage.tsx` | INLINE — LEGAL_REVIEW_REQUIRED |
| Ethics Code | `src/pages/legal/EthicsPage.tsx` | INLINE — LEGAL_REVIEW_REQUIRED |

**Treatment applied:** Per task rules, inline legal text was NOT moved to JSON or modified. Pages remain in English (hardcoded inline). Full i18n of legal pages is documented as a separate future task.

---

## 5. Bóveda Access

```
Bóveda not accessible from this environment.
```

---

## 6. Risk Assessment

| Risk | Severity | Notes |
|------|----------|-------|
| Legal pages in English only | HIGH | 5 pages with inline legal text — not i18n'd |
| Cookie consent copy translated but not legally reviewed | MEDIUM | Functional, needs legal sign-off per locale |
| `language.*` key only lists 4 languages (es/en/fr/de) | LOW | Cosmetic — does not affect functionality |
| `footer.disclaimer` is a legal/institutional statement | MEDIUM | Translated conservatively, needs legal review |
