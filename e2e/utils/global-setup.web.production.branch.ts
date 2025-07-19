import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for Web + API E2E tests (Production - Branch Deployment)...');
  
  // For branch/PR deployments - environment variables are required
  const webUrl = process.env.WEB_DEPLOYMENT_URL || 
                 process.env.FIREBASE_HOSTING_URL;
  const apiUrl = process.env.API_DEPLOYMENT_URL || 
                 process.env.API_BASE_URL || 
                 process.env.CLOUD_RUN_URL;
  
  if (!webUrl) {
    throw new Error('❌ WEB_DEPLOYMENT_URL or FIREBASE_HOSTING_URL environment variable is required for branch deployment tests');
  }
  
  if (!apiUrl) {
    throw new Error('❌ API_DEPLOYMENT_URL or CLOUD_RUN_URL environment variable is required for branch deployment tests');
  }
  
  console.log(`🌐 Web URL: ${webUrl}`);
  console.log(`🔗 API URL: ${apiUrl}`);
  console.log(`📍 Environment: Production - Branch Deployment`);
  console.log(`🌿 Branch: ${process.env.GITHUB_HEAD_REF || process.env.BRANCH_NAME || 'unknown'}`);
  console.log(`🔢 PR: #${process.env.PR_NUMBER || process.env.GITHUB_EVENT_NUMBER || 'unknown'}`);
  
  // Wait for both services to be ready
  await Promise.all([
    waitForService(apiUrl, 'API'),
    waitForService(webUrl, 'Web App')
  ]);
  
  console.log('✅ Web + API global setup complete!');
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