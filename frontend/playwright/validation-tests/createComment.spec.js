import { test, expect } from '@playwright/test';
import { captureScreenshot, baseURL, login } from './testUtils';

const BASE_URL = baseURL;

test.describe('Create Comment Process', () => {
  test('Validate comment form and capture alerts', async ({ page }) => {
    await login(page);

    console.log(`Navigating to ${BASE_URL}/posts/42`);
    await page.goto(`${BASE_URL}/posts/42`);

    console.log('Starting comment validation tests');

    await page.waitForSelector('form', { state: 'visible' });

    // Test: Empty submission
    console.log('Testing empty submission');
    await page.fill('textarea[placeholder="my comment..."]', '');
    await page.click('button:has-text("post")');
    await captureScreenshot(page, 'create-comment', 'empty-submission', true);
    console.log('Captured screenshot for empty submission');

    // Test: Comment with only spaces
    console.log('Testing comment with only spaces');
    await page.fill('textarea[placeholder="my comment..."]', '   ');
    await page.click('button:has-text("post")');
    await captureScreenshot(page, 'create-comment', 'spaces-only', true);
    console.log('Captured screenshot for spaces-only comment');

    // Test: Long comment
    console.log('Testing long comment');
    await page.fill('textarea[placeholder="my comment..."]', 'a'.repeat(1001));
    await page.click('button:has-text("post")');
    await captureScreenshot(page, 'create-comment', 'long-comment', true);
    console.log('Captured screenshot for long comment');

    console.log('Comment validation tests completed');
  });
});
