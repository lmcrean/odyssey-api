import { defineConfig, devices } from '@playwright/test';

// Full web + API integration configuration for main branch production deployments
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
    // Use stable production web app URL
    baseURL: process.env.WEB_DEPLOYMENT_URL || 
             process.env.FIREBASE_HOSTING_URL || 
             'https://odyssey-466315.web.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    actionTimeout: 15000,
    navigationTimeout: 45000
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
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  expect: {
    timeout: 15000,
  },

  timeout: 120000,

  // Use full global setup that checks both web and API
  globalSetup: './utils/global-setup.web.production.main.ts',
  globalTeardown: './utils/global-teardown.ts',
});