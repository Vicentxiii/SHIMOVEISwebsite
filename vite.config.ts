import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Proxy /api para testar local com `vercel dev` (porta 3000). Se usar `npm run dev` puro, /api retorna 404
      // porque Vite não roda as funções serverless. Para testar salvar local: use `vercel dev` ou faça deploy na Vercel.
      proxy: process.env.VERCEL_DEV_PROXY ? {
        '/api': {
          target: process.env.VERCEL_DEV_PROXY,
          changeOrigin: true,
        }
      } : undefined,
    },
    // SPA fallback para react-router (importante para SEO de URLs amigáveis)
    appType: 'spa' as const,
    build: {
      // Otimizações para Core Web Vitals
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['motion'],
          },
        },
      },
      // Aumenta limite para evitar warnings de chunk grande
      chunkSizeWarningLimit: 600,
    },
    // Pré-carrega módulos críticos
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  };
});
