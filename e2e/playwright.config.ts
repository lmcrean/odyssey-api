import { defineConfig, devices } from '@playwright/test';

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
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
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
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // webServer: [
  //   {
  //     command: 'cd ../apps/api && dotnet run',
  //     port: 5000,
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 60000,
  //   },
  //   {
  //     command: 'cd ../apps/web && npm start',
  //     port: 4200,
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 60000,
  //   },
  // ],

  expect: {
    timeout: 10000,
  },

  timeout: 60000,
  
  globalSetup: './utils/global-setup.ts',
  globalTeardown: './utils/global-teardown.ts',
});