import { defineConfig, devices } from '@playwright/test';

// Full web + API integration configuration for local development
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
    // Local development URLs
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false, // Show browser in local dev
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  expect: {
    timeout: 10000,
  },

  timeout: 60000,

  // Use full global setup that checks both web and API
  globalSetup: './utils/global-setup.web.local.ts',
  globalTeardown: './utils/global-teardown.ts',
});