import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/validation-tests',
  testMatch: '**/productionRegistration*.spec.js',
  fullyParallel: false, // Run production tests sequentially to avoid conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Allow retries for production network issues
  workers: 1, // Single worker for production tests
  reporter: [
    ['html', { outputFolder: 'test-results/production-html-report' }],
    ['list']
  ],
  outputDir: 'test-results/production-artifacts',
  timeout: 60000, // Longer timeout for production
  use: {
    // No baseURL - tests will use full production URLs
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
    headless: false, // Show browser for production tests
  },
  projects: [
    {
      name: 'safari', // Following user rule - only Safari
      use: { ...devices['Desktop Safari'] },
    },
  ],
  // No webServer - we're testing against live production
}); 