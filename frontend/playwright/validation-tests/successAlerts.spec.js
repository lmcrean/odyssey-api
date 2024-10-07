import { test, expect } from '@playwright/test';
import { captureScreenshot, baseURL } from './testUtils';

const BASE_URL = baseURL;

console.log('Starting test description');

test.describe('Success Alerts for POST Requests', () => {
  console.log('Entering test description');

  test('Verify and screenshot signup success alerts', async ({ page }) => {
    console.log('Starting signup test case');

    // Sign Up
    console.log('Navigating to signup page');
    await page.goto(`${BASE_URL}/signup`);

    console.log('Generating random username');
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const randomUsername = `newuser${randomNumber}`;
    console.log(`Generated username: ${randomUsername}`);

    console.log('Filling random username');
    await page.fill('input[name="username"]', randomUsername);

    console.log('Filling password1');
    await page.fill('input[name="password1"]', 'strongpassword123');

    console.log('Filling password2');
    await page.fill('input[name="password2"]', 'strongpassword123');

    console.log('Clicking submit button');
    await page.click('button[type="submit"]');

    console.log('Capturing first screenshot');
    await captureScreenshot(page, 'success-alerts', '01-signup-success');

    // Wait for 5 seconds
    console.log('Starting 5 second wait');
    await page.waitForTimeout(5000);
    console.log('Finished 5 second wait');

    console.log('Capturing second screenshot');
    await captureScreenshot(page, 'success-alerts', '02-signup-success-disappeared');

    console.log('Signup test case completed');

    console.log('Starting signin test case');

    // Sign In
    console.log('Navigating to signin page');
    await page.goto(`${BASE_URL}/signin`);

    console.log('Filling username');
    await page.fill('input[name="username"]', randomUsername);

    console.log('Filling password');
    await page.fill('input[name="password"]', 'strongpassword123'); 

    console.log('Clicking submit button');
    await page.click('button[type="submit"]');

    console.log('Capturing first signin screenshot');
    await captureScreenshot(page, 'success-alerts', '03-signin-success');

    // Wait for 5 seconds
    console.log('Starting 5 second wait');
    await page.waitForTimeout(5000);
    console.log('Finished 5 second wait');

    console.log('Capturing second signin screenshot');
    await captureScreenshot(page, 'success-alerts', '04-signin-success-disappeared');

    console.log('Signin test case completed');
  });

  console.log('Exiting test description');
});

console.log('Test script completed');