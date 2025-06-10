import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/*.api.pw.spec.{js,ts}', 
      '**/playwright/**',
      '**/node_modules/**',
      '**/dist/**'
    ],
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.config.ts'
      ]
    },
    testTimeout: 60000,
    globalSetup: './src/test-utilities/setupDb.ts',
    globals: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/models': resolve(__dirname, './src/models'),
      '@/routes': resolve(__dirname, './src/routes'),
      '@/middleware': resolve(__dirname, './src/middleware'),
      '@/services': resolve(__dirname, './src/services'),
      '@/db': resolve(__dirname, './src/db'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/types': resolve(__dirname, './src/types'),
      '@/test-utils': resolve(__dirname, './src/test-utilities')
    }
  }
}); 