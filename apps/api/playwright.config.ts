import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
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
    baseURL: 'http://localhost:5000',
    trace: 'on-first-retry',
  },
  
  // Specific file pattern to avoid conflicts with vitest
  testMatch: '**/*.api.pw.spec.ts',

  // Configure webServer to automatically start the backend server during tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5000/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Create separate projects for API tests and browser tests
  projects: [
    {
      name: 'api',
      use: {
        // No browser needed for API tests
      },
      testMatch: '**/*.api.pw.spec.ts',
    },
    {
      name: 'browser',
      use: {
        // Using only Safari as per user rules
        ...devices['Desktop Safari'],
      },
      testMatch: '**/*.ui.pw.spec.ts',
    },
  ],
}); 