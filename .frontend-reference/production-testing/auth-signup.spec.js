import { test, expect } from '@playwright/test';
import { runProductionSignup } from './runners/auth-flow-runner.js';
import { generateRandomUser } from './runners/user-generator-runner.js';
import { checkDeploymentStatus } from './operations/health-operations.js';
import { captureErrorScreenshot } from './operations/screenshot-operations.js';

test.describe('Production Signup Testing', () => {
  test.beforeEach(async ({ page }) => {
    await checkDeploymentStatus(page);
  });

  test('should register new user successfully', async ({ page }) => {
    try {
      const testUser = generateRandomUser();
      const result = await runProductionSignup(page, testUser);
      
      console.log(`🎉 SUCCESS: ${result.username} registered!`);
      
    } catch (error) {
      console.error('❌ Signup test failed:', error);
      await captureErrorScreenshot(page, 'signup-test', 'signup-failure');
      throw error;
    }
  });

  test('should handle invalid signup data', async ({ page }) => {
    try {
      const invalidUser = { username: 'ab', password: 'short' };
      
      await page.goto('https://odyssey-frontend-lmcreans-projects.vercel.app/signup');
      await page.fill('input[name="username"]', invalidUser.username);
      await page.fill('input[name="password1"]', invalidUser.password);
      await page.fill('input[name="password2"]', invalidUser.password);
      await page.click('button[type="submit"]');
      
      const errorAlert = page.locator('.alert, [role="alert"], .error-message');
      await expect(errorAlert).toBeVisible({ timeout: 8000 });
      
      console.log('✅ Invalid data handled correctly');
      
    } catch (error) {
      await captureErrorScreenshot(page, 'signup-test', 'validation-failure');
      throw error;
    }
  });
}); 