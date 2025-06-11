import { describe, it, expect } from 'vitest';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  PublicUserProfile, 
  UserSearchResult,
  CloudinaryImageData,
  ProfilePictureUpload,
  DEFAULT_PROFILE_PICTURE,
  CLOUDINARY_CONFIG
} from '../index';

describe('User Types', () => {
  describe('User Interface', () => {
    it('should have all required fields for unified user model', () => {
      const mockUser: User = {
        id: 'test-uuid',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        profileBio: 'Test bio',
        profilePicture: 'https://res.cloudinary.com/test/image/upload/v123/profile.jpg',
        profileName: 'Test User',
        profileLocation: 'Test City',
        profileWebsite: 'https://test.com',
        profileBirthdate: new Date('1990-01-01'),
        profilePrivate: false,
        postsCount: 10,
        followersCount: 100,
        followingCount: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: new Date()
      };

      expect(mockUser.id).toBe('test-uuid');
      expect(mockUser.email).toBe('test@example.com');
      expect(mockUser.username).toBe('testuser');
      expect(mockUser.profilePicture).toBe('https://res.cloudinary.com/test/image/upload/v123/profile.jpg');
      expect(mockUser.profileBio).toBe('Test bio');
      expect(mockUser.postsCount).toBe(10);
    });

    it('should allow optional profile fields', () => {
      const minimalUser: User = {
        id: 'test-uuid',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(minimalUser.profileBio).toBeUndefined();
      expect(minimalUser.profilePicture).toBeUndefined();
      expect(minimalUser.postsCount).toBeUndefined();
    });
  });

  describe('CreateUserRequest Interface', () => {
    it('should have required fields for user creation', () => {
      const createRequest: CreateUserRequest = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser'
      };

      expect(createRequest.email).toBe('test@example.com');
      expect(createRequest.password).toBe('password123');
      expect(createRequest.username).toBe('testuser');
    });

    it('should allow optional profile fields during creation', () => {
      const createRequestWithProfile: CreateUserRequest = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        profileName: 'Test User',
        profileBio: 'Test bio',
        profilePicture: DEFAULT_PROFILE_PICTURE
      };

      expect(createRequestWithProfile.profileName).toBe('Test User');
      expect(createRequestWithProfile.profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
    });
  });

  describe('UpdateUserRequest Interface', () => {
    it('should allow updating all optional fields', () => {
      const updateRequest: UpdateUserRequest = {
        username: 'newusername',
        firstName: 'New First',
        lastName: 'New Last',
        profileName: 'New Display Name',
        profileBio: 'Updated bio',
        profilePicture: 'https://res.cloudinary.com/test/image/upload/v123/new-profile.jpg',
        profileLocation: 'New City',
        profileWebsite: 'https://newwebsite.com',
        profileBirthdate: new Date('1985-05-15'),
        profilePrivate: true
      };

      expect(updateRequest.username).toBe('newusername');
      expect(updateRequest.profilePicture).toContain('cloudinary.com');
      expect(updateRequest.profilePrivate).toBe(true);
    });

    it('should allow partial updates', () => {
      const partialUpdate: UpdateUserRequest = {
        profileBio: 'Just updating bio'
      };

      expect(partialUpdate.profileBio).toBe('Just updating bio');
      expect(partialUpdate.username).toBeUndefined();
    });
  });

  describe('PublicUserProfile Interface', () => {
    it('should exclude sensitive information', () => {
      const publicProfile: PublicUserProfile = {
        id: 'test-uuid',
        username: 'testuser',
        profileName: 'Test User',
        profileBio: 'Test bio',
        profilePicture: 'https://res.cloudinary.com/test/image/upload/v123/profile.jpg',
        profileLocation: 'Test City',
        profileWebsite: 'https://test.com',
        postsCount: 10,
        followersCount: 100,
        followingCount: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: new Date()
      };

      expect(publicProfile.id).toBe('test-uuid');
      expect(publicProfile.username).toBe('testuser');
      expect(publicProfile.profilePicture).toContain('cloudinary.com');
      
      // Should not have email or other sensitive fields
      expect('email' in publicProfile).toBe(false);
      expect('firstName' in publicProfile).toBe(false);
      expect('lastName' in publicProfile).toBe(false);
    });
  });

  describe('UserSearchResult Interface', () => {
    it('should contain minimal search result data', () => {
      const searchResult: UserSearchResult = {
        id: 'test-uuid',
        username: 'testuser',
        profileName: 'Test User',
        profilePicture: 'https://res.cloudinary.com/test/image/upload/v123/profile.jpg',
        profileBio: 'Test bio',
        followersCount: 100
      };

      expect(searchResult.username).toBe('testuser');
      expect(searchResult.profilePicture).toContain('cloudinary.com');
      expect(searchResult.followersCount).toBe(100);
    });
  });
});

describe('Cloudinary Types', () => {
  describe('CloudinaryImageData Interface', () => {
    it('should contain all Cloudinary response fields', () => {
      const imageData: CloudinaryImageData = {
        publicId: 'profile-pictures/user123',
        url: 'http://res.cloudinary.com/test/image/upload/v123/profile-pictures/user123.jpg',
        secureUrl: 'https://res.cloudinary.com/test/image/upload/v123/profile-pictures/user123.jpg',
        width: 400,
        height: 400,
        format: 'jpg',
        bytes: 45230
      };

      expect(imageData.publicId).toBe('profile-pictures/user123');
      expect(imageData.secureUrl).toContain('https://');
      expect(imageData.width).toBe(400);
      expect(imageData.bytes).toBeGreaterThan(0);
    });
  });

  describe('ProfilePictureUpload Interface', () => {
    it('should handle file upload with optional settings', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      const upload: ProfilePictureUpload = {
        file: mockFile,
        folder: 'profile-pictures',
        transformation: 'w_400,h_400,c_fill'
      };

      expect(upload.file.name).toBe('test.jpg');
      expect(upload.folder).toBe('profile-pictures');
      expect(upload.transformation).toBe('w_400,h_400,c_fill');
    });
  });
});

describe('Cloudinary Constants', () => {
  describe('DEFAULT_PROFILE_PICTURE', () => {
    it('should match Django model default', () => {
      expect(DEFAULT_PROFILE_PICTURE).toBe('media/images/default_profile_dqcubz.jpg');
    });
  });

  describe('CLOUDINARY_CONFIG', () => {
    it('should have reasonable file size limit', () => {
      expect(CLOUDINARY_CONFIG.MAX_FILE_SIZE).toBe(5 * 1024 * 1024); // 5MB
    });

    it('should include common image formats', () => {
      expect(CLOUDINARY_CONFIG.ALLOWED_FORMATS).toContain('jpg');
      expect(CLOUDINARY_CONFIG.ALLOWED_FORMATS).toContain('png');
      expect(CLOUDINARY_CONFIG.ALLOWED_FORMATS).toContain('webp');
    });

    it('should have profile-specific folder', () => {
      expect(CLOUDINARY_CONFIG.PROFILE_FOLDER).toBe('profile-pictures');
    });

    it('should have optimized transformation settings', () => {
      expect(CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION).toContain('q_auto');
      expect(CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION).toContain('f_auto');
      expect(CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION).toContain('w_400,h_400');
    });
  });
}); 