import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../../shared/db/init-sqlite';
import { getUserProfile, getPublicUserProfile } from '../services/user-retrieval';
import { updateUserProfile } from '../services/user-updates';
import { searchUsers, createUser } from '../models/database';

describe('Unified User Model Integration Tests', () => {
  beforeEach(async () => {
    // Clean up before each test
    await db('users').del();
  });

  afterEach(async () => {
    // Clean up after each test
    await db('users').del();
  });

  describe('User Profile Operations', () => {
    it('should create, retrieve, and update user profile', async () => {
      // Create a user
      const userData = {
        id: 'test-user-id',
        email: 'test@example.com',
        password: 'ValidPassword123',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe'
      };

      const createdUser = await createUser(userData);
      expect(createdUser.id).toBe('test-user-id');
      expect(createdUser.email).toBe('test@example.com');
      expect(createdUser.username).toBe('johndoe');

      // Get full profile (authenticated)
      const fullProfile = await getUserProfile('test-user-id');
      expect(fullProfile).toBeDefined();
      expect(fullProfile?.email).toBe('test@example.com');
      expect(fullProfile).not.toHaveProperty('password');

      // Get public profile
      const publicProfile = await getPublicUserProfile('johndoe');
      expect(publicProfile).toBeDefined();
      expect(publicProfile?.username).toBe('johndoe');
      expect(publicProfile?.firstName).toBe('John');

      // Update profile
      const updateData = {
        firstName: 'UpdatedJohn',
        lastName: 'UpdatedDoe'
      };

      const updatedProfile = await updateUserProfile('test-user-id', updateData);
      expect(updatedProfile?.firstName).toBe('UpdatedJohn');
      expect(updatedProfile?.lastName).toBe('UpdatedDoe');
    });

    it('should search users by username', async () => {
      // Create test users
      await createUser({
        id: 'user-1',
        email: 'john@example.com',
        password: 'ValidPassword123',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe'
      });

      await createUser({
        id: 'user-2',
        email: 'jane@example.com',
        password: 'ValidPassword123',
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith'
      });

      // Search for users
      const searchResults = await searchUsers('john');
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].username).toBe('johndoe');
    });
  });
}); 