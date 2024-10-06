import { test, expect } from '@playwright/test';
import { login, captureScreenshot } from './testUtils';

const BASE_URL = 'http://localhost:8080';

test('Capture screenshot of messages page', async ({ page }) => {
  // Log in
  await login(page);

  // Navigate to messages page
  console.log('Navigating to messages page');
  await page.goto(`${BASE_URL}/messages`);
  await page.waitForLoadState('networkidle');
  console.log('Navigated to messages page');

  // Capture screenshot of messages page
  await captureScreenshot(page, 'messages', 'messages-page');

  await page.goto(`${BASE_URL}/messages/4`);
  await page.waitForLoadState('networkidle');
  console.log('Navigated to messages page');

  // Capture screenshot of messages page
  await captureScreenshot(page, 'messages', 'message-detail');

  console.log('Test completed for messages page');
});