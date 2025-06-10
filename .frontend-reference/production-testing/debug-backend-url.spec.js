import { test } from '@playwright/test';

test.describe('Debug Backend URL', () => {
  test('should verify correct backend URL and check deployments', async ({ page }) => {
    const possibleUrls = [
      'https://odyssey-api-lmcreans-projects.vercel.app',
      'https://odyssey-backend-lmcreans-projects.vercel.app', 
      'https://dottie-backend-lmcreans-projects.vercel.app',
      'https://odyssey-copxicvv1-lmcreans-projects.vercel.app', // From our deploy output
    ];

    console.log('🔍 Testing possible backend URLs...\n');

    for (const url of possibleUrls) {
      console.log(`📍 Testing: ${url}`);
      
      try {
        // Test root endpoint
        const rootResponse = await page.request.get(url);
        console.log(`   Root (/) Status: ${rootResponse.status()}`);
        
        if (rootResponse.status() === 200) {
          const body = await rootResponse.text();
          console.log(`   Root Response: ${body.substring(0, 100)}...`);
        }

        // Test login endpoint
        const loginResponse = await page.request.get(`${url}/dj-rest-auth/login/`);
        console.log(`   Login endpoint Status: ${loginResponse.status()}`);

        // Test admin endpoint (should exist if Django is properly deployed)
        const adminResponse = await page.request.get(`${url}/admin/`);
        console.log(`   Admin endpoint Status: ${adminResponse.status()}`);

        console.log(''); // Empty line for readability

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        console.log('');
      }
    }

    // Also check what our frontend thinks the backend URL should be
    console.log('🔍 Checking what axios is configured to use...');
    
    await page.goto('https://odyssey-frontend-lmcreans-projects.vercel.app');
    
    // Check axios defaults in the browser
    const axiosConfig = await page.evaluate(() => {
      // Try to access axios if it's available globally
      if (window.axios) {
        return {
          baseURL: window.axios.defaults.baseURL,
          headers: window.axios.defaults.headers
        };
      }
      return 'Axios not found in global scope';
    });
    
    console.log('Frontend axios config:', JSON.stringify(axiosConfig, null, 2));

    // Let's also make a test request from the frontend to see where it goes
    console.log('\n🔍 Making test request from frontend...');
    
    const frontendTestResult = await page.evaluate(async () => {
      try {
        const response = await fetch('/dj-rest-auth/user/', {
          method: 'GET',
          credentials: 'include'
        });
        return {
          url: response.url,
          status: response.status,
          ok: response.ok
        };
      } catch (error) {
        return {
          error: error.message
        };
      }
    });
    
    console.log('Frontend test request result:', JSON.stringify(frontendTestResult, null, 2));
  });
}); 