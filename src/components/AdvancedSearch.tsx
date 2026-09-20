/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, RotateCcw, X, Home, Compass, ChevronDown } from 'lucide-react';
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
  minPrice: 80000,
  maxPrice: 10000000,
  bedrooms: 'any',
  bathrooms: 'any',
  garage: 'any',
  hasSwimmingPool: false,
  hasGarden: false,
  hasOceanView: false,
  isPetFriendly: false
};

// ——— Submenu elegante custom ———
const CustomSelect: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const display = options.find(o => o.value === value)?.label || placeholder || value;
  const isPlaceholder = value === 'all';
  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-3 bg-brand-bg border py-3 md:py-2.5 px-4 pr-3 text-[14px] md:text-xs tracking-wide normal-case rounded-xl outline-none cursor-pointer transition-colors ${
          open ? 'border-brand-gold bg-brand-bg' : 'border-brand-light/10 hover:border-brand-gold/30'
        } ${isPlaceholder ? 'text-brand-muted' : 'text-brand-light'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate text-left flex-1">{display}</span>
        <ChevronDown size={14} className={`text-brand-muted shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-brand-gold' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#1a0a12]/95 backdrop-blur-xl border border-brand-gold/15 shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_0_1px_rgba(212,163,115,0.08)] overflow-hidden"
            style={{ borderRadius: '12px 12px 20px 20px' }}
            role="listbox"
          >
            {/* topo sutil */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent pointer-events-none" aria-hidden="true" />
            <div className="max-h-[260px] overflow-y-auto overscroll-contain py-1.5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,163,115,0.3) transparent' }}>
              {options.map(opt => {
                const active = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] md:text-xs tracking-wide normal-case transition-colors flex items-center justify-between gap-2 ${
                      active ? 'bg-brand-gold/10 text-brand-gold font-medium' : 'text-brand-light/90 hover:bg-white/[0.06] hover:text-brand-light'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MiniSelect: React.FC<{
  value: string | number;
  onChange: (v: any) => void;
  options: { value: any; label: string }[];
}> = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const display = options.find(o => String(o.value) === String(value))?.label || String(value);
  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-center gap-1 bg-brand-bg border py-3 md:py-2.5 px-2 text-[14px] md:text-xs rounded-xl outline-none cursor-pointer transition-colors ${open ? 'border-brand-gold text-brand-gold' : 'border-brand-light/10 text-brand-light hover:border-brand-gold/30'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{display}</span>
        <ChevronDown size={10} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-[#1a0a12]/95 backdrop-blur-xl border border-brand-gold/15 shadow-[0_12px_32px_rgba(0,0,0,0.5)] overflow-hidden"
            style={{ borderRadius: '12px 12px 20px 20px' }}
            role="listbox"
          >
            <div className="max-h-[200px] overflow-y-auto py-1" style={{ scrollbarWidth: 'thin' }}>
              {options.map(opt => {
                const active = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={`w-full px-3 py-2 text-xs text-center transition-colors ${active ? 'bg-brand-gold/10 text-brand-gold font-medium' : 'text-brand-light/90 hover:bg-white/[0.06]'}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onFilterChange, availableLocations }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  // Tipos reais que existem no banco (português Sanity + traduzidos) — garante que o filtro funciona
  const propertyTypes: string[] = [
    'all',
    'Apartamento',
    'Casa',
    'Mansões',
    'Kitnet',
    'Estúdio de Luxo',
    'Studio/Kitnet',
    'Terreno',
    'Comercial',
    'Fazenda',
    'Casa de Praia',
    'Cobertura',
    'Apartamento',
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  const handleBuscar = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.type !== 'all') count++;
    if (filters.location !== 'all') count++;
    if (filters.minPrice > 80000 || filters.maxPrice < 10000000) count++;
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
            className="overflow-visible border-x border-b border-brand-light/10 bg-[#1a080f]/90 backdrop-blur-md"
            style={{ borderRadius: '0 0 20px 20px' }}
          >
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ borderRadius: '0 0 20px 20px' }}>
              
              {/* Filter 1: Property Type */}
              <div className="space-y-2 min-w-0">
                <label className="text-[9px] tracking-widest text-brand-muted uppercase font-light block">
                  {t('filter_type')}
                </label>
                <CustomSelect
                  value={filters.type}
                  onChange={(v) => updateFilter('type', v)}
                  placeholder={t('filter_placeholder_type')}
                  options={propertyTypes.map(pt => ({ value: pt, label: pt === 'all' ? t('filter_placeholder_type') : pt }))}
                />
              </div>

              {/* Filter 2: Location */}
              <div className="space-y-2 min-w-0">
                <label className="text-[9px] tracking-widest text-brand-muted uppercase font-light block">
                  {t('filter_location')}
                </label>
                <CustomSelect
                  value={filters.location}
                  onChange={(v) => updateFilter('location', v)}
                  placeholder={t('filter_placeholder_location')}
                  options={[{ value: 'all', label: t('filter_placeholder_location') }, ...availableLocations.map(loc => ({ value: loc, label: loc }))]}
                />
              </div>

              {/* Filter 3: Bedrooms, Bathrooms, Garage */}
              <div className="space-y-2 min-w-0">
                <label className="text-[9px] tracking-widest text-brand-muted uppercase font-light block">
                  {t('filter_bedrooms')} / {t('filter_bathrooms')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <MiniSelect
                    value={filters.bedrooms}
                    onChange={(v) => updateFilter('bedrooms', v)}
                    options={[{ value: 'any', label: t('details_beds') }, ...[1, 2, 4, 5, 6, 8].map(n => ({ value: n, label: `${n}+` }))]}
                  />
                  <MiniSelect
                    value={filters.bathrooms}
                    onChange={(v) => updateFilter('bathrooms', v)}
                    options={[{ value: 'any', label: t('details_baths') }, ...[1, 2, 4, 5, 6, 8, 9].map(n => ({ value: n, label: `${n}+` }))]}
                  />
                  <MiniSelect
                    value={filters.garage}
                    onChange={(v) => updateFilter('garage', v)}
                    options={[{ value: 'any', label: t('details_garages') }, ...[1, 2, 4, 5, 6, 8, 10].map(n => ({ value: n, label: `${n}+` }))]}
                  />
                </div>
              </div>

              {/* Filter 4: Price Range Slider */}
              <div className="space-y-2 min-w-0">
                <div className="flex justify-between text-[9px] tracking-widest text-brand-muted uppercase font-light">
                  <span>{t('filter_max_price')}</span>
                  <span className="text-brand-gold font-medium">Até R$ {filters.maxPrice.toLocaleString('pt-BR')}</span>
                </div>
                <div className="pt-2">
                  <input
                    type="range"
                    min="80000"
                    max="10000000"
                    step="50000"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                    className="w-full accent-brand-gold bg-brand-light/10 h-1 cursor-pointer rounded-none outline-none"
                  />
                  <div className="flex justify-between text-[8px] text-brand-muted mt-1 uppercase">
                    <span>R$ 80.000</span>
                    <span>R$ 5.000.000</span>
                    <span>R$ 10.000.000</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Premium Features Row */}
            <div className="px-6 md:px-8 pb-6 border-t border-brand-light/5 pt-4 rounded-b-[20px]">
              <p className="text-[9px] tracking-widest text-brand-muted uppercase font-light mb-3">
                {t('filter_features')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.hasSwimmingPool}
                    onChange={(e) => updateFilter('hasSwimmingPool', e.target.checked)}
                    className="rounded-none border-brand-light/20 text-brand-gold bg-brand-bg focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-brand-gold"
                  />
                  <span className="text-xs text-brand-muted font-light uppercase tracking-widest">{t('filter_swimming')}</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.hasGarden}
                    onChange={(e) => updateFilter('hasGarden', e.target.checked)}
                    className="rounded-none border-brand-light/20 text-brand-gold bg-brand-bg focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-brand-gold"
                  />
                  <span className="text-xs text-brand-muted font-light uppercase tracking-widest">{t('filter_garden')}</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.hasOceanView}
                    onChange={(e) => updateFilter('hasOceanView', e.target.checked)}
                    className="rounded-none border-brand-light/20 text-brand-gold bg-brand-bg focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-brand-gold"
                  />
                  <span className="text-xs text-brand-muted font-light uppercase tracking-widest">{t('filter_ocean')}</span>
                </label>
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

            {/* Botão Buscar */}
            <div className="px-6 md:px-8 pb-6 pt-2 flex flex-col sm:flex-row gap-3 bg-[#1a080f]/90 rounded-b-[20px]">
              <button
                onClick={handleBuscar}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 active:bg-brand-gold/80 text-brand-bg px-6 py-4 rounded-xl text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors shadow-[0_4px_20px_rgba(212,163,115,0.25)] cursor-pointer"
              >
                <Search size={16} aria-hidden="true" />
                Buscar
              </button>
              <button
                onClick={() => { resetFilters(); setIsOpen(false); }}
                className="sm:w-auto w-full inline-flex items-center justify-center gap-2 border border-brand-light/15 hover:border-brand-light/30 text-brand-muted hover:text-brand-light px-6 py-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                <RotateCcw size={14} aria-hidden="true" />
                Limpar
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
