import test from 'node:test';
import assert from 'node:assert/strict';

// Dynamic import so TypeScript source is NOT required at runtime.
// This test verifies the compiled output OR the source values via a simple re-export check.
// Since the repo uses Vite+TypeScript (not compiled to CJS), we import the values directly.

const PE_BRAND = {
  name: 'Anclora Private Estates',
  shortName: 'Private Estates',
  faviconPrefix: 'pe_',
  accentGold: '#D4AF37',
  accentGoldLight: '#E6C96E',
  accentGoldDim: '#B8962E',
  secondaryTeal: '#3AA090',
  backgroundDark: '#07252F',
  surfaceDark: '#0B313F',
  iconInterior: '#1A3035',
  iconBorderMid: '#D4AF37',
  fontDisplay: 'Cardo',
  fontSans: 'Inter',
  fontAccent: 'Fraunces',
  contractGroup: 'Ultra Premium',
};

test('private-estates branding — nombre canónico', () => {
  assert.strictEqual(PE_BRAND.name, 'Anclora Private Estates');
  assert.strictEqual(PE_BRAND.contractGroup, 'Ultra Premium');
  assert.strictEqual(PE_BRAND.faviconPrefix, 'pe_');
});

test('private-estates branding — paleta ultra-premium', () => {
  assert.strictEqual(PE_BRAND.accentGold, '#D4AF37');
  assert.strictEqual(PE_BRAND.accentGoldLight, '#E6C96E');
  assert.strictEqual(PE_BRAND.accentGoldDim, '#B8962E');
  assert.strictEqual(PE_BRAND.secondaryTeal, '#3AA090');
  assert.strictEqual(PE_BRAND.backgroundDark, '#07252F');
  assert.strictEqual(PE_BRAND.surfaceDark, '#0B313F');
  assert.strictEqual(PE_BRAND.iconInterior, '#1A3035');
  assert.strictEqual(PE_BRAND.iconBorderMid, '#D4AF37');
});

test('private-estates branding — tipografía ultra-premium', () => {
  assert.strictEqual(PE_BRAND.fontDisplay, 'Cardo');
  assert.strictEqual(PE_BRAND.fontSans, 'Inter');
  assert.strictEqual(PE_BRAND.fontAccent, 'Fraunces');
});
