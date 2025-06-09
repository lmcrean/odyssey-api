import { test } from '@playwright/test';
import { runCompleteAuthFlow } from './runners/auth-flow-runner.js';
import { generateRandomUser, generateMultipleUsers } from './runners/user-generator-runner.js';
import { checkDeploymentStatus } from './operations/health-operations.js';
import { captureErrorScreenshot } from './operations/screenshot-operations.js';

test.describe('Production Complete Auth Flow', () => {
  test.beforeEach(async ({ page }) => {
    await checkDeploymentStatus(page);
  });

  test('should complete full signup and signin flow', async ({ page }) => {
    try {
      const testUser = generateRandomUser();
      const result = await runCompleteAuthFlow(page, testUser);
      
      console.log(`🎉 COMPLETE SUCCESS: ${result.username} full auth flow!`);
      
    } catch (error) {
      console.error('❌ Complete auth flow failed:', error);
      await captureErrorScreenshot(page, 'complete-flow', 'auth-flow-failure');
      throw error;
    }
  });

  test('should handle multiple user registrations', async ({ page }) => {
    try {
      const users = generateMultipleUsers(2);
      const results = [];
      
      for (const user of users) {
        const result = await runCompleteAuthFlow(page, user);
        results.push(result);
        console.log(`✅ User ${result.username} completed auth flow`);
      }
      
      console.log(`🎉 SUCCESS: ${results.length} users completed auth flows!`);
      
    } catch (error) {
      console.error('❌ Multiple user test failed:', error);
      await captureErrorScreenshot(page, 'complete-flow', 'multiple-users-failure');
      throw error;
    }
  });
}); 