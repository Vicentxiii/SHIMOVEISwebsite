import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { REGIONS } from '../data/regions';
import { getPropertiesByRegion } from '../data/regionProperties';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Header } from '../components/Header';
import { FavoritesDrawer } from '../components/FavoritesDrawer';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyDetailModal } from '../components/PropertyDetailModal';
import { ContactSection } from '../components/ContactSection';
import { FAQSection } from '../components/FAQSection';
import { Property } from '../types';
import { buildCanonical, SITE_CONFIG } from '../utils/seoConfig';
import { slugify } from '../utils/slugify';
import logoSrc from '../assets/images/logo_transparente.png';
import { MapPin, ShieldCheck, Home as HomeIcon } from 'lucide-react';

export const RegionPage: React.FC = () => {
  const { regiao } = useParams<{ regiao: string }>();
  const normalized = regiao?.toLowerCase().replace(/-/g, '') || '';
  // Find region by handling slug variations
  const regionKey = Object.keys(REGIONS).find(k => k.replace(/-/g, '') === normalized || REGIONS[k].name.toLowerCase().replace(/[^a-z]/g, '') === normalized);
  const region = regionKey ? REGIONS[regionKey] : undefined;

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  if (!region) {
    return <Navigate to="/" replace />;
  }

  const regionProperties = getPropertiesByRegion(region.slug);

  // JSON-LD RealEstateAgent + CollectionPage + Breadcrumb
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: region.metaTitle,
    description: region.metaDescription,
    url: buildCanonical(`/imoveis/${region.slug}`),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.siteName,
      url: SITE_CONFIG.getSiteUrl(),
    },
    about: {
      '@type': 'Place',
      name: `${region.name}, São Paulo`,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: region.coords.lat,
        longitude: region.coords.lng,
      },
    },
  };

  // ItemList for GEO
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Imóveis à venda em ${region.name}`,
    itemListElement: regionProperties.map((prop, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: buildCanonical(`/imoveis/${region.slug}/${slugify(prop.title)}-${prop.id}`),
      name: prop.title,
    })),
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-light">
      <SEO
        title={region.metaTitle}
        description={region.metaDescription}
        canonical={buildCanonical(`/imoveis/${region.slug}`)}
        keywords={`${region.keywords.join(', ')}, comprar imóvel ${region.name}, vender imóvel ${region.name}, alugar ${region.name}`}
        ogImage="/favicon.png"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <Header onOpenFavorites={() => setIsFavoritesOpen(true)} activeSection="estates" />
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} onSelectProperty={setSelectedProperty} />

      {/* Hero região */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-[#210c14] to-brand-bg border-b border-brand-light/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Breadcrumbs items={[{ name: 'Imóveis', url: '/imoveis' }, { name: region.name, url: `/imoveis/${region.slug}` }]} />
          <div className="mt-6 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-brand-gold uppercase font-light">
              <MapPin size={12} aria-hidden="true" /> {region.name} • São Paulo • SP
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-brand-light font-light leading-tight">{region.h1}</h1>
            <p className="text-sm md:text-base text-brand-muted font-light max-w-3xl leading-relaxed">{region.intro}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {region.highlights.map((h, i) => (
                <span key={i} className="bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] tracking-widest uppercase px-3 py-1.5">{h}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo SEO único 300-500 palavras */}
      <section className="py-12 md:py-16 bg-brand-bg border-b border-brand-light/5" aria-labelledby="region-content-heading">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 id="region-content-heading" className="font-serif text-2xl md:text-3xl text-brand-light font-light mb-6">
            Por que comprar, vender e alugar imóveis em {region.name} com Silvia Helena?
          </h2>
          <div className="space-y-5 text-sm md:text-base text-brand-muted font-light leading-relaxed">
            {region.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Links internos entre regiões */}
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="text-xs tracking-widest uppercase text-brand-muted w-full mb-1">Explore outras regiões:</span>
            {Object.values(REGIONS).filter(r => r.slug !== region.slug).map(r => (
              <Link key={r.slug} to={`/imoveis/${r.slug}`} className="inline-flex items-center gap-1.5 border border-brand-light/10 hover:border-brand-gold text-brand-muted hover:text-brand-gold px-4 py-2 text-xs uppercase tracking-widest transition-colors">
                <HomeIcon size={12} aria-hidden="true" /> Imóveis em {r.name}
              </Link>
            ))}
            <Link to="/" className="inline-flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-bg px-4 py-2 text-xs uppercase tracking-widest transition-colors">
              Voltar ao início
            </Link>
          </div>
        </div>
      </section>

      {/* Grid de imóveis da região */}
      <section className="py-16 md:py-24 bg-[#17060D]" aria-labelledby="region-listings-heading">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-brand-light/5 pb-6">
            <div>
              <h2 id="region-listings-heading" className="font-serif text-3xl md:text-4xl text-brand-light font-light">
                {regionProperties.length} imóveis em {region.name} para comprar e alugar
              </h2>
              <p className="text-xs text-brand-muted mt-2 font-light">Imóveis selecionados por Silvia Helena — CRECISP 125743</p>
            </div>
            <Link to="/#contact" className="inline-flex items-center gap-2 border border-brand-gold bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-brand-bg px-6 py-2.5 text-xs uppercase tracking-widest transition-colors">
              Quero vender no {region.name}
            </Link>
          </div>

          {regionProperties.length === 0 ? (
            <p className="text-brand-muted text-center py-12">Nenhum imóvel encontrado em {region.name} no momento. Fale com Silvia Helena para acesso off-market.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regionProperties.map((property, idx) => (
                <div key={property.id} className="flex flex-col">
                  <PropertyCard property={property} onSelect={setSelectedProperty} index={idx} />
                  <Link
                    to={`/imoveis/${region.slug}/${slugify(property.title)}-${property.id}`}
                    className="mt-3 inline-flex items-center justify-center gap-2 border border-brand-gold/20 hover:border-brand-gold bg-brand-light/[0.02] hover:bg-brand-gold/10 text-brand-gold text-[11px] uppercase tracking-widest px-4 py-2.5 transition-colors"
                    aria-label={`Ver detalhes do ${property.title} em ${property.location} — ${property.formattedPrice}`}
                  >
                    Ver detalhes do imóvel em {region.name} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FAQSection />
      <ContactSection />

      {/* Modal */}
      {selectedProperty && (
        <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      )}

      <footer className="bg-[#13040a] border-t border-brand-light/5 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-6 text-xs text-brand-muted">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Silvia Helena Imóveis" className="h-10 w-auto" width={80} height={40} loading="lazy" />
            <span>© 2026 Silvia Helena • CRECISP 125743 • {region.name}, São Paulo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-brand-gold" aria-hidden="true" />
            <span>Canal seguro • Atendimento em {region.name}, Butantã, Taboão da Serra e Morumbi</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
