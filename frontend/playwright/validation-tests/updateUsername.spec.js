import { test, expect } from '@playwright/test';
import { captureScreenshot, login } from './testUtils';

const BASE_URL = 'http://localhost:8080';

test.describe('Username Update Form Validation', () => {
  test('Test invalid inputs for username update', async ({ page }) => {
    console.log('Starting test');
    
    // Login
    await login(page);
    console.log('Logged in successfully');

    // Navigate to the profile page
    console.log('Navigating to the profile page');
    await page.goto(`${BASE_URL}/profiles/150`);
    await page.waitForLoadState('networkidle');
    console.log('Profile page loaded');

    // Capture screenshot of the profile page
    await captureScreenshot(page, 'username-update', '01-logged-in-profile-view');

    // Click on the ProfileEditDropdown and "change username" option
    await page.click('i.fas.fa-ellipsis-v');
    await page.waitForSelector('.dropdown-menu', { state: 'visible' });
    await page.click('text=change username');

    // Wait for navigation to the username change page
    await page.waitForURL(`${BASE_URL}/profiles/150/edit/username`);
    await page.waitForLoadState('networkidle');
    console.log('Change username page loaded');
    await captureScreenshot(page, 'username-update', '02-change-username-page');
  
    // Check for any unexpected alerts
    const initialAlerts = await page.$$('.alert');
    if (initialAlerts.length === 0) {
      console.log('No alerts present on initial load of Change username page');
    } else {
      console.log(`Warning: ${initialAlerts.length} alert(s) found on initial load`);
      for (const alert of initialAlerts) {
        console.log('Alert text:', await alert.textContent());
      }
    }

    // Test cases for invalid inputs
    const testCases = [
      { name: 'username-too-short', value: 'a' },
      { name: 'username-too-long', value: 'a'.repeat(151) },
      { name: 'username-with-spaces', value: 'test user' },
      { name: 'existing-external-username', value: 'admin' },
      { name: 'existing-own-username', value: 'testuser' },
    ];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`Testing: ${testCase.name}`);

      // Fill in the username field
      await page.fill('input[placeholder="username"]', testCase.value);
      
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
      await captureScreenshot(page, 'username-update', `${(i + 3).toString().padStart(2, '0')}-${testCase.name}`);

      // Clear the input for the next test
      await page.fill('input[placeholder="username"]', '');

      // Wait a bit for any animations or state updates
      await page.waitForTimeout(1000);
    }

    console.log('Username update form validation tests completed');
  });
});