// File: tests/auth-pages.spec.js

import { test, expect } from '@playwright/test';

const devices = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1920, height: 1080 }
];

devices.forEach(device => {
  test.describe(`Auth Pages - ${device.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });
    });

    test('Navigate to Sign In page', async ({ page }) => {
      await page.goto('http://localhost:8000');
      await page.click('text=Sign in');
      await page.waitForURL('**/signin');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: `screenshots/signin-page-${device.name}.png`,
        fullPage: false
      });

      console.log(`Sign In screenshot captured for ${device.name}`);
    });

    test('Navigate to Sign Up page', async ({ page }) => {
      await page.goto('http://localhost:8000');
      await page.click('text=Sign up');
      await page.waitForURL('**/signup');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: `screenshots/signup-page-${device.name}.png`,
        fullPage: false
      });

      console.log(`Sign Up screenshot captured for ${device.name}`);
    });
  });
});