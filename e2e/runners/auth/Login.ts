import { APIRequestContext, expect } from '@playwright/test';

export class LoginRunner {
  constructor(private request: APIRequestContext) {}

  async runValidLogin() {
    const loginData = {
      email: 'test@example.com',
      password: 'TestPassword123!'
    };

    const response = await this.request.post('/api/auth/login', {
      data: loginData
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('message', 'Login successful');
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('user');
    expect(data.data).toHaveProperty('accessToken');
    expect(data.data).toHaveProperty('refreshToken');

    return { success: true, data };
  }

  async runInvalidLogin() {
    const loginData = {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    };

    const response = await this.request.post('/api/auth/login', {
      data: loginData
    });

    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error', 'Authentication failed');
    expect(data).toHaveProperty('message', 'Invalid email or password');

    return { success: true, data };
  }

  async runMissingCredentials() {
    const loginData = {
      email: 'test@example.com'
      // Missing password
    };

    const response = await this.request.post('/api/auth/login', {
      data: loginData
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error', 'Validation error');
    expect(data).toHaveProperty('message', 'Email and password are required');

    return { success: true, data };
  }
} 