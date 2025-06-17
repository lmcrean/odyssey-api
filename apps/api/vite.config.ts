import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/server.ts'),
      name: 'OdysseyBackend',
      fileName: 'server',
      formats: ['cjs']
    },
    rollupOptions: {
      external: [
        'express',
        'cors',
        'dotenv',
        'cookie-parser',
        'jsonwebtoken',
        'bcrypt',
        'sqlite3',
        'uuid',
        'knex',
        'url',
        'path',
        'fs',
        'http',
        'https',
        'crypto',
        'os',
        'util',
        'events',
        'stream'
      ]
    },
    outDir: 'dist',
    target: 'node18',
    ssr: true,
    minify: false
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
  },
  ssr: {
    target: 'node'
  }
}); 