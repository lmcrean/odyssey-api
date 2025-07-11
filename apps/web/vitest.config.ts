/// <reference types="vitest" />
import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@src': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/api/core'),
      core: path.resolve(__dirname, './src/api/core'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
