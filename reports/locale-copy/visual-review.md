# Visual Review Report — Ultra Premium Locale Copy

**Date:** 2026-05-28  
**Method:** Static analysis (no live server — WSL2 environment)

---

## Environment Limitations

This visual review was performed via static analysis only. A live browser rendering session was not possible in this environment. The following observations are based on file inspection, key length analysis, and copy content review.

---

## Static Analysis Observations

### 1. Text Length Fit

The following locales may produce longer strings than ES in certain UI contexts:

| Locale | Risk area | Observation |
|--------|-----------|-------------|
| DE | nav labels, button labels | German compounds tend to be longer: "Immobilienbewertung", "Anruf vereinbaren" |
| NL | nav labels | Dutch also compounds: "Ejendomme" is shorter, but some labels extend |
| PT | nav, buttons | "Marcar chamada", "Avalie o seu imóvel" — slightly longer than ES equivalents |
| FR | form labels | French form labels may overflow narrow inputs |
| IT | form fields | "Indirizzo e-mail" vs "E-mail" — marginal |

**Recommendation:** Test DE, NL, PT button labels in the mobile nav overlay (max-width breakpoints).

### 2. Character Set

All locales use standard Latin Unicode characters. Specific observations:

| Locale | Characters used | Notes |
|--------|----------------|-------|
| CA | à, è, é, í, ï, ó, ú, ü, ç, ·, l·l | Standard Catalan orthography — well-supported |
| FR | é, è, ê, à, â, ù, û, î, ç, œ | Standard French — well-supported |
| DE | ä, ö, ü, ß | Already in use, existing font support confirmed |
| SV | å, ä, ö | Nordic characters — confirm font coverage |
| DA | å, æ, ø | Nordic characters — confirm font coverage |
| NO | å, æ, ø | Nordic characters — confirm font coverage |
| PT | ã, ç, õ, á, é, í, ó, ú, â, ê, ô | European Portuguese diacritics — confirm |
| IT | à, è, é, ì, ò, ù | Standard Italian — well-supported |
| NL | No special chars beyond common Latin | Clean |

**Font action required:** Confirm that Cardo (display) and Inter (body) cover full Latin Extended character sets for Nordic and Portuguese diacritics.

### 3. RTL / Directionality

All 11 Ultra Premium locales are LTR. No directionality changes required.

### 4. Cookie Banner

- CookieBanner is i18n-driven via `useTranslation()`
- All `cookie.*` keys are now present in all 11 locales
- Visual fit should be tested: `cookie.description` is the longest string and may affect banner height across locales

### 5. Navigation Overlay (MenuOverlay)

- All `menuOverlay.*` keys translated
- DE: "SCHLIESSEN" (8 chars) vs ES: "CERRAR" (6 chars) — minimal impact
- SV: "STÄNG" (5 chars), NO: "LUKK" (4 chars) — shorter, fine

### 6. Valuation & Contact Forms

- All form labels translated
- Placeholder text lengths vary but are contained within `input` elements (overflow is hidden naturally)
- Success/error messages are single-line in all locales

### 7. Footer Disclaimer

The `footer.disclaimer` key contains the longest string in the dataset (~200 chars). All translations preserve similar length. The footer layout uses flex/wrap — no overflow risk.

---

## Recommended Actions

1. Manual browser test: switch to DE, FR, NL in mobile viewport (375px) and check nav/button overflow
2. Confirm font CDN includes Latin Extended coverage for CA, PT, NO, SV, DA
3. Legal review of all LEGAL_REVIEW_REQUIRED keys before enabling locales in production
4. Full legal page i18n is a separate future task — do not deploy multilingual pages until then
