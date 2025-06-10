import { APIRequestContext, expect } from '@playwright/test';

export class LogoutRunner {
  constructor(private request: APIRequestContext) {}

  async runLogout() {
    const response = await this.request.post('/api/auth/logout');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('message', 'Logout successful');

    return { success: true, data };
  }

  async runLogoutWithToken() {
    // Test logout with authorization header (if implemented)
    const response = await this.request.post('/api/auth/logout', {
      headers: {
        'Authorization': 'Bearer some-jwt-token'
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('message', 'Logout successful');

    return { success: true, data };
  }
} 