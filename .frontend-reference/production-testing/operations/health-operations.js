import { expect } from '@playwright/test';
import { PROD_BACKEND_URL } from './config-operations.js';

/**
 * Operation: Verify backend health
 */
export async function verifyBackendHealth(page) {
  console.log('🔗 Verifying backend health...');
  
  const response = await page.request.get(`${PROD_BACKEND_URL}/`);
  expect(response.status()).toBe(200);
  
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('message');
  
  console.log('✅ Backend health check passed');
}

/**
 * Operation: Verify CORS configuration
 */
export async function verifyCORS(page) {
  console.log('🔗 Verifying CORS configuration...');
  
  const response = await page.request.fetch(`${PROD_BACKEND_URL}/dj-rest-auth/login/`, {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://odyssey-frontend-lmcreans-projects.vercel.app',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  });
  
  expect(response.status()).toBe(200);
  console.log('✅ CORS configuration verified');
}

/**
 * Operation: Check deployment status
 */
export async function checkDeploymentStatus(page) {
  console.log('🚀 Checking deployment status...');
  
  await verifyBackendHealth(page);
  await verifyCORS(page);
  
  console.log('✅ Deployment status healthy');
} 