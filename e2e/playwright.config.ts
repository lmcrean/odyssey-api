import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  
  // Root-level e2e testing for cross-app integration
  use: {
    baseURL: 'http://localhost:3000', // Web app as primary base
    trace: 'on-first-retry',
  },
  
  // Target the master integration spec file
  testMatch: 'master-integration.spec.ts',

  // Configure webServer for cross-app testing
  webServer: [
    {
      command: 'cd apps/api && npm run dev:e2e',
      url: 'http://localhost:5005/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'cd apps/web && npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],

  // Projects for cross-app testing
  projects: [
    {
      name: 'api-integration',
      use: {
        baseURL: 'http://localhost:5005', // API app
      },
      testMatch: 'master-integration.spec.ts',
    },
    {
      name: 'web-integration',
      use: {
        ...devices['Desktop Safari'], // Safari only as per user rules
        baseURL: 'http://localhost:3000', // Web app
      },
      testMatch: 'master-integration.spec.ts',
    },
    {
      name: 'cross-app-integration',
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'http://localhost:3000', // Start with web, test across apps
      },
      testMatch: 'master-integration.spec.ts',
    },
  ],
}); 