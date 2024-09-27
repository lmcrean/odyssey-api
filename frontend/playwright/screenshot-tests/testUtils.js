import { expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

export async function login(page) {
  console.log('Logging in...');
  // Navigate to signin page and capture screenshots
  await page.goto(`${BASE_URL}/signin`);
  console.log('Navigated to signin page');

  console.log('Filling in login form...');
  // Fill in the login form
  await page.fill('input[name="username"]', 'testuser');
  console.log('Filled in username');
  await page.fill('input[name="password"]', 'qwerqwer*');
  console.log('Filled in password');

  // Click the sign-in button and wait for navigation
  await Promise.all([
    console.log('Clicking sign-in button'),
    page.click('button[type="submit"]'),
    console.log('Clicked sign-in button'),
    page.waitForNavigation(),
  ]);

  console.log('Login attempted');

  // Check if redirected to home page
  expect(page.url()).toBe(`${BASE_URL}/`);
  console.log('Redirected to home page');

  // Check localStorage for access token
  const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
  console.log(accessToken ? 'Access token found in localStorage' : 'Warning: No access token found in localStorage');
}

export async function captureScreenshot(page, pageName) {
  const devices = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'laptop', width: 1366, height: 768 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];

  for (const device of devices) {
    console.log(`Capturing screenshot for ${device.name} view of ${pageName}`);
    await page.setViewportSize({ width: device.width, height: device.height });
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `screenshots/${device.name}-${pageName}.png`,
      fullPage: false
    });
  }
}