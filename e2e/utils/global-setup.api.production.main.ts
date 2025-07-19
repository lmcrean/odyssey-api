import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for API E2E tests (Production - Main Branch)...');
  
  // For main branch production deployments
  const apiUrl = process.env.API_DEPLOYMENT_URL || 
                 process.env.API_BASE_URL || 
                 process.env.CLOUD_RUN_URL ||
                 'https://api-odyssey-466315-tjmqnedl6a-uc.a.run.app';
  
  console.log(`🔗 API URL: ${apiUrl}`);
  console.log(`📍 Environment: Production - Main Branch`);
  
  // Wait for API to be ready
  await waitForService(apiUrl, 'API');
  
  console.log('✅ API global setup complete!');
}

async function waitForService(url: string, serviceName: string, maxRetries = 20) {
  console.log(`⏳ Waiting for ${serviceName} at ${url}...`);
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`✅ ${serviceName} is ready!`);
        return;
      }
    } catch (error) {
      console.log(`⏳ ${serviceName} not ready yet (attempt ${i + 1}/${maxRetries})`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  throw new Error(`❌ ${serviceName} failed to respond after ${maxRetries * 3} seconds`);
}

export default globalSetup;