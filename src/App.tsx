/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowDown, MapPin, Sparkles, MessageSquare, Heart, Compass, ShieldCheck, ArrowUp } from 'lucide-react';
import { Property } from './types';
import { Header } from './components/Header';
import { AboutSection } from './components/AboutSection';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AdvancedSearch, FilterState } from './components/AdvancedSearch';
import { LifestyleSection } from './components/LifestyleSection';
import { ContactSection } from './components/ContactSection';
import { LoadingScreen } from './components/LoadingScreen';
import { FavoritesProvider, useFavorites } from './components/FavoritesContext';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { useLanguage, LanguageProvider } from './components/LanguageContext';
import { PortalListingsCarousel } from './components/PortalListingsCarousel';
import logoSrc from './assets/images/logo_transparente.png';

function AppContent() {
  const { t, properties, testimonials } = useLanguage();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Filtering states
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const { favorites } = useFavorites();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync filtered properties with language selection
  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  // Handle intersection observers to track active section for header indicators
  useEffect(() => {
    const sections = ['home', 'about', 'estates', 'lifestyle', 'testimonials', 'contact'];
    const observers = sections.map((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId);
          }
        },
        { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' }
      );
      observer.observe(element);
      return { observer, element };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.element);
        }
      });
    };
  }, []);

  // Filter application
  const handleFilterChange = (filters: FilterState) => {
    let result = [...properties];

    if (filters.type !== 'all') {
      result = result.filter((p) => p.type === filters.type);
    }

    if (filters.location !== 'all') {
      result = result.filter((p) => p.location === filters.location);
    }

    if (filters.bedrooms !== 'any') {
      result = result.filter((p) => p.bedrooms >= (filters.bedrooms as number));
    }

    if (filters.bathrooms !== 'any') {
      result = result.filter((p) => p.bathrooms >= (filters.bathrooms as number));
    }

    if (filters.garage !== 'any') {
      result = result.filter((p) => p.garage >= (filters.garage as number));
    }

    // Max Price (Millions USD)
    result = result.filter((p) => p.price <= filters.maxPrice);

    // Boolean features
    if (filters.hasSwimmingPool) result = result.filter((p) => p.hasSwimmingPool);
    if (filters.hasGarden) result = result.filter((p) => p.hasGarden);
    if (filters.hasOceanView) result = result.filter((p) => p.hasOceanView);
    if (filters.isPetFriendly) result = result.filter((p) => p.isPetFriendly);

    setFilteredProperties(result);
  };

  // Extract all unique locations for the search panel dropdown
  const uniqueLocations = React.useMemo(() => {
    return Array.from(new Set(properties.map((p) => p.location))).filter(Boolean);
  }, [properties]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-light selection:bg-brand-gold selection:text-brand-bg relative">
      {/* Loading Intro Experience */}
      <LoadingScreen />

      {/* Sticky Minimal Navigation Header */}
      <Header 
        onOpenFavorites={() => setIsFavoritesOpen(true)} 
        activeSection={activeSection} 
      />

      {/* Dynamic Favorites Sidebar Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

      {/* SECTION 1: Fullscreen Cinematic Hero */}
      <section 
        id="home" 
        className="relative h-screen flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-black"
      >
        {/* Background Image / Paralax effect */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/cliffside_villa_hero_1783897988616.jpg"
            alt="Monolithic Luxury Estate"
            className="w-full h-full object-cover scale-105 opacity-65 select-none"
            referrerPolicy="no-referrer"
          />
          {/* Immersive Dark Vignetting */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-black/80" />
        </div>

        {/* Top Spacer */}
        <div className="h-20" />

        {/* Central Brand Narrative */}
        <div className="max-w-4xl mx-auto text-center z-10 space-y-6 md:space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 text-xs tracking-[0.35em] text-brand-gold uppercase font-light"
          >
            <Sparkles size={12} />
            <span>{t('hero_badge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl md:text-8xl font-extralight uppercase text-brand-light tracking-wide leading-tight"
          >
            {t('hero_title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 1.5 }}
            className="text-sm md:text-lg tracking-[0.2em] text-brand-light uppercase font-light mt-2 max-w-2xl mx-auto border-t border-brand-gold/25 pt-4"
          >
            {t('hero_subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.5, duration: 1.2 }}
            className="pt-6"
          >
            <button
              onClick={() => scrollToSection('estates')}
              className="group border border-brand-gold bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-bg px-8 py-3.5 text-xs font-light tracking-[0.3em] uppercase text-brand-gold transition-all duration-500 cursor-pointer"
            >
              <span>{t('hero_cta')}</span>
            </button>
          </motion.div>
        </div>

        {/* Bottom Bar: Ambient Indicators */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 items-center md:items-end z-10 text-[10px] tracking-[0.25em] text-brand-muted uppercase font-light w-full text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <MapPin size={10} className="text-brand-gold" />
            <span>São Paulo • Rio de Janeiro • Trancoso</span>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => scrollToSection('about')}
              className="hidden md:flex items-center gap-2 text-brand-muted hover:text-brand-gold transition-all duration-300 animate-bounce cursor-pointer"
            >
              <span>{t('hero_scroll')}</span>
              <ArrowDown size={10} />
            </button>
          </div>

          <div className="text-center md:text-right w-full md:w-auto flex justify-center md:justify-end">
            <span>{t('hero_private_office')}</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: About Silvia (Editorial Spread) */}
      <AboutSection />

      {/* SECTION 3: Advanced Search Bar Integration */}
      <div className="sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <AdvancedSearch
            onFilterChange={handleFilterChange}
            availableLocations={uniqueLocations}
          />
        </div>
      </div>

      {/* SECTION 4: Curated Featured Properties (Magazine Style Layout) */}
      <section id="estates" className="py-24 md:py-36 bg-brand-bg relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-brand-light/5 pb-10">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.3em] text-brand-gold uppercase font-light block">
                {t('portfolio_badge')}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-brand-light font-light leading-tight tracking-tight">
                {t('portfolio_title')}
              </h2>
            </div>
            <div>
              <p className="text-xs text-brand-muted max-w-sm font-light leading-relaxed tracking-wide">
                {t('portfolio_desc', [filteredProperties.length, properties.length])}
              </p>
            </div>
          </div>

          {/* Non-Standard Editorial Grid Display */}
          {filteredProperties.length === 0 ? (
            <div className="py-24 text-center border border-brand-light/10 space-y-4 bg-brand-light/[0.01]">
              <Compass size={28} className="text-brand-gold mx-auto animate-spin" />
              <h4 className="font-serif text-xl text-brand-light font-light">{t('portfolio_empty_title')}</h4>
              <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed font-light">
                {t('portfolio_empty_desc')}
              </p>
              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center gap-2 border border-brand-gold/30 hover:border-brand-gold text-brand-gold px-6 py-2.5 text-xs font-light uppercase tracking-widest mt-4 transition-all duration-300 cursor-pointer"
              >
                <span>{t('portfolio_empty_cta')}</span>
                <ChevronRight size={10} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-16">
              {filteredProperties.map((property, idx) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={(p) => setSelectedProperty(p)}
                  index={idx}
                />
              ))}
            </div>
          )}

          {/* Off-Market Slogan */}
          <div className="mt-20 border border-brand-gold/20 p-8 text-center max-w-3xl mx-auto space-y-4 bg-brand-gold/[0.01]">
            <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-[9px] px-3 py-1 font-light tracking-widest uppercase">
              {t('portfolio_unlisted_badge')}
            </span>
            <h4 className="font-serif text-xl text-brand-light font-light tracking-wide">
              {t('portfolio_unlisted_title')}
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed font-light max-w-xl mx-auto">
              {t('portfolio_unlisted_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* PORTAL LISTINGS CAROUSEL */}
      <PortalListingsCarousel />

      {/* SECTION 5: Lifestyle Section (Emotional Narrative Selling) */}
      <LifestyleSection />

      {/* SECTION 6: Testimonials (Minimal Luxury Slider) */}
      <section id="testimonials" className="py-24 md:py-36 bg-brand-bg relative overflow-hidden">
        {/* Decorative thin background design line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-brand-light/5" />

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="space-y-4 mb-12">
            <span className="text-xs tracking-[0.3em] text-brand-gold uppercase font-light block">
              {t('test_badge')}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-brand-light font-light tracking-tight">
              {t('test_title')}
            </h2>
          </div>

          <div className="relative min-h-[360px] md:min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="space-y-6 bg-[#210c14]/40 border border-brand-light/5 rounded-2xl p-8 md:p-12 hover:border-brand-gold/40 hover:shadow-[0_0_25px_rgba(197,160,89,0.15)] transition-all duration-500 w-full max-w-4xl mx-auto"
              >
                {/* Clean quote signifier */}
                <div className="font-serif text-5xl text-brand-gold/25 select-none leading-none -mt-4">
                  “
                </div>
                
                <blockquote className="font-serif text-base md:text-xl text-brand-light font-light leading-relaxed max-w-3xl mx-auto tracking-wide italic">
                  {testimonials[activeTestimonial]?.quote}
                </blockquote>

                <div className="space-y-1">
                  <p className="font-serif text-sm md:text-base text-brand-gold font-medium tracking-wide">
                    {testimonials[activeTestimonial]?.author}
                  </p>
                  <p className="text-[9px] tracking-widest text-brand-muted uppercase font-light">
                    {testimonials[activeTestimonial]?.role} — {testimonials[activeTestimonial]?.location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Testimonial Selectors */}
          <div className="flex justify-center items-center space-x-3 mt-10">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border cursor-pointer ${
                  activeTestimonial === idx
                    ? 'bg-brand-gold border-brand-gold scale-110'
                    : 'bg-transparent border-brand-light/30 hover:border-brand-light/70'
                }`}
                aria-label={`Go to client testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Encrypted Contact Consultation Form */}
      <ContactSection />

      {/* SECTION 8: Immersive full-screen Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyDetailModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </AnimatePresence>

      {/* SECTION 9: Editorial Footer */}
      <footer className="bg-[#13040a] border-t border-brand-light/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img 
                src={logoSrc} 
                alt="Silvia Helena Logo" 
                className="h-12 md:h-16 w-auto object-contain brightness-100"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col items-start border-l border-brand-light/15 pl-3">
                <span className="font-serif text-base md:text-lg font-light uppercase tracking-[0.2em] text-brand-light">
                  SILVIA HELENA
                </span>
                <span className="text-[8px] md:text-[9px] font-light uppercase tracking-[0.3em] text-brand-muted mt-0.5">
                  {t('hero_badge')}
                </span>
              </div>
            </div>
            <p className="text-xs text-brand-muted max-w-sm font-light leading-relaxed mt-4">
              {t('footer_creci_desc')}
            </p>
          </div>

          {/* Territories */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold tracking-widest text-brand-light uppercase">{t('footer_territories')}</h5>
            <ul className="text-xs text-brand-muted space-y-2 font-light">
              <li>{t('footer_sp')}</li>
              <li>{t('footer_rio')}</li>
              <li>{t('footer_trancoso')}</li>
              <li>{t('footer_angra')}</li>
              <li>{t('footer_campinas')}</li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold tracking-widest text-brand-light uppercase">{t('footer_disclosures')}</h5>
            <ul className="text-xs text-brand-muted space-y-2 font-light">
              <li>{t('footer_off_market_policy')}</li>
              <li>{t('footer_nda')}</li>
              <li>{t('footer_wealth_integration')}</li>
              <li>{t('footer_ecology')}</li>
              <li>{t('footer_rights')}</li>
            </ul>
          </div>

        </div>

        {/* Elegant bottom structural row */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-brand-light/5 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] tracking-widest text-brand-muted uppercase font-light">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-brand-gold" />
            <span>{t('footer_crypto_alert')}</span>
          </div>
          <div className="normal-case">
            <span>designed by <a href="https://www.instagram.com/vicenteczar.dev/" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-brand-light hover:underline transition-colors duration-300 font-light lowercase">@vicenteczar.dev</a></span>
          </div>
          <div>
            <span>{t('footer_aesthetics')}</span>
          </div>
        </div>
      </footer>

      {/* Back to Top Fixed Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-brand-bg/90 hover:bg-brand-bg text-brand-gold border border-brand-gold/30 hover:border-brand-gold rounded-full shadow-xl backdrop-blur-md transition-all duration-300 group cursor-pointer"
            aria-label="Voltar ao topo"
          >
            <span className="text-[9px] tracking-[0.25em] uppercase font-light pl-1">
              voltar ao topo
            </span>
            <div className="p-1 rounded-full bg-brand-gold/15 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-bg transition-all duration-300">
              <ArrowUp size={10} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </LanguageProvider>
  );
}
