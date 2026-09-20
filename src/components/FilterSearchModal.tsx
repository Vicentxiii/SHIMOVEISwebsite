import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Sparkles, SearchX, MessageCircle } from 'lucide-react';
import { AdvancedSearch, FilterState } from './AdvancedSearch';

interface FilterSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterState) => void;
  availableLocations: string[];
  hasNoResults?: boolean;
}

export const FilterSearchModal: React.FC<FilterSearchModalProps> = ({ isOpen, onClose, onFilterChange, availableLocations, hasNoResults = false }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6"
          aria-modal="true"
          role="dialog"
          aria-labelledby="filter-modal-title"
        >
          {/* backdrop glass */}
          <div
            className="absolute inset-0 bg-[#0a0206]/60 backdrop-blur-[12px]"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

          <motion.div
            initial={{ scale: 0.96, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="relative w-full max-w-[880px] max-h-[90vh] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%), rgba(23,6,13,0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* top hairline */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden="true" />

            {/* header */}
            <div className="relative flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-brand-bg">
                  <Search size={14} aria-hidden="true" />
                </span>
                <div>
                  <h2 id="filter-modal-title" className="font-serif text-lg md:text-xl text-brand-light font-light tracking-wide">Procurar imóvel</h2>
                  <p className="text-[11px] tracking-[0.18em] text-brand-light/60 uppercase font-light flex items-center gap-1.5">
                    <Sparkles size={10} className="text-brand-gold" aria-hidden="true" />
                    Filtros inteligentes • Butantã • Morumbi • Taboão da Serra
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-brand-light/70 hover:text-brand-light flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Fechar busca"
              >
                <X size={16} />
              </button>
            </div>

            {/* content scroll */}
            <div className="overflow-y-auto max-h-[72vh] overscroll-contain p-6 md:p-8" style={{ scrollbarWidth: 'thin' }}>
              <AdvancedSearch onFilterChange={onFilterChange} availableLocations={availableLocations} />
              {!hasNoResults ? (
                <p className="mt-4 text-center text-[11px] tracking-wide text-brand-muted/60 font-light">
                  Selecione os filtros e clique em <span className="text-brand-gold">Buscar</span> — mostraremos só o que vale seu tempo
                </p>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-[20px] border border-brand-gold/20 bg-brand-gold/[0.06] p-5 md:p-6 text-center"
                >
                  <div className="mx-auto w-10 h-10 rounded-full bg-brand-gold/15 border border-brand-gold/20 flex items-center justify-center mb-3">
                    <SearchX size={18} className="text-brand-gold" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-lg text-brand-light font-light">Ops, infelizmente não achei nada</h3>
                  <p className="text-[13px] leading-relaxed text-brand-muted font-light mt-3">
                    Infelizmente não achei nada no meu banco de dados com esses filtros, mas não fique assim. Dentro do meu site tem só uma parte do que eu realmente tenho em minha cartela de imóveis. Todos os dias entram imóveis novos para mim, e por isso posso ter algumas opções que não tenho no meu site.
                  </p>
                  <p className="text-[13px] leading-relaxed text-brand-light/90 font-light mt-2">
                    O que acha de entrar em contato comigo nesse número abaixo e podemos conversar melhor?
                  </p>
                  <a
                    href={`https://wa.me/5511940840966?text=${encodeURIComponent('Olá, nao achei o imovel que estava procurando no seu site, você pode confirmar para mim se nao tem nada novo na sua cartela de imóveis?')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-[#e0b48a] text-brand-bg px-6 py-3.5 rounded-full text-[13px] font-semibold tracking-wide shadow-[0_8px_28px_rgba(212,163,115,0.3)] transition-colors"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    Falar no WhatsApp da Silvia
                  </a>
                  <p className="mt-3 text-[10px] tracking-widest uppercase text-brand-muted/50 font-light">Resposta em até 2h • Atendimento direto</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
