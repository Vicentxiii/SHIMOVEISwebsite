/**
 * Google Analytics 4 para Vite/React
 * Carrega gtag.js dinamicamente usando VITE_GA_MEASUREMENT_ID
 * Placeholder: G-XXXXXXXXXX — substitua no .env ou Vercel Env Vars
 */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID as string | undefined;

// Se placeholder ou vazio, não carrega — evita erro no build/dev
const isValidId = (id?: string) => !!id && id !== 'G-XXXXXXXXXX' && /^G-[A-Z0-9]+$/.test(id);

export const GoogleAnalytics: React.FC = () => {
  const location = useLocation();

  // Carrega script gtag.js apenas uma vez
  useEffect(() => {
    if (!isValidId(GA_MEASUREMENT_ID)) {
      if ((import.meta as any).env?.DEV) {
        console.info('[GA4] Placeholder VITE_GA_MEASUREMENT_ID não configurado (G-XXXXXXXXXX). Configure em .env ou Vercel.');
      }
      return;
    }

    // Evita duplicar script
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
      return;
    }

    // Inicializa dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // page_view manual abaixo (SPA)
    });

    // Injeta script gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

  }, []);

  // Envia page_view a cada mudança de rota (SPA)
  useEffect(() => {
    if (!isValidId(GA_MEASUREMENT_ID) || !window.gtag) return;
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);

  return null;
};
