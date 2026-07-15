/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ExternalLink, MapPin, Maximize2, Bed, Bath, Car } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export interface PortalListing {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  image: string;
  url: string;
  tagline: string;
}

const PORTAL_LISTINGS: PortalListing[] = [
  {
    id: 'zap-1',
    title: 'Cobertura Duplex Jardim Paulista',
    location: 'Jardim Paulista, São Paulo',
    price: 'R$ 15.500.000',
    area: '450 m²',
    bedrooms: 4,
    bathrooms: 5,
    garage: 4,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.zapimoveis.com.br/imovel/imovel-id-2886494851',
    tagline: 'Vista panorâmica incomparável e terraço privativo com spa suspenso.'
  },
  {
    id: 'zap-2',
    title: 'Casa Contemporânea Cidade Jardim',
    location: 'Cidade Jardim, São Paulo',
    price: 'R$ 22.000.000',
    area: '850 m²',
    bedrooms: 5,
    bathrooms: 7,
    garage: 6,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.zapimoveis.com.br/imovel/imovel-id-2885858878',
    tagline: 'Projeto de vanguarda com concreto aparente integrado ao paisagismo exuberante.'
  },
  {
    id: 'zap-3',
    title: 'Residência de Alto Padrão no Morumbi',
    location: 'Morumbi, São Paulo',
    price: 'R$ 12.900.000',
    area: '700 m²',
    bedrooms: 4,
    bathrooms: 6,
    garage: 5,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.zapimoveis.com.br/imovel/imovel-id-2885856891',
    tagline: 'Elegância clássica e amplas salas de recepção voltadas para área verde.'
  },
  {
    id: 'zap-4',
    title: 'Apartamento Vista Parque Ibirapuera',
    location: 'Vila Nova Conceição, São Paulo',
    price: 'R$ 18.200.000',
    area: '380 m²',
    bedrooms: 3,
    bathrooms: 4,
    garage: 4,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.zapimoveis.com.br/imovel/imovel-id-2843544618',
    tagline: 'O endereço mais cobiçado de São Paulo, a passos do parque e com acabamentos nobres.'
  },
  {
    id: 'zap-5',
    title: 'Mansão Suspensa Itaim Bibi',
    location: 'Itaim Bibi, São Paulo',
    price: 'R$ 14.500.000',
    area: '420 m²',
    bedrooms: 4,
    bathrooms: 5,
    garage: 4,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.zapimoveis.com.br/imovel/imovel-id-2803735655',
    tagline: 'Altíssimo padrão com living com pé-direito duplo e automação residencial completa.'
  },
  {
    id: 'zap-6',
    title: 'Refúgio de Campo Quinta da Baroneza',
    location: 'Bragança Paulista, São Paulo',
    price: 'R$ 28.000.000',
    area: '1.200 m²',
    bedrooms: 6,
    bathrooms: 8,
    garage: 6,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.zapimoveis.com.br/imovel/imovel-id-2802415565',
    tagline: 'Privacidade cinematográfica, heliponto homologado e lazer completo privativo.'
  },
  {
    id: 'zap-7',
    title: 'Cobertura Linear de Prestígio Leblon',
    location: 'Leblon, Rio de Janeiro',
    price: 'R$ 32.000.000',
    area: '510 m²',
    bedrooms: 4,
    bathrooms: 6,
    garage: 3,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.zapimoveis.com.br/imovel/imovel-id-2802410417',
    tagline: 'A um quarteirão da praia, piscina aquecida no terraço e segurança máxima.'
  },
  {
    id: 'zap-8',
    title: 'Mansão Panorâmica Joatinga',
    location: 'Joatinga, Rio de Janeiro',
    price: 'R$ 19.800.000',
    area: '980 m²',
    bedrooms: 5,
    bathrooms: 7,
    garage: 5,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.zapimoveis.com.br/imovel/imovel-id-2746557204',
    tagline: 'Arquitetura suspensa sobre o mar com deck infinito e acesso direto à prainha.'
  },
  {
    id: 'zap-9',
    title: 'Apartamento Boutique Jardins',
    location: 'Cerqueira César, São Paulo',
    price: 'R$ 8.900.000',
    area: '290 m²',
    bedrooms: 3,
    bathrooms: 4,
    garage: 3,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.zapimoveis.com.br/imovel/imovel-id-2716447403',
    tagline: 'Design de interiores assinado, marcenaria de grife e iluminação cênica instalada.'
  },
  {
    id: 'zap-10',
    title: 'Casa de Praia de Luxo Angra',
    location: 'Portogalo, Angra dos Reis',
    price: 'R$ 16.000.000',
    area: '850 m²',
    bedrooms: 6,
    bathrooms: 8,
    garage: 4,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.zapimoveis.com.br/imovel/imovel-id-2642930776',
    tagline: 'Pier privativo para iate de até 80 pés e vista exuberante para a baía da Ilha Grande.'
  }
];

