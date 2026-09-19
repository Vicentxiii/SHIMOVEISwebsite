import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blog';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Header } from '../components/Header';
import { FavoritesDrawer } from '../components/FavoritesDrawer';
import { buildCanonical, SITE_CONFIG } from '../utils/seoConfig';
import { Clock, Calendar, User, Share2, MessageSquare, Home as HomeIcon, ShieldCheck, ArrowRight, ListTree } from 'lucide-react';
import logoSrc from '../assets/images/logo_transparente.webp';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const [isFavoritesOpen, setIsFavoritesOpen] = React.useState(false);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const canonical = buildCanonical(`/blog/${post.slug}`);

  const regionMap: Record<string, { label: string; path: string }> = {
    butanta: { label: 'Ver opções com corretora no Butantã', path: '/imoveis/butanta' },
    'taboao-da-serra': { label: 'Ver opções com corretora em Taboão da Serra', path: '/imoveis/taboao-da-serra' },
    morumbi: { label: 'Ver opções com corretora no Morumbi', path: '/imoveis/morumbi' },
    geral: { label: 'Ver opções com corretora em São Paulo', path: '/imoveis' },
  };
  const cta = post.region ? regionMap[post.region] ?? regionMap.geral : regionMap.geral;

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: post.image,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: 'Corretora de imóveis',
      identifier: 'CRECI 125743',
      url: SITE_CONFIG.getSiteUrl(),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.siteName,
      logo: { '@type': 'ImageObject', url: `${SITE_CONFIG.getSiteUrl()}/favicon.webp` },
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_CONFIG.getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: buildCanonical('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
    ],
  };

  const whatsappText = encodeURIComponent(`Olá Silvia, li seu artigo "${post.title}" e gostaria de falar com a corretora sobre um imóvel. Pode me ajudar?`);
  const whatsappHref = `https://wa.me/5511940840966?text=${whatsappText}`;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-light">
      <SEO
        title={post.metaTitle}
        description={post.metaDescription}
        canonical={canonical}
        keywords={post.tags.join(', ')}
        ogImage={post.image}
        ogType="article"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Header onOpenFavorites={() => setIsFavoritesOpen(true)} activeSection="" />
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} onSelectProperty={() => {}} />

      <article className="pt-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <Breadcrumbs items={[{ name: 'Blog', url: '/blog' }, { name: post.title, url: `/blog/${post.slug}` }]} />
        </div>

        {/* Header do artigo */}
        <header className="max-w-4xl mx-auto px-6 md:px-12 pt-6 pb-8">
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] tracking-[0.25em] uppercase px-3 py-1">
            {post.category}
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-brand-light font-light leading-tight mt-4">
            {post.title}
          </h1>
          <p className="text-base md:text-lg text-brand-muted font-light leading-relaxed mt-4 max-w-3xl">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-brand-muted border-y border-brand-light/10 py-4">
            <span className="inline-flex items-center gap-1.5"><User size={12} className="text-brand-gold" aria-hidden="true" /> {post.author} • Corretora de imóveis CRECI 125743</span>
            <span className="inline-flex items-center gap-1.5"><Calendar size={12} className="text-brand-gold" aria-hidden="true" /> {new Date(post.datePublished).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={12} className="text-brand-gold" aria-hidden="true" /> {post.readingTime} min de leitura</span>
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: post.title, url: canonical });
                else navigator.clipboard.writeText(canonical);
              }}
              className="ml-auto inline-flex items-center gap-1.5 text-brand-gold hover:text-brand-light transition-colors cursor-pointer"
              aria-label="Compartilhar este artigo"
            >
              <Share2 size={12} aria-hidden="true" /> Compartilhar
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 md:px-12 pb-4">
          <img
            src={post.image}
            alt={post.imageAlt}
            className="w-full aspect-[16/9] object-cover rounded-2xl border border-brand-light/5"
            width={1200}
            height={675}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Sumário clicável */}
        {post.sections.length > 2 && (
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-6">
            <nav aria-labelledby="toc-heading" className="border border-brand-gold/20 bg-brand-gold/[0.03] rounded-2xl p-6">
              <h2 id="toc-heading" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-brand-gold font-light">
                <ListTree size={12} aria-hidden="true" /> Neste artigo
              </h2>
              <ol className="mt-4 space-y-2">
                {post.sections.map((sec) => (
                  <li key={sec.id}>
                    <a href={`#${sec.id}`} className="text-sm text-brand-muted hover:text-brand-gold transition-colors underline-offset-4 hover:underline">
                      {sec.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}

        {/* Conteúdo */}
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-8">
          <div className="space-y-12">
            {post.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-28">
                <h2 className="font-serif text-2xl md:text-3xl text-brand-light font-light leading-tight mb-4">
                  {sec.title}
                </h2>
                <div
                  className="prose prose-invert max-w-none prose-p:text-[15px] prose-p:leading-7 prose-p:font-light prose-p:text-brand-muted prose-p:tracking-wide prose-li:text-[15px] prose-li:leading-7 prose-li:text-brand-muted prose-strong:text-brand-light prose-strong:font-medium prose-ul:list-disc prose-ul:ml-5 prose-ol:list-decimal prose-ol:ml-5 prose-a:text-brand-gold prose-a:underline-offset-4 hover:prose-a:text-brand-light"
                  dangerouslySetInnerHTML={{ __html: sec.content }}
                />
              </section>
            ))}
          </div>

          {/* Autor */}
          <div className="mt-12 border border-brand-light/10 rounded-2xl p-6 bg-[#1a080f] flex gap-4">
            <img src={logoSrc} alt="Silvia Helena" className="h-12 w-12 rounded-full border border-brand-gold/20 object-contain p-1 bg-brand-bg" width={48} height={48} loading="lazy" />
            <div>
              <p className="font-serif text-brand-light">Silvia Helena — Corretora de imóveis • CRECI 125743</p>
              <p className="text-sm text-brand-muted font-light leading-relaxed mt-1">Há 15 anos entre Butantã, Morumbi e Taboão da Serra. Já ajudei 300+ famílias a comprar, vender e alugar com calma — da visita à chave. Falo direto com você, sem equipe.</p>
            </div>
          </div>

          {/* CTAs finais */}
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            <Link
              to={cta.path}
              className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg px-6 py-4 text-xs uppercase tracking-[0.2em] font-light rounded-xl transition-colors text-center"
              aria-label={cta.label}
            >
              <HomeIcon size={14} aria-hidden="true" /> {cta.label}
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-brand-gold/30 hover:border-brand-gold bg-brand-gold/5 hover:bg-brand-gold/10 text-brand-gold px-6 py-4 text-xs uppercase tracking-[0.2em] font-light rounded-xl transition-colors text-center"
              aria-label="Falar com a corretora no WhatsApp"
            >
              <MessageSquare size={14} aria-hidden="true" /> Falar com a corretora no WhatsApp
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-brand-light/[0.04] border border-brand-light/5 text-brand-muted text-[11px] tracking-widest uppercase px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Navegação entre artigos */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 border-t border-brand-light/5 flex justify-between gap-4">
          <Link to="/blog" className="text-sm text-brand-gold hover:text-brand-light hover:underline underline-offset-4">
            ← Voltar para o Blog
          </Link>
          <Link to="/imoveis" className="text-sm text-brand-muted hover:text-brand-light">
            Ver imóveis →
          </Link>
        </div>
      </article>

      <footer className="bg-[#13040a] border-t border-brand-light/5 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-6 text-xs text-brand-muted">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Silvia Helena corretora de imóveis" className="h-8 w-auto" width={60} height={30} loading="lazy" />
            <span>Silvia Helena, corretora de imóveis • CRECI 125743</span>
          </div>
          <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-brand-gold" aria-hidden="true" /><span>Blog • Butantã • Taboão • Morumbi</span></div>
        </div>
      </footer>
    </div>
  );
};
