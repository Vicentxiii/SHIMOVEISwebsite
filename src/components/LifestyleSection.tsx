/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Compass, ShieldAlert, Award, Feather } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const LifestyleSection: React.FC = () => {
  const { t, lifestyles } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === lifestyles.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? lifestyles.length - 1 : prev - 1));
  };

  return (
    <section id="lifestyle" className="py-24 md:py-36 bg-[#1a080f] relative overflow-hidden">
      {/* Background soft red/purple ambient light */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] luxury-blur-bg pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Editorial Title Block */}
        <div className="max-w-3xl space-y-4 mb-16 md:mb-24">
          <div className="text-xs tracking-[0.3em] text-brand-gold uppercase font-light flex items-center gap-2">
            <Feather size={12} />
            <span>{t('life_badge')}</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-light font-light leading-tight tracking-tight">
            {t('life_title')}
          </h2>
        </div>

        {/* Dynamic Presentation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left: Interactive Details Indicator */}
          <div className="col-span-1 lg:col-span-5 space-y-10 order-2 lg:order-1">
            <div className="flex space-x-3">
              {lifestyles.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-[2px] transition-all duration-500 cursor-pointer ${
                    activeIndex === idx ? 'w-12 bg-brand-gold' : 'w-6 bg-brand-light/10'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="text-[10px] tracking-[0.35em] text-brand-gold uppercase font-light">
                  {lifestyles[activeIndex]?.tagline}
                </div>
                
                <h3 className="font-serif text-2xl md:text-3.5xl text-brand-light font-light leading-snug tracking-tight">
                  {lifestyles[activeIndex]?.title}
                  <span className="block text-brand-muted text-lg mt-1 font-sans font-light italic">
                    {lifestyles[activeIndex]?.subtitle}
                  </span>
                </h3>

                <p className="text-brand-muted text-sm md:text-base font-light leading-relaxed tracking-wide">
                  {lifestyles[activeIndex]?.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Micro Slider Controls */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                onClick={prevSlide}
                className="p-3 border border-brand-light/10 hover:border-brand-gold text-brand-light hover:text-brand-gold transition-colors duration-300 cursor-pointer rounded-xl"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 border border-brand-light/10 hover:border-brand-gold text-brand-light hover:text-brand-gold transition-colors duration-300 cursor-pointer rounded-xl"
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Large Editorial Graphic Container */}
          <div className="col-span-1 lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#241219] border border-brand-light/5 hover:border-brand-gold/40 hover:shadow-[0_0_20px_rgba(197,160,89,0.18)] transition-all duration-500">
              {/* Premium Thin Double Border on top of the image */}
              <div className="absolute inset-4 border border-brand-gold/15 rounded-xl pointer-events-none z-10" />
              
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.85 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  src={lifestyles[activeIndex]?.image}
                  alt={lifestyles[activeIndex]?.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Luxury dark vignetting filter */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent z-10" />
            </div>
          </div>

        </div>

        {/* Curated Lifestyle Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-t border-brand-light/10 pt-16 mt-20">
          {[
            { label: t('life_cat_arch'), val: t('life_cat_arch_val') },
            { label: t('life_cat_heritage'), val: t('life_cat_heritage_val') },
            { label: t('life_cat_wealth'), val: t('life_cat_wealth_val') },
            { label: t('life_cat_comfort'), val: t('life_cat_comfort_val') },
            { label: t('life_cat_nature'), val: t('life_cat_nature_val') }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-brand-gold text-xs tracking-widest font-light uppercase">{item.label}</p>
              <p className="text-brand-muted text-[10px] tracking-wider font-light uppercase">{item.val}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
