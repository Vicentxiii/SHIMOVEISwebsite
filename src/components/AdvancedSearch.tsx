/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, RotateCcw, X, Home, Compass } from 'lucide-react';
import { PropertyType } from '../types';
import { useLanguage } from './LanguageContext';

interface AdvancedSearchProps {
  onFilterChange: (filters: FilterState) => void;
  availableLocations: string[];
}

export interface FilterState {
  type: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'any';
  bathrooms: number | 'any';
  garage: number | 'any';
  hasSwimmingPool: boolean;
  hasGarden: boolean;
  hasOceanView: boolean;
  isPetFriendly: boolean;
}

const initialFilters: FilterState = {
  type: 'all',
  location: 'all',
  minPrice: 0,
  maxPrice: 30, // in Millions USD
  bedrooms: 'any',
  bathrooms: 'any',
  garage: 'any',
  hasSwimmingPool: false,
  hasGarden: false,
  hasOceanView: false,
  isPetFriendly: false
};

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onFilterChange, availableLocations }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const propertyTypes: (PropertyType | 'all')[] = [
    'all',
    'House',
    'Apartment',
    'Luxury Mansion',
    'Kitnet',
    'Land',
    'Commercial',
    'Farm',
    'Beach House'
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.type !== 'all') count++;
    if (filters.location !== 'all') count++;
    if (filters.minPrice > 0 || filters.maxPrice < 30) count++;
    if (filters.bedrooms !== 'any') count++;
    if (filters.bathrooms !== 'any') count++;
    if (filters.garage !== 'any') count++;
    if (filters.hasSwimmingPool) count++;
    if (filters.hasGarden) count++;
    if (filters.hasOceanView) count++;
    if (filters.isPetFriendly) count++;
    return count;
  };

  return (
    <div className="w-full bg-brand-bg relative z-20">
      {/* Search Header Bar */}
      <div className="border border-brand-light/10 p-4 md:p-6 bg-[#210c14] flex flex-col md:flex-row gap-4 justify-between items-center rounded-2xl hover:border-brand-gold/45 hover:shadow-[0_0_20px_rgba(197,160,89,0.18)] transition-all duration-500">
        {/* Simple search overview status */}
        <div className="flex items-center gap-3 text-left w-full md:w-auto">
          <div className="p-2.5 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold">
            <Search size={16} />
          </div>
          <div>
            <h4 className="font-serif text-lg text-brand-light font-light">{t('portfolio_title')}</h4>
            <p className="text-[10px] tracking-widest text-brand-muted uppercase font-light">
              {t('portfolio_badge')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-light tracking-widest uppercase border rounded-xl transition-all duration-300 cursor-pointer ${
              isOpen || getActiveFilterCount() > 0
                ? 'border-brand-gold bg-brand-gold/5 text-brand-gold'
                : 'border-brand-light/15 hover:border-brand-light/30 text-brand-light'
            }`}
          >
            <SlidersHorizontal size={12} />
            <span>{t('filter_features')}</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-brand-gold text-brand-bg text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          {getActiveFilterCount() > 0 && (
            <button
              onClick={resetFilters}
              className="p-2.5 border border-brand-light/10 hover:border-brand-gold hover:text-brand-gold text-brand-muted transition-colors duration-300 cursor-pointer rounded-xl"
              title="Reset all filters"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Advanced Filters Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-x border-b border-brand-light/10 bg-[#1a080f]/90 backdrop-blur-md"
          >
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 rounded-b-2xl border-t border-brand-light/5">
              
              {/* Filter 1: Property Type */}
              <div className="space-y-2">
                <label className="text-[9px] tracking-widest text-brand-muted uppercase font-light block">
                  {t('filter_type')}
                </label>
                <div className="relative">
                  <select
                    value={filters.type}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    className="w-full bg-brand-bg border border-brand-light/10 focus:border-brand-gold py-2.5 px-3 text-xs tracking-widest text-brand-light uppercase rounded-xl outline-none cursor-pointer"
                  >
                    {propertyTypes.map((tItem) => (
                      <option key={tItem} value={tItem} className="bg-brand-bg text-brand-light">
                        {tItem === 'all' ? t('filter_placeholder_type') : tItem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter 2: Location */}
              <div className="space-y-2">
                <label className="text-[9px] tracking-widest text-brand-muted uppercase font-light block">
                  {t('filter_location')}
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  className="w-full bg-brand-bg border border-brand-light/10 focus:border-brand-gold py-2.5 px-3 text-xs tracking-widest text-brand-light uppercase rounded-xl outline-none cursor-pointer"
                >
                  <option value="all" className="bg-brand-bg text-brand-light">{t('filter_placeholder_location')}</option>
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc} className="bg-brand-bg text-brand-light">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 3: Bedrooms, Bathrooms, Garage */}
              <div className="space-y-2">
                <label className="text-[9px] tracking-widest text-brand-muted uppercase font-light block">
                  {t('filter_bedrooms')} / {t('filter_bathrooms')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => updateFilter('bedrooms', e.target.value === 'any' ? 'any' : Number(e.target.value))}
                    className="bg-brand-bg border border-brand-light/10 focus:border-brand-gold py-2.5 text-center text-xs text-brand-light rounded-xl outline-none cursor-pointer"
                  >
                    <option value="any">{t('details_beds')}</option>
                    {[1, 2, 4, 5, 6, 8].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>

                  <select
                    value={filters.bathrooms}
                    onChange={(e) => updateFilter('bathrooms', e.target.value === 'any' ? 'any' : Number(e.target.value))}
                    className="bg-brand-bg border border-brand-light/10 focus:border-brand-gold py-2.5 text-center text-xs text-brand-light rounded-xl outline-none cursor-pointer"
                  >
                    <option value="any">{t('details_baths')}</option>
                    {[1, 2, 4, 5, 6, 8, 9].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>

                  <select
                    value={filters.garage}
                    onChange={(e) => updateFilter('garage', e.target.value === 'any' ? 'any' : Number(e.target.value))}
                    className="bg-brand-bg border border-brand-light/10 focus:border-brand-gold py-2.5 text-center text-xs text-brand-light rounded-xl outline-none cursor-pointer"
                  >
                    <option value="any">{t('details_garages')}</option>
                    {[1, 2, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
              </div>

              {/* Filter 4: Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] tracking-widest text-brand-muted uppercase font-light">
                  <span>{t('filter_max_price')}</span>
                  <span className="text-brand-gold font-medium">{t('filter_up_to', [filters.maxPrice])}</span>
                </div>
                <div className="pt-2">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                    className="w-full accent-brand-gold bg-brand-light/10 h-1 cursor-pointer rounded-none outline-none"
                  />
                  <div className="flex justify-between text-[8px] text-brand-muted mt-1 uppercase">
                    <span>R$ 0</span>
                    <span>R$ 15 Mi</span>
                    <span>R$ 30 Mi+</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Premium Features Row */}
            <div className="px-6 md:px-8 pb-6 border-t border-brand-light/5 pt-4">
              <p className="text-[9px] tracking-widest text-brand-muted uppercase font-light mb-3">
                {t('filter_features')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Checkbox 1: Pool */}
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.hasSwimmingPool}
                    onChange={(e) => updateFilter('hasSwimmingPool', e.target.checked)}
                    className="rounded-none border-brand-light/20 text-brand-gold bg-brand-bg focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-brand-gold"
                  />
                  <span className="text-xs text-brand-muted font-light uppercase tracking-widest">{t('filter_swimming')}</span>
                </label>

                {/* Checkbox 2: Garden */}
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.hasGarden}
                    onChange={(e) => updateFilter('hasGarden', e.target.checked)}
                    className="rounded-none border-brand-light/20 text-brand-gold bg-brand-bg focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-brand-gold"
                  />
                  <span className="text-xs text-brand-muted font-light uppercase tracking-widest">{t('filter_garden')}</span>
                </label>

                {/* Checkbox 3: Ocean View */}
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.hasOceanView}
                    onChange={(e) => updateFilter('hasOceanView', e.target.checked)}
                    className="rounded-none border-brand-light/20 text-brand-gold bg-brand-bg focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-brand-gold"
                  />
                  <span className="text-xs text-brand-muted font-light uppercase tracking-widest">{t('filter_ocean')}</span>
                </label>

                {/* Checkbox 4: Pet Friendly */}
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.isPetFriendly}
                    onChange={(e) => updateFilter('isPetFriendly', e.target.checked)}
                    className="rounded-none border-brand-light/20 text-brand-gold bg-brand-bg focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-brand-gold"
                  />
                  <span className="text-xs text-brand-muted font-light uppercase tracking-widest">{t('filter_pet')}</span>
                </label>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
