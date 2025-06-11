import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    include: ['**/*.test.{js,ts,jsx,tsx}'],
    exclude: [
      '**/playwright/**',
      '**/node_modules/**',
      '**/dist/**'
    ],
    environment: 'node',
    watch: false,
    reporters: ['default', 'hanging-process'],
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
    globalSetup: './src/shared/utilities/setupDb.ts',
    globalTeardown: './src/shared/utilities/setupDb.ts',
    globals: true,
    forceExit: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/apps': resolve(__dirname, './src/apps'),
      '@/shared': resolve(__dirname, './src/shared'),
      '@/middleware': resolve(__dirname, './src/shared/middleware'),
      '@/db': resolve(__dirname, './src/shared/db'),
      '@/types': resolve(__dirname, './src/shared/types'),
      '@/utilities': resolve(__dirname, './src/shared/utilities')
    }
  }
}); 