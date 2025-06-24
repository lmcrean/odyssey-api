import { APIRequestContext, expect } from '@playwright/test';

export class RefreshTokenRunner {
  constructor(private request: APIRequestContext) {}

  async runValidRefreshToken(refreshToken: string) {
    const response = await this.request.post('/api/auth/refresh-token', {
      data: {
        refreshToken
      }
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('message', 'Tokens refreshed successfully');
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('accessToken');
    expect(data.data).toHaveProperty('refreshToken');

    return { success: true, data };
  }

  async runInvalidRefreshToken() {
    const response = await this.request.post('/api/auth/refresh-token', {
      data: {
        refreshToken: 'invalid-refresh-token'
      }
    });

    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error', 'Authentication failed');
    expect(data).toHaveProperty('message', 'Invalid or expired refresh token');

    return { success: true, data };
  }

  async runMissingRefreshToken() {
    const response = await this.request.post('/api/auth/refresh-token', {
      data: {}
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error', 'Validation error');
    expect(data).toHaveProperty('message', 'Refresh token is required');

    return { success: true, data };
  }
} 