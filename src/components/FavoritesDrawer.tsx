/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Eye, ArrowRight, ShieldCheck, Mail, Check } from 'lucide-react';
import { useFavorites } from './FavoritesContext';
import { useLanguage } from './LanguageContext';
import { Property } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({ isOpen, onClose, onSelectProperty }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { properties, t } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const favoritedProperties = properties.filter((p) => favorites.includes(p.id));

  const handleInquireAll = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setFormSubmitted(true);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-brand-bg border-l border-brand-light/10 p-6 md:p-8 flex flex-col justify-between rounded-l-3xl"
          >
            {/* Header */}
            <div>
              <div className="flex justify-between items-center pb-6 border-b border-brand-light/10">
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-brand-gold fill-brand-gold/30" />
                  <h3 className="font-serif text-lg text-brand-light font-light uppercase tracking-widest">
                    {t('fav_header', [favoritedProperties.length])}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-brand-muted hover:text-brand-gold transition-colors duration-300 cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Content */}
              <div className="mt-6 flex-1 overflow-y-auto space-y-6 max-h-[55vh]">
                {favoritedProperties.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <p className="text-sm text-brand-muted font-light">
                      {t('fav_empty')}
                    </p>
                    <p className="text-xs text-brand-gold/80 font-light italic text-center">
                      {t('fav_empty_desc')}
                    </p>
                  </div>
                ) : (
                  favoritedProperties.map((p) => (
                    <div
                      key={p.id}
                      className="group flex gap-4 p-3 bg-brand-light/[0.02] border border-brand-light/5 hover:border-brand-gold/45 hover:shadow-[0_0_15px_rgba(197,160,89,0.12)] transition-all duration-300 rounded-2xl relative"
                    >
                      <div className="w-20 aspect-square overflow-hidden bg-brand-bg border border-brand-light/10 rounded-xl">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <p className="text-[9px] tracking-widest text-brand-gold uppercase font-light">
                            {p.type}
                          </p>
                          <h4 className="font-serif text-sm text-brand-light font-light group-hover:text-brand-gold transition-colors leading-tight mt-0.5">
                            {p.title}
                          </h4>
                          <p className="text-[10px] text-brand-muted mt-1 font-light">
                            {p.location}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-serif text-xs text-brand-gold font-light">
                            {p.formattedPrice}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onClose();
                                onSelectProperty(p);
                              }}
                              className="text-[9px] tracking-widest text-brand-light hover:text-brand-gold uppercase font-light flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Eye size={10} />
                              <span>{t('fav_examine')}</span>
                            </button>
                            <button
                              onClick={() => toggleFavorite(p.id)}
                              className="text-[9px] tracking-widest text-brand-muted hover:text-red-400 uppercase font-light cursor-pointer transition-colors"
                              title="Remove from saved portfolio"
                            >
                              {t('fav_remove')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Inquiry/Footer Area */}
            <div className="border-t border-brand-light/10 pt-6 mt-6">
              {favoritedProperties.length > 0 && (
                <>
                  {formSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-brand-gold/5 border border-brand-gold/30 p-4 text-center text-brand-light space-y-2 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-brand-gold/10 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto text-brand-gold">
                        <Check size={14} />
                      </div>
                      <p className="font-serif text-sm text-brand-gold font-light">{t('fav_collective_success')}</p>
                      <p className="text-[10px] text-brand-muted leading-relaxed font-light">
                        {t('fav_collective_success_desc', [favoritedProperties.length])}
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleInquireAll} className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-serif text-sm text-brand-light font-light uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-brand-gold" />
                          <span>{t('fav_collective_title')}</span>
                        </h4>
                        <p className="text-[10px] text-brand-muted leading-relaxed font-light">
                          {t('fav_collective_desc', [favoritedProperties.length])}
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder={t('fav_email_placeholder')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 pl-4 pr-10 py-3 text-xs tracking-widest uppercase text-brand-light placeholder-brand-muted/70 rounded-xl outline-none transition-all duration-300 font-light"
                        />
                        <button
                          type="submit"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold cursor-pointer transition-colors"
                          title="Submit"
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              <div className="text-[9px] text-center text-brand-muted tracking-widest uppercase font-light mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck size={10} className="text-brand-gold" />
                <span>{t('fav_channel_secured')}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
