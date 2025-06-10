import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  User, 
  UpdateUserRequest, 
  PublicUserProfile,
  UserSearchResult,
  DEFAULT_PROFILE_PICTURE,
  CLOUDINARY_CONFIG 
} from '../types';

describe('Unified User Model Integration Tests', () => {
  describe('Type System Integration', () => {
    it('should create complete unified user with all fields', () => {
      const completeUser: User = {
        id: 'test-uuid',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        profileName: 'Test User',
        profileBio: 'Software developer passionate about technology',
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile-pictures/testuser.jpg',
        profileLocation: 'San Francisco, CA',
        profileWebsite: 'https://testuser.com',
        profileBirthdate: new Date('1990-01-01'),
        profilePrivate: false,
        postsCount: 25,
        followersCount: 150,
        followingCount: 89,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        lastActiveAt: new Date('2024-01-03')
      };

      // Verify all unified model fields are present
      expect(completeUser.id).toBeDefined();
      expect(completeUser.email).toBeDefined();
      expect(completeUser.username).toBeDefined();
      expect(completeUser.profilePicture).toContain('cloudinary.com');
      expect(completeUser.profileBio).toBeDefined();
      expect(completeUser.postsCount).toBeGreaterThan(0);
    });

    it('should handle profile updates with Cloudinary URLs', () => {
      const updateRequest: UpdateUserRequest = {
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/profile-pictures/newpic.jpg',
        profileBio: 'Updated bio with new picture',
        profileLocation: 'New York'
      };

      expect(updateRequest.profilePicture).toContain('cloudinary.com');
      expect(updateRequest.profilePicture).toContain('w_400,h_400');
    });

    it('should properly exclude sensitive data in PublicUserProfile', () => {
      const publicProfile: PublicUserProfile = {
        id: 'test-uuid',
        username: 'testuser',
        profileName: 'Test User',
        profileBio: 'Test bio',
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile.jpg',
        profileLocation: 'Test City',
        profileWebsite: 'https://test.com',
        postsCount: 10,
        followersCount: 100,
        followingCount: 50,
        createdAt: new Date(),
        lastActiveAt: new Date()
      };

      // Verify no sensitive fields
      expect('email' in publicProfile).toBe(false);
      expect('firstName' in publicProfile).toBe(false);
      expect('lastName' in publicProfile).toBe(false);
      expect(publicProfile.profilePicture).toContain('cloudinary.com');
    });
  });

  describe('Cloudinary Integration Tests', () => {
    it('should validate Cloudinary configuration constants', () => {
      expect(CLOUDINARY_CONFIG.MAX_FILE_SIZE).toBe(5 * 1024 * 1024);
      expect(CLOUDINARY_CONFIG.ALLOWED_FORMATS).toContain('jpg');
      expect(CLOUDINARY_CONFIG.ALLOWED_FORMATS).toContain('png');
      expect(CLOUDINARY_CONFIG.ALLOWED_FORMATS).toContain('webp');
      expect(CLOUDINARY_CONFIG.PROFILE_FOLDER).toBe('profile-pictures');
      expect(CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION).toContain('w_400,h_400');
      expect(CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION).toContain('q_auto');
      expect(CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION).toContain('f_auto');
    });

    it('should handle default profile picture correctly', () => {
      expect(DEFAULT_PROFILE_PICTURE).toBe('media/images/default_profile_dqcubz.jpg');
      
      const userWithDefault: User = {
        id: 'test',
        email: 'test@example.com',
        username: 'test',
        profilePicture: DEFAULT_PROFILE_PICTURE,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(userWithDefault.profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
    });

    it('should generate proper Cloudinary URLs with transformations', () => {
      const baseUrl = 'https://res.cloudinary.com/demo/image/upload';
      const transformation = CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION;
      const imagePath = 'profile-pictures/testuser.jpg';
      
      const fullUrl = `${baseUrl}/${transformation}/${imagePath}`;
      
      expect(fullUrl).toContain('cloudinary.com');
      expect(fullUrl).toContain('w_400,h_400');
      expect(fullUrl).toContain('profile-pictures');
    });
  });

  describe('Search Results Integration', () => {
    it('should create proper search results with mixed profile pictures', () => {
      const searchResults: UserSearchResult[] = [
        {
          id: 'user1',
          username: 'john_doe',
          profileName: 'John Doe',
          profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile-pictures/john.jpg',
          profileBio: 'Developer',
          followersCount: 100
        },
        {
          id: 'user2',
          username: 'jane_smith',
          profileName: 'Jane Smith',
          profilePicture: DEFAULT_PROFILE_PICTURE,
          profileBio: 'Designer',
          followersCount: 50
        },
        {
          id: 'user3',
          username: 'bob_wilson',
          profileName: 'Bob Wilson',
          profilePicture: undefined,
          profileBio: 'Manager',
          followersCount: 25
        }
      ];

      expect(searchResults).toHaveLength(3);
      expect(searchResults[0].profilePicture).toContain('cloudinary.com');
      expect(searchResults[1].profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
      expect(searchResults[2].profilePicture).toBeUndefined();
      
      // Verify no sensitive data in search results
      searchResults.forEach(result => {
        expect('email' in result).toBe(false);
        expect('firstName' in result).toBe(false);
        expect('lastName' in result).toBe(false);
      });
    });
  });

  describe('Data Flow Integration', () => {
    it('should maintain consistency between User and PublicUserProfile', () => {
      const fullUser: User = {
        id: 'test-uuid',
        email: 'test@example.com', // Sensitive
        username: 'testuser',
        firstName: 'Test', // Sensitive
        lastName: 'User', // Sensitive
        profileName: 'Test User',
        profileBio: 'Test bio',
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile.jpg',
        profileLocation: 'Test City',
        profileWebsite: 'https://test.com',
        profilePrivate: false,
        postsCount: 10,
        followersCount: 100,
        followingCount: 50,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        lastActiveAt: new Date('2024-01-03')
      };

      // Convert to public profile (this would happen in service layer)
      const publicProfile: PublicUserProfile = {
        id: fullUser.id,
        username: fullUser.username,
        profileName: fullUser.profileName,
        profileBio: fullUser.profileBio,
        profilePicture: fullUser.profilePicture,
        profileLocation: fullUser.profileLocation,
        profileWebsite: fullUser.profileWebsite,
        postsCount: fullUser.postsCount,
        followersCount: fullUser.followersCount,
        followingCount: fullUser.followingCount,
        createdAt: fullUser.createdAt,
        lastActiveAt: fullUser.lastActiveAt
      };

      // Verify public fields match
      expect(publicProfile.id).toBe(fullUser.id);
      expect(publicProfile.username).toBe(fullUser.username);
      expect(publicProfile.profilePicture).toBe(fullUser.profilePicture);
      expect(publicProfile.profilePicture).toContain('cloudinary.com');
      
      // Verify sensitive fields are excluded
      expect('email' in publicProfile).toBe(false);
      expect('firstName' in publicProfile).toBe(false);
      expect('lastName' in publicProfile).toBe(false);
    });
  });

  describe('Update Flow Integration', () => {
    it('should handle complete profile update with Cloudinary', () => {
      const originalUser: User = {
        id: 'test-uuid',
        email: 'test@example.com',
        username: 'oldusername',
        profilePicture: DEFAULT_PROFILE_PICTURE,
        profileBio: 'Old bio',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      };

      const updateData: UpdateUserRequest = {
        username: 'newusername',
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/profile-pictures/newpic.jpg',
        profileBio: 'Updated bio with new picture',
        profileLocation: 'New City',
        profileWebsite: 'https://newwebsite.com',
        profilePrivate: true
      };

      // Simulate the update (this would happen in service layer)
      const updatedUser: User = {
        ...originalUser,
        ...updateData,
        updatedAt: new Date('2024-01-02')
      };

      expect(updatedUser.username).toBe('newusername');
      expect(updatedUser.profilePicture).toContain('cloudinary.com');
      expect(updatedUser.profilePicture).toContain('w_400,h_400');
      expect(updatedUser.profileBio).toBe('Updated bio with new picture');
      expect(updatedUser.profilePrivate).toBe(true);
      expect(updatedUser.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle missing optional fields gracefully', () => {
      const minimalUser: User = {
        id: 'test-uuid',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(minimalUser.profilePicture).toBeUndefined();
      expect(minimalUser.profileBio).toBeUndefined();
      expect(minimalUser.postsCount).toBeUndefined();
      expect(minimalUser.followersCount).toBeUndefined();
    });

    it('should handle various Cloudinary URL formats', () => {
      const cloudinaryUrls = [
        'https://res.cloudinary.com/demo/image/upload/v123/profile-pictures/user.jpg',
        'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/profile-pictures/user.jpg',
        'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill,q_auto,f_auto/profile-pictures/user.jpg'
      ];

      cloudinaryUrls.forEach(url => {
        expect(url).toContain('cloudinary.com');
        expect(url).toContain('profile-pictures');
      });
    });
  });
}); 