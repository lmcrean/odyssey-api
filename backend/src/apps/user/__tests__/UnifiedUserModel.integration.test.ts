import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import userRoutes from '../routes';
import { UserService } from '../services/UserService';
import { 
  User, 
  UpdateUserRequest, 
  PublicUserProfile,
  UserSearchResult,
  DEFAULT_PROFILE_PICTURE,
  CLOUDINARY_CONFIG 
} from '../types';

// Mock UserService for integration testing
vi.mock('../services/UserService');

// Mock the authentication middleware
vi.mock('../../../shared/middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    console.log('Mock authenticateToken called');
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Access token is required'
      });
    }
    
    req.user = { id: 'test-user-id', email: 'test@example.com' };
    next();
  },
  optionalAuth: (req: any, res: any, next: any) => {
    console.log('Mock optionalAuth called');
    const authHeader = req.headers['authorization'];
    
    if (authHeader) {
      req.user = { id: 'test-user-id', email: 'test@example.com' };
    }
    next();
  }
}));

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('Unified User Model Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUser: User = {
    id: 'test-user-id',
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

  describe('Complete User Profile Flow', () => {
    it('should handle full user profile lifecycle with Cloudinary', async () => {
      // 1. Get initial profile
      vi.mocked(UserService.getUserProfile).mockResolvedValue(mockUser);
      
      const getResponse = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer token');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.success).toBe(true);
      expect(getResponse.body.data.profilePicture).toContain('cloudinary.com');

      // 2. Update profile with new Cloudinary image
      const updateData: UpdateUserRequest = {
        profileName: 'Updated Name',
        profileBio: 'Updated bio',
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/v456/profile-pictures/newpic.jpg',
        profileLocation: 'New York, NY'
      };

      const updatedUser = { ...mockUser, ...updateData };
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(updatedUser);

      const updateResponse = await request(app)
        .put('/users/profile/update')
        .set('Authorization', 'Bearer token')
        .send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.profileName).toBe('Updated Name');
      expect(updateResponse.body.data.profilePicture).toBe(updateData.profilePicture);

      // 3. Check that public profile excludes sensitive data
      const publicProfile: PublicUserProfile = {
        id: updatedUser.id,
        username: updatedUser.username,
        profileName: updatedUser.profileName,
        profileBio: updatedUser.profileBio,
        profilePicture: updatedUser.profilePicture,
        profileLocation: updatedUser.profileLocation,
        profileWebsite: updatedUser.profileWebsite,
        postsCount: updatedUser.postsCount,
        followersCount: updatedUser.followersCount,
        followingCount: updatedUser.followingCount,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        lastActiveAt: updatedUser.lastActiveAt
      };

      vi.mocked(UserService.getUserByUsername).mockResolvedValue(publicProfile);

      const publicResponse = await request(app)
        .get('/users/public/testuser');

      expect(publicResponse.status).toBe(200);
      expect(publicResponse.body.data.profilePicture).toBe(updateData.profilePicture);
      expect(publicResponse.body.data.email).toBeUndefined(); // Should not expose email
    });
  });

  describe('Cloudinary Profile Picture Scenarios', () => {
    it('should handle default profile picture', async () => {
      const userWithDefault = {
        ...mockUser,
        profilePicture: DEFAULT_PROFILE_PICTURE
      };

      vi.mocked(UserService.getUserProfile).mockResolvedValue(userWithDefault);

      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer token');

      expect(response.body.data.profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
    });

    it('should update from default to Cloudinary URL', async () => {
      const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill/profile-pictures/user123.jpg';
      const updateData: UpdateUserRequest = {
        profilePicture: cloudinaryUrl
      };

      const updatedUser = { ...mockUser, profilePicture: cloudinaryUrl };
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/users/profile/update')
        .set('Authorization', 'Bearer token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.profilePicture).toBe(cloudinaryUrl);
      expect(UserService.updateUserProfile).toHaveBeenCalledWith('test-user-id', updateData);
    });

    it('should handle profile picture removal', async () => {
      const updateData: UpdateUserRequest = {
        profilePicture: undefined
      };

      const updatedUser = { ...mockUser, profilePicture: undefined };
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/users/profile/update')
        .set('Authorization', 'Bearer token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.profilePicture).toBeUndefined();
    });
  });

  describe('Search Integration with Cloudinary', () => {
    it('should return search results with proper profile pictures', async () => {
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

      vi.mocked(UserService.searchUsers).mockResolvedValue(searchResults as any);

      const response = await request(app)
        .get('/users/search?q=user&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.data.results).toHaveLength(3);
      
      const results = response.body.data.results;
      expect(results[0].profilePicture).toContain('cloudinary.com');
      expect(results[1].profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
      expect(results[2].profilePicture).toBeUndefined();
    });
  });

  describe('Username Validation Integration', () => {
    it('should validate username availability', async () => {
      vi.mocked(UserService.checkUsernameAvailability).mockResolvedValue(true);

      const response = await request(app)
        .get('/users/check-username/available_username');

      expect(response.status).toBe(200);
      expect(response.body.data.available).toBe(true);
      expect(response.body.data.username).toBe('available_username');
    });

    it('should return false for taken username', async () => {
      vi.mocked(UserService.checkUsernameAvailability).mockResolvedValue(false);

      const response = await request(app)
        .get('/users/check-username/taken_username');

      expect(response.status).toBe(200);
      expect(response.body.data.available).toBe(false);
    });

    it('should validate username format', async () => {
      const response = await request(app)
        .get('/users/check-username/invalid username');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('only contain letters, numbers, and underscores');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle authentication errors', async () => {
      const response = await request(app)
        .get('/users/profile'); // No auth header

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should handle service errors gracefully', async () => {
      vi.mocked(UserService.getUserProfile).mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('Data Consistency Tests', () => {
    it('should maintain consistent field structure across all endpoints', async () => {
      // Test getUserProfile response structure
      vi.mocked(UserService.getUserProfile).mockResolvedValue(mockUser);
      const profileResponse = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer token');

      // Test updateProfile response structure
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(mockUser);
      const updateResponse = await request(app)
        .put('/users/profile/update')
        .set('Authorization', 'Bearer token')
        .send({ profileBio: 'test' });

      // Both should have same structure for user data
      const profileData = profileResponse.body.data;
      const updateData = updateResponse.body.data;

      // Check that unified model fields are present
      ['id', 'username', 'email', 'profileName', 'profileBio', 'profilePicture', 
       'postsCount', 'followersCount', 'followingCount'].forEach(field => {
        expect(profileData).toHaveProperty(field);
        expect(updateData).toHaveProperty(field);
      });
    });
  });

  describe('Cloudinary Configuration Validation', () => {
    it('should use proper Cloudinary configuration constants', () => {
      expect(CLOUDINARY_CONFIG.MAX_FILE_SIZE).toBe(5 * 1024 * 1024);
      expect(CLOUDINARY_CONFIG.ALLOWED_FORMATS).toContain('jpg');
      expect(CLOUDINARY_CONFIG.PROFILE_FOLDER).toBe('profile-pictures');
      expect(CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION).toContain('w_400,h_400');
    });

    it('should handle Cloudinary URLs in all user data', async () => {
      const cloudinaryUser = {
        ...mockUser,
        profilePicture: `https://res.cloudinary.com/demo/image/upload/${CLOUDINARY_CONFIG.DEFAULT_TRANSFORMATION}/profile-pictures/testuser.jpg`
      };

      vi.mocked(UserService.getUserProfile).mockResolvedValue(cloudinaryUser);

      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer token');

      expect(response.body.data.profilePicture).toContain('w_400,h_400');
      expect(response.body.data.profilePicture).toContain('profile-pictures');
    });
  });
}); 