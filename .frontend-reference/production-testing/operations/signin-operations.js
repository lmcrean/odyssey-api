import { expect } from '@playwright/test';
import { PROD_FRONTEND_URL } from './config-operations.js';

/**
 * Operation: Navigate to signin page
 */
export async function navigateToSignin(page) {
  console.log('📍 Navigating to signin page...');
  await page.goto(`${PROD_FRONTEND_URL}/signin`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/.*\/signin/);
  console.log('✅ Navigation to signin successful');
}

/**
 * Operation: Fill signin form
 */
export async function fillSigninForm(page, user) {
  console.log(`📝 Filling signin form for: ${user.username}`);
  
  await page.fill('input[name="username"]', user.username);
  await page.fill('input[name="password"]', user.password);
  
  console.log('✅ Signin form filled');
}

/**
 * Operation: Submit signin form
 */
export async function submitSigninForm(page) {
  console.log('🚀 Submitting signin form...');
  await page.click('button[type="submit"]');
  console.log('✅ Signin form submitted');
}

/**
 * Operation: Verify signin success
 */
export async function verifySigninSuccess(page) {
  console.log('🔍 Verifying signin success...');
  
  await page.waitForURL(/.*\/\?success=signin/, { timeout: 15000 });
  
  // Verify access token in localStorage
  const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
  expect(accessToken).toBeTruthy();
  
  console.log('✅ Signin success verified');
} 