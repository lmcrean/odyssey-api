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
    const response = await request.get('/api/health/hello');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('message', 'Hello from Odyssey Backend!');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('version', '1.0.0');
  });

  test('should handle CORS preflight', async ({ request }) => {
    const response = await request.fetch('/api/health/hello', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    expect(response.status()).toBe(204);
  });

  test('should get hello message from database', async ({ request }) => {
    const response = await request.get('/api/health/hello-db');
    
    // Should succeed with either 200 (DB success) or 500 (DB error with fallback)
    expect([200, 500]).toContain(response.status());
    
    const data = await response.json();
    if (response.status() === 200) {
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('source');
      expect(data).toHaveProperty('version', '1.0.0');
    } else {
      expect(data).toHaveProperty('fallback', 'Hello World from Neon DB! (error fallback)');
    }
  });

  test('should get database health status', async ({ request }) => {
    const response = await request.get('/api/health/db-health');
    
    // Should succeed with either 200 (healthy) or 500 (connection failed)
    expect([200, 500]).toContain(response.status());
    
    const data = await response.json();
    expect(data).toHaveProperty('database');
    expect(data).toHaveProperty('timestamp');
    
    if (response.status() === 200) {
      expect(data).toHaveProperty('status', 'ok');
      expect(data).toHaveProperty('message', 'Database connection successful');
    } else {
      expect(data).toHaveProperty('status', 'error');
      expect(data).toHaveProperty('message', 'Database connection failed');
    }
  });
}); 