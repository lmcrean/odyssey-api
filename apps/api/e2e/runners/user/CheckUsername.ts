import { APIRequestContext, expect } from '@playwright/test';

export class CheckUsernameRunner {
  constructor(private request: APIRequestContext) {}

  async runWithAvailableUsername(username: string) {
    const response = await this.request.get(`/api/user/check-username/${username}`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('username', username);
    expect(data.data).toHaveProperty('available', true);
    expect(data.data).toHaveProperty('message', 'Username is available');

    return { success: true, data };
  }

  async runWithTakenUsername(username: string) {
    const response = await this.request.get(`/api/user/check-username/${username}`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('username', username);
    expect(data.data).toHaveProperty('available', false);
    expect(data.data).toHaveProperty('message', 'Username is already taken');

    return { success: true, data };
  }

  async runWithShortUsername() {
    const response = await this.request.get('/api/user/check-username/ab');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Username must be between 3 and 30 characters');

    return { success: true, data };
  }

  async runWithLongUsername() {
    const longUsername = 'a'.repeat(31); // 31 characters
    const response = await this.request.get(`/api/user/check-username/${longUsername}`);

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Username must be between 3 and 30 characters');

    return { success: true, data };
  }

  async runWithInvalidCharacters() {
    const response = await this.request.get('/api/user/check-username/invalid@username');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Username can only contain letters, numbers, and underscores');

    return { success: true, data };
  }

  async runWithSpecialCharacters() {
    const response = await this.request.get('/api/user/check-username/user-name!');

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Username can only contain letters, numbers, and underscores');

    return { success: true, data };
  }

  async runWithEmptyUsername() {
    const response = await this.request.get('/api/user/check-username/');

    // This might return 404 depending on route configuration
    expect([404, 400]).toContain(response.status());

    return { success: true, status: response.status() };
  }

  async runWithValidFormat() {
    const response = await this.request.get('/api/user/check-username/valid_user123');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data.data).toHaveProperty('username', 'valid_user123');
    expect(data.data).toHaveProperty('available');
    expect(typeof data.data.available).toBe('boolean');

    return { success: true, data };
  }
} 