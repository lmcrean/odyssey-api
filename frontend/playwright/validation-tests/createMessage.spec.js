import { test, expect } from '@playwright/test';
import { captureScreenshot, baseURL, login } from './testUtils';
import path from 'path';

const BASE_URL = baseURL;

test.describe('Message Detail Send Form Validation', () => {
  test('Validate message send form and capture screenshots', async ({ page }) => {
    await login(page);

    console.log(`Navigating to ${BASE_URL}/messages/1`);
    await page.goto(`${BASE_URL}/messages/1`);

    console.log('Starting message send form validation tests');

    await page.waitForSelector('form', { state: 'visible' });

    // Test: Empty submission
    console.log('Testing empty submission');
    await page.click('button:has-text("Send")');
    
    // Wait for the alert to appear
    await page.waitForSelector('.alert-warning', { state: 'visible', timeout: 5000 });
    
    const alertText = await page.textContent('.alert-warning');
    expect(alertText).toContain('Please enter a message or upload an image');
    
    await captureScreenshot(page, 'message-send', '1-empty-submission');
    console.log('Captured screenshot for empty submission');

    // Test: Message too long
    console.log('Testing message too long');
    await page.fill('textarea[name="content"]', 'a'.repeat(1001));
    await page.click('button:has-text("Send")');
    
    // Wait for the alert to appear
    await page.waitForSelector('.alert-warning', { state: 'visible', timeout: 5000 });
    
    const longMessageAlertText = await page.textContent('.alert-warning');
    expect(longMessageAlertText).toContain('Message should not exceed 1000 characters');
    
    await captureScreenshot(page, 'message-send', '2-message-too-long');
    console.log('Captured screenshot for message too long');

    // Test: Message with only spaces
    console.log('Testing message with only spaces');
    await page.fill('textarea[name="content"]', '   ');
    await page.click('button:has-text("Send")');
    
    // Wait for the alert to appear
    await page.waitForSelector('.alert-warning', { state: 'visible', timeout: 5000 });
    
    const spacesAlertText = await page.textContent('.alert-warning');
    expect(spacesAlertText).toContain('Please enter a message or upload an image');
    
    await captureScreenshot(page, 'message-send', '3-spaces-only');
    console.log('Captured screenshot for spaces-only message');
    

    // Test: Image file too large
    console.log('Testing image file too large');
    const largeImagePath = path.join(__dirname, 'test-assets', 'large-image.jpg');
    await page.setInputFiles('input[type="file"]', largeImagePath);
    
    // Wait for the alert to appear
    await page.waitForSelector('.alert-warning', { state: 'visible', timeout: 5000 });
    
    const largeImageAlertText = await page.textContent('.alert-warning');
    expect(largeImageAlertText).toContain('Image file size should not exceed 5MB');
    
    await captureScreenshot(page, 'message-send', '4-image-too-large');
    console.log('Captured screenshot for image too large');

    // Test: invalid image type
    console.log('Testing invalid image type');
    const invalidImagePath = path.join(__dirname, 'test-assets', 'test-file.txt');
    await page.setInputFiles('input[type="file"]', invalidImagePath);
    
    // Wait for the alert to appear
    await page.waitForSelector('.alert-warning', { state: 'visible', timeout: 5000 });
    
    const invalidImageAlertText = await page.textContent('.alert-warning');
    expect(invalidImageAlertText).toContain('Only JPEG, PNG, and GIF images are allowed');
    
    await captureScreenshot(page, 'message-send', '5-invalid-image-type');
    console.log('Captured screenshot for invalid image type');

    console.log('Message send form validation tests completed');

     // Test: Valid image with no message
     console.log('Testing valid image with no message');
     const validImagePath = path.join(__dirname, 'test-assets', 'test-image.jpg');
     await page.fill('textarea[name="content"]', '');
     await page.setInputFiles('input[type="file"]', validImagePath);
     await captureScreenshot(page, 'message-send', '6.1-valid-image-no-message-preview');
     await page.click('button:has-text("Send")');
     await page.waitForTimeout(200);
     
     // Check if there are no error messages
     const errorMessages = await page.$$('.alert-warning');
     expect(errorMessages.length).toBe(0);
     await page.waitForTimeout(2000);
     await captureScreenshot(page, 'message-send', '6-valid-image-no-message');
      console.log('Captured screenshot for valid image with no message');

    // Test: Valid message with no image
    console.log('Testing valid message with no image');
    await page.fill('textarea[name="content"]', 'Hello, world!');
    await page.click('button:has-text("Send")');
    // wait for network idle
    await page.waitForTimeout(2000);
    await captureScreenshot(page, 'message-send', '7-valid-message-no-image');
  });
});