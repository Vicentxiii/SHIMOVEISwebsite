/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, TrendingUp, Sparkles, Award } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import silviaPortrait from '../assets/images/silvia_helena_portrait_3.png';
export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  const achievements = [
    {
      icon: <Award className="text-brand-gold" size={20} />,
      title: t('about_ach1_title'),
      description: t('about_ach1_desc')
    },
    {
      icon: <TrendingUp className="text-brand-gold" size={20} />,
      title: t('about_ach2_title'),
      description: t('about_ach2_desc')
    },
    {
      icon: <ShieldCheck className="text-brand-gold" size={20} />,
      title: t('about_ach3_title'),
      description: t('about_ach3_desc')
    }
  ];

  return (
    <section id="about" className="py-24 md:py-36 bg-brand-bg relative overflow-hidden">
      {/* Background radial soft gold glow */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] luxury-blur-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left Column: Portrait & Stats (Editorial Layout) */}
          <div className="col-span-1 lg:col-span-5 flex flex-col space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#241219] border border-brand-light/5 hover:border-brand-gold/40 hover:shadow-[0_0_20px_rgba(197,160,89,0.18)] transition-all duration-500"
            >
              {/* Premium Thin Double Border */}
              <div className="absolute inset-4 border border-brand-gold/15 rounded-xl pointer-events-none z-10" />
              <img
                src={silviaPortrait}
                className="w-full h-full object-cover object-top scale-[1.2] grayscale-[15%] hover:scale-125 transition-transform duration-[2.5s] ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-brand-bg/90 backdrop-blur-md p-5 border border-brand-light/5 rounded-xl z-10">
                <p className="font-serif text-lg text-brand-gold">Silvia Helena</p>
                <p className="text-[10px] tracking-[0.25em] text-brand-muted uppercase font-light mt-1">
                  {t('about_role')}
                </p>
              </div>
            </motion.div>

            {/* Micro Stats Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="grid grid-cols-3 gap-4 border-t border-brand-light/10 pt-8 text-center lg:text-left"
            >
              <div>
                <div className="h-14 flex items-end justify-center lg:justify-start pb-1">
                  <p className="font-serif text-3xl md:text-4xl text-brand-gold font-light leading-none">{t('about_stat1_val')}</p>
                </div>
                <p className="text-[9px] tracking-widest text-brand-muted uppercase mt-2">{t('about_stat1_lbl')}</p>
              </div>
              <div className="border-x border-brand-light/10 px-4">
                <div className="h-14 flex flex-col justify-end items-center lg:items-start pb-1">
                  <span className="font-serif text-xs md:text-sm text-brand-gold/60 tracking-wider leading-none">R$</span>
                  <span className="font-serif text-3xl md:text-4xl text-brand-gold font-light mt-1 leading-none">123M+</span>
                </div>
                <p className="text-[9px] tracking-widest text-brand-muted uppercase mt-2">{t('about_stat2_lbl')}</p>
              </div>
              <div>
                <div className="h-14 flex items-end justify-center lg:justify-start pb-1">
                  <p className="font-serif text-3xl md:text-4xl text-brand-gold font-light leading-none">{t('about_stat3_val')}</p>
                </div>
                <p className="text-[9px] tracking-widest text-brand-muted uppercase mt-2">{t('about_stat3_lbl')}</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Bio Narrative */}
          <div className="col-span-1 lg:col-span-7 flex flex-col space-y-12 lg:pl-4">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-xs tracking-[0.3em] text-brand-gold uppercase font-light"
              >
                {t('about_badge')}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-3xl md:text-5xl text-brand-light font-light leading-tight tracking-tight"
              >
                {t('about_title')}
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1.2 }}
              className="space-y-6 text-brand-muted text-sm md:text-base font-light leading-relaxed tracking-wide"
            >
              <p>
                {t('about_p1')}
              </p>
              <p>
                {t('about_p2')}
              </p>
              <p>
                {t('about_p3')}
              </p>
            </motion.div>

            {/* Core Values Rows */}
            <div className="space-y-6 border-t border-brand-light/10 pt-10">
              {achievements.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.8 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-brand-light/[0.02] border border-transparent hover:border-brand-gold/30 hover:shadow-[0_0_15px_rgba(197,160,89,0.12)] transition-all duration-300"
                >
                  <div className="p-2 bg-brand-light/[0.03] border border-brand-gold/20">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg text-brand-light font-medium tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-xs md:text-sm text-brand-muted font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Signature Block */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="pt-4 flex items-center justify-between border-b border-brand-light/5 pb-4"
            >
              <div>
                <p className="text-xs text-brand-muted tracking-widest font-light uppercase">{t('about_quote_label')}</p>
                <p className="font-serif italic text-brand-gold text-lg mt-2">{t('about_quote')}</p>
              </div>
              <div className="font-serif text-4xl text-brand-light/10 italic select-none">
                Silvia Helena
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};
