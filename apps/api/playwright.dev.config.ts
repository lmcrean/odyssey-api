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
  
  // Auto-exit configuration
  maxFailures: process.env.CI ? undefined : 1,
  globalTeardown: './src/shared/utilities/playwrightTeardown.ts',
  
  testMatch: ['**/*.spec.ts', '**/*.api.pw.spec.ts'],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5000/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  projects: [
    {
      name: 'api-dev',
      use: {},
      testMatch: ['**/*.spec.ts', '**/*.api.pw.spec.ts'],
    },
    {
      name: 'browser-dev',
      use: {
        ...devices['Desktop Safari'],
      },
      testMatch: '**/*.ui.pw.spec.ts',
    },
  ],
}); 