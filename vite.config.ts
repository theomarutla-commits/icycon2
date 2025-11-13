import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // When building for Django, output into the project's static folder
      base: '/static/frontend/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        // Build directly into the Django app's static folder so Django can
        // serve the files without an extra copy step when running from the
        // repo root. This path is relative to the repository root where
        // `vite` is executed.
        outDir: 'icycon/static/frontend',
        assetsDir: 'assets',
        // Don't remove other static files when building
        emptyOutDir: false,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
