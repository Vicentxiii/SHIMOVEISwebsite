/**
 * Configuração central de SEO e GEO
 * Site: Silvia Helena Imóveis
 * Foco: Butantã, Taboão da Serra, Morumbi, São Paulo
 */

export const SITE_CONFIG = {
  // ALTERAR para domínio real em produção
  siteUrl: 'https://www.silviahelena.com.br',
  siteName: 'Silvia Helena Imóveis',
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
  defaultOgImage: '/og-image.jpg', // será gerado no public ou usar logo
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
    title: 'Imóveis à venda em São Paulo | Comprar, Vender e Alugar no Butantã, Morumbi e Taboão da Serra | Silvia Helena Imóveis',
    description: 'Silvia Helena Imóveis: especialista em comprar, vender e alugar imóveis em São Paulo. Casas, apartamentos e coberturas no Butantã, Morumbi e Taboão da Serra. Atendimento exclusivo CRECI 125743.',
  },
  butanta: {
    title: 'Apartamentos e Casas à venda no Butantã, SP | Comprar e Alugar Imóveis | Silvia Helena',
    description: 'Encontre imóveis para comprar e alugar no Butantã, São Paulo. Apartamentos, casas e coberturas com assessoria exclusiva Silvia Helena. Agende visita e venda seu imóvel com segurança.',
  },
  taboao: {
    title: 'Imóveis à venda em Taboão da Serra, SP | Casas e Apartamentos | Silvia Helena',
    description: 'Imóveis em Taboão da Serra para comprar, vender e alugar. Casas, apartamentos e terrenos com melhor custo-benefício da Grande SP. Fale com Silvia Helena, CRECISP 125743.',
  },
  morumbi: {
    title: 'Imóveis de Luxo à venda no Morumbi, SP | Casas e Apartamentos | Silvia Helena',
    description: 'Imóveis de alto padrão no Morumbi, São Paulo. Mansões, apartamentos de luxo e coberturas para comprar e alugar. Consultoria premium Silvia Helena Imóveis.',
  },
};

export function buildCanonical(path: string): string {
  const base = SITE_CONFIG.getSiteUrl().replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
