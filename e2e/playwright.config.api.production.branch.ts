import { defineConfig, devices } from '@playwright/test';

// API-only configuration for branch/PR deployments
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }]
  ],
  use: {
    // API tests don't need a base URL for the web app
    baseURL: undefined,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    actionTimeout: 15000,
    navigationTimeout: 45000
  },

  projects: [
    {
      name: 'api-tests',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  expect: {
    timeout: 15000,
  },

  timeout: 120000,

  // Use API-specific global setup that only checks API health
  globalSetup: './utils/global-setup.api.ts',
  globalTeardown: './utils/global-teardown.ts',
});