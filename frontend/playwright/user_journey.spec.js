// @ts-check
const { test, expect } = require('@playwright/test');

// Define device viewports
const devices = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1920, height: 1080 }
];

devices.forEach((device) => {
  test.describe(`User Journey - ${device.name}`, () => {
    test(`Landing Page - ${device.name}`, async ({ page }) => {
      // Set the viewport size based on the device
      await page.setViewportSize({ width: device.width, height: device.height });

      console.log(`Visiting the page for ${device.name}`);
      // Intercept console log and error to spy on them
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.error(`Console error in ${device.name}: ${msg.text()}`);
        }
      });

      // Visit the landing page
      await page.goto('/');

      // Check basic page structure
      console.log('Checking for basic page structure');
      await expect(page.locator('body')).toBeVisible({ timeout: 30000 });
      await expect(page.locator('[data-testid=app-container]')).toBeVisible({ timeout: 30000 });

      // Wait for content to load
      console.log(`Waiting for content to load for ${device.name}`);
      await page.waitForSelector('[data-testid=post-item]', { timeout: 60000 });

      // Check if there are posts (at least 1)
      const postCount = await page.locator('[data-testid=post-item]').count();
      expect(postCount).toBeGreaterThan(0);

      // Take a screenshot of the fully loaded page
      await page.screenshot({ path: `screenshots/user-journey/landing_page_loaded_${device.name}.png`, fullPage: true });

      // Check if the page is scrollable
      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const clientHeight = await page.evaluate(() => document.documentElement.clientHeight);

      if (scrollHeight > clientHeight) {
        console.log(`Page is scrollable for ${device.name}, scrolling and capturing`);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000); // Wait for any lazy-loaded content
        await page.screenshot({ path: `screenshots/user-journey/landing_page_scrolled_${device.name}.png`, fullPage: true });
      } else {
        console.log(`Page is not scrollable for ${device.name}`);
      }
    });
  });
});

// Add global error handling to avoid failures due to uncaught exceptions
test.beforeEach(async ({ page }) => {
  page.on('pageerror', exception => {
    console.error(`Uncaught exception: ${exception}`);
  });
});
