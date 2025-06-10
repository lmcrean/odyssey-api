import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {
  test('should get health status', async ({ request }) => {
    const response = await request.get('/api/health');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('message', 'Odyssey Backend is running');
    expect(data).toHaveProperty('environment');
    expect(data).toHaveProperty('timestamp');
  });

  test('should get hello message', async ({ request }) => {
    const response = await request.get('/api/hello');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('message', 'Hello from Odyssey Backend!');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('version', '1.0.0');
  });

  test('should handle CORS preflight', async ({ request }) => {
    const response = await request.fetch('/api/hello', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    expect(response.status()).toBe(204);
  });
}); 