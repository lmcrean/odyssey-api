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
  use: {
    baseURL: 'http://localhost:5005',
    trace: 'on-first-retry',
  },
  
  // Target the master integration spec file
  testMatch: 'master-integration.spec.ts',

  // Configure webServer to start the API for testing
  webServer: {
    command: 'cd ../apps/api && npm run dev:e2e',
    url: 'http://localhost:5005/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  projects: [
    {
      name: 'api-dev',
      use: {
        baseURL: 'http://localhost:5005',
      },
      testMatch: 'master-integration.spec.ts',
    },
  ],
}); 