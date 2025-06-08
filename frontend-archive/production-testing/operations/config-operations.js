// Production URLs - using stable root format as per user rules
export const PROD_FRONTEND_URL = 'https://odyssey-frontend-lmcreans-projects.vercel.app';
export const PROD_BACKEND_URL = 'https://odyssey-api-lmcreans-projects.vercel.app';

/**
 * Operation: Get production configuration
 */
export function getProductionConfig() {
  return {
    frontend: PROD_FRONTEND_URL,
    backend: PROD_BACKEND_URL,
    timeout: 15000,
    retries: 2
  };
}

/**
 * Operation: Validate URLs are accessible
 */
export async function validateUrls(page) {
  console.log('🔍 Validating production URLs...');
  
  // Check frontend
  const frontendResponse = await page.request.get(PROD_FRONTEND_URL);
  if (frontendResponse.status() !== 200) {
    throw new Error(`Frontend not accessible: ${frontendResponse.status()}`);
  }
  
  // Check backend
  const backendResponse = await page.request.get(PROD_BACKEND_URL);
  if (backendResponse.status() !== 200) {
    throw new Error(`Backend not accessible: ${backendResponse.status()}`);
  }
  
  console.log('✅ Production URLs validated');
} 