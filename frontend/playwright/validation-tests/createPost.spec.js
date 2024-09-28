import { test, expect } from '@playwright/test';
import { captureScreenshot, baseURL, login } from './testUtils';

const BASE_URL = baseURL;

test.describe('Create Post Process', () => {
  test('Validate create post form and capture alerts', async ({ page }) => {
    // Login before the test
    await login(page);

    console.log(`Navigating to ${BASE_URL}/posts/create`);
    await page.goto(`${BASE_URL}/posts/create`);

    console.log('Starting create post validation tests');

    // Wait for the form to be visible
    await page.waitForSelector('form', { state: 'visible' });

    // Test: Empty submission
    console.log('Testing empty submission');
    await page.evaluate(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) submitButton.click();
    });
    console.log('Clicked submit button for empty submission');
    
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert-warning', { state: 'visible' });
    await captureScreenshot(page, 'create-post', 'empty-submission');
    console.log('Captured screenshot for empty submission alert');

    const error = await page.textContent('.alert-warning');
    expect(error).toBeTruthy();
    console.log('Verified error message presence for empty submission');

    // Test: Fill in title and content
    console.log('Filling in title and content');
    await page.fill('input[name="title"]', 'Test Post Title');
    await page.fill('textarea[name="content"]', 'This is a test post content.');

    // Test: Submit without image
    console.log('Testing submission without image');
    await page.evaluate(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) submitButton.click();
    });
    await page.waitForSelector('.alert-warning', { state: 'visible' });
    await captureScreenshot(page, 'create-post', 'no-image');
    console.log('Captured screenshot for no image alert');

    const imageError = await page.textContent('.alert-warning');
    expect(imageError).toBeTruthy();
    console.log('Verified error message presence for missing image');

    console.log('Create post validation tests completed');
  });
});