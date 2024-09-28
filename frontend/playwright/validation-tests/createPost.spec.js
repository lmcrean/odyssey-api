import { test, expect } from '@playwright/test';
import { captureScreenshot, baseURL, login } from './testUtils';
import path from 'path';
import fs from 'fs';

const BASE_URL = baseURL;
const IMAGE_URL = 'https://res.cloudinary.com/dh5lpihx1/image/upload/v1725533889/media/placeholder_5.jpg';

test.describe('Create Post Process', () => {
  test('Validate create post form and capture alerts', async ({ page }) => {
    await login(page);

    console.log(`Navigating to ${BASE_URL}/posts/create`);
    await page.goto(`${BASE_URL}/posts/create`);

    console.log('Starting create post validation tests');

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

    // Fill in title and content
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

    // Image upload test
    console.log('Starting image upload test');

    const fileInput = await page.$('input[type="file"]#image-upload');
    expect(fileInput).toBeTruthy();

    // Use a real image file
    const imagePath = path.join(__dirname, './test-assets/test-image.jpg');
    console.log('Image path:', imagePath);
    
    // Check if file exists
    if (fs.existsSync(imagePath)) {
      console.log('Image file exists');
    } else {
      console.error('Image file does not exist');
      throw new Error('Image file not found');
    }

    await fileInput.setInputFiles(imagePath);

    // Trigger change event
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]#image-upload');
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Verify image upload
    console.log('Verifying image upload');
    try {
      // Wait for the "Change the image" button to appear
      await page.waitForSelector('label:has-text("Change the image")', { state: 'visible', timeout: 5000 });
      console.log('Change image button found');

      // Check if the image preview is visible
      const imagePreview = await page.$('img.Image');
      if (imagePreview) {
        const isVisible = await imagePreview.isVisible();
        console.log('Image preview visible:', isVisible);
        
        if (isVisible) {
          const src = await imagePreview.getAttribute('src');
          console.log('Image preview src:', src);
        }
      } else {
        console.log('Image preview element not found');
      }

      await captureScreenshot(page, 'create-post', 'image-uploaded');
    } catch (error) {
      console.error('Image upload verification failed:', error);
      await captureScreenshot(page, 'create-post', 'image-upload-failed');
      throw error;
    }
  });
});