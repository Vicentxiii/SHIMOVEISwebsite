import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowDown, MapPin, Sparkles, Compass, ShieldCheck, ArrowUp, X, Crown, MessageCircle } from 'lucide-react';
import { Property } from '../types';
import { Header } from '../components/Header';
import { AboutSection } from '../components/AboutSection';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyDetailModal } from '../components/PropertyDetailModal';
import { FilterState } from '../components/AdvancedSearch';
import { LifestyleSection } from '../components/LifestyleSection';
import { ContactSection } from '../components/ContactSection';
import { LoadingScreen } from '../components/LoadingScreen';
import { useFavorites } from '../components/FavoritesContext';
import { FavoritesDrawer } from '../components/FavoritesDrawer';
import { useLanguage } from '../components/LanguageContext';
import { PortalListingsCarousel } from '../components/PortalListingsCarousel';
import { FAQSection } from '../components/FAQSection';
import { SocialProofTestimonials } from '../components/SocialProofTestimonials';
import { NoResultsModal } from '../components/NoResultsModal';
import { FilterSearchModal } from '../components/FilterSearchModal';
import { Signature } from '@/components/ui/signature';
import { SEO } from '../components/SEO';
import { SITE_CONFIG, SEO_TEMPLATES, buildCanonical } from '../utils/seoConfig';
import logoSrc from '../assets/images/logo_transparente.webp';
import cliffsideVillaHero from '../assets/images/cliffside_villa_hero_1783897988616.webp';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { t, properties } = useLanguage();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [filterHasNoResults, setFilterHasNoResults] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);
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
    const sections = ['home', 'about', 'testimonials', 'estates', 'lifestyle', 'contact', 'faq'];
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
    if (filters.type !== 'all') {
      const f = String(filters.type).toLowerCase();
      result = result.filter((p) => {
        const pt = String(p.type).toLowerCase();
        if (pt === f) return true;
        if (f === 'house' && pt.includes('casa')) return true;
        if (f === 'apartment' && (pt.includes('apartamento') || pt.includes('cobertura'))) return true;
        if (f === 'luxury mansion' && pt.includes('mans')) return true;
        if (f === 'mansões' && pt.includes('mans')) return true;
        if (f === 'mansão de luxo' && pt.includes('mans')) return true;
        if (f === 'kitnet' && pt.includes('kitnet')) return true;
        if (f === 'estúdio de luxo' && pt.includes('estúdio')) return true;
        if (f === 'studio/kitnet' && pt.includes('studio')) return true;
        return pt.includes(f) || f.includes(pt);
      });
    }
    if (filters.location !== 'all') {
      const loc = String(filters.location).toLowerCase();
      result = result.filter((p) => String(p.location).toLowerCase().includes(loc));
    }
    if (filters.bedrooms !== 'any') result = result.filter((p) => p.bedrooms >= (filters.bedrooms as number));
    if (filters.bathrooms !== 'any') result = result.filter((p) => p.bathrooms >= (filters.bathrooms as number));
    if (filters.garage !== 'any') result = result.filter((p) => p.garage >= (filters.garage as number));
    // preço literal 80.000 → 10.000.000 (valores reais da região)
    const getActualPrice = (p: any) => (p as any).valorRaw ?? Math.round((p.price as number) * 1000000);
    if (filters.minPrice > 80000) result = result.filter((p) => getActualPrice(p) >= filters.minPrice);
    if (filters.maxPrice < 10000000) result = result.filter((p) => getActualPrice(p) <= filters.maxPrice);
    if (filters.hasSwimmingPool) result = result.filter((p) => p.hasSwimmingPool);
    if (filters.hasGarden) result = result.filter((p) => p.hasGarden);
    if (filters.hasOceanView) result = result.filter((p) => p.hasOceanView);
    if (filters.isPetFriendly) result = result.filter((p) => p.isPetFriendly);
    setFilteredProperties(result);
    // verifica se filtro está ativo
    const hasActive =
      filters.type !== 'all' ||
      filters.location !== 'all' ||
      filters.bedrooms !== 'any' ||
      filters.bathrooms !== 'any' ||
      filters.garage !== 'any' ||
      filters.minPrice > 80000 ||
      filters.maxPrice < 10000000 ||
      filters.hasSwimmingPool ||
      filters.hasGarden ||
      filters.hasOceanView ||
      filters.isPetFriendly;
    const hasNoResults = result.length === 0 && hasActive;
    setFilterHasNoResults(hasNoResults);
    // se tem resultado, fecha o modal de filtro e scrolla até os imóveis — se não tem, mantém o MESMO modal aberto com a mensagem (evita modal sobre modal)
    if (!hasNoResults) {
      setShowNoResultsModal(false);
      // fecha o modal de busca e vai até a lista
      if (hasActive) {
        setIsSearchModalOpen(false);
        setTimeout(() => {
          const el = document.getElementById('estates');
          if (el) {
            const headerOffset = 80;
            const pos = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
          }
        }, 150);
      }
    } else {
      // mantém o modal de filtro aberto e mostra a mensagem dentro dele (mesmo modal)
      setIsSearchModalOpen(true);
      setShowNoResultsModal(false);
    }
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
    name: 'Silvia Helena corretora de imóveis',
    image: `${SITE_CONFIG.getSiteUrl()}/favicon.webp`,
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
    knowsAbout: ['corretora de imóveis para comprar', 'corretora de imóveis para vender', 'corretora de imóveis para alugar', 'corretora de imóveis Butantã', 'corretora de imóveis Morumbi', 'corretora de imóveis Taboão da Serra'],
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
        keywords="Corretora de imóveis São Paulo, corretora de imóveis Butantã, corretora de imóveis Morumbi, corretora de imóveis Taboão da Serra, corretora no Butantã, Silvia Helena"
        ogImage="/favicon.webp"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      <LoadingScreen />
      <Header onOpenFavorites={() => setIsFavoritesOpen(true)} onOpenSearch={() => setIsSearchModalOpen(true)} activeSection={activeSection} />
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} onSelectProperty={(p) => setSelectedProperty(p)} />
      <FilterSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => {
          setIsSearchModalOpen(false);
          setFilterHasNoResults(false);
        }}
        onFilterChange={handleFilterChange}
        availableLocations={uniqueLocations}
        hasNoResults={filterHasNoResults}
      />

      {/* HERO - limpa, elegante e futurista - bordas redondas */}
      <section id="home" className="relative min-h-[100svh] flex flex-col justify-center items-center overflow-hidden bg-black" aria-label="Silvia Helena corretora de imóveis - corretora de imóveis em São Paulo">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={cliffsideVillaHero}
            alt="Apartamento de luxo à venda no Morumbi São Paulo - vista panorâmica"
            className="w-full h-full object-cover scale-[1.02] opacity-[0.58] select-none"
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
          />
          {/* gradiente elegante + vinheta futurista */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-brand-bg/15 to-brand-bg" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
          {/* brilho sutil dourado */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none" />
          {/* grid futurista muito sutil - oculto no mobile para limpeza */}
          <div className="absolute inset-0 opacity-[0.04] hidden md:block" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`, backgroundSize: '72px 72px' }} aria-hidden="true" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-8 flex flex-col items-center text-center pt-28 md:pt-32 pb-16 md:pb-10">
          {/* pill badge futurista - texto levemente menor para hero mais limpo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-xl px-3.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-brand-bg">
              <Sparkles size={11} aria-hidden="true" />
            </span>
            <span className="text-[10px] tracking-[0.26em] text-brand-light/90 uppercase font-light">{t('hero_badge')}</span>
            <span className="hidden sm:inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" aria-hidden="true" />
          </motion.div>

          {/* H1 otimizado SEO Local - textos levemente reduzidos para hero mais limpo */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[34px] sm:text-5xl md:text-6xl lg:text-[64px] font-extralight uppercase text-brand-light tracking-[0.02em] leading-[0.9] mt-6 max-w-4xl"
          >
            <span className="block font-extralight tracking-wide">Silvia Helena</span>
            <span className="block text-[11px] sm:text-xs md:text-[13px] tracking-[0.16em] font-light normal-case mt-2.5 text-brand-light/90 leading-relaxed">Corretora de Imóveis no Butantã, Morumbi e Taboão da Serra - CRECISP 125743</span>
          </motion.h1>

          {/* subtítulo / proposta de valor + meta description visível - reduzido para leveza */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.1, duration: 1 }}
            className="mt-5 flex flex-col items-center gap-3 max-w-xl"
          >
            <span className="h-px w-20 bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" aria-hidden="true" />
            <p className="text-xs md:text-[13px] tracking-[0.12em] md:tracking-[0.14em] text-brand-light/75 uppercase font-light leading-relaxed">
              Encontre casas e apartamentos para comprar, vender ou alugar no Butantã, Morumbi e Taboão da Serra com quem entende da região.
            </p>
          </motion.div>

          {/* CTA principal - único botão centralizado */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.4, duration: 0.8 }} className="mt-10 flex justify-center w-full px-2 sm:px-0">
            <button
              onClick={() => scrollToSection('estates')}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-gold px-5 sm:px-6 md:px-8 py-3.5 md:py-4 text-[10px] sm:text-[11px] md:text-[12px] font-medium tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.18em] uppercase text-brand-bg shadow-[0_10px_30px_rgba(212,163,115,0.35)] hover:shadow-[0_12px_36px_rgba(212,163,115,0.45)] hover:bg-[#e0b48a] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-center max-w-[92vw] sm:max-w-xl md:max-w-none"
              aria-label={t('hero_cta')}
            >
              <span className="leading-[1.35] text-center whitespace-normal break-words">{t('hero_cta')}</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-bg text-brand-gold group-hover:rotate-45 transition-transform duration-300">
                <ArrowDown size={14} className="-rotate-90" aria-hidden="true" />
              </span>
            </button>
          </motion.div>

          {/* pills de região - desktop apenas, mobile fica limpo */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.7, duration: 0.8 }} className="mt-8 hidden md:flex flex-wrap justify-center gap-2.5">
            <Link to="/imoveis/butanta" className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] backdrop-blur-xl px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase text-brand-light/85 hover:bg-white/10 hover:border-brand-gold/30 hover:text-brand-gold transition-all duration-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold group-hover:shadow-[0_0_8px_rgba(212,163,115,0.8)] transition-shadow" aria-hidden="true" />
              Butantã
            </Link>
            <Link to="/imoveis/morumbi" className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] backdrop-blur-xl px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase text-brand-light/85 hover:bg-white/10 hover:border-brand-gold/30 hover:text-brand-gold transition-all duration-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold group-hover:shadow-[0_0_8px_rgba(212,163,115,0.8)] transition-shadow" aria-hidden="true" />
              Morumbi
            </Link>
            <Link to="/imoveis/taboao-da-serra" className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] backdrop-blur-xl px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase text-brand-light/85 hover:bg-white/10 hover:border-brand-gold/30 hover:text-brand-gold transition-all duration-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold group-hover:shadow-[0_0_8px_rgba(212,163,115,0.8)] transition-shadow" aria-hidden="true" />
              Taboão da Serra
            </Link>
          </motion.div>
        </div>

        {/* barra inferior minimal - oculta no mobile para hero mais limpo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
          className="relative z-10 hidden md:block w-full max-w-7xl mx-auto px-6 md:px-12 pb-6 md:pb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl px-4 md:px-6 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
            <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.2em] text-brand-light/70 uppercase font-light">
              <span className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-white/10 border border-white/10">
                <MapPin size={12} className="text-brand-gold" aria-hidden="true" />
              </span>
              <span>Butantã • Taboão da Serra • Morumbi • São Paulo</span>
            </div>
            <button
              onClick={() => scrollToSection('about')}
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-brand-light/80 hover:text-brand-light transition-all duration-300 cursor-pointer group"
              aria-label="Rolar para conhecer a consultora Silvia Helena"
            >
              <span>{t('hero_scroll')}</span>
              <ArrowDown size={12} className="group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
            </button>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/15 border border-brand-gold/20 px-4 py-2 text-[10px] tracking-[0.18em] text-brand-gold uppercase font-light">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" aria-hidden="true" />
              <span>{t('hero_private_office')}</span>
            </div>
          </div>
        </motion.div>
      </section>

      <AboutSection />

      <SocialProofTestimonials />

      {/* SEO Content Section — duas colunas: esquerda Signature, direita texto */}
      <section className="py-12 md:py-16 bg-[#1a080f] border-y border-brand-light/5" aria-labelledby="seo-content-heading">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Coluna esquerda — efeito Signature com leve inclinação manuscrita */}
          <div className="flex flex-col items-center justify-center text-center py-2 md:py-6 order-1 overflow-visible rotate-[-10deg] origin-center">
            <div className="w-full max-w-[320px] md:max-w-[420px]">
              <Signature text="Silvia Helena" fontSize={44} duration={1.5} delay={0.2} color="#D4A373" fontUrl="/LastoriaBoldRegular.otf" className="w-full h-auto text-brand-gold overflow-visible" loop loopPause={2.2} />
            </div>
            <div className="w-full max-w-[280px] md:max-w-[360px] -mt-2 md:-mt-1">
              <Signature text="corretora de imóveis" fontSize={22} duration={1.4} delay={1.1} color="#F8F2EF" fontUrl="/LastoriaBoldRegular.otf" className="w-full h-auto opacity-85 overflow-visible" loop loopPause={2.2} />
            </div>
            {/* fallback caso fonte não carregue — garante que algo apareça */}
            <noscript>
              <p className="font-serif text-2xl text-brand-gold mt-2">Silvia Helena — corretora de imóveis</p>
            </noscript>
          </div>
          {/* Coluna direita — texto */}
          <div className="order-2">
            <motion.h2
              id="seo-content-heading"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="font-serif text-2xl md:text-3xl text-brand-light font-light mb-6 leading-tight overflow-visible"
            >
              {"Precisa achar alguém de confiança para comprar, vender ou alugar seu imóvel? Eu cuido de tudo".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -18, filter: "blur(6px)" },
                    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.035, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block mr-[0.22em] will-change-transform"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
            <div className="space-y-4 text-sm text-brand-muted font-light leading-relaxed">
              <p>
                Sou a <strong className="text-brand-light">Silvia Helena, CRECI 125743</strong>. Há 15 anos vivo e trabalho entre o Butantã, Taboão da Serra e Morumbi. Já acompanhei de perto a valorização da Vital Brasil, a procura por casas com quintal no Taboão e a busca por prédios silenciosos no Morumbi. Cada visita que faço leva essa vivência.
              </p>
              <p>
                Se você quer vender, faço conta com vendas reais da sua rua, não estimativa de portal. Para alugar, seleciono inquilino com critério e contrato que te protege. E se a ideia é encontrar um 2 quartos perto do metrô Butantã, uma casa com quintal no Taboão ou um apartamento tranquilo no Morumbi, te mostro o que vale a pena hoje, incluindo o que ainda nem foi anunciado.
              </p>
              <p>
                Você fala sempre direto comigo, do primeiro oi no WhatsApp até a entrega das chaves. Sem equipe passando seu caso adiante. <Link to="/imoveis/butanta" className="text-brand-gold hover:underline">Veja com corretora de imóveis no Butantã</Link>, <Link to="/imoveis/taboao-da-serra" className="text-brand-gold hover:underline">opções com corretora de imóveis em Taboão da Serra</Link> ou <Link to="/imoveis/morumbi" className="text-brand-gold hover:underline">opções mais reservadas no Morumbi com corretora de imóveis</Link>, ou me chama para conversarmos sem compromisso.
              </p>
            </div>
          </div>
        </div>
      </section>

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
            <div className="py-16 md:py-24 text-center border border-brand-light/10 space-y-4 bg-brand-light/[0.01] rounded-2xl px-6">
              <Compass size={28} className="text-brand-gold mx-auto" aria-hidden="true" />
              <h3 className="font-serif text-xl text-brand-light font-light">{t('portfolio_empty_title')}</h3>
              <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed font-light">{t('portfolio_empty_desc')}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                <button onClick={() => setShowNoResultsModal(true)} className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer" aria-label="Ver mensagem da Silvia sobre imóveis fora do site">
                  <span>Ver opções da cartela</span>
                  <ChevronRight size={12} aria-hidden="true" />
                </button>
                <button onClick={() => scrollToSection('contact')} className="inline-flex items-center gap-2 border border-brand-gold/30 hover:border-brand-gold text-brand-gold px-6 py-3 rounded-full text-xs font-light uppercase tracking-widest transition-all duration-300 cursor-pointer" aria-label="Iniciar busca privada com Silvia Helena">
                  <span>{t('portfolio_empty_cta')}</span>
                  <ChevronRight size={10} aria-hidden="true" />
                </button>
              </div>
              <p className="text-[11px] text-brand-muted/70 font-light">Dica: clique em <strong className="text-brand-gold font-medium">Buscar</strong> após selecionar os filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-16">
              {filteredProperties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} onSelect={(p) => setSelectedProperty(p)} index={idx} />
              ))}
            </div>
          )}
          <div className="mt-20 border border-brand-gold/20 p-8 text-center max-w-3xl mx-auto space-y-4 bg-brand-gold/[0.01] rounded-[20px]">
            <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-[9px] px-3 py-1 font-light tracking-widest uppercase rounded-full">{t('portfolio_unlisted_badge')}</span>
            <h3 className="font-serif text-xl text-brand-light font-light tracking-wide">{t('portfolio_unlisted_title')}</h3>
            <p className="text-xs text-brand-muted leading-relaxed font-light max-w-xl mx-auto">{t('portfolio_unlisted_desc')}</p>
            <button
              onClick={() => setShowVIPModal(true)}
              className="group inline-flex items-center gap-2 bg-brand-gold hover:bg-[#e0b48a] text-brand-bg px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.16em] shadow-[0_8px_24px_rgba(212,163,115,0.35)] hover:shadow-[0_10px_28px_rgba(212,163,115,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer mt-2"
            >
              <Sparkles size={12} aria-hidden="true" />
              Lista de clientes VIP
            </button>
          </div>
        </div>
      </section>

      <NoResultsModal isOpen={showNoResultsModal} onClose={() => setShowNoResultsModal(false)} />

      {/* Modal Lista VIP — elegante e chique */}
      <AnimatePresence>
        {showVIPModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6"
            aria-modal="true"
            role="dialog"
            aria-labelledby="vip-modal-title"
          >
            <div className="absolute inset-0 bg-[#0a0206]/70 backdrop-blur-[10px]" onClick={() => setShowVIPModal(false)} aria-hidden="true" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-brand-gold/10 blur-[90px] rounded-full pointer-events-none" aria-hidden="true" />
            <motion.div
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 12, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-[520px] p-[1.5px] rounded-[24px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
            >
              {/* Rastro dourado super elegante — gira na borda */}
              <motion.div
                className="absolute inset-[-70%] rounded-full pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 72%, #D4A373 88%, #FFEDC2 92%, transparent 100%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              />
              <motion.div
                className="absolute inset-[-70%] rounded-full pointer-events-none opacity-50 blur-[6px]"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 72%, #D4A373 88%, transparent 100%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              />
              <div className="relative bg-[#1d0a12] rounded-[22px] overflow-hidden border border-white/[0.04]">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" aria-hidden="true" />
                <button
                  onClick={() => setShowVIPModal(false)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-brand-muted hover:text-brand-light flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Fechar"
                >
                  <X size={14} />
                </button>
                <div className="p-7 md:p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-brand-gold/15 border border-brand-gold/20 flex items-center justify-center mb-4">
                  <Crown size={20} className="text-brand-gold" aria-hidden="true" />
                </div>
                <span className="inline-flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] tracking-[0.18em] uppercase px-3 py-1 rounded-full">
                  <Sparkles size={10} aria-hidden="true" /> Acesso antecipado
                </span>
                <h3 id="vip-modal-title" className="font-serif text-2xl text-brand-light font-light mt-4">Lista de clientes VIP</h3>
                <p className="text-sm text-brand-muted font-light leading-relaxed mt-3">
                  Uma seleção exclusiva da Silvia Helena para quem quer prioridade. Clientes VIP recebem <strong className="text-brand-light font-medium">antes de todo mundo</strong> as oportunidades off-market, pré-lançamentos e imóveis que nem chegam ao portal.
                </p>
                <p className="text-sm text-brand-muted font-light leading-relaxed mt-3">
                  Atendimento direto com a corretora, sem intermediários, com prioridade no agendamento e condições especiais. Todos os dias entram imóveis novos e os melhores saem primeiro para a lista VIP.
                </p>
                <a
                  href={`https://wa.me/5511940840966?text=${encodeURIComponent('olá, quero entrar na lista VIP de clientes')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-[#e0b48a] text-brand-bg px-6 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.16em] shadow-[0_8px_28px_rgba(212,163,115,0.35)] hover:shadow-[0_10px_32px_rgba(212,163,115,0.45)] transition-all duration-300 cursor-pointer"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Entrar na lista VIP no WhatsApp
                </a>
                <p className="mt-3 text-[11px] text-brand-muted/60 font-light">Resposta em até 2h • Sem spam, só oportunidades reais</p>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PortalListingsCarousel />
      <LifestyleSection />

      <FAQSection />
      <ContactSection />

      <AnimatePresence>{selectedProperty && <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}</AnimatePresence>

      <footer className="bg-[#13040a] border-t border-brand-light/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="Silvia Helena corretora de imóveis - Corretora em São Paulo - Logo" className="h-12 md:h-16 w-auto object-contain brightness-100" width={120} height={60} loading="lazy" />
              <div className="flex flex-col items-start border-l border-brand-light/15 pl-3">
                <span className="font-serif text-base md:text-lg font-light uppercase tracking-[0.2em] text-brand-light">SILVIA HELENA</span>
                <span className="text-[8px] md:text-[9px] font-light uppercase tracking-[0.3em] text-brand-muted mt-0.5">{t('hero_badge')}</span>
              </div>
            </div>
            <p className="text-xs text-brand-muted max-w-sm font-light leading-relaxed mt-4">{t('footer_creci_desc')}</p>
            <nav aria-label="Regiões atendidas pela corretora" className="flex flex-wrap gap-2 pt-2">
              <Link to="/imoveis/butanta" className="text-[10px] tracking-widest uppercase text-brand-gold hover:text-brand-light border border-brand-gold/20 px-3 py-1">Corretora no Butantã</Link>
              <Link to="/imoveis/taboao-da-serra" className="text-[10px] tracking-widest uppercase text-brand-gold hover:text-brand-light border border-brand-gold/20 px-3 py-1">Corretora em Taboão da Serra</Link>
              <Link to="/imoveis/morumbi" className="text-[10px] tracking-widest uppercase text-brand-gold hover:text-brand-light border border-brand-gold/20 px-3 py-1">Corretora no Morumbi</Link>
            </nav>
            <p className="text-[11px] text-brand-muted/80 font-light leading-relaxed">Corretora de imóveis no Butantã | Morumbi | Taboão da Serra — atendimento direto na Zona Oeste de SP</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest text-brand-light uppercase">{t('footer_territories')}</h3>
            <ul className="text-xs text-brand-muted space-y-2 font-light">
              <li><Link to="/imoveis/butanta" className="hover:text-brand-gold">Corretora de imóveis no Butantã</Link></li>
              <li><Link to="/imoveis/taboao-da-serra" className="hover:text-brand-gold">Corretora de imóveis em Taboão da Serra</Link></li>
              <li><Link to="/imoveis/morumbi" className="hover:text-brand-gold">Corretora de imóveis no Morumbi</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest text-brand-light uppercase">{t('footer_disclosures')}</h3>
            <ul className="text-xs text-brand-muted space-y-2 font-light">
              <li>{t('footer_off_market_policy')}</li>
              <li>{t('footer_nda')}</li>
              <li>{t('footer_wealth_integration')}</li>
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
