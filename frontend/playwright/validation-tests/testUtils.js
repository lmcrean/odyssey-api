import fs from 'fs';
import path from 'path';
import { expect } from '@playwright/test';

export const baseURL = 'localhost:8080';

export async function login(page) {
  console.log('Logging in...');
  await page.goto(`${baseURL}/signin`);
  console.log('Navigated to signin page');

  console.log('Filling in login form...');
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="password"]', 'qwerqwer*');

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation(),
  ]);

  console.log('Login attempted');
  const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
  console.log(accessToken ? 'Access token found in localStorage' : 'Warning: No access token found in localStorage');
}

export async function captureScreenshot(page, testName, pageName, fullPage = false) {
  const screenshotDir = path.join('playwright', 'screenshots', testName);

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log(`Capturing screenshot for ${fullPage ? 'full page' : 'mobile view'} of ${pageName}`);
  
  if (fullPage) {
    // For full page, use a larger viewport
    await page.setViewportSize({ width: 1280, height: 800 });
  } else {
    // For mobile view, use the original mobile viewport size
    await page.setViewportSize({ width: 375, height: 667 });
  }
  
  await page.waitForLoadState('networkidle');
  
  const fileName = `${fullPage ? 'full-' : 'mobile-'}${pageName}.png`;
  await page.screenshot({
    path: path.join(screenshotDir, fileName),
    fullPage: fullPage
  });

  // Reset to mobile view after capturing full page screenshot
  if (fullPage) {
    await page.setViewportSize({ width: 375, height: 667 });
  }
}