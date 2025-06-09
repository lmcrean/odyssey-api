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
 * Operation: Navigate to production registration page
 */
async function navigateToRegistration(page) {
  console.log('📍 Navigating to production registration page...');
  await page.goto(`${PROD_FRONTEND_URL}/signup`);
  await page.waitForLoadState('networkidle');
  
  // Verify we're on the signup page
  await expect(page).toHaveURL(/.*\/signup/);
  console.log('✅ Successfully navigated to registration page');
}

/**
 * Operation: Fill registration form
 */
async function fillRegistrationForm(page, user) {
  console.log(`📝 Filling registration form for user: ${user.username}`);
  
  // Fill username
  await page.fill('input[name="username"]', user.username);
  console.log(`✅ Username filled: ${user.username}`);
  
  // Fill first password
  await page.fill('input[name="password1"]', user.password);
  console.log('✅ Password1 filled');
  
  // Fill confirm password
  await page.fill('input[name="password2"]', user.password);
  console.log('✅ Password2 filled');
}

/**
 * Operation: Submit registration form
 */
async function submitRegistration(page) {
  console.log('🚀 Submitting registration form...');
  
  // Click submit button
  await page.click('button[type="submit"]');
  console.log('✅ Registration form submitted');
}

/**
 * Operation: Verify successful registration
 */
async function verifyRegistrationSuccess(page) {
  console.log('🔍 Verifying registration success...');
  
  // Wait for navigation to signin page with success parameter
  await page.waitForURL(/.*\/signin\?success=signup/, { timeout: 15000 });
  
  // Verify success message appears
  const successAlert = page.locator('.alert, [role="alert"], .success-message');
  await expect(successAlert).toBeVisible({ timeout: 8000 });
  
  const successText = await successAlert.textContent();
  expect(successText).toContain('Sign up successful');
  
  console.log('✅ Registration success verified');
}

/**
 * Operation: Verify backend connectivity
 */
async function verifyBackendHealth(page) {
  console.log('🔗 Verifying backend connectivity...');
  
  // Make a direct request to the backend health endpoint
  const response = await page.request.get(`${PROD_BACKEND_URL}/`);
  expect(response.status()).toBe(200);
  
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('message');
  
  console.log('✅ Backend health check passed');
}

/**
 * Runner: Complete registration and signin test
 */
async function runCompleteRegistrationFlow(page) {
  // Generate test user
  const testUser = generateTestUser();
  console.log(`🎯 Starting registration test for: ${testUser.username}`);
  
  // Execute registration operations
  await navigateToRegistration(page);
  await captureScreenshot(page, 'production-registration', '01-signup-page');
  
  await fillRegistrationForm(page, testUser);
  await captureScreenshot(page, 'production-registration', '02-form-filled');
  
  await submitRegistration(page);
  await verifyRegistrationSuccess(page);
  await captureScreenshot(page, 'production-registration', '03-registration-success');
  
  console.log(`🎉 Registration completed successfully for: ${testUser.username}`);
  return testUser;
}

/**
 * Operation: Test signin with newly registered user
 */
async function testSigninWithNewUser(page, user) {
  console.log('🔐 Testing signin with newly registered user...');
  
  // Fill signin form
  await page.fill('input[name="username"]', user.username);
  await page.fill('input[name="password"]', user.password);
  await captureScreenshot(page, 'production-registration', '04-signin-form-filled');
  
  // Submit signin
  await page.click('button[type="submit"]');
  
  // Verify successful signin
  await page.waitForURL(/.*\/\?success=signin/, { timeout: 15000 });
  await captureScreenshot(page, 'production-registration', '05-signin-success');
  
  // Verify user is logged in by checking localStorage
  const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
  expect(accessToken).toBeTruthy();
  
  console.log('✅ Signin successful with newly registered user');
}

test.describe('Production E2E Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Verify backend health before each test
    await verifyBackendHealth(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await handleFailedTestVideo(testInfo);
  });

  test('should successfully register and signin a new user on production', async ({ page }, testInfo) => {
    try {
      console.log('🚀 Starting complete production registration flow...');
      
      // Run the complete registration test
      const registeredUser = await runCompleteRegistrationFlow(page);
      
      // Test signin with the newly registered user
      await testSigninWithNewUser(page, registeredUser);
      
      console.log('✅ Complete E2E registration and signin flow successful');
      
      // Handle successful test video
      await handleTestVideo(testInfo);
      
    } catch (error) {
      console.error('❌ Production registration test failed:', error);
      await captureScreenshot(page, 'production-registration', 'error-state');
      throw error;
    }
  });

  test('should handle registration validation errors gracefully', async ({ page }, testInfo) => {
    try {
      console.log('🧪 Testing registration validation on production...');
      
      await navigateToRegistration(page);
      
      // Test with invalid username (too short)
      await page.fill('input[name="username"]', 'ab');
      await page.fill('input[name="password1"]', 'validpassword123');
      await page.fill('input[name="password2"]', 'validpassword123');
      await captureScreenshot(page, 'production-registration', 'validation-short-username');
      
      await submitRegistration(page);
      
      // Verify error message appears
      const errorAlert = page.locator('.alert, [role="alert"], .error-message');
      await expect(errorAlert).toBeVisible({ timeout: 8000 });
      await captureScreenshot(page, 'production-registration', 'validation-error-displayed');
      
      console.log('✅ Validation errors handled correctly on production');
      
    } catch (error) {
      console.error('❌ Production validation test failed:', error);
      await captureScreenshot(page, 'production-registration', 'validation-error-state');
      throw error;
    }
  });

  test('should verify CORS configuration between frontend and backend', async ({ page }) => {
    console.log('🔗 Testing CORS configuration...');
    
    // Navigate to frontend
    await page.goto(PROD_FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    
    // Test that API calls work by attempting to access a backend endpoint
    const response = await page.evaluate(async (backendUrl) => {
      try {
        const result = await fetch(`${backendUrl}/`, {
          method: 'GET',
          credentials: 'include'
        });
        return {
          status: result.status,
          ok: result.ok
        };
      } catch (error) {
        return {
          error: error.message
        };
      }
    }, PROD_BACKEND_URL);
    
    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);
    
    console.log('✅ CORS configuration working correctly');
  });
}); 