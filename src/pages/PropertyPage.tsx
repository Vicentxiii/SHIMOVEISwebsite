import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { PROPERTIES } from '../propertiesData';
import { REGION_PROPERTIES } from '../data/regionProperties';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Header } from '../components/Header';
import { FavoritesDrawer } from '../components/FavoritesDrawer';
import { useFavorites } from '../components/FavoritesContext';
import { buildCanonical, SITE_CONFIG } from '../utils/seoConfig';
import { slugify, parsePriceToNumber } from '../utils/slugify';
import { REGIONS } from '../data/regions';
import logoSrc from '../assets/images/logo_transparente.webp';
import { MapPin, Heart, Maximize2, Bed, Bath, Car, Calendar, Award, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';

export const PropertyPage: React.FC = () => {
  const { regiao, slug } = useParams<{ regiao: string; slug: string }>();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Encontrar propriedade: busca em ambos datasets por ID contido no slug
  const allProps = [...PROPERTIES, ...REGION_PROPERTIES];
  // slug format: titulo-slug-id  (ex: apartamento-2-quartos-jardim-butanta-prop-butanta-1)
  const idFromSlug = slug?.split('-').slice(-3).join('-') || slug?.split('-').pop(); // fallback
  // Tenta match exato por id incluído
  let property = allProps.find(p => slug?.includes(p.id));
  if (!property && idFromSlug) {
    property = allProps.find(p => p.id === idFromSlug);
  }
  // Fallback: busca por slugify title
  if (!property && slug) {
    property = allProps.find(p => slugify(p.title) === slug || slug.includes(slugify(p.title).slice(0, 20)));
  }

  if (!property) {
    return <Navigate to="/imoveis" replace />;
  }

  if (!activeImage) setActiveImage(property.gallery[0] || property.image);

  const regionData = Object.values(REGIONS).find(r => r.slug === regiao || regiao?.includes(r.slug.slice(0, 4)));
  const regionName = regionData?.name || property.location.split(',')[0];
  const canonicalPath = `/imoveis/${regiao}/${slug}`;
  const priceNumber = parsePriceToNumber(property.formattedPrice);

  // SEO dinâmico otimizado por região
  const seoTitle = `${property.title} à venda em ${property.location} | ${property.bedrooms} quartos, ${property.area} | Silvia Helena`;
  const seoDescription = `${property.title} em ${property.location}: ${property.bedrooms} qts, ${property.bathrooms} banhos, ${property.area}, ${property.formattedPrice}. Fale com corretora de imóveis no ${regionName} com Silvia Helena, CRECISP 125743. Agende visita!`.slice(0, 158);

  const fav = isFavorite(property.id);

  // JSON-LD RealEstateListing (Apartment / Residence etc.)
  const realEstateListingJsonLd = {
    '@context': 'https://schema.org',
    '@type': property.type === 'Apartment' ? 'Apartment' : property.type === 'House' ? 'House' : 'Residence',
    name: property.title,
    description: property.description,
    url: buildCanonical(canonicalPath),
    image: property.gallery,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location,
      addressLocality: property.location.includes('São Paulo') ? 'São Paulo' : regionName,
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    geo: regionData ? {
      '@type': 'GeoCoordinates',
      latitude: regionData.coords.lat,
      longitude: regionData.coords.lng,
    } : undefined,
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area.replace(' m²', '').replace(',', ''),
      unitCode: 'MTK',
    },
    offers: {
      '@type': 'Offer',
      price: priceNumber,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'RealEstateAgent',
        name: 'Silvia Helena corretora de imóveis',
        telephone: SITE_CONFIG.phone,
        email: SITE_CONFIG.email,
      },
      url: buildCanonical(canonicalPath),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_CONFIG.getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'corretora de imóveis', item: `${SITE_CONFIG.getSiteUrl()}/imoveis` },
      { '@type': 'ListItem', position: 3, name: regionName, item: `${SITE_CONFIG.getSiteUrl()}/imoveis/${regiao}` },
      { '@type': 'ListItem', position: 4, name: property.title, item: buildCanonical(canonicalPath) },
    ],
  };

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: `Tenho interesse no ${property.title} em ${property.location} (${property.formattedPrice}). Gostaria de agendar visita.` });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setFormSubmitted(true), 800);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-light">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={buildCanonical(canonicalPath)}
        keywords={`corretora de imóveis ${regionName}, ${property.title}, corretora para comprar ${property.type} ${regionName}, ${property.location}, ${property.bedrooms} quartos`}
        ogImage={property.image}
        ogType="article"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateListingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Header onOpenFavorites={() => setIsFavoritesOpen(true)} activeSection="estates" />
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} onSelectProperty={() => {}} />

      <main className="pt-20">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Breadcrumbs items={[
            { name: 'corretora de imóveis', url: '/imoveis' },
            { name: regionName, url: `/imoveis/${regiao}` },
            { name: property.title, url: canonicalPath }
          ]} />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs tracking-[0.3em] text-brand-gold uppercase font-light">{property.type} • {property.location}</span>
              <h1 className="font-serif text-3xl md:text-4xl text-brand-light font-light leading-tight">{property.title} em {regionName}</h1>
              <div className="flex items-center gap-2 text-xs text-brand-muted">
                <MapPin size={12} className="text-brand-gold" aria-hidden="true" />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-brand-bg border border-brand-light/5">
              <img
                src={activeImage || property.image}
                alt={`${property.title} à venda em ${property.location} - ${property.bedrooms} quartos ${property.area} - fachada`}
                className="w-full h-full object-cover"
                width={1200}
                height={750}
                loading="eager"
                decoding="async"
              />
              <span className="absolute top-4 left-4 bg-brand-bg/90 backdrop-blur-md text-[10px] tracking-widest uppercase text-brand-gold px-3 py-1 border border-brand-gold/20">{property.type}</span>
              <button onClick={() => toggleFavorite(property.id)} className="absolute top-4 right-4 p-2.5 bg-brand-bg/90 backdrop-blur-md rounded-full border border-brand-light/10 text-brand-light hover:text-brand-gold transition-colors cursor-pointer" aria-label={fav ? `Remover ${property.title} dos favoritos` : `Adicionar ${property.title} aos favoritos`}>
                <Heart size={16} className={fav ? 'fill-brand-gold text-brand-gold' : ''} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3" role="list" aria-label="Galeria de fotos do corretora de imóveis">
              {property.gallery.map((img, idx) => (
                <button key={idx} role="listitem" onClick={() => setActiveImage(img)} className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition-all cursor-pointer ${activeImage === img ? 'border-brand-gold ring-1 ring-brand-gold/30' : 'border-brand-light/10 hover:border-brand-light/30'}`} aria-label={`Ver foto ${idx + 1} de ${property.title} em ${property.location}`}>
                  <img src={img} alt={`${property.title} - foto ${idx + 1} - ${property.location}`} className="w-full h-full object-cover" loading="lazy" width={300} height={225} decoding="async" />
                </button>
              ))}
            </div>

            {/* Detalhes */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 border-y border-brand-light/10 py-6">
                <div>
                  <p className="text-[9px] tracking-widest text-brand-muted uppercase font-light">Preço para comprar</p>
                  <p className="font-serif text-2xl text-brand-gold font-light mt-1">{property.formattedPrice}</p>
                </div>
                <div className="border-l border-brand-light/10 pl-6">
                  <p className="text-[9px] tracking-widest text-brand-muted uppercase font-light">Área privativa</p>
                  <p className="font-serif text-2xl text-brand-light font-light mt-1">{property.area}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-brand-muted">
                {property.bedrooms > 0 && <span className="inline-flex items-center gap-1.5 bg-brand-light/[0.04] border border-brand-light/5 px-3 py-1.5"><Bed size={12} className="text-brand-gold" aria-hidden="true" /><span className="text-brand-light font-medium">{property.bedrooms}</span> quartos</span>}
                {property.bathrooms > 0 && <span className="inline-flex items-center gap-1.5 bg-brand-light/[0.04] border border-brand-light/5 px-3 py-1.5"><Bath size={12} className="text-brand-gold" aria-hidden="true" /><span className="text-brand-light font-medium">{property.bathrooms}</span> banheiros</span>}
                {property.garage > 0 && <span className="inline-flex items-center gap-1.5 bg-brand-light/[0.04] border border-brand-light/5 px-3 py-1.5"><Car size={12} className="text-brand-gold" aria-hidden="true" /><span className="text-brand-light font-medium">{property.garage}</span> vagas</span>}
                <span className="inline-flex items-center gap-1.5 bg-brand-light/[0.04] border border-brand-light/5 px-3 py-1.5"><Maximize2 size={12} className="text-brand-gold" aria-hidden="true" />{property.area}</span>
                {property.yearBuilt && <span className="inline-flex items-center gap-1.5 bg-brand-light/[0.04] border border-brand-light/5 px-3 py-1.5"><Calendar size={12} className="text-brand-gold" aria-hidden="true" />{property.yearBuilt}</span>}
              </div>

              <div>
                <h2 className="font-serif text-xl text-brand-light font-light mb-3">Sobre este corretora de imóveis com corretora de imóveis em {regionName}</h2>
                <p className="text-sm text-brand-muted leading-relaxed font-light">{property.description} Ideal para quem busca comprar com segurança ou investir para alugar em {regionName}, São Paulo, com suporte completo da Silvia Helena (CRECISP 125743).</p>
                {property.architect && <p className="text-xs text-brand-muted mt-3">Arquiteto: <span className="text-brand-light">{property.architect}</span></p>}
                <p className="text-xs text-brand-gold mt-2 italic">{property.tagline}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {property.features.map((f, i) => (
                  <span key={i} className="bg-brand-light/[0.04] text-[10px] text-brand-light tracking-widest px-3 py-1.5 border border-brand-light/5 rounded-xl uppercase inline-flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-brand-gold rounded-full" aria-hidden="true" />{f}
                  </span>
                ))}
              </div>

              {/* Links internos SEO */}
              <div className="border border-brand-gold/20 p-5 bg-brand-gold/[0.02] space-y-3">
                <h3 className="text-xs tracking-widest uppercase text-brand-gold font-light">Veja também com corretora de imóveis em:</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(REGIONS).map(r => (
                    <Link key={r.slug} to={`/imoveis/${r.slug}`} className="text-[11px] uppercase tracking-widest border border-brand-light/10 hover:border-brand-gold text-brand-muted hover:text-brand-gold px-3 py-1.5 transition-colors">Corretora de imóveis em {r.name}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-brand-gold/25 p-6 md:p-8 space-y-6 bg-brand-gold/[0.01] rounded-2xl sticky top-24">
              <div className="space-y-2">
                <span className="flex items-center gap-2 text-xs text-brand-gold tracking-widest uppercase font-light"><ShieldCheck size={12} aria-hidden="true" />Canal protegido por NDA</span>
                <h2 className="font-serif text-xl text-brand-light font-light">Agendar visita para comprar ou alugar em {regionName}</h2>
                <p className="text-xs text-brand-muted font-light">Fale com a corretora Silvia Helena e visite este corretora de imóveis em {property.location}. Atendimento com corretora de imóveis para compra, venda e aluguel.</p>
              </div>

              {formSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-brand-gold/10 border border-brand-gold/40 p-6 text-center space-y-3">
                  <div className="w-10 h-10 bg-brand-gold/20 border border-brand-gold rounded-full flex items-center justify-center mx-auto text-brand-gold"><Check size={18} aria-hidden="true" /></div>
                  <h3 className="font-serif text-lg text-brand-gold font-light">Solicitação enviada!</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">A assessoria de Silvia Helena retornará em até 2 horas para agendar sua visita em {regionName}.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="prop-name" className="sr-only">Seu nome completo</label>
                    <input type="text" id="prop-name" required placeholder="SEU NOME COMPLETO" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold px-4 py-3 text-xs tracking-widest uppercase text-brand-light placeholder-brand-muted/70 rounded-xl outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="prop-email" className="sr-only">Seu e-mail</label>
                      <input type="email" id="prop-email" required placeholder="SEU E-MAIL" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold px-4 py-3 text-xs tracking-widest uppercase text-brand-light placeholder-brand-muted/70 rounded-xl outline-none transition-all" />
                    </div>
                    <div>
                      <label htmlFor="prop-phone" className="sr-only">Seu telefone</label>
                      <input type="text" id="prop-phone" required placeholder="SEU WHATSAPP" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold px-4 py-3 text-xs tracking-widest uppercase text-brand-light placeholder-brand-muted/70 rounded-xl outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="prop-msg" className="sr-only">Mensagem</label>
                    <textarea id="prop-msg" rows={4} placeholder="MENSAGEM" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold p-4 text-xs tracking-widest uppercase text-brand-light placeholder-brand-muted/70 rounded-xl outline-none resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-bg py-3 text-xs uppercase tracking-[0.25em] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <span>Enviar solicitação para visitar</span><ArrowRight size={12} aria-hidden="true" />
                  </button>
                  <p className="text-[10px] text-brand-muted text-center">Ao enviar, você aceita contato da corretora Silvia Helena em {regionName}.</p>
                </form>
              )}

              <div className="pt-4 border-t border-brand-light/10 space-y-2 text-xs text-brand-muted">
                <p className="flex items-center gap-2"><Award size={12} className="text-brand-gold" aria-hidden="true" />CRECISP 125743 • Avaliação gratuita para vender em {regionName}</p>
                <p>WhatsApp direto: <a href="https://wa.me/5511940840966" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">+55 11 94084-0966</a></p>
                <Link to={`/imoveis/${regiao}`} className="inline-block mt-2 text-brand-gold hover:underline">← Ver todos com corretora de imóveis em {regionName}</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#13040a] border-t border-brand-light/5 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-6 text-xs text-brand-muted">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Silvia Helena" className="h-8 w-auto" width={60} height={30} loading="lazy" />
            <span>Silvia Helena corretora de imóveis • {property.location} • CRECISP 125743</span>
          </div>
          <Link to="/" className="text-brand-gold hover:underline">Voltar ao início</Link>
        </div>
      </footer>
    </div>
  );
};
