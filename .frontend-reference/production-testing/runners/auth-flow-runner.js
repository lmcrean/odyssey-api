import { 
  navigateToSignup, 
  fillSignupForm, 
  submitSignupForm, 
  verifySignupSuccess 
} from '../operations/signup-operations.js';
import { 
  navigateToSignin, 
  fillSigninForm, 
  submitSigninForm, 
  verifySigninSuccess 
} from '../operations/signin-operations.js';
import { verifyBackendHealth } from '../operations/health-operations.js';
import { captureScreenshot } from '../operations/screenshot-operations.js';

/**
 * Runner: Complete signup flow on production
 */
export async function runProductionSignup(page, testUser) {
  console.log(`🎯 Running production signup for: ${testUser.username}`);
  
  await navigateToSignup(page);
  await captureScreenshot(page, 'auth-flow', '01-signup-page');
  
  await fillSignupForm(page, testUser);
  await captureScreenshot(page, 'auth-flow', '02-signup-filled');
  
  await submitSignupForm(page);
  await verifySignupSuccess(page);
  await captureScreenshot(page, 'auth-flow', '03-signup-success');
  
  console.log(`✅ Signup completed for: ${testUser.username}`);
  return testUser;
}

/**
 * Runner: Complete signin flow on production  
 */
export async function runProductionSignin(page, testUser) {
  console.log(`🔐 Running production signin for: ${testUser.username}`);
  
  await navigateToSignin(page);
  await captureScreenshot(page, 'auth-flow', '04-signin-page');
  
  await fillSigninForm(page, testUser);
  await captureScreenshot(page, 'auth-flow', '05-signin-filled');
  
  await submitSigninForm(page);
  await verifySigninSuccess(page);
  await captureScreenshot(page, 'auth-flow', '06-signin-success');
  
  console.log(`✅ Signin completed for: ${testUser.username}`);
  return testUser;
}

/**
 * Runner: Complete auth flow (signup + signin)
 */
export async function runCompleteAuthFlow(page, testUser) {
  console.log(`🚀 Running complete auth flow for: ${testUser.username}`);
  
  // Verify backend first
  await verifyBackendHealth(page);
  
  // Run signup
  await runProductionSignup(page, testUser);
  
  // Run signin  
  await runProductionSignin(page, testUser);
  
  console.log(`🎉 Complete auth flow successful for: ${testUser.username}`);
  return testUser;
} 