import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for production E2E tests...');
  
  // Get URLs from environment variables
  const webUrl = process.env.WEB_DEPLOYMENT_URL || process.env.FIREBASE_HOSTING_URL || 'https://lauriecrean-free-38256.web.app';
  const apiUrl = process.env.API_DEPLOYMENT_URL || process.env.CLOUD_RUN_URL;
  
  if (!apiUrl) {
    throw new Error('❌ API_DEPLOYMENT_URL or CLOUD_RUN_URL environment variable is required for production E2E tests');
  }
  
  console.log(`🌐 Web URL: ${webUrl}`);
  console.log(`🔗 API URL: ${apiUrl}`);
  
  // Wait for deployed services to be ready
  await waitForService(apiUrl, 'API');
  await waitForService(webUrl, 'Web App');
  
  console.log('✅ Production global setup complete!');
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