export const PortalListingsCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { t } = useLanguage();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      // Initial check
      checkScroll();
      // Handle resize check
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#17050b] to-brand-bg relative overflow-hidden border-t border-brand-light/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <span className="text-xs tracking-[0.3em] text-brand-gold uppercase font-light block">
              Disponibilidade em Tempo Real
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-light font-light leading-tight tracking-tight">
              Ativos nos Portais
            </h2>
            <p className="text-xs text-brand-muted max-w-2xl font-light leading-relaxed tracking-wide">
              Explore uma seleção curada de nossas propriedades exclusivas com anúncios ativos nos principais canais de luxo nacionais. Selecione para visualizar detalhes oficiais e agendar assessoria.
            </p>
          </div>
        </div>

        {/* Carousel Container with Absolute Side Arrows */}
        <div className="relative group px-6 md:px-16">
          {/* Left Navigation Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-brand-bg/95 backdrop-blur-md rounded-full border border-brand-gold/30 text-brand-gold hover:border-brand-gold hover:bg-brand-gold/15 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center"
              aria-label="Anterior"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          {/* Right Navigation Arrow */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-brand-bg/95 backdrop-blur-md rounded-full border border-brand-gold/30 text-brand-gold hover:border-brand-gold hover:bg-brand-gold/15 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center"
              aria-label="Próximo"
            >
              <ArrowRight size={16} />
            </button>
          )}

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {PORTAL_LISTINGS.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                // Show up to 3 per page on desktop, 2 on tablet/medium, and 1 on mobile
                className="w-[280px] sm:w-[320px] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] flex-shrink-0 bg-brand-bg/60 border border-brand-light/5 hover:border-brand-gold/45 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_25px_rgba(197,160,89,0.12)] transition-all duration-500 flex flex-col snap-start group"
              >
                {/* Image Container */}
                <a 
                  href={listing.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative overflow-hidden aspect-[16/9] block cursor-pointer"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  
                  {/* Visual Glow Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                  
                  {/* Portal Badge overlay */}
                  <span className="absolute top-4 left-4 z-20 bg-[#de1b56] text-white text-[8px] font-mono tracking-[0.2em] px-2.5 py-1 rounded uppercase font-semibold shadow-md">
                    ZAP IMÓVEIS
                  </span>

                  {/* View External hover indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="bg-brand-bg/95 backdrop-blur-md px-4 py-2 border border-brand-gold/30 text-[10px] font-light tracking-[0.2em] uppercase text-brand-gold flex items-center gap-1.5 rounded-sm">
                      <ExternalLink size={10} />
                      <span>Ver anúncio</span>
                    </span>
                  </div>
                </a>

                {/* Content Body */}
                <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-brand-muted uppercase font-light">
                      <MapPin size={10} className="text-brand-gold" />
                      <span>{listing.location}</span>
                    </div>

                    {/* Title & Price */}
                    <div className="space-y-1">
                      <h3 className="font-serif text-base md:text-lg text-brand-light font-light group-hover:text-brand-gold transition-colors duration-300 leading-snug tracking-tight">
                        <a href={listing.url} target="_blank" rel="noopener noreferrer">
                          {listing.title}
                        </a>
                      </h3>
                      <p className="font-serif text-brand-gold text-base md:text-lg font-light">
                        {listing.price}
                      </p>
                    </div>

                    {/* Tagline */}
                    <p className="text-[11px] leading-relaxed text-brand-muted font-light tracking-wide italic min-h-[32px] line-clamp-2">
                      {listing.tagline}
                    </p>
                  </div>

                  {/* Micro Attributes Row */}
                  <div className="grid grid-cols-4 gap-2 pt-4 mt-4 border-t border-brand-light/5 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-brand-gold/80">
                        <Bed size={11} />
                        <span className="text-[11px] font-light font-sans">{listing.bedrooms}</span>
                      </div>
                      <p className="text-[7.5px] tracking-widest text-brand-muted uppercase font-light">Quartos</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-brand-gold/80">
                        <Bath size={11} />
                        <span className="text-[11px] font-light font-sans">{listing.bathrooms}</span>
                      </div>
                      <p className="text-[7.5px] tracking-widest text-brand-muted uppercase font-light">Banhos</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-brand-gold/80">
                        <Car size={11} />
                        <span className="text-[11px] font-light font-sans">{listing.garage}</span>
                      </div>
                      <p className="text-[7.5px] tracking-widest text-brand-muted uppercase font-light">Vagas</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-brand-gold/80">
                        <Maximize2 size={10} />
                        <span className="text-[11px] font-light font-sans whitespace-nowrap">{listing.area}</span>
                      </div>
                      <p className="text-[7.5px] tracking-widest text-brand-muted uppercase font-light">Área</p>
                    </div>
                  </div>

                  {/* Direct External Link CTA */}
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 border border-brand-gold/20 hover:border-brand-gold bg-brand-gold/5 hover:bg-brand-gold/10 text-brand-gold text-[9px] uppercase font-light tracking-widest transition-all duration-300 rounded-sm"
                  >
                    <span>Acessar no ZAP Imóveis</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
