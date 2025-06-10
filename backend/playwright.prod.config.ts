import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/prod',
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
    baseURL: 'https://odyssey-api-lmcreans-projects.vercel.app',
    trace: 'on-first-retry',
  },
  
  testMatch: '**/*.api.pw.spec.ts',

  projects: [
    {
      name: 'api-prod',
      use: {},
      testMatch: '**/*.api.pw.spec.ts',
    },
    {
      name: 'browser-prod',
      use: {
        ...devices['Desktop Safari'],
      },
      testMatch: '**/*.ui.pw.spec.ts',
    },
  ],
}); 