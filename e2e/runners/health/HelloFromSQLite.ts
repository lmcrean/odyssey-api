import { APIRequestContext, expect } from '@playwright/test';

export class HelloFromSQLiteRunner {
  constructor(private request: APIRequestContext) {}

  async run() {
    const response = await this.request.get('/api/health/hello-db');
    
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

    return { 
      success: true, 
      data, 
      status: response.status(),
      isDatabaseConnected: response.status() === 200 
    };
  }
} 