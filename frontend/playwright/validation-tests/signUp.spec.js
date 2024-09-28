import {
  test,
  expect
} from '@playwright/test';
import {
  captureScreenshot,
  baseURL
} from './testUtils';

const BASE_URL = baseURL;

test.describe('Sign Up Process', () => {
  test('Validate sign-up form and capture alerts', async ({
    page
  }) => {
    console.log(`Navigating to ${BASE_URL}/signup`);
    await page.goto(`${BASE_URL}/signup`);

    console.log('Starting sign-up validation tests');

    console.log('Testing sign up with existing username');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password1"]', 'newpassword123');
    await page.fill('input[name="password2"]', 'newpassword123');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-up button for existing username test');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signup', 'existing-username-alert');
    console.log('Captured screenshot for existing username alert');

    // Test: Empty form submission.
    console.log('Testing empty form submission');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-up button for empty form');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signup', 'empty-form-alert');
    console.log('Captured screenshot for empty form alert');

    // Test: Username with spaces
    console.log('Testing username with spaces');
    await page.fill('input[name="username"]', 'user with spaces');
    console.log('Filled in username with spaces');
    await page.fill('input[name="password1"]', 'testpassword');
    console.log('Filled in password1');
    await page.fill('input[name="password2"]', 'testpassword');
    console.log('Filled in password2');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-up button for username with spaces test');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signup', 'username-with-spaces-alert');
    console.log('Captured screenshot for username with spaces alert');

    // Test: Password too short
    console.log('Testing password too short');
    await page.fill('input[name="username"]', 'validuser');
    console.log('Filled in valid username');
    await page.fill('input[name="password1"]', 'short');
    console.log('Filled in short password1');
    await page.fill('input[name="password2"]', 'short');
    console.log('Filled in short password2');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-up button for password too short test');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signup', 'password-too-short-alert');
    console.log('Captured screenshot for password too short alert');

    // Test: Password entirely numeric
    console.log('Testing entirely numeric password');
    await page.fill('input[name="password1"]', '123456789');
    console.log('Filled in numeric password1');
    await page.fill('input[name="password2"]', '123456789');
    console.log('Filled in numeric password2');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-up button for numeric password test');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signup', 'numeric-password-alert');
    console.log('Captured screenshot for numeric password alert');

    // Test: Passwords don't match
    console.log('Testing passwords that don\'t match');
    await page.fill('input[name="password1"]', 'validpassword1');
    console.log('Filled in password1');
    await page.fill('input[name="password2"]', 'validpassword2');
    console.log('Filled in different password2');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-up button for passwords don\'t match test');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signup', 'passwords-dont-match-alert');
    console.log('Captured screenshot for passwords don\'t match alert');

    // Test: Username too short
    console.log('Testing username too short');
    await page.fill('input[name="username"]', 'ab');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-up button for username too short test');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signup', 'username-too-short-alert');
    console.log('Captured screenshot for username too short alert');

    // Test: Username too long
    console.log('Testing username too long');
    await page.fill('input[name="username"]', 'a'.repeat(31));
    await page.click('button[type="submit"]');
    console.log('Clicked sign-up button for username too long test');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signup', 'username-too-long-alert');
    console.log('Captured screenshot for username too long alert');

    // Test: Common password
    console.log('Testing common password');
    await page.fill('input[name="username"]', 'validuser');
    await page.fill('input[name="password1"]', 'password');
    await page.fill('input[name="password2"]', 'password');
    await page.click('button[type="submit"]');
    console.log('Clicked sign-up button for common password test');
    console.log('Waiting for alert to appear');
    await page.waitForSelector('.alert');
    await captureScreenshot(page, 'signup', 'common-password-alert');
    console.log('Captured screenshot for common password alert');

    console.log('Sign-up validation tests completed');
  });
});