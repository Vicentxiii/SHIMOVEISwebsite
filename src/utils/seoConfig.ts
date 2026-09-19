/**
 * Configuração central de SEO e GEO
 * Site: Silvia Helena corretora de imóveis
 * Foco: Butantã, Taboão da Serra, Morumbi, São Paulo
 */

export const SITE_CONFIG = {
  // ALTERAR para domínio real em produção
  siteUrl: 'https://silviahelenacorretora.com.br',
  siteName: 'Silvia Helena corretora de imóveis',
  // fallback se env var definida
  getSiteUrl(): string {
    // Vite expõe import.meta.env
    // @ts-ignore
    const envUrl = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SITE_URL : undefined;
    return envUrl || this.siteUrl;
  },
  locale: 'pt_BR',
  language: 'pt-BR',
  author: 'Silvia Helena - CRECISP 125743',
  email: 'silvia.vic2018@gmail.com',
  phone: '+55 11 94084-0966',
  address: {
    streetAddress: 'Rua Alfredo Mendes da Silva, 395',
    addressLocality: 'São Paulo',
    addressRegion: 'SP',
    postalCode: '05525-030',
    addressCountry: 'BR',
  },
  // Regiões prioritárias para SEO/GEO
  regions: ['Butantã', 'Taboão da Serra', 'Morumbi'] as const,
  // Coordenadas aproximadas (centro de cada região) para JSON-LD
  regionCoords: {
    'Butantã': { lat: -23.573, lng: -46.722 },
    'Taboão da Serra': { lat: -23.62, lng: -46.791 },
    'Morumbi': { lat: -23.6, lng: -46.705 },
  } as Record<string, { lat: number; lng: number }>,
  social: {
    instagram: 'https://www.instagram.com/vicenteczar.dev/',
  },
  defaultOgImage: '/og-image.webp', // será gerado no public ou usar logo
};

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  keywords?: string;
  noindex?: boolean;
}

export const SEO_TEMPLATES = {
  home: {
    title: 'Silvia Helena | Corretora de Imóveis no Butantã, Morumbi e Taboão da Serra - CRECISP 125743',
    description: 'Encontre casas e apartamentos para comprar, vender ou alugar no Butantã, Morumbi e Taboão da Serra com quem entende da região. Fale com a corretora Silvia Helena.',
  },
  butanta: {
    title: 'Imóveis à venda no Butantã, SP | Apartamentos e Casas para Comprar e Alugar | Silvia Helena - CRECISP 125743',
    description: 'Encontre apartamentos, casas e coberturas para comprar e alugar no Butantã, São Paulo. Assessoria exclusiva da corretora Silvia Helena - CRECISP 125743. Agende visita.',
  },
  taboao: {
    title: 'Imóveis à venda em Taboão da Serra, SP | Casas e Apartamentos para Comprar e Alugar | Silvia Helena - CRECISP 125743',
    description: 'Encontre casas, apartamentos e terrenos para comprar, vender ou alugar em Taboão da Serra, SP, com o melhor custo-benefício da Grande SP. Fale com a corretora Silvia Helena - CRECISP 125743.',
  },
  morumbi: {
    title: 'Imóveis de Luxo à venda no Morumbi, SP | Casas e Apartamentos | Silvia Helena - CRECISP 125743',
    description: 'Encontre imóveis de alto padrão para comprar e alugar no Morumbi, São Paulo. Mansões, apartamentos de luxo e coberturas com consultoria premium da corretora Silvia Helena - CRECISP 125743.',
  },
};

export function buildCanonical(path: string): string {
  const base = SITE_CONFIG.getSiteUrl().replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
