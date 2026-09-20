import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, SearchX, Sparkles, MessageCircle } from 'lucide-react';

interface NoResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NoResultsModal: React.FC<NoResultsModalProps> = ({ isOpen, onClose }) => {
  const waMessage = encodeURIComponent(
    'Olá, nao achei o imovel que estava procurando no seu site, você pode confirmar para mim se nao tem nada novo na sua cartela de imóveis?'
  );
  const waHref = `https://wa.me/5511940840966?text=${waMessage}`;

  // trava scroll do body quando aberto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // fecha no ESC
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
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6"
          aria-modal="true"
          role="dialog"
          aria-labelledby="no-results-title"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-[#0a0206]/70 backdrop-blur-[6px]"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* glow dourado sutil */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-brand-gold/10 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

          <motion.div
            initial={{ scale: 0.96, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative w-full max-w-[560px] bg-[#1d0a12] border border-brand-gold/20 rounded-[24px] md:rounded-[28px] shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_0_1px_rgba(212,163,115,0.12)] overflow-hidden"
          >
            {/* borda superior dourada sutil */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" aria-hidden="true" />
            {/* cantos */}
            <span className="absolute top-0 left-0 w-10 h-10 border-t border-l border-brand-gold/20 rounded-tl-[24px] pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-brand-gold/20 rounded-br-[24px] pointer-events-none" aria-hidden="true" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-brand-muted hover:text-brand-light flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Fechar modal"
            >
              <X size={16} />
            </button>

            <div className="p-6 md:p-8 pt-8 md:pt-9 text-center">
              {/* ícone */}
              <div className="mx-auto w-14 h-14 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-5">
                <SearchX size={22} className="text-brand-gold" aria-hidden="true" />
              </div>

              <p className="text-[11px] tracking-[0.24em] text-brand-gold uppercase font-light flex items-center justify-center gap-1.5">
                <Sparkles size={12} aria-hidden="true" />
                Nenhum filtro encontrou imóvel
              </p>

              <h2 id="no-results-title" className="font-serif text-[22px] md:text-[26px] text-brand-light font-light leading-tight mt-3">
                Ops, infelizmente não achei nada <br className="hidden sm:block" /> no meu banco de dados
              </h2>

              <div className="mt-4 text-[13px] md:text-[14px] leading-relaxed text-brand-muted font-light space-y-3 text-left md:text-center">
                <p>
                  Mas não fique assim. Dentro do meu site tem só uma parte do que eu realmente tenho em minha
                  <strong className="text-brand-light font-medium"> cartela de imóveis</strong>.
                </p>
                <p>
                  Todos os dias entram imóveis novos para mim, e por isso posso ter algumas opções que não tenho no meu site.
                </p>
                <p className="text-brand-light/90">
                  O que acha de entrar em contato comigo nesse número abaixo e podemos conversar melhor?
                </p>
              </div>

              {/* prova social sutil */}
              <div className="mt-5 inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-[11px] tracking-wide text-brand-light/80 font-light">Resposta em até 2h • Atendimento direto com a Silvia</span>
              </div>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 w-full inline-flex items-center justify-center gap-2.5 bg-brand-gold hover:bg-[#e0b48a] active:bg-[#c49660] text-brand-bg px-6 py-4 rounded-full text-[13px] md:text-[14px] font-semibold tracking-wide shadow-[0_8px_28px_rgba(212,163,115,0.35)] transition-all duration-300 cursor-pointer"
                aria-label="Falar no WhatsApp da Silvia Helena"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Falar com a Silvia no WhatsApp
              </a>

              <button
                onClick={onClose}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-brand-light/10 hover:border-brand-light/20 text-brand-muted hover:text-brand-light px-6 py-3.5 rounded-full text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                Continuar navegando
              </button>

              <p className="mt-4 text-[10px] tracking-widest uppercase text-brand-muted/60 font-light">
                CRECISP 125743 • Butantã • Morumbi • Taboão da Serra
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
