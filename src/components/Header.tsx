/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Heart, MessageSquare, Compass, Award, Globe } from 'lucide-react';
import { useFavorites } from './FavoritesContext';
import { useLanguage, Language } from './LanguageContext';
import logoSrc from '../assets/images/logo_transparente.png';

interface HeaderProps {
  onOpenFavorites: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFavorites, activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { favorites } = useFavorites();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
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

  const navItems = [
    { label: t('nav_advisor'), target: 'about' },
    { label: t('nav_estates'), target: 'estates' },
    { label: t('nav_philosophy'), target: 'lifestyle' },
    { label: t('nav_testimonials'), target: 'testimonials' },
    { label: t('nav_consultation'), target: 'contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: (activeSection === 'home' || activeSection === 'about') ? 0 : -120, 
          opacity: (activeSection === 'home' || activeSection === 'about') ? 1 : 0 
        }}
        transition={{ 
          delay: hasLoaded ? 0 : 2.2, 
          duration: (activeSection === 'home' || activeSection === 'about') ? 0.8 : 0.5, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
          (activeSection === 'home' || activeSection === 'about') ? '' : 'pointer-events-none'
        } ${
          scrolled
            ? 'bg-brand-bg/95 backdrop-blur-md py-4 border-brand-light/5 shadow-lg shadow-black/10'
            : 'bg-transparent py-6 md:py-8 border-transparent'
        }`}
      >
        <div className="max-w-[95rem] mx-auto px-6 md:px-12 xl:px-16 flex justify-between items-center w-full">
          {/* Logo Brand Title */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group text-left cursor-pointer animate-fade-in"
          >
            <img 
              src={logoSrc} 
              alt="Silvia Helena Logo" 
              className="h-10 md:h-12 w-auto object-contain brightness-100 transition-all duration-300 hover:brightness-110"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col items-start border-l border-brand-light/15 pl-3">
              <span className="font-serif text-sm md:text-base font-light uppercase tracking-[0.2em] text-brand-light transition-all duration-300 group-hover:text-brand-gold">
                SILVIA HELENA
              </span>
              <span className="text-[7px] md:text-[7.5px] font-mono tracking-[0.2em] text-brand-gold/60 mt-1 uppercase">
                CRECISP 125743
              </span>
              <span 
                className="text-[8px] md:text-[9px] font-light uppercase tracking-[0.3em] text-brand-muted mt-1 block leading-relaxed"
                style={{ paddingLeft: '0px', marginRight: '25px', marginBottom: '8px' }}
              >
                {t('hero_badge').toLowerCase().includes('patrimônio imobiliário') ? (
                  <>
                    Patrimônio Imobiliário
                    <br />
                    Privado de Luxo
                  </>
                ) : (
                  t('hero_badge')
                )}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-12 xl:space-x-16">
            {navItems.map((item) => {
              const isActive = activeSection === item.target;
              return (
                <button
                  key={item.target}
                  onClick={() => scrollToSection(item.target)}
                  className={`relative text-xs font-light uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                    isActive ? 'text-brand-gold font-medium' : 'text-brand-muted hover:text-brand-light'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[1px] bg-brand-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Utilities (Favorites, Private Button) */}
          <div className="flex items-center space-x-4 md:space-x-8">

            <button
              onClick={onOpenFavorites}
              className="relative p-2 text-brand-muted hover:text-brand-gold transition-colors duration-300 cursor-pointer flex items-center gap-1"
              aria-label="Favorites portfolio"
            >
              <Heart
                size={18}
                className={favorites.length > 0 ? 'fill-brand-gold text-brand-gold animate-pulse' : ''}
              />
              <AnimatePresence>
                {favorites.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-brand-gold text-brand-bg text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {favorites.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Quick Consultation CTA */}
            <button
              onClick={() => scrollToSection('contact')}
              className="hidden lg:flex items-center gap-2 border border-brand-gold/30 hover:border-brand-gold bg-brand-gold/5 hover:bg-brand-gold/15 text-brand-gold px-5 py-2 rounded-none text-xs font-light uppercase tracking-[0.2em] transition-all duration-500 cursor-pointer"
            >
              <MessageSquare size={12} />
              <span>{t('header_cta_consultation')}</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-brand-light hover:text-brand-gold transition-colors duration-300 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-brand-bg flex flex-col justify-between pt-28 pb-12 px-8 border-b border-brand-light/5"
          >
            <div className="flex flex-col space-y-8 mt-4">
              <div className="text-[10px] tracking-[0.25em] text-brand-muted uppercase font-light">
                {t('mobile_menu_title')}
              </div>
              <nav className="flex flex-col space-y-6">
                {navItems.map((item, index) => (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={item.target}
                    onClick={() => scrollToSection(item.target)}
                    className="text-left font-serif text-3xl font-light tracking-wide text-brand-light hover:text-brand-gold transition-colors duration-300 uppercase"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </div>

            <div className="flex flex-col space-y-6">

              <div className="border-t border-brand-light/10 pt-6 flex flex-col space-y-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenFavorites();
                  }}
                  className="flex items-center gap-3 text-brand-light text-sm font-light uppercase tracking-widest"
                >
                  <Heart size={16} className="text-brand-gold fill-brand-gold/25" />
                  <span>{t('mobile_menu_favs', [favorites.length])}</span>
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="flex items-center gap-3 text-brand-gold text-sm font-light uppercase tracking-widest"
                >
                  <MessageSquare size={16} />
                  <span>{t('mobile_menu_contact')}</span>
                </button>
              </div>

              <div className="flex justify-between items-center text-[10px] tracking-widest text-brand-muted uppercase mt-4">
                <span>© SILVIA HELENA</span>
                <span className="flex items-center gap-1">
                  <Award size={10} className="text-brand-gold" />
                  <span>{t('hero_badge')}</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
