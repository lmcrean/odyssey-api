import { APIRequestContext, expect } from '@playwright/test';

export class RegisterRunner {
  constructor(private request: APIRequestContext) {}

  async runValidRegistration() {
    const registerData = {
      email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User'
    };

    const response = await this.request.post('/api/auth/register', {
      data: registerData
    });

    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('message', 'User registered successfully');
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('user');
    expect(data.data).toHaveProperty('accessToken');
    expect(data.data).toHaveProperty('refreshToken');

    return { success: true, data };
  }

  async runValidRegistrationWithCredentials(credentials: { email: string; password: string; username: string }) {
    const registerData = {
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.password,
      firstName: 'Test',
      lastName: 'User',
      username: credentials.username
    };

    const response = await this.request.post('/api/auth/register', {
      data: registerData
    });

    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('message', 'User registered successfully');
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('user');
    expect(data.data).toHaveProperty('accessToken');
    expect(data.data).toHaveProperty('refreshToken');

    return { 
      success: true, 
      data,
      tokens: {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken
      }
    };
  }

  async runMissingRequiredFields() {
    const registerData = {
      email: 'test@example.com'
      // Missing password and confirmPassword
    };

    const response = await this.request.post('/api/auth/register', {
      data: registerData
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error', 'Validation error');
    expect(data).toHaveProperty('message', 'Email, password, and confirmPassword are required');

    return { success: true, data };
  }

  async runInvalidEmailFormat() {
    const registerData = {
      email: 'invalid-email',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!'
    };

    const response = await this.request.post('/api/auth/register', {
      data: registerData
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error', 'Validation error');
    expect(data).toHaveProperty('message', 'Invalid email format');

    return { success: true, data };
  }

  async runPasswordMismatch() {
    const registerData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      confirmPassword: 'DifferentPassword123!'
    };

    const response = await this.request.post('/api/auth/register', {
      data: registerData
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error', 'Validation error');
    expect(data).toHaveProperty('message', 'Passwords do not match');

    return { success: true, data };
  }

  async runWeakPassword() {
    const registerData = {
      email: 'test@example.com',
      password: '123', // Weak password
      confirmPassword: '123'
    };

    const response = await this.request.post('/api/auth/register', {
      data: registerData
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error', 'Validation error');
    // Password validation message will vary based on implementation

    return { success: true, data };
  }
} 