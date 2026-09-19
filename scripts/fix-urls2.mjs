import fs from 'fs';

const files = [
  'index.html',
  'src/pages/HomePage.tsx',
  'src/pages/RegionPage.tsx',
  'src/pages/ImoveisIndexPage.tsx',
  'src/pages/PropertyPage.tsx',
  'src/components/PortalListingsCarousel.tsx',
  'src/data/regionProperties.ts',
  'public/llms.txt',
  'src/pages/BlogListPage.tsx',
  'src/pages/BlogPostPage.tsx',
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let c = fs.readFileSync(file, 'utf8');
  let orig = c;
  // Fix external ZAP first (most specific)
  c = c.replaceAll('https://www.zapcorretora de imóveis.com.br/corretora de imóveis/', 'https://www.zapimoveis.com.br/imovel/');
  c = c.replaceAll('https://www.zapcorretora de imóveis.com.br', 'https://www.zapimoveis.com.br');
  c = c.replaceAll('zapcorretora de imóveis', 'zapimoveis');
  // Fix internal routes - any occurrence of /corretora de imóveis (with slash, space) -> /imoveis
  c = c.replaceAll('/corretora de imóveis', '/imoveis');
  // Also handle without leading slash but with quotes: "corretora de imóveis" as URL path without slash? Already handled
  // Fix standalone path "/corretora de imóveis" already done
  if (c !== orig) {
    fs.writeFileSync(file, c, 'utf8');
    console.log(file + ' fixed');
  }
}
console.log('done2');
