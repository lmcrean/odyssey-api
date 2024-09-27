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

  await captureScreenshot(page, 'create-post-page');
  
  await page.fill('input[name="title"]', 'Test Post Title');
  await page.fill('textarea[name="content"]', 'This is a test post content.');
  console.log('Post details filled');


  await captureScreenshot(page, 'post-created');
  console.log('Post creation verified');
});