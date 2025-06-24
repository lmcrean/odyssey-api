import { APIRequestContext, expect } from '@playwright/test';

export class HelloMessageRunner {
  constructor(private request: APIRequestContext) {}

  async run() {
    const response = await this.request.get('/api/health/hello');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('message', 'Hello from Odyssey Backend!');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('version', '1.0.0');

    return { success: true, data };
  }
} 