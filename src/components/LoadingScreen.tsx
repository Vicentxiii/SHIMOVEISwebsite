import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Key, Building2, Compass } from 'lucide-react';

const phrases = [
  'Seu sonho tem endereço.',
  'Onde a vida acontece.',
  'Mais que um imóvel. Um começo.',
  'Encontre. Sinta. More.',
  'O lar que você já imaginava.',
];

const icons = [Home, Key, Building2, Compass];

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const startTime = useRef(Date.now());
  const [IconComponent] = useState(() => icons[Math.floor(Math.random() * icons.length)]);
  const [phrase] = useState(() => phrases[Math.floor(Math.random() * phrases.length)]);

  useEffect(() => {
    startTime.current = Date.now();
    const duration = 8000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 30);
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 bg-brand-bg z-50 flex flex-col items-center justify-center text-brand-light font-sans"
        >
          {/* Randomized Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <div className="relative">
              <IconComponent size={48} className="text-brand-gold" strokeWidth={1.2} />
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-brand-gold/20 blur-xl rounded-full -z-10"
              />
            </div>
          </motion.div>

          {/* Randomized Phrase */}
          <motion.p
            key={phrase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-serif text-lg md:text-xl text-brand-light font-light tracking-wide mb-10 italic"
          >
            &ldquo;{phrase}&rdquo;
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-64 md:w-80"
          >
            <div className="h-[1px] w-full bg-brand-light/10 mb-3">
              <motion.div
                className="h-full bg-brand-gold"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-end items-center text-[10px] tracking-[0.25em] text-brand-muted font-light uppercase">
              <motion.span
                key={progress}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="font-serif text-sm text-brand-gold tracking-normal"
              >
                {progress}%
              </motion.span>
            </div>
          </motion.div>

          {/* "carregando experiência" gold small text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-[10px] md:text-xs tracking-[0.3em] text-brand-gold uppercase font-light mt-10"
          >
            carregando experiência
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
