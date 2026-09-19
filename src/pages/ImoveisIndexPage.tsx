import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Header } from '../components/Header';
import { FavoritesDrawer } from '../components/FavoritesDrawer';
import { REGIONS } from '../data/regions';
import { REGION_PROPERTIES } from '../data/regionProperties';
import { buildCanonical } from '../utils/seoConfig';
import { slugify } from '../utils/slugify';
import logoSrc from '../assets/images/logo_transparente.png';
import { MapPin, ShieldCheck, Home } from 'lucide-react';
import { useState } from 'react';

export const ImoveisIndexPage: React.FC = () => {
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Imóveis à venda em São Paulo - Butantã, Morumbi, Taboão da Serra',
    itemListElement: Object.values(REGIONS).map((r, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: buildCanonical(`/imoveis/${r.slug}`),
      name: `Imóveis em ${r.name}`,
    })),
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-light">
      <SEO
        title="Imóveis à venda em São Paulo | Butantã, Morumbi e Taboão da Serra | Silvia Helena"
        description="Todos os imóveis para comprar, vender e alugar em São Paulo. Explore casas e apartamentos no Butantã, Morumbi e Taboão da Serra com Silvia Helena, CRECISP 125743."
        canonical={buildCanonical('/imoveis')}
        keywords="imóveis São Paulo, imóveis Butantã, imóveis Morumbi, imóveis Taboão da Serra, comprar apartamento São Paulo"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <Header onOpenFavorites={() => setIsFavoritesOpen(true)} activeSection="estates" />
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} onSelectProperty={() => {}} />

      <section className="pt-28 pb-12 bg-gradient-to-b from-[#210c14] to-brand-bg border-b border-brand-light/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Breadcrumbs items={[{ name: 'Imóveis', url: '/imoveis' }]} />
          <h1 className="font-serif text-4xl md:text-5xl text-brand-light font-light mt-6">Imóveis à venda, para alugar e para comprar em São Paulo</h1>
          <p className="text-sm text-brand-muted mt-4 max-w-3xl leading-relaxed">
            Navegue por região e encontre o imóvel ideal no <strong className="text-brand-light">Butantã, Morumbi e Taboão da Serra</strong>. Temos intermediação completa para <strong className="text-brand-light">comprar, vender e alugar</strong> casas, apartamentos e coberturas com assessoria premium da Silvia Helena.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-8">
        {Object.values(REGIONS).map(region => (
          <Link key={region.slug} to={`/imoveis/${region.slug}`} className="group border border-brand-light/10 hover:border-brand-gold/40 rounded-2xl overflow-hidden bg-brand-bg/40 hover:shadow-[0_0_20px_rgba(197,160,89,0.15)] transition-all">
            <div className="h-48 bg-gradient-to-br from-brand-gold/20 to-[#210c14] flex items-center justify-center">
              <MapPin size={32} className="text-brand-gold group-hover:scale-110 transition-transform" aria-hidden="true" />
            </div>
            <div className="p-6 space-y-3">
              <h2 className="font-serif text-xl text-brand-light group-hover:text-brand-gold transition-colors">Imóveis em {region.name}</h2>
              <p className="text-xs text-brand-muted line-clamp-3 leading-relaxed">{region.metaDescription}</p>
              <span className="inline-flex items-center gap-1 text-[11px] tracking-widest uppercase text-brand-gold">Ver imóveis em {region.name} →</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="py-12 bg-[#1a080f] border-t border-brand-light/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-serif text-2xl text-brand-light font-light mb-6">Últimos imóveis adicionados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {REGION_PROPERTIES.slice(0, 6).map(prop => (
              <Link key={prop.id} to={`/imoveis/${slugify(prop.location.split(',')[0])}/${slugify(prop.title)}-${prop.id}`} className="group border border-brand-light/10 hover:border-brand-gold/30 rounded-xl overflow-hidden bg-brand-bg flex flex-col">
                <img src={prop.image} alt={`${prop.title} à venda em ${prop.location} - ${prop.bedrooms} quartos ${prop.area}`} className="h-48 w-full object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" width={400} height={300} />
                <div className="p-4 space-y-1 flex-1">
                  <p className="text-[10px] tracking-widest uppercase text-brand-muted flex items-center gap-1"><MapPin size={10} className="text-brand-gold" aria-hidden="true" />{prop.location}</p>
                  <h3 className="font-serif text-base text-brand-light group-hover:text-brand-gold">{prop.title}</h3>
                  <p className="font-serif text-brand-gold">{prop.formattedPrice} • {prop.area}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#13040a] border-t border-brand-light/5 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-6 text-xs text-brand-muted">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Silvia Helena" className="h-8 w-auto" width={60} height={30} loading="lazy" />
            <span>Silvia Helena Imóveis • CRECISP 125743</span>
          </div>
          <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-brand-gold" aria-hidden="true" /><span>Butantã • Taboão da Serra • Morumbi</span></div>
        </div>
      </footer>
    </div>
  );
};
