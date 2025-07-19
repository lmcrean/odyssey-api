import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for Web + API E2E tests (Local)...');
  
  // For local development
  const webUrl = process.env.WEB_BASE_URL || 'http://localhost:4200';
  const apiUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  
  console.log(`🌐 Web URL: ${webUrl}`);
  console.log(`🔗 API URL: ${apiUrl}`);
  
  // Wait for both services to be ready (with shorter timeout for local)
  await Promise.all([
    waitForService(apiUrl, 'API', 10),
    waitForService(webUrl, 'Web App', 10)
  ]);
  
  console.log('✅ Web + API global setup complete!');
}

async function waitForService(url: string, serviceName: string, maxRetries = 10) {
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
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error(`❌ ${serviceName} failed to respond after ${maxRetries * 2} seconds`);
}

export default globalSetup;