import { expect } from '@playwright/test';
import { PROD_FRONTEND_URL } from './config-operations.js';

/**
 * Operation: Navigate to signup page
 */
export async function navigateToSignup(page) {
  console.log('📍 Navigating to signup page...');
  await page.goto(`${PROD_FRONTEND_URL}/signup`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/.*\/signup/);
  console.log('✅ Navigation to signup successful');
}

/**
 * Operation: Fill signup form
 */
export async function fillSignupForm(page, user) {
  console.log(`📝 Filling signup form for: ${user.username}`);
  
  await page.fill('input[name="username"]', user.username);
  await page.fill('input[name="password1"]', user.password);
  await page.fill('input[name="password2"]', user.password);
  
  console.log('✅ Signup form filled');
}

/**
 * Operation: Submit signup form
 */
export async function submitSignupForm(page) {
  console.log('🚀 Submitting signup form...');
  await page.click('button[type="submit"]');
  console.log('✅ Signup form submitted');
}

/**
 * Operation: Verify signup success
 */
export async function verifySignupSuccess(page) {
  console.log('🔍 Verifying signup success...');
  
  await page.waitForURL(/.*\/signin\?success=signup/, { timeout: 15000 });
  
  const successAlert = page.locator('.alert, [role="alert"], .success-message');
  await expect(successAlert).toBeVisible({ timeout: 8000 });
  
  const successText = await successAlert.textContent();
  expect(successText).toContain('Sign up successful');
  
  console.log('✅ Signup success verified');
} 