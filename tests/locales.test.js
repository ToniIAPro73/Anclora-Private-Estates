/**
 * Locale consistency tests — Anclora Ultra Premium governance
 * Verifies that all 11 Ultra Premium locales are present and consistent.
 *
 * Runner: node --test (Node.js built-in test runner, no extra deps)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.resolve(__dirname, '../src/i18n/locales');

// --- Contract: order matters ---
const ULTRA_PREMIUM_LOCALES = ['es', 'ca', 'de', 'en', 'sv', 'fr', 'it', 'da', 'nl', 'no', 'pt'];
const DEFAULT_LOCALE = 'es';
const SECOND_LOCALE = 'ca';

function loadLocale(locale) {
  const filePath = path.join(LOCALES_DIR, `${locale}.json`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      keys.push(fullKey);
    } else if (typeof value === 'object' && value !== null) {
      keys.push(...flattenKeys(value, fullKey));
    }
  }
  return keys;
}

// --- Tests ---

test('Ultra Premium locale contract — all 11 locales are present as JSON files', () => {
  for (const locale of ULTRA_PREMIUM_LOCALES) {
    const filePath = path.join(LOCALES_DIR, `${locale}.json`);
    assert.ok(
      fs.existsSync(filePath),
      `Missing locale file: ${locale}.json`
    );
  }
});

test('Ultra Premium locale contract — locale order is correct', () => {
  const existingLocales = ULTRA_PREMIUM_LOCALES.filter((locale) =>
    fs.existsSync(path.join(LOCALES_DIR, `${locale}.json`))
  );

  assert.deepStrictEqual(
    existingLocales,
    ULTRA_PREMIUM_LOCALES,
    `Locale order mismatch. Expected: ${ULTRA_PREMIUM_LOCALES.join(', ')}. Got: ${existingLocales.join(', ')}`
  );
});

test('Ultra Premium locale contract — ES is the default locale and loads correctly', () => {
  const esData = loadLocale(DEFAULT_LOCALE);
  assert.ok(typeof esData === 'object', 'ES locale must be a valid JSON object');
  assert.ok(Object.keys(esData).length > 0, 'ES locale must not be empty');
});

test('Ultra Premium locale contract — CA is the second locale in order', () => {
  assert.strictEqual(
    ULTRA_PREMIUM_LOCALES[1],
    SECOND_LOCALE,
    `Second locale must be CA, got ${ULTRA_PREMIUM_LOCALES[1]}`
  );
  const caData = loadLocale(SECOND_LOCALE);
  assert.ok(typeof caData === 'object', 'CA locale must be a valid JSON object');
});

test('Ultra Premium locale contract — all locales have the same keys as ES (no missing keys)', () => {
  const esData = loadLocale(DEFAULT_LOCALE);
  const esKeys = new Set(flattenKeys(esData));

  const missing = {};

  for (const locale of ULTRA_PREMIUM_LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;

    const localeData = loadLocale(locale);
    const localeKeys = new Set(flattenKeys(localeData));

    const missingKeys = [...esKeys].filter((k) => !localeKeys.has(k));
    if (missingKeys.length > 0) {
      missing[locale] = missingKeys;
    }
  }

  const missingEntries = Object.entries(missing);
  if (missingEntries.length > 0) {
    const report = missingEntries
      .map(([locale, keys]) => `${locale}: [${keys.slice(0, 5).join(', ')}${keys.length > 5 ? ` ... +${keys.length - 5} more` : ''}]`)
      .join('\n  ');
    assert.fail(`Missing keys in locales:\n  ${report}`);
  }
});

test('Ultra Premium locale contract — all locale files are valid JSON with non-empty content', () => {
  for (const locale of ULTRA_PREMIUM_LOCALES) {
    const data = loadLocale(locale);
    const keys = flattenKeys(data);
    assert.ok(
      keys.length > 50,
      `Locale ${locale} has fewer than 50 keys (${keys.length}) — likely incomplete`
    );
  }
});

test('Ultra Premium locale contract — no locale has empty string values', () => {
  const emptyValues = {};

  for (const locale of ULTRA_PREMIUM_LOCALES) {
    const data = loadLocale(locale);
    const pairs = flattenKeys(data).map((k) => {
      let val = data;
      for (const part of k.split('.')) val = val[part];
      return { key: k, value: val };
    });

    const empty = pairs.filter(({ value }) => typeof value === 'string' && value.trim() === '');
    if (empty.length > 0) {
      emptyValues[locale] = empty.map(({ key }) => key);
    }
  }

  const entries = Object.entries(emptyValues);
  if (entries.length > 0) {
    const report = entries
      .map(([locale, keys]) => `${locale}: [${keys.join(', ')}]`)
      .join('\n  ');
    assert.fail(`Empty string values found:\n  ${report}`);
  }
});

test('Ultra Premium locale contract — ES locale has expected top-level sections', () => {
  const esData = loadLocale('es');
  const expectedSections = [
    'nav', 'hero', 'search', 'philosophy', 'properties', 'investment',
    'neighborhood', 'valuation', 'insights', 'contact', 'aboutSection',
    'menuOverlay', 'footer', 'languageToggle', 'cookie', 'newsletter',
    'social', 'scroll',
  ];

  for (const section of expectedSections) {
    assert.ok(
      section in esData,
      `ES locale missing expected section: "${section}"`
    );
  }
});
