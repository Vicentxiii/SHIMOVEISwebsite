import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blog';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Header } from '../components/Header';
import { FavoritesDrawer } from '../components/FavoritesDrawer';
import { buildCanonical, SITE_CONFIG } from '../utils/seoConfig';
import { Clock, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import logoSrc from '../assets/images/logo_transparente.webp';

export const BlogListPage: React.FC = () => {
  const [isFavoritesOpen, setIsFavoritesOpen] = React.useState(false);

  const blogListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog da Corretora Silvia Helena — Dicas para comprar, vender e alugar no Butantã, Taboão e Morumbi',
    description: 'Guias práticos da corretora de imóveis Silvia Helena para quem busca comprar, vender ou alugar em São Paulo.',
    url: buildCanonical('/blog'),
    author: { '@type': 'Person', name: 'Silvia Helena', jobTitle: 'Corretora de imóveis', identifier: 'CRECI 125743' },
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: BLOG_POSTS.map((post, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: buildCanonical(`/blog/${post.slug}`),
      name: post.title,
    })),
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-light">
      <SEO
        title="Blog | Corretora de imóveis no Butantã, Taboão e Morumbi | Silvia Helena"
        description="Guias da corretora Silvia Helena para comprar, vender e alugar com tranquilidade no Butantã, Taboão da Serra e Morumbi. Preços 2026, comparativos e checklist de documentos."
        canonical={buildCanonical('/blog')}
        keywords="blog corretora de imóveis, quanto custa apartamento Butantã, alugar Taboão da Serra, Morumbi alto padrão, documentos comprar imóvel"
        ogImage="/og-image.webp"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <Header onOpenFavorites={() => setIsFavoritesOpen(true)} activeSection="" />
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} onSelectProperty={() => {}} />

      <section className="pt-28 pb-12 bg-gradient-to-b from-[#210c14] to-brand-bg border-b border-brand-light/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Breadcrumbs items={[{ name: 'Blog', url: '/blog' }]} />
          <div className="mt-6 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-brand-gold uppercase font-light">
              <BookOpen size={12} aria-hidden="true" /> Blog da corretora
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-brand-light font-light leading-tight">Dicas da corretora para você decidir sem susto</h1>
            <p className="text-sm md:text-base text-brand-muted font-light max-w-3xl leading-relaxed">
              Escrevo direto, sem enrolação — do jeito que explico numa visita. Preços reais de 2026, comparativos honestos entre Butantã, Taboão e Morumbi e checklist de documentos. Para você comprar, vender ou alugar com tranquilidade.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col border border-brand-light/10 hover:border-brand-gold/40 rounded-2xl overflow-hidden bg-brand-bg/40 hover:shadow-[0_0_20px_rgba(197,160,89,0.12)] transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#1a080f]">
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  loading="lazy"
                  width={600}
                  height={375}
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/60 to-transparent opacity-60" aria-hidden="true" />
                <span className="absolute top-4 left-4 bg-brand-bg/90 backdrop-blur-md border border-brand-gold/20 text-brand-gold text-[10px] tracking-[0.2em] uppercase px-3 py-1">
                  {post.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[11px] text-brand-muted tracking-widest uppercase font-light mb-3">
                  <span className="inline-flex items-center gap-1"><Clock size={11} className="text-brand-gold" aria-hidden="true" /> {post.readingTime} min</span>
                  <span>•</span>
                  <span>{new Date(post.datePublished).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <h2 className="font-serif text-xl text-brand-light font-light leading-snug group-hover:text-brand-gold transition-colors line-clamp-3">
                  {post.title}
                </h2>
                <p className="text-sm text-brand-muted font-light leading-relaxed mt-3 line-clamp-3">
                  {post.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-brand-gold group-hover:gap-2 transition-all">
                  Ler artigo <ArrowRight size={12} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 border border-brand-gold/20 bg-brand-gold/[0.02] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg text-brand-light font-light">Quer avaliar, vender ou encontrar o imóvel ideal na Zona Oeste?</h3>
            <p className="text-sm text-brand-muted font-light">Fale direto comigo pelo WhatsApp — atendimento direto com a corretora no Butantã, Taboão da Serra e Morumbi.</p>
          </div>
          <a href="https://wa.me/5511940840966" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg px-6 py-3 text-xs uppercase tracking-[0.2em] font-light transition-colors shrink-0" aria-label="Falar com Silvia Helena no WhatsApp">
            Fale direto no WhatsApp
          </a>
        </div>
      </section>

      <footer className="bg-[#13040a] border-t border-brand-light/5 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-6 text-xs text-brand-muted">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Silvia Helena corretora de imóveis" className="h-8 w-auto" width={60} height={30} loading="lazy" />
            <span>Silvia Helena, corretora de imóveis • CRECI 125743</span>
          </div>
          <Link to="/" className="text-brand-gold hover:underline">Voltar ao início</Link>
        </div>
      </footer>
    </div>
  );
};
