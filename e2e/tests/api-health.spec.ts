import { test, expect } from '@playwright/test';
import { TEST_DATA, MOCK_RESPONSES } from '../fixtures/test-data';

test.describe('API Health Checks', () => {
  test.beforeEach(async ({ page }) => {
    // These tests directly test the API endpoints
    await page.goto('/');
  });

  test('should have API health endpoint accessible', async ({ page }) => {
    const response = await page.request.get(`${TEST_DATA.API.BASE_URL}/api/health`);
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');
    
    const responseText = await response.text();
    expect(responseText).toBe(TEST_DATA.API.EXPECTED_HEALTH_MESSAGE);
  });

  test('should have API health status endpoint accessible', async ({ page }) => {
    const response = await page.request.get(`${TEST_DATA.API.BASE_URL}/api/health/status`);
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    
    const responseJson = await response.json();
    expect(responseJson.message).toBe(TEST_DATA.API.EXPECTED_STATUS_MESSAGE);
    expect(responseJson.version).toBe(TEST_DATA.API.EXPECTED_VERSION);
    expect(responseJson.timestamp).toBeDefined();
  });

  test('should have root endpoint accessible', async ({ page }) => {
    const response = await page.request.get(`${TEST_DATA.API.BASE_URL}/`);
    
    expect(response.status()).toBe(200);
    
    const responseText = await response.text();
    expect(responseText).toBe('API is running');
  });

  test('should return 404 for non-existent endpoints', async ({ page }) => {
    const response = await page.request.get(`${TEST_DATA.API.BASE_URL}/api/nonexistent`);
    
    expect(response.status()).toBe(404);
  });

  test('should handle CORS for Angular origin', async ({ page }) => {
    const response = await page.request.fetch(`${TEST_DATA.API.BASE_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:4200',
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const corsHeader = response.headers()['access-control-allow-origin'];
    expect(corsHeader).toBe('http://localhost:4200');
  });

  test('should reject unauthorized CORS origins', async ({ page }) => {
    const response = await page.request.fetch(`${TEST_DATA.API.BASE_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://malicious-site.com',
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const corsHeader = response.headers()['access-control-allow-origin'];
    expect(corsHeader).toBeUndefined();
  });

  test('should handle concurrent requests', async ({ page }) => {
    const requests = Array.from({ length: 5 }, (_, i) => 
      page.request.get(`${TEST_DATA.API.BASE_URL}/api/health`)
    );
    
    const responses = await Promise.all(requests);
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
    
    // All responses should have the same content
    const responseTexts = await Promise.all(responses.map(r => r.text()));
    responseTexts.forEach(text => {
      expect(text).toBe(TEST_DATA.API.EXPECTED_HEALTH_MESSAGE);
    });
  });

  test('should return valid JSON structure for status endpoint', async ({ page }) => {
    const response = await page.request.get(`${TEST_DATA.API.BASE_URL}/api/health/status`);
    const responseJson = await response.json();
    
    // Validate JSON structure
    expect(responseJson).toHaveProperty('message');
    expect(responseJson).toHaveProperty('version');
    expect(responseJson).toHaveProperty('timestamp');
    
    // Validate data types
    expect(typeof responseJson.message).toBe('string');
    expect(typeof responseJson.version).toBe('string');
    expect(typeof responseJson.timestamp).toBe('string');
    
    // Validate timestamp format (ISO 8601)
    const timestamp = new Date(responseJson.timestamp);
    expect(timestamp.toISOString()).toBe(responseJson.timestamp);
  });

  test('should have reasonable response times', async ({ page }) => {
    const startTime = Date.now();
    
    const response = await page.request.get(`${TEST_DATA.API.BASE_URL}/api/health`);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
  });

  test('should handle HTTP methods correctly', async ({ page }) => {
    // GET should work
    const getResponse = await page.request.get(`${TEST_DATA.API.BASE_URL}/api/health`);
    expect(getResponse.status()).toBe(200);
    
    // POST should return 405 Method Not Allowed
    const postResponse = await page.request.post(`${TEST_DATA.API.BASE_URL}/api/health`);
    expect(postResponse.status()).toBe(405);
    
    // PUT should return 405 Method Not Allowed
    const putResponse = await page.request.put(`${TEST_DATA.API.BASE_URL}/api/health`);
    expect(putResponse.status()).toBe(405);
    
    // DELETE should return 405 Method Not Allowed
    const deleteResponse = await page.request.delete(`${TEST_DATA.API.BASE_URL}/api/health`);
    expect(deleteResponse.status()).toBe(405);
  });
});

test.describe('API Integration with Frontend', () => {
  test('should successfully connect frontend to API', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the API calls to be made from the frontend
    const healthRequest = page.waitForRequest(`${TEST_DATA.API.BASE_URL}/api/health`);
    const statusRequest = page.waitForRequest(`${TEST_DATA.API.BASE_URL}/api/health/status`);
    
    await Promise.all([healthRequest, statusRequest]);
    
    // Verify the responses are successful
    const healthResponse = await (await healthRequest).response();
    const statusResponse = await (await statusRequest).response();
    
    expect(healthResponse?.status()).toBe(200);
    expect(statusResponse?.status()).toBe(200);
  });

  test('should handle API errors in frontend', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/health', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    await page.goto('/');
    
    // Frontend should display error message
    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.error')).toContainText('Failed to connect to API');
  });

  test('should display API data in frontend', async ({ page }) => {
    await page.goto('/');
    
    // Wait for API calls to complete
    await page.waitForSelector('.success');
    
    // Verify API data is displayed
    await expect(page.locator('.message-card')).toContainText(TEST_DATA.API.EXPECTED_HEALTH_MESSAGE);
    await expect(page.locator('.status-card')).toContainText(TEST_DATA.API.EXPECTED_STATUS_MESSAGE);
    await expect(page.locator('.status-card')).toContainText(TEST_DATA.API.EXPECTED_VERSION);
  });
});