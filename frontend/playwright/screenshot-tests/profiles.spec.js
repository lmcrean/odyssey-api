import { test, expect } from '@playwright/test';
import { login, captureScreenshot } from './testUtils';

const BASE_URL = 'http://localhost:8080';

test('Capture screenshot of profile page', async ({ page }) => {
  // Log in
  await login(page);

  // Navigate to profile page
  console.log('Navigating to profile page');
  await page.goto(`${BASE_URL}/profiles/141`);
  await page.waitForLoadState('networkidle');
  console.log('Navigated to profile page');

  // Capture screenshot of profile page
  await captureScreenshot(page, 'profiles', 'profile-141-page');

  console.log('Test completed for profile page');
});