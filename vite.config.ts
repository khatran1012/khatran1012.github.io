import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveSiteUrl } from './site.config.mjs';

const siteUrl = resolveSiteUrl();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'portfolio-metadata',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
  }],
  base: '/',
  define: {
    'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
    'import.meta.env.VITE_BUILD_YEAR': JSON.stringify(new Date().getUTCFullYear()),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
