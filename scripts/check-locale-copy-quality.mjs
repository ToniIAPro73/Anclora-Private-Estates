/**
 * Anclora Locale Copy Quality Checker
 * Detects forbidden literalisms and flags legal copy for review.
 *
 * Usage: node scripts/check-locale-copy-quality.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.resolve(__dirname, '../src/i18n/locales');
const REPORTS_DIR = path.resolve(__dirname, '../reports/locale-copy');

// Forbidden literalism patterns
const FORBIDDEN_PATTERNS = [
  { pattern: /Damos la bienvenida/i, label: 'LITERALISM_ES: "Damos la bienvenida"' },
  { pattern: /siéntete libre de/i, label: 'LITERALISM_ES: "siéntete libre de"' },
  { pattern: /no dudes en/i, label: 'LITERALISM_ES: "no dudes en"' },
  { pattern: /propiedades únicas/i, label: 'LITERALISM_ES: "propiedades únicas"' },
  { pattern: /Wir begr[üu][ßs]en/i, label: 'LITERALISM_DE: "Wir begrüßen"' },
  { pattern: /f[üu]hlen Sie sich frei/i, label: 'LITERALISM_DE: "fühlen Sie sich frei"' },
  { pattern: /z[öo]gern Sie nicht/i, label: 'LITERALISM_DE: "zögern Sie nicht"' },
  { pattern: /unique properties/i, label: 'LITERALISM_EN: "unique properties"' },
  { pattern: /feel free to/i, label: 'LITERALISM_EN: "feel free to"' },
  { pattern: /do not hesitate/i, label: 'LITERALISM_EN: "do not hesitate"' },
];

// Legal keyword patterns
const LEGAL_KEY_PATTERNS = [
  /privacy/i,
  /cookie/i,
  /terms/i,
  /legal/i,
  /consent/i,
  /gdpr/i,
  /rgpd/i,
  /datenschutz/i,
  /privacidad/i,
  /confidentialit/i,
];

function flattenKeys(obj, prefix = '') {
  const result = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      result.push({ key: fullKey, value });
    } else if (typeof value === 'object' && value !== null) {
      result.push(...flattenKeys(value, fullKey));
    }
  }
  return result;
}

function isLegalKey(key) {
  return LEGAL_KEY_PATTERNS.some((p) => p.test(key));
}

function checkFile(filePath, locale) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw);
  const pairs = flattenKeys(json);

  const forbidden = [];
  const legalKeys = [];

  for (const { key, value } of pairs) {
    for (const { pattern, label } of FORBIDDEN_PATTERNS) {
      if (pattern.test(value)) {
        forbidden.push({ key, value, label });
      }
    }
    if (isLegalKey(key)) {
      legalKeys.push({ key, value });
    }
  }

  return { locale, forbidden, legalKeys, totalKeys: pairs.length };
}

function generateReport(results) {
  const lines = [
    '# Locale Copy Quality Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '---',
    '',
  ];

  let totalForbidden = 0;
  let totalLegal = 0;

  for (const { locale, forbidden, legalKeys, totalKeys } of results) {
    lines.push(`## ${locale.toUpperCase()} (${totalKeys} keys)`);
    lines.push('');

    if (forbidden.length === 0) {
      lines.push('**Forbidden patterns:** None detected.');
    } else {
      lines.push(`**Forbidden patterns detected: ${forbidden.length}**`);
      lines.push('');
      for (const { key, value, label } of forbidden) {
        lines.push(`- \`${key}\`: [${label}] — \`${value}\``);
      }
      totalForbidden += forbidden.length;
    }

    lines.push('');

    if (legalKeys.length > 0) {
      lines.push(`**Legal/consent keys (LEGAL_REVIEW_REQUIRED): ${legalKeys.length}**`);
      lines.push('');
      for (const { key, value } of legalKeys) {
        const preview = value.length > 80 ? value.slice(0, 77) + '...' : value;
        lines.push(`- \`${key}\`: \`${preview}\` — ⚠️ LEGAL_REVIEW_REQUIRED`);
      }
      totalLegal += legalKeys.length;
    } else {
      lines.push('**Legal/consent keys:** None.');
    }

    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('## Summary');
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Locales checked | ${results.length} |`);
  lines.push(`| Total forbidden patterns found | ${totalForbidden} |`);
  lines.push(`| Total legal/consent keys flagged | ${totalLegal} |`);
  lines.push('');

  if (totalForbidden === 0) {
    lines.push('**Result: PASS — No forbidden literalisms detected.**');
  } else {
    lines.push(`**Result: FAIL — ${totalForbidden} forbidden pattern(s) require review.**`);
  }

  lines.push('');
  lines.push('> Legal/consent keys are flagged for human review. They are not errors but require verification by a qualified reviewer before publishing in each locale.');
  lines.push('');

  return lines.join('\n');
}

// Main
const localeFiles = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json'));
const results = [];

console.log(`\nAnclora Locale Copy Quality Checker`);
console.log(`Scanning ${localeFiles.length} locale file(s) in ${LOCALES_DIR}\n`);

for (const file of localeFiles) {
  const locale = path.basename(file, '.json');
  const filePath = path.join(LOCALES_DIR, file);
  const result = checkFile(filePath, locale);
  results.push(result);

  const status = result.forbidden.length === 0 ? '✓ PASS' : `✗ FAIL (${result.forbidden.length} forbidden)`;
  const legalNote = result.legalKeys.length > 0 ? ` | ${result.legalKeys.length} legal keys flagged` : '';
  console.log(`  ${locale.padEnd(4)} — ${result.totalKeys} keys — ${status}${legalNote}`);
}

// Sort by locale order
const LOCALE_ORDER = ['es', 'ca', 'de', 'en', 'sv', 'fr', 'it', 'da', 'nl', 'no', 'pt'];
results.sort((a, b) => {
  const ai = LOCALE_ORDER.indexOf(a.locale);
  const bi = LOCALE_ORDER.indexOf(b.locale);
  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
});

const report = generateReport(results);
const reportPath = path.join(REPORTS_DIR, 'copy-quality-report.md');

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(reportPath, report, 'utf-8');

const totalForbidden = results.reduce((sum, r) => sum + r.forbidden.length, 0);
const totalLegal = results.reduce((sum, r) => sum + r.legalKeys.length, 0);

console.log(`\nReport saved to: ${reportPath}`);
console.log(`Forbidden patterns: ${totalForbidden}`);
console.log(`Legal keys flagged: ${totalLegal}`);

if (totalForbidden > 0) {
  console.error('\nCopy quality check FAILED. Review the report above.');
  process.exit(1);
} else {
  console.log('\nCopy quality check PASSED.');
  process.exit(0);
}
