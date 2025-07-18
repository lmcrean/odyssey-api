import { defineConfig, devices } from '@playwright/test';

// Production configuration for E2E tests against deployed services
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
    // Use deployed web app URL from environment variable
    baseURL: process.env.WEB_DEPLOYMENT_URL || process.env.FIREBASE_HOSTING_URL || 'https://lauriecrean-free-38256.web.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    actionTimeout: 15000, // Increased for network delays
    navigationTimeout: 45000 // Increased for deployed services
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

  // No webServer configuration - testing against deployed services
  
  expect: {
    timeout: 15000, // Increased for network delays
  },

  timeout: 120000, // Increased for deployed services

  // Use production-specific global setup
  globalSetup: './utils/global-setup.production.ts',
  globalTeardown: './utils/global-teardown.ts',
});