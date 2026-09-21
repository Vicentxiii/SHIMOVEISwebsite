import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Home, Key, Building2, Compass } from 'lucide-react';

const phrases = [
  'Seu sonho tem endereço.',
  'Onde a vida acontece.',
  'O próximo capítulo da sua história.',
  'Encontre. Sinta. More.',
  'O lar que você já imaginava.',
];

const icons = [Home, Key, Building2, Compass];

const STORAGE_KEY = 'sh_preloader_shown';

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressMotion = useMotionValue(0);
  const progressSpring = useSpring(progressMotion, { stiffness: 90, damping: 20, mass: 0.6 });
  const startTime = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const [IconComponent] = useState(() => icons[Math.floor(Math.random() * icons.length)]);
  const [phrase] = useState(() => phrases[Math.floor(Math.random() * phrases.length)]);

  // Mobile-first: dura menos no mobile para fluidez
  const getDuration = () => {
    if (typeof window === 'undefined') return 2200;
    const isMobile = window.innerWidth < 768;
    const alreadyShown = (() => {
      try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
    })();
    if (alreadyShown) return isMobile ? 900 : 1200;
    return isMobile ? 1800 : 2400;
  };

  useEffect(() => {
    if (!visible) return;
    const duration = getDuration();
    startTime.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime.current;
      const raw = Math.min(elapsed / duration, 1);
      // easeOutCubic para fluidez
      const eased = 1 - Math.pow(1 - raw, 3);
      const pct = Math.round(eased * 100);
      setProgress(pct);
      progressMotion.set(eased);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
        // pequena pausa antes de sumir — mais fluido
        setTimeout(() => setVisible(false), 280);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, progressMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -12,
            filter: 'blur(6px)',
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as any },
          }}
          className="fixed inset-0 bg-brand-bg z-50 flex flex-col items-center justify-center text-brand-light font-sans will-change-transform"
          style={{ transform: 'translateZ(0)' } as any}
        >
          {/* Icon — GPU acelerado, sem layout thrash */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as any }}
            className="mb-6 will-change-transform"
            style={{ transform: 'translateZ(0)' } as any}
          >
            <div className="relative">
              <IconComponent size={44} className="text-brand-gold md:w-[48px] md:h-[48px]" strokeWidth={1.25} />
              <motion.div
                animate={{ opacity: [0.25, 0.9, 0.25], scale: [0.9, 1.08, 0.9] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-brand-gold/20 blur-xl rounded-full -z-10 will-change-transform"
                style={{ transform: 'translateZ(0)' } as any}
              />
            </div>
          </motion.div>

          {/* Phrase — blur + y suave */}
          <motion.p
            key={phrase}
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="font-serif text-[17px] md:text-xl text-brand-light font-light tracking-wide mb-8 md:mb-10 italic text-center px-6 max-w-[320px] md:max-w-none will-change-transform"
          >
            &ldquo;{phrase}&rdquo;
          </motion.p>

          {/* Progress — scaleX (GPU) no lugar de width para 60fps no mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="w-[68vw] max-w-[320px] md:w-80"
          >
            <div className="h-[2px] w-full bg-brand-light/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-gold to-[#e8b98a] rounded-full will-change-transform"
                style={{ scaleX: progressSpring, transformOrigin: 'left', transform: 'translateZ(0)' } as any}
              />
            </div>
            <div className="flex justify-end items-center text-[10px] tracking-[0.25em] text-brand-muted font-light uppercase mt-2.5">
              <motion.span
                key={progress}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="font-serif text-[13px] md:text-sm text-brand-gold tracking-normal tabular-nums"
              >
                {progress}%
              </motion.span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.3em] text-brand-gold uppercase font-light mt-8 md:mt-10 will-change-transform"
          >
            carregando experiência
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
