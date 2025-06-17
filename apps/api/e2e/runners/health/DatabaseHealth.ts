import { APIRequestContext, expect } from '@playwright/test';

export class DatabaseHealthRunner {
  constructor(private request: APIRequestContext) {}

  async run() {
    const response = await this.request.get('/api/health/db-health');
    
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

    return { 
      success: true, 
      data, 
      status: response.status(),
      isDatabaseHealthy: response.status() === 200 
    };
  }
} 