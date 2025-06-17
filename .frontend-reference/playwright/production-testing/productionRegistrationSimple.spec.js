import { test, expect } from '@playwright/test';
import { 
  captureScreenshot, 
  handleTestVideo, 
  handleFailedTestVideo 
} from '../validation-tests/testUtils';

// Production URLs - using stable root format as per user rules
const PROD_FRONTEND_URL = 'https://odyssey-frontend-lmcreans-projects.vercel.app';
const PROD_BACKEND_URL = 'https://odyssey-api-lmcreans-projects.vercel.app';

/**
 * Runner: Generate random test user credentials
 */
function generateTestUser() {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return {
    username: `e2euser${timestamp}${randomSuffix}`,
    password: `TestPass${randomSuffix}123!`
  };
}

/**
 * Operation: Verify backend connectivity
 */
async function verifyBackendHealth(page) {
  console.log('🔗 Verifying backend connectivity...');
  
  const response = await page.request.get(`${PROD_BACKEND_URL}/`);
  expect(response.status()).toBe(200);
  
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('message');
  
  console.log('✅ Backend health check passed');
}

/**
 * Runner: Complete registration test (simplified)
 */
async function runSimpleRegistrationTest(page) {
  // Generate test user
  const testUser = generateTestUser();
  console.log(`🎯 Starting registration test for: ${testUser.username}`);
  
  // Navigate to registration
  console.log('📍 Navigating to production registration page...');
  await page.goto(`${PROD_FRONTEND_URL}/signup`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/.*\/signup/);
  console.log('✅ Successfully navigated to registration page');
  await captureScreenshot(page, 'simple-registration', '01-signup-page');
  
  // Fill form
  console.log(`📝 Filling registration form for user: ${testUser.username}`);
  await page.fill('input[name="username"]', testUser.username);
  await page.fill('input[name="password1"]', testUser.password);
  await page.fill('input[name="password2"]', testUser.password);
  console.log('✅ Form filled successfully');
  await captureScreenshot(page, 'simple-registration', '02-form-filled');
  
  // Submit registration
  console.log('🚀 Submitting registration form...');
  await page.click('button[type="submit"]');
  console.log('✅ Registration form submitted');
  
  // Verify success
  console.log('🔍 Verifying registration success...');
  await page.waitForURL(/.*\/signin\?success=signup/, { timeout: 15000 });
  
  const successAlert = page.locator('.alert, [role="alert"], .success-message');
  await expect(successAlert).toBeVisible({ timeout: 8000 });
  
  const successText = await successAlert.textContent();
  expect(successText).toContain('Sign up successful');
  console.log('✅ Registration success verified');
  await captureScreenshot(page, 'simple-registration', '03-registration-success');
  
  console.log(`🎉 Registration completed successfully for: ${testUser.username}`);
  return testUser;
}

test.describe('Production Registration (Simplified)', () => {
  test.beforeEach(async ({ page }) => {
    await verifyBackendHealth(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await handleFailedTestVideo(testInfo);
  });

  test('should successfully register a new random user on production', async ({ page }, testInfo) => {
    try {
      console.log('🚀 Starting simple production registration test...');
      
      const registeredUser = await runSimpleRegistrationTest(page);
      
      console.log(`✅ SUCCESS: User ${registeredUser.username} registered successfully on production!`);
      console.log(`📧 Username: ${registeredUser.username}`);
      console.log(`🔐 Password: ${registeredUser.password}`);
      
      await handleTestVideo(testInfo);
      
    } catch (error) {
      console.error('❌ Production registration test failed:', error);
      await captureScreenshot(page, 'simple-registration', 'error-state');
      throw error;
    }
  });
}); 