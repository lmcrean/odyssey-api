import { test, expect } from '@playwright/test';
import { runProductionSignup, runProductionSignin } from './runners/auth-flow-runner.js';
import { generateRandomUser } from './runners/user-generator-runner.js';
import { checkDeploymentStatus } from './operations/health-operations.js';
import { captureErrorScreenshot } from './operations/screenshot-operations.js';

test.describe('Production Signin Testing', () => {
  test.beforeEach(async ({ page }) => {
    await checkDeploymentStatus(page);
  });

  test('should signin with newly registered user', async ({ page }) => {
    try {
      // First register a user
      const testUser = generateRandomUser();
      await runProductionSignup(page, testUser);
      
      // Then signin with that user
      const result = await runProductionSignin(page, testUser);
      
      console.log(`🎉 SUCCESS: ${result.username} signed in!`);
      
    } catch (error) {
      console.error('❌ Signin test failed:', error);
      await captureErrorScreenshot(page, 'signin-test', 'signin-failure');
      throw error;
    }
  });

  test('should handle invalid signin credentials', async ({ page }) => {
    try {
      const invalidUser = { username: 'nonexistent', password: 'wrongpass' };
      
      await page.goto('https://odyssey-frontend-lmcreans-projects.vercel.app/signin');
      await page.fill('input[name="username"]', invalidUser.username);
      await page.fill('input[name="password"]', invalidUser.password);
      await page.click('button[type="submit"]');
      
      const errorAlert = page.locator('.alert, [role="alert"], .error-message');
      await expect(errorAlert).toBeVisible({ timeout: 8000 });
      
      console.log('✅ Invalid credentials handled correctly');
      
    } catch (error) {
      await captureErrorScreenshot(page, 'signin-test', 'invalid-creds-failure');
      throw error;
    }
  });
}); 