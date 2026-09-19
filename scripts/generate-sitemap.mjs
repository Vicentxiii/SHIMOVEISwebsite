/**
 * Gera sitemap.xml dinâmico para SEO
 * Inclui: /, /imoveis, /imoveis/butanta, /imoveis/taboao-da-serra, /imoveis/morumbi
 * e todas as páginas individuais de imóveis (REGION_PROPERTIES + PROPERTIES)
 * Uso: node scripts/generate-sitemap.mjs
 * Ideal rodar no build (postbuild) ou via vite plugin.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteUrl = process.env.VITE_SITE_URL || 'https://silviahelenacorretora.com.br';
const today = new Date().toISOString().split('T')[0];

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').replace(/--+/g,'-');
}

// Rotas estáticas — /admin NUNCA entra no sitemap (noindex, privado)
const staticRoutes = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/imoveis', priority: '0.9', changefreq: 'weekly' },
  { loc: '/imoveis/butanta', priority: '0.9', changefreq: 'weekly' },
  { loc: '/imoveis/taboao-da-serra', priority: '0.9', changefreq: 'weekly' },
  { loc: '/imoveis/morumbi', priority: '0.9', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
];
// NOTA: /admin é propositalmente excluído (noindex, Disallow em robots.txt)

// Importar propriedades - replicando dados de regionProperties para geração estática sem TS
// Lista manual para evitar parse de TS; manter sincronizado com src/data/regionProperties.ts
const regionProperties = [
  { id: 'prop-butanta-1', title: 'Apartamento 2 Quartos Jardim no Butantã', location: 'Butantã, São Paulo' },
  { id: 'prop-butanta-2', title: 'Casa 3 Quartos com Quintal no Butantã', location: 'Butantã, São Paulo' },
  { id: 'prop-butanta-3', title: 'Cobertura Linear 3 Suítes Butantã', location: 'Butantã, São Paulo' },
  { id: 'prop-taboao-1', title: 'Casa 3 Quartos Pirajuçara Taboão da Serra', location: 'Pirajuçara, Taboão da Serra' },
  { id: 'prop-taboao-2', title: 'Apartamento 2 Quartos Parque Pinheiros Taboão', location: 'Parque Pinheiros, Taboão da Serra' },
  { id: 'prop-taboao-3', title: 'Sobrado 4 Quartos Jardim Mirna Taboão da Serra', location: 'Jardim Mirna, Taboão da Serra' },
  { id: 'prop-morumbi-1', title: 'Mansão 5 Suítes Morumbi com Piscina e Gourmet', location: 'Morumbi, São Paulo' },
  { id: 'prop-morumbi-2', title: 'Apartamento 3 Suítes Alto Padrão Morumbi', location: 'Morumbi, São Paulo' },
  { id: 'prop-morumbi-3', title: 'Cobertura Duplex Morumbi com Terraço 80m²', location: 'Morumbi, São Paulo' },
  // Propriedades base (propertiesData.ts) - gerar slugs amigáveis também indexadas
  { id: 'prop-1', title: 'Residência Cliffside Obsidian', location: 'Joatinga, Rio de Janeiro', region: 'joatinga' },
  { id: 'prop-2', title: 'Cobertura Skyline Bauhaus', location: 'Itaim Bibi, São Paulo', region: 'itaim-bibi' },
  { id: 'prop-3', title: 'Pavilhão Floresta de Eucaliptos', location: 'Jardim Europa, São Paulo', region: 'jardim-europa' },
  { id: 'prop-4', title: 'Refúgio Areia & Copa das Árvores', location: 'Trancoso, Bahia', region: 'trancoso' },
  { id: 'prop-5', title: 'Pied-à-Terre Minimalista Tsubo', location: 'Jardins, São Paulo', region: 'jardins' },
  { id: 'prop-6', title: 'Reserva Horizonte Frente ao Mar', location: 'Angra dos Reis, Rio de Janeiro', region: 'angra' },
  { id: 'prop-7', title: 'Pavilhão Galeria Brutalista', location: 'Faria Lima, São Paulo', region: 'faria-lima' },
  { id: 'prop-8', title: 'Fazenda Imperial de Café & Hípica', location: 'Campinas Highlands, São Paulo', region: 'campinas' },
];

function getRegionSlugForLocation(location) {
  if (location.includes('Butantã')) return 'butanta';
  if (location.includes('Taboão') || location.includes('Pirajuçara') || location.includes('Parque Pinheiros') || location.includes('Jardim Mirna')) return 'taboao-da-serra';
  if (location.includes('Morumbi')) return 'morumbi';
  // fallback: slugify primeira parte
  return slugify(location.split(',')[0]);
}

const propertyRoutes = regionProperties.map(p => {
  const region = p.region || getRegionSlugForLocation(p.location);
  const slug = `${slugify(p.title)}-${p.id}`;
  return {
    loc: `/imoveis/${region}/${slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: today,
  };
});

// Blog - 5 artigos
const blogPosts = [
  { slug: 'quanto-custa-apartamento-butanta' },
  { slug: 'quanto-custa-alugar-apartamento-taboao-da-serra' },
  { slug: 'quanto-custa-apartamento-alto-padrao-morumbi' },
  { slug: 'butanta-taboao-ou-morumbi-qual-regiao-escolher' },
  { slug: 'documentos-necessarios-comprar-imovel-sao-paulo' },
];

const blogRoutes = blogPosts.map(p => ({
  loc: `/blog/${p.slug}`,
  priority: '0.7',
  changefreq: 'monthly',
  lastmod: today,
}));

// Sanity - tenta buscar imóveis publicados para incluir no sitemap (dinâmico)
// Se falhar (sem rede/credencial), mantém apenas rotas estáticas
let sanityRoutes = [];
try {
  const {createClient} = await import('@sanity/client');
  const sanity = createClient({
    projectId: 'wpe14gsf',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
    perspective: 'published',
  });
  const sanityImoveis = await sanity.fetch(`*[_type == "imovel" && publicado == true]{_id, titulo, regiao, slug, _createdAt}`);
  if (Array.isArray(sanityImoveis) && sanityImoveis.length > 0) {
    sanityRoutes = sanityImoveis.map((doc) => {
      const regiaoSlug = doc.regiao ? slugify(doc.regiao) : 'geral';
      const slug = doc.slug?.current || `${slugify(doc.titulo || 'imovel')}-${doc._id.slice(0,8)}`;
      const lastmod = doc._createdAt ? doc._createdAt.split('T')[0] : today;
      return {
        loc: `/imoveis/${regiaoSlug}/${slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod,
      };
    });
    console.log(`✓ Sanity: ${sanityRoutes.length} imóveis publicados encontrados para sitemap`);
  }
} catch (e) {
  console.warn('[sitemap] Sanity fetch falhou, usando apenas rotas estáticas:', e.message);
}

const allRoutes = [...staticRoutes.map(r => ({ ...r, lastmod: today })), ...propertyRoutes, ...blogRoutes, ...sanityRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${siteUrl}${r.loc}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outPathPublic = path.resolve(__dirname, '../public/sitemap.xml');
const outPathDist = path.resolve(__dirname, '../dist/sitemap.xml');

fs.mkdirSync(path.dirname(outPathPublic), { recursive: true });
fs.writeFileSync(outPathPublic, xml, 'utf8');
console.log(`✓ sitemap.xml gerado em ${outPathPublic} com ${allRoutes.length} URLs`);

// Se dist existir, copia também
if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
  fs.writeFileSync(outPathDist, xml, 'utf8');
  console.log(`✓ sitemap.xml copiado para ${outPathDist}`);
}
