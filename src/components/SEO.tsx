/**
 * Componente SEO dinâmico para SPA Vite
 * Gerencia <title>, meta description, canonical, Open Graph, Twitter Cards
 * Essential para SEO e GEO (ChatGPT, Perplexity, etc. leem meta tags + JSON-LD)
 */
import React, { useEffect } from 'react';
import { SITE_CONFIG, buildCanonical, SEOProps } from '../utils/seoConfig';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  keywords,
  noindex = false,
}) => {
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : SITE_CONFIG.getSiteUrl());
  const imageUrl = ogImage
    ? ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.getSiteUrl()}${ogImage}`
    : `${SITE_CONFIG.getSiteUrl()}/og-image.jpg`;

  useEffect(() => {
    // Title
    document.title = title;

    // Helper to create/update meta tags
    const setMeta = (selector: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${selector}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, selector);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Basic SEO
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setMeta('author', SITE_CONFIG.author);
    
    // Canonical
    setLink('canonical', canonicalUrl);

    // Open Graph
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', imageUrl, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:type', ogType, 'property');
    setMeta('og:locale', SITE_CONFIG.locale, 'property');
    setMeta('og:site_name', SITE_CONFIG.siteName, 'property');

    // Twitter Cards
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', imageUrl);
    setMeta('twitter:creator', '@silviahelena');

    // Geo tags para São Paulo
    setMeta('geo.region', 'BR-SP');
    setMeta('geo.placename', 'São Paulo');
    setMeta('geo.position', '-23.5505;-46.6333');
    setMeta('ICBM', '-23.5505, -46.6333');

    // Bing Webmaster Tools verification (presente em todas as páginas)
    setMeta('msvalidate.01', 'B742D63ED49FCC56F5CA669EC8F962D6');

  }, [title, description, canonicalUrl, imageUrl, ogType, keywords, noindex]);

  return null;
};

/**
 * Injeta JSON-LD no head (para crawlers e IAs)
 */
export const JsonLd: React.FC<{ data: object | object[] }> = ({ data }) => {
  useEffect(() => {
    const id = `jsonld-${JSON.stringify(data).slice(0, 20).replace(/\W/g, '')}`;
    // Remove previous
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(Array.isArray(data) ? data : [data].length ? data : data);
    // Se data for array, precisa envolver? Não, cada objeto já é JSON-LD separado — injetamos cada um
    if (Array.isArray(data)) {
      // For arrays, create multiple scripts
      data.forEach((item, idx) => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.id = `${id}-${idx}`;
        s.textContent = JSON.stringify(item);
        document.head.appendChild(s);
      });
      return () => {
        data.forEach((_, idx) => document.getElementById(`${id}-${idx}`)?.remove());
      };
    } else {
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      return () => {
        document.getElementById(id)?.remove();
      };
    }
  }, [data]);

  return null;
};

// Helper dedicado para múltiplos JSON-LD
export const JsonLdArray: React.FC<{ items: object[] }> = ({ items }) => {
  useEffect(() => {
    const ids: string[] = [];
    items.forEach((item, idx) => {
      const id = `jsonld-array-${idx}-${(item as any)['@type'] || 'data'}`;
      // remove old
      document.getElementById(id)?.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
      ids.push(id);
    });
    return () => {
      ids.forEach(id => document.getElementById(id)?.remove());
    };
  }, [items]);
  return null;
};
