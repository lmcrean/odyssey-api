import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

async function debugSignIn(page) {
  await page.goto(`${BASE_URL}/signin`);
  
  console.log('Current URL before sign-in:', page.url());

  await page.fill('input[name="username"]', 'user');
  await page.fill('input[name="password"]', 'qwerqwer*');

  // Enable request interception
  await page.route('**/*', route => route.continue());

  // Listen for API requests
  page.on('request', request => {
    if (request.url().includes('/dj-rest-auth/login/')) {
      console.log('Sign-in request detected:', request.url());
      console.log('Request method:', request.method());
      console.log('Request headers:', request.headers());
      console.log('Request body:', request.postData());
    }
  });

  // Listen for API responses
  page.on('response', async response => {
    if (response.url().includes('/dj-rest-auth/login/')) {
      console.log('Sign-in response detected:', response.url());
      console.log('Response status:', response.status());
      try {
        const body = await response.json();
        console.log('Response body:', body);
      } catch (error) {
        console.log('Failed to parse response body:', error);
      }
    }
  });

  // Click the submit button and wait for navigation
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle' })
  ]);

  console.log('Current URL after sign-in attempt:', page.url());

  // Check localStorage
  const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
  const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
  console.log('Access token after sign-in:', accessToken);
  console.log('Refresh token after sign-in:', refreshToken);

  // Check for any error messages on the page
  const errorMessage = await page.$eval('body', el => el.innerText);
  console.log('Page content after sign-in attempt:', errorMessage);

  // Take a screenshot
  await page.screenshot({ path: 'debug-signin-attempt.png', fullPage: true });
}

test('Debug Sign-in Process', async ({ page }) => {
  await debugSignIn(page);
});