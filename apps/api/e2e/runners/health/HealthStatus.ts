import { APIRequestContext, expect } from '@playwright/test';

export class HealthStatusRunner {
  constructor(private request: APIRequestContext) {}

  async run() {
    const response = await this.request.get('/api/health');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('message', 'Odyssey Backend is running');
    expect(data).toHaveProperty('environment');
    expect(data).toHaveProperty('timestamp');

    return { success: true, data };
  }
} 