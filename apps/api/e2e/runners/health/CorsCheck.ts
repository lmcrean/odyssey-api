import { APIRequestContext, expect } from '@playwright/test';

export class CorsCheckRunner {
  constructor(private request: APIRequestContext) {}

  async run() {
    const response = await this.request.fetch('/api/health/hello', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    expect(response.status()).toBe(204);

    return { 
      success: true, 
      status: response.status(),
      corsEnabled: response.status() === 204 
    };
  }
} 