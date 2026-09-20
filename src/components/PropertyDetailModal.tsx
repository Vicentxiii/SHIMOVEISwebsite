/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Heart, MapPin, Grid, Compass, Award, Shield, ShieldCheck, Calendar, ArrowRight, Check, Bed, Bath, Car, Maximize2 } from 'lucide-react';
import { Property } from '../types';
import { useFavorites } from './FavoritesContext';
import { useLanguage } from './LanguageContext';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t } = useLanguage();
  const [activeImage, setActiveImage] = useState(property.gallery[0]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: `Olá Silvia Helena, tenho interesse neste imóvel (ID: ${property.id}) e gostaria de agendar uma visita ou receber mais informações.` });

  const fav = isFavorite(property.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate high-end server contact
    setTimeout(() => {
      setFormSubmitted(true);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-brand-bg/98 overflow-y-auto backdrop-blur-md pt-20"
    >
      {/* Top sticky controls */}
      <div className="fixed top-0 left-0 right-0 h-20 px-6 md:px-12 flex justify-between items-center z-50 bg-brand-bg/95 border-b border-brand-light/5">
        <div className="flex items-center gap-3">
          <Award size={18} className="text-brand-gold" />
          <span className="text-[10px] tracking-[0.3em] text-brand-muted uppercase font-light">
            {t('portfolio_unlisted_badge')}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => toggleFavorite(property.id)}
            className="p-2.5 rounded-full border border-brand-light/10 text-brand-light hover:text-brand-gold transition-colors duration-300 flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest font-light bg-brand-bg"
          >
            <Heart size={14} className={fav ? 'fill-brand-gold text-brand-gold' : ''} />
            <span className="hidden md:inline">{fav ? t('nav_portfolio') : t('nav_portfolio')}</span>
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full border border-brand-light/15 hover:border-brand-gold text-brand-light hover:text-brand-gold transition-all duration-300 cursor-pointer bg-brand-bg"
            aria-label="Close presentation"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Area: Large Image Display & Gallery Selector */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-brand-bg border border-brand-light/5 hover:border-brand-gold/45 hover:shadow-[0_0_20px_rgba(197,160,89,0.18)] transition-all duration-500"
          >
            <img
              src={activeImage}
              alt={`${property.title} em ${property.location} - ${property.bedrooms} quartos, ${property.area}, ${property.formattedPrice} - foto principal`}
              className="w-full h-full object-cover transition-all duration-700"
              referrerPolicy="no-referrer"
              width={1200}
              height={750}
              loading="eager"
              decoding="async"
            />
          </motion.div>

          {/* Thumbnails list */}
          <div className="grid grid-cols-4 gap-4">
            {property.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                  activeImage === img ? 'border-brand-gold ring-1 ring-brand-gold/30' : 'border-brand-light/10 hover:border-brand-light/30'
                }`}
              >
                <img
                  src={img}
                  alt={`${property.title} detail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Localização — copy de autoridade PT-BR */}
          <div className="border border-brand-light/10 p-6 md:p-8 space-y-4 rounded-2xl hover:border-brand-gold/45 hover:shadow-[0_0_20px_rgba(197,160,89,0.18)] transition-all duration-500">
            <div className="flex items-center gap-2">
              <Compass className="text-brand-gold" size={16} />
              <h4 className="font-serif text-lg text-brand-light font-light">Localização</h4>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed font-light">
              Imóvel selecionado e verificado pela nossa equipe. Garantia de segurança jurídica e confidencialidade em todo o processo de negociação.
            </p>
            {/* Visual Abstract Luxury Map Art */}
            <div className="relative h-48 rounded-xl bg-[#1f0912] border border-brand-light/5 flex items-center justify-center overflow-hidden">
              <svg className="absolute inset-0 w-full h-full text-brand-gold/5" stroke="currentColor" strokeWidth="0.5">
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Simulated contour lines / abstract architectural map paths */}
                <path d="M 50 100 Q 150 50 250 150 T 450 100 T 650 200" fill="none" strokeWidth="1" className="text-brand-gold/15" />
                <path d="M 20 180 Q 200 120 300 220 T 550 180" fill="none" strokeWidth="1.5" className="text-brand-gold/20 animate-pulse" />
                {/* Pulsing luxurious location target beacon */}
                <circle cx="300" cy="120" r="15" className="text-brand-gold/10 fill-brand-gold/10" />
                <circle cx="300" cy="120" r="4" className="fill-brand-gold text-brand-gold" />
              </svg>
              <div className="relative text-center p-4 bg-brand-bg/90 backdrop-blur-md border border-brand-light/10 rounded-xl">
                <p className="text-[10px] tracking-[0.18em] text-brand-gold uppercase font-light">LOCALIZAÇÃO APROXIMADA</p>
                <p className="text-xs text-brand-muted mt-1 font-light flex items-center justify-center gap-1">
                  <MapPin size={10} className="text-brand-gold" aria-hidden="true" />
                  <span>{property.location}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Editorial Metadata & Private Booking Form */}
        <div className="lg:col-span-5 flex flex-col space-y-10">
          
          {/* Header Typography — PT-BR */}
          <div className="space-y-4">
            <span className="text-xs tracking-[0.3em] text-brand-gold uppercase font-light">
              APRESENTAÇÃO DO IMÓVEL
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-light font-light leading-tight tracking-tight">
              {property.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-brand-muted tracking-wider font-light">
              <MapPin size={12} className="text-brand-gold" />
              <span>{property.location}</span>
            </div>
            <p className="text-[10px] tracking-widest text-brand-muted uppercase font-light">Cód: {property.id}</p>
          </div>

          {/* Primary Financial Indicator & Size — PT-BR */}
          <div className="grid grid-cols-2 gap-4 border-y border-brand-light/10 py-6">
            <div>
              <p className="text-[9px] tracking-[0.2em] text-brand-muted uppercase font-light">VALOR DO IMÓVEL</p>
              <p className="font-serif text-2xl text-brand-gold font-light mt-1">{property.formattedPrice}</p>
            </div>
            <div className="border-l border-brand-light/10 pl-6">
              <p className="text-[9px] tracking-[0.2em] text-brand-muted uppercase font-light">ÁREA PRIVATIVA</p>
              <p className="font-serif text-2xl text-brand-light font-light mt-1">{property.area}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 text-brand-muted text-sm md:text-base font-light leading-relaxed tracking-wide">
            <p>{property.description}</p>
          </div>

          {/* Características unificadas — lista limpa com ícones sutis */}
          <div className="bg-brand-light/[0.02] border border-brand-light/5 rounded-2xl p-5 md:p-6 space-y-4 hover:border-brand-gold/45 hover:shadow-[0_0_20px_rgba(197,160,89,0.18)] transition-all duration-500">
            <h4 className="font-serif text-sm tracking-[0.16em] uppercase text-brand-light font-medium border-b border-brand-light/5 pb-3">
              O QUE A CORRETORA DESTACA AQUI
            </h4>
            <ul className="grid grid-cols-2 gap-3 text-xs" aria-label="Características do imóvel">
              <li className="flex items-center gap-2 bg-brand-bg/40 border border-brand-light/5 rounded-xl px-3 py-2.5">
                <Bed size={14} className="text-brand-gold shrink-0" aria-hidden="true" />
                <span className="text-brand-muted">Quartos</span>
                <span className="ml-auto text-brand-light font-semibold">{property.bedrooms}</span>
              </li>
              <li className="flex items-center gap-2 bg-brand-bg/40 border border-brand-light/5 rounded-xl px-3 py-2.5">
                <Bath size={14} className="text-brand-gold shrink-0" aria-hidden="true" />
                <span className="text-brand-muted">Banheiros</span>
                <span className="ml-auto text-brand-light font-semibold">{property.bathrooms}</span>
              </li>
              <li className="flex items-center gap-2 bg-brand-bg/40 border border-brand-light/5 rounded-xl px-3 py-2.5">
                <Car size={14} className="text-brand-gold shrink-0" aria-hidden="true" />
                <span className="text-brand-muted">Vagas</span>
                <span className="ml-auto text-brand-light font-semibold">{property.garage}</span>
              </li>
              <li className="flex items-center gap-2 bg-brand-bg/40 border border-brand-light/5 rounded-xl px-3 py-2.5">
                <Maximize2 size={14} className="text-brand-gold shrink-0" aria-hidden="true" />
                <span className="text-brand-muted">Área</span>
                <span className="ml-auto text-brand-light font-semibold">{property.area}</span>
              </li>
              <li className="flex items-center gap-2 bg-brand-bg/40 border border-brand-light/5 rounded-xl px-3 py-2.5">
                <Award size={14} className="text-brand-gold shrink-0" aria-hidden="true" />
                <span className="text-brand-muted">Tipo</span>
                <span className="ml-auto text-brand-light font-semibold truncate">{property.type}</span>
              </li>
              <li className="flex items-center gap-2 bg-brand-bg/40 border border-brand-light/5 rounded-xl px-3 py-2.5">
                <ShieldCheck size={14} className="text-brand-gold shrink-0" aria-hidden="true" />
                <span className="text-brand-muted">Finalidade</span>
                <span className="ml-auto text-brand-light font-semibold">{(property as any).finalidade || 'Venda'}</span>
              </li>
            </ul>
            {(property.architect || property.yearBuilt) && (
              <div className="pt-3 border-t border-brand-light/5 text-xs text-brand-muted space-y-1">
                {property.architect && <p>Arquiteto: <span className="text-brand-light font-medium">{property.architect}</span></p>}
                {property.yearBuilt && <p>Ano: <span className="text-brand-light font-medium">{property.yearBuilt}</span></p>}
              </div>
            )}
          </div>

          {/* Formulário — PT-BR, corrigido */}
          <div className="border border-brand-gold/25 p-6 md:p-8 space-y-6 bg-brand-gold/[0.01] rounded-2xl hover:border-brand-gold/45 hover:shadow-[0_0_20px_rgba(197,160,89,0.18)] transition-all duration-500">
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-xs text-brand-gold tracking-widest uppercase font-light">
                <Shield size={12} aria-hidden="true" />
                <span>Canal protegido por NDA</span>
              </span>
              <h4 className="font-serif text-xl text-brand-light font-light leading-tight">Fale com a Silvia sobre este imóvel</h4>
              <p className="text-xs text-brand-muted font-light leading-relaxed">
                Quer comprar, vender ou tirar dúvidas? Envie sua mensagem. Retorno em até 2 horas.
              </p>
            </div>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-gold/10 border border-brand-gold/40 p-6 text-center text-brand-light space-y-3"
              >
                <div className="w-10 h-10 bg-brand-gold/20 border border-brand-gold rounded-full flex items-center justify-center mx-auto text-brand-gold">
                  <Check size={18} />
                </div>
                <h5 className="font-serif text-lg text-brand-gold font-light">{t('details_success_title')}</h5>
                <p className="text-xs text-brand-muted leading-relaxed font-light">
                  {t('details_success_desc')}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="modal-name" className="sr-only">Seu nome</label>
                  <input
                    type="text"
                    id="modal-name"
                    required
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 px-4 py-3 text-sm text-brand-light placeholder:text-brand-muted/60 placeholder:text-sm rounded-xl outline-none transition-all duration-300"
                    autoComplete="name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-email" className="sr-only">Seu melhor e-mail</label>
                    <input
                      type="email"
                      id="modal-email"
                      required
                      placeholder="Seu melhor e-mail"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 px-4 py-3 text-sm text-brand-light placeholder:text-brand-muted/60 placeholder:text-sm rounded-xl outline-none transition-all duration-300"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-phone" className="sr-only">WhatsApp com DDD</label>
                    <input
                      type="tel"
                      id="modal-phone"
                      required
                      placeholder="WhatsApp com DDD"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 px-4 py-3 text-sm text-brand-light placeholder:text-brand-muted/60 placeholder:text-sm rounded-xl outline-none transition-all duration-300"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="modal-msg" className="sr-only">Mensagem</label>
                  <textarea
                    id="modal-msg"
                    rows={4}
                    placeholder={`Olá Silvia Helena, tenho interesse neste imóvel (ID: ${property.id}) e gostaria de agendar uma visita ou receber mais informações.`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 p-4 text-sm text-brand-light placeholder:text-brand-muted/60 placeholder:text-sm rounded-xl outline-none transition-all duration-300 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-bg py-4 text-xs font-semibold uppercase tracking-[0.18em] rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(212,163,115,0.25)]"
                >
                  <span>QUERO RECEBER DETALHES POR WHATSAPP</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
                <p className="text-[10px] text-brand-muted text-center leading-relaxed">Resposta em até 2 horas • Canal protegido por NDA.</p>
              </form>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
};
