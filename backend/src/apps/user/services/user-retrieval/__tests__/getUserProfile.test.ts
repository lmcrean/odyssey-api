import { describe, it, expect, vi } from 'vitest';
import { getUserProfile } from '../getUserProfile';
import { findUserById } from '../../../models/database';

// Mock the database function
vi.mock('../../../models/database', () => ({
  findUserById: vi.fn()
}));

describe('getUserProfile', () => {
  it('should return user profile without password', async () => {
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      password: 'hashed-password',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      bio: 'Test bio',
      location: 'Test location',
      website: 'https://test.com',
      avatarUrl: 'avatar-url',
      isPrivate: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (findUserById as any).mockResolvedValue(mockUser);

    const result = await getUserProfile('test-id');

    expect(result).toBeDefined();
    expect(result?.id).toBe('test-id');
    expect(result?.email).toBe('test@example.com');
    expect(result).not.toHaveProperty('password');
  });

  it('should return null when user not found', async () => {
    (findUserById as any).mockResolvedValue(null);

    const result = await getUserProfile('non-existent-id');

    expect(result).toBeNull();
  });
}); 