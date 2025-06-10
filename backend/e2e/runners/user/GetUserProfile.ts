import { APIRequestContext, expect } from '@playwright/test';

export class GetUserProfileRunner {
  constructor(private request: APIRequestContext) {}

  async runWithValidAuth(authToken: string) {
    const response = await this.request.get('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('id');
    expect(data.data).toHaveProperty('email');

    return { success: true, data };
  }

  async runWithoutAuth() {
    const response = await this.request.get('/api/user/profile');

    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Authentication required');

    return { success: true, data };
  }

  async runWithInvalidAuth() {
    const response = await this.request.get('/api/user/profile', {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });

    expect(response.status()).toBe(403);

    const data = await response.json();
    expect(data).toHaveProperty('error');

    return { success: true, data };
  }
} 