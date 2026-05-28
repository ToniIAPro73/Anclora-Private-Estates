import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function getLocale(locale) {
  const source = read(`src/i18n/locales/${locale}.json`);
  return JSON.parse(source);
}

test('navbar menu overlay switched to hierarchical list layout without cards', () => {
  const navbarSource = read('src/components/Navbar.tsx');

  assert.match(navbarSource, /premium-menu-row/);
  assert.match(navbarSource, /premium-menu-subheader/);
  assert.doesNotMatch(navbarSource, /premium-private-card/);
  assert.match(navbarSource, /setActiveMenuGroup/);
});

test('menu overlay config defines investment and private submenus', () => {
  const configSource = read('src/components/menuOverlayConfig.ts');

  assert.match(configSource, /id: 'invest'/);
  assert.match(configSource, /id: 'private'/);
  assert.match(configSource, /openPartnerPortal/);
  assert.match(configSource, /openDataLabPortal/);
  assert.doesNotMatch(configSource, /id: 'discover'/);
});

test('private area access resolves partner and data lab URLs with language support and legacy nexus base env', () => {
  const accessSource = read('src/lib/privateAreaAccess.ts');

  assert.match(accessSource, /getPartnerPortalUrl/);
  assert.match(accessSource, /getDataLabPortalUrl/);
  assert.match(accessSource, /VITE_NEXUS_URL/);
  assert.match(accessSource, /searchParams\.set\('lang', normalized\)/);
});

test('all active locales contain required menu overlay keys', () => {
  for (const locale of ['es', 'en', 'de']) {
    const data = getLocale(locale);
    const menu = data.menuOverlay ?? {};

    assert.ok(menu.menuWord, `${locale}: menuOverlay.menuWord missing`);
    assert.ok(menu.back, `${locale}: menuOverlay.back missing`);
    assert.ok(menu.brand, `${locale}: menuOverlay.brand missing`);
    assert.ok(menu.groups?.invest, `${locale}: menuOverlay.groups.invest missing`);
    assert.ok(menu.links?.valuation, `${locale}: menuOverlay.links.valuation missing`);
    assert.ok(menu.links?.contact, `${locale}: menuOverlay.links.contact missing`);
  }
});

test('language toggle governance uses Ultra Premium modal catalog — all 11 locales active', () => {
  const source = read('src/lib/ancloraLanguageToggle.ts');
  const toggleSource = read('src/components/LanguageToggle.tsx');
  const navbarSource = read('src/components/Navbar.tsx');

  // ULTRA_PREMIUM_LOCALES definition must be present
  assert.match(source, /ULTRA_PREMIUM_LOCALES/);
  // All 11 Ultra Premium locales must be declared in the correct order
  assert.match(source, /'es',\s*'ca',\s*'de',\s*'en',\s*'sv',\s*'fr',\s*'it',\s*'da',\s*'nl',\s*'no',\s*'pt'/);
  // ACTIVE_LOCALES must now include all 11 Ultra Premium locales (feat/ultra-premium-app-missing-locales-copy)
  assert.match(source, /ACTIVE_LOCALES.*'es'.*'ca'.*'de'.*'en'.*'sv'.*'fr'.*'it'.*'da'.*'nl'.*'no'.*'pt'/s);
  assert.match(toggleSource, /role="dialog"/);
  assert.match(toggleSource, /pendingLabel/);
  assert.doesNotMatch(navbarSource, /className="lang-switcher"/);
});
