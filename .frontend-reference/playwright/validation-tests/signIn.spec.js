import { test, expect } from '@playwright/test';
import { captureScreenshot, baseURL, login } from './testUtils';

const BASE_URL = baseURL;

test.describe('Sign In Process', () => {
  test('Validate sign-in form and capture alerts', async ({ page }) => {
    console.log(`Navigating to ${BASE_URL}/signin`);
    await page.goto(`${BASE_URL}/signin`);

    console.log('Starting sign-in validation tests');

    // Test: Empty form submission
    console.log('Testing empty form submission');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-in button for empty form');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signin', 'empty-form-alert');
    console.log('Captured screenshot for empty form alert');

    // Test: Invalid username
    console.log('Testing invalid username');
    await page.fill('input[name="username"]', 'invaliduser');
    await page.fill('input[name="password"]', 'somepassword');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-in button for invalid username test');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signin', 'invalid-username-alert');
    console.log('Captured screenshot for invalid username alert');

    // Test: Invalid password
    console.log('Testing invalid password');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-in button for invalid password test');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signin', 'invalid-password-alert');
    console.log('Captured screenshot for invalid password alert');

    // Test: Successful signin
    console.log('Testing successful signin');
    await login(page);
    console.log('Waiting for network idle after signin');
    await page.waitForLoadState('networkidle');
    await captureScreenshot(page, 'signin', 'successful-signin');
    console.log('Captured screenshot for successful signin');

    // Verify successful signin
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(accessToken).toBeTruthy();
    console.log('Verified access token in localStorage');

    console.log('Sign-in validation tests completed');
  });
});