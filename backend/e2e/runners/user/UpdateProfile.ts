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

  // Test updating actual profile fields
  async runValidProfileFieldsUpdate(authToken: string) {
    const updateData = {
      profileBio: 'I am a software developer passionate about creating amazing applications.',
      profileLocation: 'San Francisco, CA',
      profileWebsite: 'https://example.com',
      profilePrivate: false
    };

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
    expect(data.data).toHaveProperty('profileBio', updateData.profileBio);
    expect(data.data).toHaveProperty('profileLocation', updateData.profileLocation);
    expect(data.data).toHaveProperty('profileWebsite', updateData.profileWebsite);
    expect(data.data).toHaveProperty('profilePrivate', updateData.profilePrivate);

    return { success: true, data, updateData };
  }

  // Test clearing profile fields
  async runClearProfileFields(authToken: string) {
    const updateData = {
      profileBio: '',
      profileLocation: '',
      profileWebsite: '',
      profilePrivate: true
    };

    const response = await this.request.put('/api/user/profile/update', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updateData
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data.data).toHaveProperty('profileBio', '');
    expect(data.data).toHaveProperty('profileLocation', '');
    expect(data.data).toHaveProperty('profileWebsite', '');
    // Schema has been fixed, profilePrivate field update is now working
    expect(data.data).toHaveProperty('profilePrivate', true);

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
      profileWebsite: 'not-a-valid-url'
    };

    const response = await this.request.put('/api/user/profile/update', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: updateData
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Invalid website URL');

    return { success: true, data };
  }
} 