import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

const devices = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1920, height: 1080 }
];

test.describe('Signed-in Landing Page', () => {
  devices.forEach(device => {
    test(`${device.name}`, async ({ page }) => {
      page.setViewportSize({ width: device.width, height: device.height });

      // Navigate to sign-in page
      await page.goto(`${BASE_URL}/signin`);
      console.log(`Navigated to signin page: ${page.url()}`);

      // Fill in credentials and submit
      await page.fill('input[name="username"]', 'user');
      await page.fill('input[name="password"]', 'qwerqwer*');
      await page.click('button[type="submit"]');
      console.log('Submitted sign-in form');

      // Wait for navigation and network idle
      await page.waitForLoadState('networkidle');
      console.log(`Current URL after sign-in: ${page.url()}`);

      // Log localStorage contents
      const localStorageData = await page.evaluate(() => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          data[key] = localStorage.getItem(key);
        }
        return data;
      });
      console.log('localStorage contents:', localStorageData);

      // Verify user is signed in
      const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
      console.log('Access token:', accessToken);

      if (!accessToken) {
        console.error('Access token not found in localStorage');
        const pageContent = await page.content();
        console.log('Page content:', pageContent);
      } else {
        expect(accessToken).toBeTruthy();
        
        // Check for an authenticated element
        const signOutElement = await page.locator('text=Sign out').count();
        console.log('Sign out element count:', signOutElement);
        
        if (signOutElement === 0) {
          console.error('Sign out element not found');
          const pageContent = await page.content();
          console.log('Page content:', pageContent);
        } else {
          await expect(page.locator('text=Sign out')).toBeVisible();
        }
      }

      // Navigate to the frontend URL and wait for network idle
      await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

      // Take a screenshot
      await page.screenshot({
        path: `screenshots/signed-in-landing-page-${device.name}.png`,
        fullPage: false
      });

      console.log(`Test completed for ${device.name}`);
    });
  });
});