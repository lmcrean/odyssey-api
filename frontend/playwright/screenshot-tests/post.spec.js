import { test, expect } from '@playwright/test';
import { login, captureScreenshot } from './testUtils';

const BASE_URL = 'http://localhost:8080';

test('Create and view a post', async ({ page }) => {
  await login(page);

  // Navigate to create post page
  console.log('Navigating to create post page');
  await page.click('a[href="/posts/create"]');
  await page.waitForURL(`${BASE_URL}/posts/create`);
  console.log('Navigated to create post page');

  // Fill in post details
  console.log('Filling in post details');

  await captureScreenshot(page, 'posts', 'create-post-page');
});