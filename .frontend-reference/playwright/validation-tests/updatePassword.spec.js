import { test, expect } from '@playwright/test';
import { captureScreenshot, login, baseURL } from './testUtils';

const BASE_URL = baseURL;

test.describe('Password Update Form Validation', () => {
  test('Test invalid inputs for password update', async ({ page }) => {
    console.log('Starting password update validation test');

    // Login
    await login(page);
    console.log('Logged in successfully');

    // Navigate to the profile page
    console.log('Navigating to the profile page');
    await page.goto(`${BASE_URL}/profiles/150`);
    await page.waitForLoadState('networkidle');
    console.log('Profile page loaded');

    // Capture screenshot of the profile page
    await captureScreenshot(page, 'password-update', '01-logged-in-profile-view');

    // Click on the ProfileEditDropdown and "change password" option
    await page.click('i.fas.fa-ellipsis-v');
    await page.waitForSelector('.dropdown-menu', { state: 'visible' });
    await page.click('text=change password');

    // Wait for network idle
    await page.waitForLoadState('networkidle');
    await captureScreenshot(page, 'password-update', '02-change-password-page');

    // Test cases for invalid inputs
    const testCases = [
      { name: 'passwords-dont-match', new_password1: 'newpassword1', new_password2: 'newpassword2' },
      { name: 'password-too-short', new_password1: 'short', new_password2: 'short' },
      { name: 'password-too-common', new_password1: 'password123', new_password2: 'password123' },
      { name: 'password-entirely-numeric', new_password1: '12345678', new_password2: '12345678' },
      { name: 'password-similar-to-username', new_password1: 'testuser123', new_password2: 'testuser123' },
    ];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`Testing: ${testCase.name}`);

      // Fill in the password fields
      await page.fill('input[placeholder="new password"]', testCase.new_password1);
      await page.fill('input[placeholder="confirm new password"]', testCase.new_password2);
      
      // Click the save button
      await page.click('button:has-text("save")');

      // Wait for any alert to appear
      const alert = await page.waitForSelector('.alert', { state: 'visible', timeout: 5000 }).catch(() => null);

      if (alert) {
        const alertText = await alert.textContent();
        console.log(`Alert for ${testCase.name}: ${alertText}`);
      } else {
        console.log(`No alert appeared for ${testCase.name}`);
      }

      // Capture screenshot
      await captureScreenshot(page, 'password-update', `${(i + 3).toString().padStart(2, '0')}-${testCase.name}`);

      // Clear the inputs for the next test
      await page.fill('input[placeholder="new password"]', '');
      await page.fill('input[placeholder="confirm new password"]', '');

      // Wait a bit for any animations or state updates
      await page.waitForTimeout(1000);
    }

    // Test unauthorized access
    console.log('Testing unauthorized access');
    await page.goto(`${BASE_URL}/profiles/999/edit/password`);
    await page.waitForLoadState('networkidle');

    await captureScreenshot(page, 'password-update', '08-unauthorized-access');

    console.log('Password update form validation tests completed');
  });
});