/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEO/GEO Optimized - Rotas amigáveis para ranking em Google, Bing, ChatGPT, Perplexity, Gemini
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { FavoritesProvider } from './components/FavoritesContext';
import { LanguageProvider } from './components/LanguageContext';
import { HomePage } from './pages/HomePage';
import { RegionPage } from './pages/RegionPage';
import { PropertyPage } from './pages/PropertyPage';
import { ImoveisIndexPage } from './pages/ImoveisIndexPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AdminPage } from './pages/AdminPage';
import { GoogleAnalytics } from './components/GoogleAnalytics';

// Scroll to top on route change (SEO UX)
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/imoveis" element={<ImoveisIndexPage />} />
        <Route path="/imoveis/:regiao" element={<RegionPage />} />
        <Route path="/imoveis/:regiao/:slug" element={<PropertyPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Redirects para compatibilidade */}
        <Route path="/butanta" element={<Navigate to="/imoveis/butanta" replace />} />
        <Route path="/morumbi" element={<Navigate to="/imoveis/morumbi" replace />} />
        <Route path="/taboao-da-serra" element={<Navigate to="/imoveis/taboao-da-serra" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <AppRoutes />
          <Analytics />
          <GoogleAnalytics />
        </BrowserRouter>
      </FavoritesProvider>
    </LanguageProvider>
  );
}
