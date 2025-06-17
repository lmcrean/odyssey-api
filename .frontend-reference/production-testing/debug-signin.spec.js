import { test, expect } from '@playwright/test';
import { runProductionSignup } from './runners/auth-flow-runner.js';
import { generateRandomUser } from './runners/user-generator-runner.js';
import { checkDeploymentStatus } from './operations/health-operations.js';
import { captureScreenshot } from './operations/screenshot-operations.js';

test.describe('Debug Signin Issues', () => {
  test('should capture console logs during signin process', async ({ page }) => {
    // Array to store console messages
    const consoleMessages = [];
    const errors = [];
    const networkFailures = [];

    // Listen to console events
    page.on('console', msg => {
      const message = `${msg.type()}: ${msg.text()}`;
      consoleMessages.push(message);
      console.log(`🖥️ CONSOLE: ${message}`);
    });

    // Listen to page errors
    page.on('pageerror', error => {
      const errorMessage = error.toString();
      errors.push(errorMessage);
      console.log(`❌ PAGE ERROR: ${errorMessage}`);
    });

    // Listen to failed requests
    page.on('requestfailed', request => {
      const failure = `${request.method()} ${request.url()} - ${request.failure().errorText}`;
      networkFailures.push(failure);
      console.log(`🌐 NETWORK FAILURE: ${failure}`);
    });

    // Listen to responses to catch API errors
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`🚨 HTTP ERROR: ${response.status()} ${response.url()}`);
      }
    });

    try {
      await checkDeploymentStatus(page);

      // First register a user
      console.log('🔧 DEBUG: Starting user registration...');
      const testUser = generateRandomUser();
      await runProductionSignup(page, testUser);
      console.log(`✅ DEBUG: User ${testUser.username} registered successfully`);

      // Now attempt signin with detailed logging
      console.log('🔧 DEBUG: Starting signin process...');
      
      // Navigate to signin
      await page.goto('https://odyssey-frontend-lmcreans-projects.vercel.app/signin');
      await page.waitForLoadState('networkidle');
      await captureScreenshot(page, 'debug-signin', '01-signin-page');

      // Fill the form
      console.log(`🔧 DEBUG: Filling form with username: ${testUser.username}`);
      await page.fill('input[name="username"]', testUser.username);
      await page.fill('input[name="password"]', testUser.password);
      await captureScreenshot(page, 'debug-signin', '02-form-filled');

      // Clear console messages before submission
      consoleMessages.length = 0;
      errors.length = 0;
      networkFailures.length = 0;

      console.log('🔧 DEBUG: Submitting signin form...');
      await page.click('button[type="submit"]');
      
      // Wait a bit to capture any immediate errors
      await page.waitForTimeout(3000);
      await captureScreenshot(page, 'debug-signin', '03-after-submit');

      // Try to wait for either success or error
      try {
        // Wait for either success redirect or error message
        await Promise.race([
          page.waitForURL(/.*\/\?success=signin/, { timeout: 10000 }),
          page.waitForSelector('.alert, [role="alert"], .error-message', { timeout: 10000 })
        ]);
      } catch (timeoutError) {
        console.log('🔧 DEBUG: No immediate redirect or error message detected');
      }

      await captureScreenshot(page, 'debug-signin', '04-final-state');

      // Check what's currently in localStorage
      const localStorage = await page.evaluate(() => {
        return {
          accessToken: window.localStorage.getItem('accessToken'),
          refreshToken: window.localStorage.getItem('refreshToken'),
          allKeys: Object.keys(window.localStorage)
        };
      });
      console.log('🔧 DEBUG: LocalStorage contents:', JSON.stringify(localStorage, null, 2));

      // Check current URL
      const currentUrl = page.url();
      console.log(`🔧 DEBUG: Current URL: ${currentUrl}`);

      // Look for any visible error messages
      const errorElements = await page.locator('.alert, [role="alert"], .error-message').all();
      for (const element of errorElements) {
        const text = await element.textContent();
        console.log(`🔧 DEBUG: Visible error message: "${text}"`);
      }

    } catch (error) {
      console.error('🔧 DEBUG: Test failed with error:', error.message);
      await captureScreenshot(page, 'debug-signin', '99-error-state');
    } finally {
      // Print summary of captured logs
      console.log('\n📋 DEBUG SUMMARY:');
      console.log('================');
      console.log(`Console Messages (${consoleMessages.length}):`);
      consoleMessages.forEach((msg, i) => console.log(`  ${i+1}. ${msg}`));
      
      console.log(`\nPage Errors (${errors.length}):`);
      errors.forEach((err, i) => console.log(`  ${i+1}. ${err}`));
      
      console.log(`\nNetwork Failures (${networkFailures.length}):`);
      networkFailures.forEach((fail, i) => console.log(`  ${i+1}. ${fail}`));
      console.log('================\n');
    }
  });
}); 