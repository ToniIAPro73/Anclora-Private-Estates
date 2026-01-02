const fs = require('fs');
const files = [
  'data/sample-properties.ts',
  'data/sample-blog-posts.ts',
  'data/location-guides.ts',
  'data/site-structure.ts'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  console.log(`Processing ${file}...`);
  let content = fs.readFileSync(file, 'utf8');
  
  // Handle various formats of Translation objects
  // Matching { es: '...', en: '...' } or { es: "...", en: "..." } or { es: `...`, en: `...` }
  content = content.replace(/{\s*es:\s*(['"`])(.*?)\1,\s*en:\s*(['"`])(.*?)\3,?\s*}/gs, (match, quoteEs, valEs, quoteEn, valEn) => {
    return `{
    es: ${quoteEs}${valEs}${quoteEs},
    en: ${quoteEn}${valEn}${quoteEn},
    de: ${quoteEn}${valEn}${quoteEn}
  }`;
  });

  fs.writeFileSync(file, content);
});
