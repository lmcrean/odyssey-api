import { APIRequestContext, expect } from '@playwright/test';

export class UpdateProfileRunner {
  constructor(private request: APIRequestContext) {}

  async runValidUpdate(authToken: string, updateData: any) {
    const response = await this.request.put('/api/user/profile/update', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updateData
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('message', 'Profile updated successfully');
    expect(data).toHaveProperty('data');

    return { success: true, data };
  }

  async runWithoutAuth(updateData: any) {
    const response = await this.request.put('/api/user/profile/update', {
      data: updateData
    });

    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Authentication required');

    return { success: true, data };
  }

  async runWithEmptyUsername(authToken: string) {
    const updateData = {
      username: ''
    };

    const response = await this.request.put('/api/user/profile/update', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updateData
    });

    // If using a fake token, expect 403 (forbidden - invalid token)
    // If using a real token, expect 400 (validation error) 
    const expectedStatus = authToken === 'fake-token' ? 403 : 400;
    expect(response.status()).toBe(expectedStatus);

    const data = await response.json();
    
    if (expectedStatus === 403) {
      expect(data).toHaveProperty('error', 'Authentication failed');
    } else {
      expect(data).toHaveProperty('error', 'Username cannot be empty');
    }

    return { success: true, data };
  }

  async runWithDuplicateUsername(authToken: string) {
    const updateData = {
      username: 'existinguser' // Assuming this username exists
    };

    const response = await this.request.put('/api/user/profile/update', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updateData
    });

    expect(response.status()).toBe(409);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Username is already taken');

    return { success: true, data };
  }

  async runWithInvalidUsernameFormat(authToken: string) {
    const updateData = {
      username: 'invalid-username@' // Invalid format
    };

    const response = await this.request.put('/api/user/profile/update', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updateData
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid username format');

    return { success: true, data };
  }

  async runWithInvalidWebsiteURL(authToken: string) {
    const updateData = {
      website: 'not-a-valid-url'
    };

    const response = await this.request.put('/api/user/profile/update', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updateData
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Invalid website URL format');

    return { success: true, data };
  }
} 