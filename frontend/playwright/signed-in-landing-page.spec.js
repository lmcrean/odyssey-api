import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('Sign-in Process', () => {
  test('desktop view', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Navigate to the sign-in page
    await page.goto(`${BASE_URL}/signin`);
    console.log(`Navigated to ${page.url()}`);

    // Take a screenshot before signing in
    await page.screenshot({
      path: 'screenshots/signin-page-before-login.png',
      fullPage: false
    });

    // Fill in the login form
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'qwerqwer*');

    // Click the sign-in button and wait for navigation
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation(),
    ]);

    console.log('Login attempted');

    // Check if redirected to home page
    expect(page.url()).toBe(`${BASE_URL}/`);
    console.log('Redirected to home page');

    // Check localStorage for access token
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    if (accessToken) {
      console.log('Access token found in localStorage');
    } else {
      console.warn('Warning: No access token found in localStorage');
    }

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

    // wait for idle network
    await page.waitForLoadState('networkidle');

    // Take a screenshot after signing in
    await page.screenshot({
      path: 'screenshots/home-page-after-login.png',
      fullPage: false
    });

    console.log('Test completed for desktop view');
  });
});