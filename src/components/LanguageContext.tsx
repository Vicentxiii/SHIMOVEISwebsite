/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Testimonial, Lifestyle } from '../types';
import { PROPERTIES, TESTIMONIALS, LIFESTYLES } from '../propertiesData';
import {
  DICT,
  PROPERTIES_TRANSLATIONS,
  TESTIMONIALS_TRANSLATIONS,
  LIFESTYLES_TRANSLATIONS
} from '../translations';

export type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof DICT['pt'], replacements?: any[]) => string;
  properties: Property[];
  testimonials: Testimonial[];
  lifestyles: Lifestyle[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Locked to Brazilian Portuguese by user request
  const [language] = useState<Language>('pt');

  const setLanguage = (lang: Language) => {
    // No-op to keep it strictly Portuguese
  };

  // Translation helper with template replacement support
  const t = (key: keyof typeof DICT['pt'], replacements?: any[]): string => {
    const dictForLang = DICT[language] || DICT['pt'];
    let translated = dictForLang[key] || DICT['pt'][key] || String(key);
    
    if (replacements && replacements.length > 0) {
      replacements.forEach((rep, index) => {
        translated = translated.replace(`{${index}}`, String(rep));
      });
    }
    
    return translated;
  };

  // Get translated properties
  const getTranslatedProperties = (): Property[] => {
    if (language === 'en') return PROPERTIES;
    const transList = PROPERTIES_TRANSLATIONS[language];
    if (!transList) return PROPERTIES;

    return PROPERTIES.map((base) => {
      const trans = transList.find((p) => p.id === base.id);
      if (!trans) return base;
      return {
        ...base,
        title: trans.title || base.title,
        type: (trans.type as any) || base.type,
        location: trans.location || base.location,
        description: trans.description || base.description,
        features: trans.features || base.features,
        tagline: trans.tagline || base.tagline,
      };
    });
  };

  // Get translated testimonials
  const getTranslatedTestimonials = (): Testimonial[] => {
    if (language === 'en') return TESTIMONIALS;
    const transList = TESTIMONIALS_TRANSLATIONS[language];
    if (!transList) return TESTIMONIALS;

    return TESTIMONIALS.map((base) => {
      const trans = transList.find((t) => t.id === base.id);
      if (!trans) return base;
      return {
        ...base,
        quote: trans.quote || base.quote,
        role: trans.role || base.role,
      };
    });
  };

  // Get translated lifestyles
  const getTranslatedLifestyles = (): Lifestyle[] => {
    if (language === 'en') return LIFESTYLES;
    const transList = LIFESTYLES_TRANSLATIONS[language];
    if (!transList) return LIFESTYLES;

    return LIFESTYLES.map((base) => {
      const trans = transList.find((l) => l.id === base.id);
      if (!trans) return base;
      return {
        ...base,
        title: trans.title || base.title,
        subtitle: trans.subtitle || base.subtitle,
        description: trans.description || base.description,
        tagline: trans.tagline || base.tagline,
      };
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        properties: getTranslatedProperties(),
        testimonials: getTranslatedTestimonials(),
        lifestyles: getTranslatedLifestyles(),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
