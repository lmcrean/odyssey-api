import { test, expect } from '@playwright/test';
import { captureScreenshot, login, baseURL } from './testUtils';
import path from 'path';

const BASE_URL = baseURL;

test.describe('Profile Edit Form Validation', () => {
  test('Test profile edit form inputs and image upload', async ({ page }) => {
    console.log('Starting profile edit form validation test');

    // Login
    await login(page);
    console.log('Logged in successfully');

    // Navigate to the profile edit page
    console.log('Navigating to the profile edit page');
    await page.goto(`${BASE_URL}/profiles/150/edit`);
    await page.waitForLoadState('networkidle');
    console.log('Profile edit page loaded');

    // Capture screenshot of the initial profile edit page
    await captureScreenshot(page, 'profile-edit', '01-initial-profile-edit-page');

    // Test cases for text inputs
    const testCases = [
      { name: 'bio-too-long', content: 'a'.repeat(1001) },
      { name: 'bio-empty', content: '' },
      { name: 'bio-only-spaces', content: '   ' },
      { name: 'bio-more-than-three-spaces', content: '    This bio starts with more than three spaces' },
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Testing: ${testCase.name}`);
      
        // Fill in the bio field
        await page.fill('textarea[name="content"]', testCase.content);
        
        // Wait for any alert to appear
        const alert = await page.waitForSelector('.alert', { state: 'visible', timeout: 5000 }).catch(() => null);
      
      
        if (alert) {
          const alertText = await alert.textContent();
          console.log(`Alert for ${testCase.name}: ${alertText}`);
          // Scroll to show both the bio textarea and the alert
            await page.evaluate(() => {
                const textarea = document.querySelector('textarea[name="content"]');
                const alert = document.querySelector('.alert');
                if (textarea && alert) {
                textarea.scrollIntoView({ behavior: 'instant', block: 'start' });
                window.scrollBy(0, 999); // Scroll down a bit to ensure the alert is visible
                }
            });
            await page.mouse.wheel(0, 500);
        } else {
          console.log(`No alert appeared for ${testCase.name}`);
        }
      
        // Capture screenshot
        await captureScreenshot(page, 'profile-edit', `${(i + 2).toString().padStart(2, '0')}-${testCase.name}`);
      
        // Clear the input for the next test
        await page.fill('textarea[name="content"]', '');
      
        // Wait a bit for any animations or state updates
        await page.waitForTimeout(1000);
      }

    // Test image upload
    console.log('Testing image upload');

    // Valid image upload
    const validImagePath = path.join(__dirname, 'test-assets', 'test-image.jpg');
    await page.setInputFiles('input[type="file"]', validImagePath);
    await captureScreenshot(page, 'profile-edit', '06-valid-image-upload');

    // Large image upload
    const largeImagePath = path.join(__dirname, 'test-assets', 'large-image.jpg');
    await page.setInputFiles('input[type="file"]', largeImagePath);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.alert', { state: 'visible', timeout: 5000 }).then(alert => 
        alert.evaluate(node => node.scrollIntoView({ behavior: 'instant', block: 'center' }))
      );
    await captureScreenshot(page, 'profile-edit', '07-large-image-upload');

    // Invalid file type upload
    const invalidFilePath = path.join(__dirname, 'test-assets', 'test-file.txt');
    await page.setInputFiles('input[type="file"]', invalidFilePath);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.alert', { state: 'visible', timeout: 5000 }).then(alert => 
        alert.evaluate(node => node.scrollIntoView({ behavior: 'instant', block: 'center' }))
      );
    await captureScreenshot(page, 'profile-edit', '08-invalid-file-upload');

    // Test unauthorized access
    console.log('Testing unauthorized access');
    await page.goto(`${BASE_URL}/profiles/999/edit`);
    await page.waitForLoadState('networkidle');
    
    console.log('Unauthorized access test completed');

    await captureScreenshot(page, 'profile-edit', '09-unauthorized-access');

    console.log('Profile edit form validation tests completed');
  });
});