# Copy Risk Classification — Ultra Premium Locales

Types: COMMERCIAL_COPY | UI_MICROCOPY | FORM_LABEL | FORM_CONSENT | LEGAL_TEXT | LEGAL_DISCLAIMER | SEO_METADATA

Risk levels: LOW | MEDIUM | HIGH | CRITICAL

---

| key | type | legalRisk | sourceLocale | localesMissing | action |
|-----|------|-----------|--------------|----------------|--------|
| hero.title | COMMERCIAL_COPY | LOW | es | none | Translated — all 11 locales |
| hero.tagline | COMMERCIAL_COPY | LOW | es | none | Kept as brand name — not translated |
| philosophy.trophy.description | COMMERCIAL_COPY | LOW | es | none | Translated — intent over literal |
| philosophy.dataLab.description | COMMERCIAL_COPY | LOW | es | none | Translated — brand name preserved |
| philosophy.legal.title | COMMERCIAL_COPY | MEDIUM | es | none | "Legal & Wealth" kept in EN as brand term — LEGAL_REVIEW_REQUIRED |
| philosophy.legal.description | COMMERCIAL_COPY | MEDIUM | es | none | Translated conservatively — LEGAL_REVIEW_REQUIRED |
| properties.description | COMMERCIAL_COPY | LOW | es | none | Translated — no added claims |
| investment.title | COMMERCIAL_COPY | LOW | es | none | Translated — factual market statement preserved |
| investment.description | COMMERCIAL_COPY | MEDIUM | es | none | Contains regulatory reference — translated conservatively |
| footer.disclaimer | LEGAL_DISCLAIMER | HIGH | es | none | Translated — meaning preserved — LEGAL_REVIEW_REQUIRED |
| footer.legalNotice | LEGAL_TEXT | HIGH | es | none | Navigation label — LEGAL_REVIEW_REQUIRED |
| footer.terms | LEGAL_TEXT | HIGH | es | none | Navigation label — LEGAL_REVIEW_REQUIRED |
| footer.privacy | LEGAL_TEXT | HIGH | es | none | Navigation label — LEGAL_REVIEW_REQUIRED |
| footer.cookies | LEGAL_TEXT | MEDIUM | es | none | Navigation label — LEGAL_REVIEW_REQUIRED |
| footer.ethics | LEGAL_TEXT | MEDIUM | es | none | Navigation label — LEGAL_REVIEW_REQUIRED |
| contact.form.privacy | FORM_CONSENT | CRITICAL | es | none | Consent checkbox copy — LEGAL_REVIEW_REQUIRED |
| contact.form.privacyRequired | FORM_CONSENT | CRITICAL | es | none | Consent error message — LEGAL_REVIEW_REQUIRED |
| contact.form.newsletter | FORM_CONSENT | HIGH | es | none | Newsletter consent — LEGAL_REVIEW_REQUIRED |
| contact.form.success | UI_MICROCOPY | LOW | es | none | Translated — no legal claims |
| contact.form.error | UI_MICROCOPY | LOW | es | none | Translated — error message |
| cookie.title | LEGAL_TEXT | HIGH | es | none | Cookie banner heading — LEGAL_REVIEW_REQUIRED |
| cookie.description | LEGAL_TEXT | HIGH | es | none | Cookie policy intro — LEGAL_REVIEW_REQUIRED |
| cookie.acceptAll | UI_MICROCOPY | MEDIUM | es | none | Consent action — LEGAL_REVIEW_REQUIRED |
| cookie.rejectAll | UI_MICROCOPY | MEDIUM | es | none | Consent action — LEGAL_REVIEW_REQUIRED |
| cookie.savePreferences | UI_MICROCOPY | MEDIUM | es | none | Consent action — LEGAL_REVIEW_REQUIRED |
| cookie.necessary.description | LEGAL_TEXT | HIGH | es | none | Describes non-disableable cookies — LEGAL_REVIEW_REQUIRED |
| cookie.analytics.description | LEGAL_TEXT | HIGH | es | none | Names Google Analytics — LEGAL_REVIEW_REQUIRED |
| cookie.marketing.description | LEGAL_TEXT | HIGH | es | none | Names Meta Pixel — LEGAL_REVIEW_REQUIRED |
| nav.* | UI_MICROCOPY | LOW | es | none | Standard navigation — translated |
| search.* | UI_MICROCOPY | LOW | es | none | Search widget labels — translated |
| valuation.form.* | FORM_LABEL | LOW | es | none | Form field labels — translated |
| insights.newsletter.description | COMMERCIAL_COPY | LOW | es | none | Marketing copy — no claims added |
| languageToggle.* | UI_MICROCOPY | LOW | es | none | Preferences modal labels — translated |
| menuOverlay.privateAreaDescription | COMMERCIAL_COPY | LOW | es | none | Portal access copy — translated |
| aboutSection.description | COMMERCIAL_COPY | LOW | es | none | About section — translated without added claims |

---

## Legal Pages (INLINE — not classified per key)

| page | type | legalRisk | action |
|------|------|-----------|--------|
| PrivacyPage.tsx | LEGAL_TEXT | CRITICAL | INLINE — NOT MODIFIED — LEGAL_REVIEW_REQUIRED before i18n |
| CookiesPage.tsx | LEGAL_TEXT | CRITICAL | INLINE — NOT MODIFIED — LEGAL_REVIEW_REQUIRED before i18n |
| TermsPage.tsx | LEGAL_TEXT | CRITICAL | INLINE — NOT MODIFIED — LEGAL_REVIEW_REQUIRED before i18n |
| DisclaimerPage.tsx | LEGAL_DISCLAIMER | HIGH | INLINE — NOT MODIFIED — LEGAL_REVIEW_REQUIRED before i18n |
| EthicsPage.tsx | LEGAL_TEXT | HIGH | INLINE — NOT MODIFIED — LEGAL_REVIEW_REQUIRED before i18n |
