/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 bg-brand-bg z-50 flex flex-col justify-between p-8 md:p-16 text-brand-light font-sans"
        >
          {/* Top Info */}
          <div className="flex justify-between items-center text-[10px] md:text-xs tracking-[0.25em] text-brand-muted font-light uppercase">
            <div>S. HELENA</div>
            <div>PRIVATE ADVISORY</div>
          </div>

          {/* Central Logo & Brand Typography */}
          <div className="flex flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ 
                opacity: 1, 
                letterSpacing: '0.35em',
                transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } 
              }}
              className="font-serif text-4xl md:text-7xl font-light uppercase text-brand-light tracking-[0.35em]"
            >
              SILVIA HELENA
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.6, duration: 1, ease: 'easeOut' } 
              }}
              className="text-xs md:text-sm tracking-[0.4em] text-brand-gold uppercase mt-4 font-light"
            >
              LUXURY REAL ESTATE ADVISOR
            </motion.div>
          </div>

          {/* Bottom Info / Year & Status */}
          <div className="flex justify-between items-end text-[10px] md:text-xs tracking-[0.25em] text-brand-muted font-light">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
              <span>EST. 2012</span>
            </div>
            <div>© 2026 BRASIL</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
