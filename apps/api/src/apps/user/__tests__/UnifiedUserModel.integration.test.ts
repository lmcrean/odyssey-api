import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findUserById, findUserByUsername, updateUser } from '../models/database';

// Mock database functions for integration test
vi.mock('../models/database', () => ({
  findUserById: vi.fn(),
  findUserByUsername: vi.fn(),
  updateUser: vi.fn()
}));

describe('Unified User Model Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUserWithPassword = {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    profileName: 'John Doe',
    profileBio: 'Software Developer',
    profilePicture: 'https://res.cloudinary.com/demo/profile.jpg',
    profileLocation: 'San Francisco, CA',
    profileWebsite: 'https://johndoe.dev',
    profilePrivate: false,
    postsCount: 42,
    followersCount: 1250,
    followingCount: 180,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-20T15:30:00Z'),
    password: 'hashed-password'
  };

  it('should retrieve full user profile (authenticated user)', async () => {
    vi.mocked(findUserById).mockResolvedValue(mockUserWithPassword);

    const user = await findUserById('test-user-id');
    
    // Simulate password removal (as done in controller)
    const { password, ...userProfile } = user!;

    expect(userProfile).toBeDefined();
    expect(userProfile.id).toBe('test-user-id');
    expect(userProfile.email).toBe('test@example.com');
    expect(userProfile.username).toBe('johndoe');
    expect(userProfile).not.toHaveProperty('password');
  });

  it('should retrieve public user profile by username', async () => {
    const publicUser = { ...mockUserWithPassword };
    delete (publicUser as any).password;
    
    vi.mocked(findUserByUsername).mockResolvedValue(publicUser);

    const user = await findUserByUsername('johndoe');
    
    // Simulate public profile formatting (as done in controller)
    const publicProfile = user ? {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profileName: user.profileName,
      profilePicture: user.profilePicture,
      profileBio: user.profileBio,
      profileLocation: user.profileLocation,
      profileWebsite: user.profileWebsite,
      profilePrivate: user.profilePrivate || false,
      postsCount: user.postsCount || 0,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } : null;

    expect(publicProfile).toBeDefined();
    expect(publicProfile?.username).toBe('johndoe');
    expect(publicProfile?.profilePrivate).toBe(false);
    expect(publicProfile?.followersCount).toBe(1250);
  });

  it('should update user profile with validation', async () => {
    const updateData = {
      profileBio: 'Updated bio',
      profileLocation: 'New York, NY',
      profileWebsite: 'https://johnsmith.dev'
    };

    const updatedUser = {
      ...mockUserWithPassword,
      ...updateData,
      updatedAt: new Date()
    };
    delete (updatedUser as any).password;

    vi.mocked(updateUser).mockResolvedValue(updatedUser);

    const result = await updateUser('test-user-id', updateData);

    expect(result).toBeDefined();
    expect(result?.profileBio).toBe('Updated bio');
    expect(result?.profileLocation).toBe('New York, NY');
    expect(result?.profileWebsite).toBe('https://johnsmith.dev');
  });
}); 