// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, 
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined, 
  reporter: [['list'], ['json', { outputFile: 'test-results.json' }]],
  outputDir: 'screenshots',
  use: {
    command: 'python3 manage.py runserver',
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    screenshot: 'on',
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
  webServer: {
    command: 'python3 manage.py runserver',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
  },
});

