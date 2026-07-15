/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Calendar, Clock, Lock, Check } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: 'R$ 5M - R$ 10M',
    type: 'Luxury Mansion',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setFormSubmitted(true);
    }, 1000);
  };

  const contactOptions = [
    {
      icon: <Clock size={16} className="text-brand-gold" />,
      title: t('about_ach1_title'), // Prompt Engagement style
      description: t('about_ach1_desc')
    },
    {
      icon: <Lock size={16} className="text-brand-gold" />,
      title: t('about_ach3_title'), // Absolute Advocacy / Protected style
      description: t('about_ach3_desc')
    }
  ];

  return (
    <section id="contact" className="py-24 md:py-36 bg-brand-bg relative overflow-hidden">
      {/* Soft circular luxury gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] luxury-blur-bg pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Direct Inroads & Trust Markers */}
          <div className="col-span-1 lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.3em] text-brand-gold uppercase font-light block">
                {t('contact_badge')}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-brand-light font-light leading-tight tracking-tight">
                {t('contact_title')}
              </h2>
              <p className="text-brand-muted text-sm md:text-base font-light leading-relaxed tracking-wide">
                {t('contact_subtitle')}
              </p>
            </div>

            {/* Micro Details Grid */}
            <div className="space-y-6 pt-6 border-t border-brand-light/10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-light/[0.02] border border-brand-gold/15 text-brand-gold mt-1">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-brand-muted uppercase font-light">Canal de E-mail</p>
                  <a href="mailto:silvia.vic2018@gmail.com" className="font-serif text-lg text-brand-light hover:text-brand-gold transition-colors mt-1 block">
                    silvia.vic2018@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-light/[0.02] border border-[#25D366]/30 text-[#25D366] mt-1">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-brand-muted uppercase font-light flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
                    WhatsApp Direct
                  </p>
                  <a href="http://wa.me/5511940840966" target="_blank" rel="noopener noreferrer" className="font-serif text-lg text-brand-light hover:text-[#25D366] transition-colors mt-1 block">
                    +55 11 94084-0966
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-light/[0.02] border border-brand-gold/15 text-brand-gold mt-1">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-brand-muted uppercase font-light">Localização do Escritório</p>
                  <p className="font-serif text-lg text-brand-light mt-1">
                    Rua Alfredo Mendes da Silva, 395
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Encrypted Form Box */}
          <div className="col-span-1 lg:col-span-7 bg-[#1c0810]/60 border border-brand-light/10 p-8 md:p-12 relative rounded-2xl hover:border-brand-gold/45 hover:shadow-[0_0_20px_rgba(197,160,89,0.18)] transition-all duration-500">
            {/* Elegant corner decorative design accents */}
            <div className="absolute top-0 left-0 w-4 h-[1px] bg-brand-gold" />
            <div className="absolute top-0 left-0 w-[1px] h-4 bg-brand-gold" />
            <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-brand-gold" />
            <div className="absolute bottom-0 right-0 w-[1px] h-4 bg-brand-gold" />

            <div className="space-y-6 mb-8">
              <h3 className="font-serif text-2xl text-brand-light font-light tracking-wide">
                {t('contact_badge')}
              </h3>
              <p className="text-xs text-brand-muted font-light leading-relaxed">
                {t('contact_subtitle')}
              </p>
            </div>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-gold/[0.03] border border-brand-gold/30 p-8 text-center space-y-4"
              >
                <div className="w-12 h-12 bg-brand-gold/10 border border-brand-gold/40 rounded-full flex items-center justify-center mx-auto text-brand-gold">
                  <Check size={20} />
                </div>
                <h4 className="font-serif text-xl text-brand-gold font-light">{t('contact_success_title')}</h4>
                <p className="text-xs text-brand-muted leading-relaxed font-light max-w-md mx-auto">
                  {t('contact_success_desc')}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1">
                    <label htmlFor="contact-name" className="text-[9px] tracking-widest text-brand-muted uppercase font-light">
                      {t('contact_form_name')}
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      required
                      placeholder="e.g. Richard Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 px-4 py-3 text-xs tracking-wider uppercase text-brand-light placeholder-brand-muted/45 rounded-xl outline-none transition-all duration-300 font-light"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="contact-email" className="text-[9px] tracking-widest text-brand-muted uppercase font-light">
                      {t('contact_form_email')}
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      required
                      placeholder="e.g. richard@vancewealth.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 px-4 py-3 text-xs tracking-wider uppercase text-brand-light placeholder-brand-muted/45 rounded-xl outline-none transition-all duration-300 font-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label htmlFor="contact-phone" className="text-[9px] tracking-widest text-brand-muted uppercase font-light">
                      {t('contact_form_phone')}
                    </label>
                    <input
                      type="text"
                      id="contact-phone"
                      required
                      placeholder="e.g. +55 11 99999.0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 px-4 py-3 text-xs tracking-wider uppercase text-brand-light placeholder-brand-muted/45 rounded-xl outline-none transition-all duration-300 font-light"
                    />
                  </div>

                  {/* Budget Selector */}
                  <div className="space-y-1">
                    <label htmlFor="contact-budget" className="text-[9px] tracking-widest text-brand-muted uppercase font-light">
                      {t('contact_form_cap')}
                    </label>
                    <select
                      id="contact-budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 px-4 py-3 text-xs tracking-widest uppercase text-brand-light rounded-xl outline-none cursor-pointer font-light"
                    >
                      <option value="R$ 1M - R$ 5M">R$ 1M - R$ 5M BRL</option>
                      <option value="R$ 5M - R$ 10M">R$ 5M - R$ 10M BRL</option>
                      <option value="R$ 10M - R$ 20M">R$ 10M - R$ 20M BRL</option>
                      <option value="R$ 20M+">R$ 20M+ BRL (Custom Legacy)</option>
                    </select>
                  </div>
                </div>

                {/* Desired Estate Type */}
                <div className="space-y-1">
                  <label htmlFor="contact-type" className="text-[9px] tracking-widest text-brand-muted uppercase font-light">
                    {t('contact_form_type')}
                  </label>
                  <select
                    id="contact-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 px-4 py-3 text-xs tracking-widest uppercase text-brand-light rounded-xl outline-none cursor-pointer font-light"
                  >
                    <option value="Luxury Mansion">{t('contact_type_buy')}</option>
                    <option value="Apartment">{t('contact_type_sell')}</option>
                    <option value="Beach House">{t('contact_type_portfolio')}</option>
                    <option value="Off Market">{t('contact_type_offmarket')}</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label htmlFor="contact-msg" className="text-[9px] tracking-widest text-brand-muted uppercase font-light">
                    {t('contact_form_notes')}
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    placeholder={t('contact_form_notes_placeholder')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-brand-bg/50 border border-brand-light/10 focus:border-brand-gold hover:border-brand-gold/40 p-4 text-xs tracking-wider uppercase text-brand-light placeholder-brand-muted/45 rounded-xl outline-none transition-all duration-300 font-light resize-none"
                  />
                </div>

                {/* Terms of Confidentiality */}
                <div className="flex items-start gap-2 text-[10px] text-brand-muted leading-relaxed font-light">
                  <input
                    type="checkbox"
                    required
                    id="privacy-chk"
                    className="mt-0.5 accent-brand-gold"
                  />
                  <label htmlFor="privacy-chk" className="cursor-pointer select-none">
                    {t('contact_privacy_note')}
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-bg py-4 text-xs font-light uppercase tracking-[0.3em] rounded-xl transition-all duration-500 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{t('contact_form_submit')}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
