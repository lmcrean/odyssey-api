import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for E2E tests...');
  
  // Clean up any test data or resources
  // This could include:
  // - Cleaning test database
  // - Clearing temporary files
  // - Resetting external service states
  
  console.log('✅ Global teardown complete!');
}

export default globalTeardown;