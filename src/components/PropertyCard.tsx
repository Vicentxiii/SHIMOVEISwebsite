/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Maximize2, MapPin, Eye } from 'lucide-react';
import { Property } from '../types';
import { useFavorites } from './FavoritesContext';
import { useLanguage } from './LanguageContext';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  index: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, index }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t } = useLanguage();
  const fav = isFavorite(property.id);

  // Alternate visual layout configurations for an asynchronous magazine-spread rhythm
  const isWideCard = index % 3 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-2xl bg-brand-bg/40 border border-brand-light/5 hover:border-brand-gold/45 hover:shadow-[0_0_20px_rgba(197,160,89,0.18)] transition-all duration-500 flex flex-col ${
        isWideCard ? 'col-span-1 md:col-span-2' : 'col-span-1'
      }`}
    >
      {/* Absolute Badges */}
      <div className="absolute top-5 left-5 z-20 flex flex-col items-start gap-2">
        <span className="bg-brand-bg/90 backdrop-blur-md text-[9px] font-light tracking-[0.2em] text-brand-gold px-3 py-1 border border-brand-gold/20 uppercase">
          {property.type}
        </span>
      </div>

      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className="p-2.5 bg-brand-bg/90 backdrop-blur-md rounded-full border border-brand-light/10 text-brand-light hover:text-brand-gold transition-colors duration-300 cursor-pointer"
          aria-label="Add to private portfolio"
        >
          <Heart size={14} className={fav ? 'fill-brand-gold text-brand-gold' : 'text-brand-light'} />
        </button>
      </div>

      {/* Main Image Container */}
      <div 
        onClick={() => onSelect(property)}
        className="relative overflow-hidden aspect-[16/10] md:aspect-[16/9] cursor-pointer"
      >
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Cinematic dark mask overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        
        {/* Centered micro hover indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="bg-brand-bg/95 backdrop-blur-md px-5 py-2.5 border border-brand-gold/30 text-xs font-light tracking-[0.25em] uppercase text-brand-gold flex items-center gap-2">
            <Eye size={12} />
            <span>{t('card_view_details')}</span>
          </span>
        </div>
      </div>

      {/* Editorial Text Content Block */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-brand-muted uppercase font-light">
            <MapPin size={10} className="text-brand-gold" />
            <span>{property.location}</span>
          </div>

          <h3 
            onClick={() => onSelect(property)}
            className="font-serif text-xl md:text-2xl text-brand-light font-light group-hover:text-brand-gold transition-colors duration-300 tracking-tight cursor-pointer"
          >
            {property.title}
          </h3>

          <p className="text-xs text-brand-muted italic font-light tracking-wide max-w-lg">
            {property.tagline}
          </p>
        </div>

        {/* Technical Grid / Specs Footer */}
        <div className="border-t border-brand-light/10 pt-6 mt-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-6 text-[10px] md:text-xs text-brand-muted tracking-wider font-light">
            {property.bedrooms > 0 && (
              <div>
                <span className="text-brand-light font-medium">{property.bedrooms}</span> {t('details_beds')}
              </div>
            )}
            {property.bathrooms > 0 && (
              <div>
                <span className="text-brand-light font-medium">{property.bathrooms}</span> {t('details_baths')}
              </div>
            )}
            {property.garage > 0 && (
              <div>
                <span className="text-brand-light font-medium">{property.garage}</span> {t('details_garages')}
              </div>
            )}
            <div>
              <span className="text-brand-light font-medium">{property.area}</span>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="text-right">
            <p className="text-[9px] tracking-widest text-brand-muted uppercase font-light">{t('nav_advisor')} Price</p>
            <p className="font-serif text-lg md:text-xl text-brand-gold font-light tracking-tight">
              {property.formattedPrice}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
