import { test, expect } from '@playwright/test';
import { captureScreenshot, baseURL, login } from './testUtils';
import path from 'path';
import fs from 'fs';

const BASE_URL = baseURL;

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

    // Test: Title with only spaces
    console.log('Testing title with only spaces');
    await page.fill('input[name="title"]', '   ');
    await page.evaluate(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) submitButton.click();
    });
    await page.waitForSelector('.alert-warning', { state: 'visible' });
    await captureScreenshot(page, 'create-post', 'title-only-spaces');

    // Test: Title too short
    console.log('Testing title too short');
    await page.fill('input[name="title"]', 'ab');
    await page.evaluate(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) submitButton.click();
    });
    await page.waitForSelector('.alert-warning', { state: 'visible' });
    await captureScreenshot(page, 'create-post', 'title-too-short');

    // Test: Title too long
    console.log('Testing title too long');
    await page.fill('input[name="title"]', 'a'.repeat(101));
    await page.evaluate(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) submitButton.click();
    });
    await page.waitForSelector('.alert-warning', { state: 'visible' });
    await captureScreenshot(page, 'create-post', 'title-too-long');

    // Test: Valid title
    console.log('Testing valid title');
    await page.fill('input[name="title"]', 'Valid Title');
    await page.fill('textarea[name="content"]', 'This is valid content');

    // Helper function to submit form, scroll to bottom, and capture screenshot
    async function submitScrollAndCapture(name) {
      await page.evaluate(() => {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) submitButton.click();
      });
      await page.waitForSelector('.alert-warning', { state: 'visible' });
      
      // Scroll to the bottom of the page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Wait for any animations to complete
      await page.waitForTimeout(1000);
      
      await captureScreenshot(page, 'create-post', name);
    }

    // Test: Content with only spaces
    console.log('Testing content with only spaces');
    await page.fill('input[name="title"]', 'Valid Title');
    await page.fill('textarea[name="content"]', '   ');
    await submitScrollAndCapture('content-only-spaces');

    // Test: Content too long
    console.log('Testing content too long');
    await page.fill('textarea[name="content"]', 'a'.repeat(1001));
    await submitScrollAndCapture('content-too-long');
    
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

    // Test: Submit with image but no title

    await page.fill('input[name="title"]', ''); // Clear the title
    await page.evaluate(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) submitButton.click();
    });
    await page.waitForSelector('.alert-warning', { state: 'visible' });
    await captureScreenshot(page, 'create-post', 'image-no-title');
    console.log('Captured screenshot for image uploaded but no title alert');

    const titleError = await page.textContent('.alert-warning');
    expect(titleError).toBeTruthy();
    console.log('Verified error message presence for missing title');

    console.log('Create post validation tests completed');


    // Upload a non-image file (.txt)
    console.log('Testing upload of non-image file');
    console.log(`Navigating to ${BASE_URL}/posts/create`);
    await page.goto(`${BASE_URL}/posts/create`);
    const badFileInput = await page.$('input[type="file"]#image-upload');
    expect(badFileInput).toBeTruthy();

    const txtFilePath = path.join(__dirname, './test-assets/test-file.txt');
    console.log('Text file path:', txtFilePath);

    await page.fill('input[name="title"]', 'uploaded a text file');
    
    // Check if file exists
    if (fs.existsSync(txtFilePath)) {
      console.log('Text file exists');
    } else {
      console.error('Text file does not exist');
      throw new Error('Text file not found');
    }

    await badFileInput.setInputFiles(txtFilePath);

    // Trigger change event
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]#image-upload');
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Verify that an error message is displayed for non-image file
    console.log('Verifying error message for non-image file');
    try {
      await page.waitForSelector('.alert-warning', { state: 'visible', timeout: 5000 });
      const errorMessage = await page.textContent('.alert-warning');
      expect(errorMessage).toContain('Please upload an image file');
      console.log('Error message for non-image file verified');

      await captureScreenshot(page, 'create-post', 'non-image-file-error');
    } catch (error) {
      console.error('Non-image file error verification failed:', error);
      await captureScreenshot(page, 'create-post', 'non-image-file-error-failed');
      throw error;
    }

    // Verify that the image preview is not visible
    const imagePreview = await page.$('img.Image');
    expect(imagePreview).toBeNull();
    console.log('Confirmed no image preview for non-image file');

    console.log('Create post validation tests completed');
  });
});