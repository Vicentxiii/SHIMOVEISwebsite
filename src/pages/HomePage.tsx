import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowDown, MapPin, Sparkles, Compass, ShieldCheck, ArrowUp } from 'lucide-react';
import { Property } from '../types';
import { Header } from '../components/Header';
import { AboutSection } from '../components/AboutSection';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyDetailModal } from '../components/PropertyDetailModal';
import { AdvancedSearch, FilterState } from '../components/AdvancedSearch';
import { LifestyleSection } from '../components/LifestyleSection';
import { ContactSection } from '../components/ContactSection';
import { LoadingScreen } from '../components/LoadingScreen';
import { useFavorites } from '../components/FavoritesContext';
import { FavoritesDrawer } from '../components/FavoritesDrawer';
import { useLanguage } from '../components/LanguageContext';
import { PortalListingsCarousel } from '../components/PortalListingsCarousel';
import { FAQSection } from '../components/FAQSection';
import { SEO } from '../components/SEO';
import { SITE_CONFIG, SEO_TEMPLATES, buildCanonical } from '../utils/seoConfig';
import logoSrc from '../assets/images/logo_transparente.png';
import cliffsideVillaHero from '../assets/images/cliffside_villa_hero_1783897988616.jpg';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { t, properties, testimonials } = useLanguage();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const { favorites } = useFavorites();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    const sections = ['home', 'about', 'estates', 'lifestyle', 'testimonials', 'contact', 'faq'];
    const observers = sections.map((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return null;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(sectionId); },
        { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' }
      );
      observer.observe(element);
      return { observer, element };
    });
    return () => {
      observers.forEach((obs) => { if (obs) obs.observer.unobserve(obs.element); });
    };
  }, []);

  const handleFilterChange = (filters: FilterState) => {
    let result = [...properties];
    if (filters.type !== 'all') result = result.filter((p) => p.type === filters.type);
    if (filters.location !== 'all') result = result.filter((p) => p.location === filters.location);
    if (filters.bedrooms !== 'any') result = result.filter((p) => p.bedrooms >= (filters.bedrooms as number));
    if (filters.bathrooms !== 'any') result = result.filter((p) => p.bathrooms >= (filters.bathrooms as number));
    if (filters.garage !== 'any') result = result.filter((p) => p.garage >= (filters.garage as number));
    result = result.filter((p) => p.price <= filters.maxPrice);
    if (filters.hasSwimmingPool) result = result.filter((p) => p.hasSwimmingPool);
    if (filters.hasGarden) result = result.filter((p) => p.hasGarden);
    if (filters.hasOceanView) result = result.filter((p) => p.hasOceanView);
    if (filters.isPetFriendly) result = result.filter((p) => p.isPetFriendly);
    setFilteredProperties(result);
  };

  const uniqueLocations = React.useMemo(() => Array.from(new Set(properties.map((p) => p.location))).filter(Boolean), [properties]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // JSON-LD RealEstateAgent + FAQ + Breadcrumb
  const realEstateAgentJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Silvia Helena Imóveis',
    image: `${SITE_CONFIG.getSiteUrl()}/favicon.png`,
    url: SITE_CONFIG.getSiteUrl(),
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    priceRange: 'R$ 250.000 - R$ 28.000.000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    areaServed: [
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'Place', name: 'Butantã, São Paulo' },
      { '@type': 'Place', name: 'Taboão da Serra, SP' },
      { '@type': 'Place', name: 'Morumbi, São Paulo' },
    ],
    openingHours: 'Mo-Sa 09:00-19:00',
    description: SEO_TEMPLATES.home.description,
    knowsAbout: ['compra de imóveis', 'venda de imóveis', 'aluguel de imóveis', 'apartamentos Butantã', 'casas Morumbi', 'imóveis Taboão da Serra'],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.getSiteUrl(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.getSiteUrl()}/imoveis?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-light selection:bg-brand-gold selection:text-brand-bg relative">
      <SEO
        title={SEO_TEMPLATES.home.title}
        description={SEO_TEMPLATES.home.description}
        canonical={buildCanonical('/')}
        keywords="comprar imóvel São Paulo, vender imóvel Butantã, alugar apartamento Morumbi, imóveis Taboão da Serra, imobiliária São Paulo, Silvia Helena"
        ogImage="/favicon.png"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      <LoadingScreen />
      <Header onOpenFavorites={() => setIsFavoritesOpen(true)} activeSection={activeSection} />
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} onSelectProperty={(p) => setSelectedProperty(p)} />

      {/* HERO - H1 único por página */}
      <section id="home" className="relative h-screen flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-black" aria-label="Silvia Helena Imóveis - Imóveis em São Paulo">
        <div className="absolute inset-0 z-0">
          <img
            src={cliffsideVillaHero}
            alt="Apartamento de luxo à venda no Morumbi São Paulo - vista panorâmica"
            className="w-full h-full object-cover scale-105 opacity-65 select-none"
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-black/80" />
        </div>
        <div className="h-20" />
        <div className="max-w-4xl mx-auto text-center z-10 space-y-6 md:space-y-8 px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-center justify-center gap-2 text-xs tracking-[0.35em] text-brand-gold uppercase font-light">
            <Sparkles size={12} aria-hidden="true" />
            <span>{t('hero_badge')}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.7, duration: 1.8, ease: [0.16, 1, 0.3, 1] }} className="font-serif text-5xl md:text-8xl font-extralight uppercase text-brand-light tracking-wide leading-tight">
            {t('hero_title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2, duration: 1.5 }} className="text-sm md:text-lg tracking-[0.2em] text-brand-light uppercase font-light mt-2 max-w-2xl mx-auto border-t border-brand-gold/25 pt-4">
            Consultora de imóveis para comprar, vender e alugar no Butantã, Morumbi e Taboão da Serra
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3.5, duration: 1.2 }} className="pt-6">
            <button onClick={() => scrollToSection('estates')} className="group border border-brand-gold bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-bg px-8 py-3.5 text-xs font-light tracking-[0.3em] uppercase text-brand-gold transition-all duration-500 cursor-pointer" aria-label="Ver imóveis à venda no Butantã, Morumbi e Taboão da Serra">
              <span>{t('hero_cta')}</span>
            </button>
          </motion.div>
          {/* Links internos SEO para regiões */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.8 }} className="flex flex-wrap justify-center gap-3 pt-4">
            <Link to="/imoveis/butanta" className="text-[11px] tracking-widest uppercase border border-brand-light/20 hover:border-brand-gold text-brand-light hover:text-brand-gold px-4 py-2 transition-colors">Imóveis no Butantã</Link>
            <Link to="/imoveis/morumbi" className="text-[11px] tracking-widest uppercase border border-brand-light/20 hover:border-brand-gold text-brand-light hover:text-brand-gold px-4 py-2 transition-colors">Imóveis no Morumbi</Link>
            <Link to="/imoveis/taboao-da-serra" className="text-[11px] tracking-widest uppercase border border-brand-light/20 hover:border-brand-gold text-brand-light hover:text-brand-gold px-4 py-2 transition-colors">Imóveis em Taboão da Serra</Link>
          </motion.div>
        </div>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 items-center md:items-end z-10 text-[10px] tracking-[0.25em] text-brand-muted uppercase font-light w-full text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <MapPin size={10} className="text-brand-gold" aria-hidden="true" />
            <span>Butantã • Taboão da Serra • Morumbi • São Paulo</span>
          </div>
          <div className="flex justify-center">
            <button onClick={() => scrollToSection('about')} className="hidden md:flex items-center gap-2 text-brand-muted hover:text-brand-gold transition-all duration-300 animate-bounce cursor-pointer" aria-label="Rolar para conhecer a consultora Silvia Helena">
              <span>{t('hero_scroll')}</span>
              <ArrowDown size={10} aria-hidden="true" />
            </button>
          </div>
          <div className="text-center md:text-right w-full md:w-auto flex justify-center md:justify-end">
            <span>{t('hero_private_office')}</span>
          </div>
        </div>
      </section>

      <AboutSection />

      {/* SEO Content Section - 300+ palavras para GEO */}
      <section className="py-12 md:py-16 bg-[#1a080f] border-y border-brand-light/5" aria-labelledby="seo-content-heading">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 id="seo-content-heading" className="font-serif text-2xl md:text-3xl text-brand-light font-light mb-6">Comprar, vender e alugar imóveis em São Paulo com Silvia Helena</h2>
          <div className="grid md:grid-cols-3 gap-8 text-sm text-brand-muted font-light leading-relaxed">
            <p>
              A <strong className="text-brand-light">Silvia Helena Imóveis</strong> é referência para quem deseja <strong className="text-brand-light">comprar, vender ou alugar imóveis em São Paulo</strong>, com atuação focada no <strong className="text-brand-light">Butantã, Taboão da Serra e Morumbi</strong>. Atendemos apartamentos, casas, coberturas e terrenos — do primeiro imóvel ao alto padrão — com avaliação precisa, fotos profissionais e divulgação nos principais portais.
            </p>
            <p>
              Para <strong className="text-brand-light">vender seu imóvel em São Paulo</strong>, oferecemos estratégia completa: precificação baseada em dados reais, marketing premium e negociação segura até o registro. Para <strong className="text-brand-light">alugar</strong>, garantimos inquilino qualificado, contrato com garantias e vistoria completa. Se quer <strong className="text-brand-light">comprar apartamento no Butantã</strong>, casa em Taboão da Serra ou mansão no Morumbi, temos curadoria exclusiva, inclusive imóveis off-market.
            </p>
            <p>
              Nossa consultoria boutique une discrição, inteligência de mercado e atendimento humanizado. Com CRECISP 125743, cuidamos de toda a burocracia e te guiamos da visita à entrega das chaves. <Link to="/imoveis/butanta" className="text-brand-gold hover:underline">Veja imóveis no Butantã</Link>, <Link to="/imoveis/taboao-da-serra" className="text-brand-gold hover:underline">em Taboão da Serra</Link> e <Link to="/imoveis/morumbi" className="text-brand-gold hover:underline">no Morumbi</Link> ou fale direto no WhatsApp para uma avaliação gratuita.
            </p>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <AdvancedSearch onFilterChange={handleFilterChange} availableLocations={uniqueLocations} />
        </div>
      </div>

      <section id="estates" className="py-24 md:py-36 bg-brand-bg relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-brand-light/5 pb-10">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.3em] text-brand-gold uppercase font-light block">{t('portfolio_badge')}</span>
              <h2 className="font-serif text-3xl md:text-5xl text-brand-light font-light leading-tight tracking-tight">{t('portfolio_title')}</h2>
            </div>
            <div>
              <p className="text-xs text-brand-muted max-w-sm font-light leading-relaxed tracking-wide">{t('portfolio_desc', [filteredProperties.length, properties.length])}</p>
            </div>
          </div>
          {filteredProperties.length === 0 ? (
            <div className="py-24 text-center border border-brand-light/10 space-y-4 bg-brand-light/[0.01]">
              <Compass size={28} className="text-brand-gold mx-auto animate-spin" aria-hidden="true" />
              <h3 className="font-serif text-xl text-brand-light font-light">{t('portfolio_empty_title')}</h3>
              <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed font-light">{t('portfolio_empty_desc')}</p>
              <button onClick={() => scrollToSection('contact')} className="inline-flex items-center gap-2 border border-brand-gold/30 hover:border-brand-gold text-brand-gold px-6 py-2.5 text-xs font-light uppercase tracking-widest mt-4 transition-all duration-300 cursor-pointer" aria-label="Iniciar busca privada com Silvia Helena">
                <span>{t('portfolio_empty_cta')}</span>
                <ChevronRight size={10} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-16">
              {filteredProperties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} onSelect={(p) => setSelectedProperty(p)} index={idx} />
              ))}
            </div>
          )}
          <div className="mt-20 border border-brand-gold/20 p-8 text-center max-w-3xl mx-auto space-y-4 bg-brand-gold/[0.01]">
            <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-[9px] px-3 py-1 font-light tracking-widest uppercase">{t('portfolio_unlisted_badge')}</span>
            <h3 className="font-serif text-xl text-brand-light font-light tracking-wide">{t('portfolio_unlisted_title')}</h3>
            <p className="text-xs text-brand-muted leading-relaxed font-light max-w-xl mx-auto">{t('portfolio_unlisted_desc')}</p>
          </div>
        </div>
      </section>

      <PortalListingsCarousel />
      <LifestyleSection />

      <section id="testimonials" className="py-24 md:py-36 bg-brand-bg relative overflow-hidden" aria-labelledby="testimonials-heading">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-brand-light/5" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="space-y-4 mb-12">
            <span className="text-xs tracking-[0.3em] text-brand-gold uppercase font-light block">{t('test_badge')}</span>
            <h2 id="testimonials-heading" className="font-serif text-3xl md:text-5xl text-brand-light font-light tracking-tight">{t('test_title')}</h2>
          </div>
          <div className="relative min-h-[360px] md:min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="space-y-6 bg-[#210c14]/40 border border-brand-light/5 rounded-2xl p-8 md:p-12 hover:border-brand-gold/40 hover:shadow-[0_0_25px_rgba(197,160,89,0.15)] transition-all duration-500 w-full max-w-4xl mx-auto">
                <div className="font-serif text-5xl text-brand-gold/25 select-none leading-none -mt-4" aria-hidden="true">“</div>
                <blockquote className="font-serif text-base md:text-xl text-brand-light font-light leading-relaxed max-w-3xl mx-auto tracking-wide italic">{testimonials[activeTestimonial]?.quote}</blockquote>
                <div className="space-y-1">
                  <p className="font-serif text-sm md:text-base text-brand-gold font-medium tracking-wide">{testimonials[activeTestimonial]?.author}</p>
                  <p className="text-[9px] tracking-widest text-brand-muted uppercase font-light">{testimonials[activeTestimonial]?.role} — {testimonials[activeTestimonial]?.location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center items-center space-x-3 mt-10" role="tablist" aria-label="Depoimentos de clientes">
            {testimonials.map((_, idx) => (
              <button key={idx} onClick={() => setActiveTestimonial(idx)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border cursor-pointer ${activeTestimonial === idx ? 'bg-brand-gold border-brand-gold scale-110' : 'bg-transparent border-brand-light/30 hover:border-brand-light/70'}`} aria-label={`Ver depoimento ${idx + 1} de ${testimonials[idx]?.author}`} role="tab" aria-selected={activeTestimonial === idx} />
            ))}
          </div>
        </div>
      </section>

      <FAQSection />
      <ContactSection />

      <AnimatePresence>{selectedProperty && <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}</AnimatePresence>

      <footer className="bg-[#13040a] border-t border-brand-light/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="Silvia Helena Imóveis - Corretora em São Paulo - Logo" className="h-12 md:h-16 w-auto object-contain brightness-100" width={120} height={60} loading="lazy" />
              <div className="flex flex-col items-start border-l border-brand-light/15 pl-3">
                <span className="font-serif text-base md:text-lg font-light uppercase tracking-[0.2em] text-brand-light">SILVIA HELENA</span>
                <span className="text-[8px] md:text-[9px] font-light uppercase tracking-[0.3em] text-brand-muted mt-0.5">{t('hero_badge')}</span>
              </div>
            </div>
            <p className="text-xs text-brand-muted max-w-sm font-light leading-relaxed mt-4">{t('footer_creci_desc')}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link to="/imoveis/butanta" className="text-[10px] tracking-widest uppercase text-brand-gold hover:text-brand-light border border-brand-gold/20 px-3 py-1">Butantã</Link>
              <Link to="/imoveis/taboao-da-serra" className="text-[10px] tracking-widest uppercase text-brand-gold hover:text-brand-light border border-brand-gold/20 px-3 py-1">Taboão da Serra</Link>
              <Link to="/imoveis/morumbi" className="text-[10px] tracking-widest uppercase text-brand-gold hover:text-brand-light border border-brand-gold/20 px-3 py-1">Morumbi</Link>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest text-brand-light uppercase">{t('footer_territories')}</h3>
            <ul className="text-xs text-brand-muted space-y-2 font-light">
              <li><Link to="/imoveis/butanta" className="hover:text-brand-gold">Imóveis no Butantã</Link></li>
              <li><Link to="/imoveis/taboao-da-serra" className="hover:text-brand-gold">Imóveis em Taboão da Serra</Link></li>
              <li><Link to="/imoveis/morumbi" className="hover:text-brand-gold">Imóveis no Morumbi</Link></li>
              <li>{t('footer_angra')}</li>
              <li>{t('footer_campinas')}</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest text-brand-light uppercase">{t('footer_disclosures')}</h3>
            <ul className="text-xs text-brand-muted space-y-2 font-light">
              <li>{t('footer_off_market_policy')}</li>
              <li>{t('footer_nda')}</li>
              <li>{t('footer_wealth_integration')}</li>
              <li>{t('footer_ecology')}</li>
              <li>{t('footer_rights')}</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-brand-light/5 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] tracking-widest text-brand-muted uppercase font-light">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-brand-gold" aria-hidden="true" />
            <span>{t('footer_crypto_alert')}</span>
          </div>
          <div className="normal-case">
            <span>designed by <a href="https://www.instagram.com/vicenteczar.dev/" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-brand-light hover:underline transition-colors duration-300 font-light lowercase">@vicenteczar.dev</a></span>
          </div>
          <div><span>{t('footer_aesthetics')}</span></div>
        </div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={scrollToTop} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-brand-bg/90 hover:bg-brand-bg text-brand-gold border border-brand-gold/30 hover:border-brand-gold rounded-full shadow-xl backdrop-blur-md transition-all duration-300 group cursor-pointer" aria-label="Voltar ao topo da página">
            <span className="text-[9px] tracking-[0.25em] uppercase font-light pl-1">voltar ao topo</span>
            <div className="p-1 rounded-full bg-brand-gold/15 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-bg transition-all duration-300"><ArrowUp size={10} aria-hidden="true" /></div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
