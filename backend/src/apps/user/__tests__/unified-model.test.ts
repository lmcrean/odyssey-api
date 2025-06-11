import { describe, it, expect } from 'vitest';
import { 
  User, 
  UpdateUserRequest, 
  PublicUserProfile,
  UserSearchResult,
  DEFAULT_PROFILE_PICTURE,
  CLOUDINARY_CONFIG 
} from '../types';

describe('Unified User Model Integration', () => {
  it('should create complete unified user with Cloudinary picture', () => {
    const user: User = {
      id: 'test-uuid',
      email: 'test@example.com',
      username: 'testuser',
      profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile-pictures/testuser.jpg',
      profileBio: 'Test bio',
      postsCount: 25,
      followersCount: 150,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(user.profilePicture).toContain('cloudinary.com');
    expect(user.postsCount).toBe(25);
  });

  it('should handle Cloudinary configuration', () => {
    expect(CLOUDINARY_CONFIG.MAX_FILE_SIZE).toBe(5 * 1024 * 1024);
    expect(CLOUDINARY_CONFIG.PROFILE_FOLDER).toBe('profile-pictures');
    expect(DEFAULT_PROFILE_PICTURE).toBe('media/images/default_profile_dqcubz.jpg');
  });

  it('should exclude sensitive data in public profile', () => {
    const publicProfile: PublicUserProfile = {
      id: 'test-uuid',
      username: 'testuser',
      profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect('email' in publicProfile).toBe(false);
    expect(publicProfile.profilePicture).toContain('cloudinary.com');
  });
}); 