import { APIRequestContext, expect } from '@playwright/test';

export class GetPublicProfileRunner {
  constructor(private request: APIRequestContext) {}

  async runWithUsername(username: string) {
    const response = await this.request.get(`/api/user/public/${username}`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('username', username);

    return { success: true, data };
  }

  async runWithUserId(userId: string) {
    const response = await this.request.get(`/api/user/public/${userId}`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('id', userId);

    return { success: true, data };
  }

  async runWithNonexistentUser() {
    const response = await this.request.get('/api/user/public/nonexistentuser');

    expect(response.status()).toBe(404);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'User not found');

    return { success: true, data };
  }

  async runWithoutIdentifier() {
    const response = await this.request.get('/api/user/public/');

    // This might return 404 or redirect, depending on route configuration
    expect([404, 400]).toContain(response.status());

    return { success: true, status: response.status() };
  }

  async runWithEmptyIdentifier() {
    const response = await this.request.get('/api/user/public/ ');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Username or user ID is required');

    return { success: true, data };
  }
} 