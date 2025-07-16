import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests...');
  
  // Wait for services to be ready
  await waitForService('http://localhost:5000', 'API');
  await waitForService('http://localhost:4200', 'Web App');
  
  console.log('✅ Global setup complete!');
}

async function waitForService(url: string, serviceName: string, maxRetries = 30) {
  console.log(`⏳ Waiting for ${serviceName} at ${url}...`);
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`✅ ${serviceName} is ready!`);
        return;
      }
    } catch (error) {
      // Service not ready yet, continue waiting
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error(`❌ ${serviceName} failed to start after ${maxRetries * 2} seconds`);
}

export default globalSetup;