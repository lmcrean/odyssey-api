import { defineConfig, devices } from '@playwright/test';

// API-only configuration for local development
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  workers: undefined,
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    // API tests don't need a base URL for the web app
    baseURL: undefined,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  projects: [
    {
      name: 'api-tests',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  expect: {
    timeout: 10000,
  },

  timeout: 60000,

  // Use API-specific global setup that only checks API health
  globalSetup: './utils/global-setup.api.local.ts',
  globalTeardown: './utils/global-teardown.ts',
});