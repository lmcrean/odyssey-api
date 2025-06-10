import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../../shared/types';
import { updateUserProfileController } from '../Controller';
import { UserService } from '../../../services/UserService';
import { User, UpdateUserRequest, DEFAULT_PROFILE_PICTURE } from '../../../types';

// Mock UserService
vi.mock('../../../services/UserService');

describe('updateUserProfileController', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let jsonSpy: any;
  let statusSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    jsonSpy = vi.fn();
    statusSpy = vi.fn().mockReturnValue({ json: jsonSpy });
    
    mockReq = {
      body: {}
    };
    mockRes = {
      status: statusSpy,
      json: jsonSpy
    };
  });

  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    profileName: 'Test User',
    profileBio: 'Test bio',
    profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile-pictures/testuser.jpg',
    profileLocation: 'Test City',
    profileWebsite: 'https://testuser.com',
    profilePrivate: false,
    postsCount: 5,
    followersCount: 100,
    followingCount: 50,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    lastActiveAt: new Date('2024-01-03')
  };

  describe('Authentication', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockReq.user = undefined;

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Authentication required'
      });
    });
  });

  describe('Profile picture updates (Cloudinary)', () => {
    it('should update profile picture with Cloudinary URL', async () => {
      const newCloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v456/profile-pictures/newpic.jpg';
      const updateData: UpdateUserRequest = {
        profilePicture: newCloudinaryUrl
      };

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;

      const updatedUser = { ...mockUser, profilePicture: newCloudinaryUrl };
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(updatedUser);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(UserService.updateUserProfile).toHaveBeenCalledWith('test-user-id', updateData);
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
      expect(jsonSpy.mock.calls[0][0].data.profilePicture).toBe(newCloudinaryUrl);
    });

    it('should update profile picture to default', async () => {
      const updateData: UpdateUserRequest = {
        profilePicture: DEFAULT_PROFILE_PICTURE
      };

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;

      const updatedUser = { ...mockUser, profilePicture: DEFAULT_PROFILE_PICTURE };
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(updatedUser);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(jsonSpy.mock.calls[0][0].data.profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
    });

    it('should handle removing profile picture', async () => {
      const updateData: UpdateUserRequest = {
        profilePicture: undefined
      };

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;

      const updatedUser = { ...mockUser, profilePicture: undefined };
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(updatedUser);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(jsonSpy.mock.calls[0][0].data.profilePicture).toBeUndefined();
    });
  });

  describe('Profile data updates', () => {
    it('should update all profile fields', async () => {
      const updateData: UpdateUserRequest = {
        username: 'newusername',
        firstName: 'New First',
        lastName: 'New Last',
        profileName: 'New Display Name',
        profileBio: 'Updated bio',
        profileLocation: 'New City',
        profileWebsite: 'https://newwebsite.com',
        profileBirthdate: new Date('1985-05-15'),
        profilePrivate: true
      };

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;

      const updatedUser = { ...mockUser, ...updateData };
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(updatedUser);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(UserService.updateUserProfile).toHaveBeenCalledWith('test-user-id', updateData);
      expect(statusSpy).toHaveBeenCalledWith(200);
      
      const responseData = jsonSpy.mock.calls[0][0].data;
      expect(responseData.username).toBe('newusername');
      expect(responseData.profileName).toBe('New Display Name');
      expect(responseData.profileBio).toBe('Updated bio');
      expect(responseData.profilePrivate).toBe(true);
    });

    it('should handle partial updates', async () => {
      const updateData: UpdateUserRequest = {
        profileBio: 'Just updating bio'
      };

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;

      const updatedUser = { ...mockUser, profileBio: 'Just updating bio' };
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(updatedUser);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(UserService.updateUserProfile).toHaveBeenCalledWith('test-user-id', updateData);
      expect(jsonSpy.mock.calls[0][0].data.profileBio).toBe('Just updating bio');
    });
  });

  describe('Validation', () => {
    it('should return 400 for empty username', async () => {
      const updateData: UpdateUserRequest = {
        username: '   ' // Empty/whitespace username
      };

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Username cannot be empty'
      });
    });

    it('should allow valid username', async () => {
      const updateData: UpdateUserRequest = {
        username: 'valid_username'
      };

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;

      const updatedUser = { ...mockUser, username: 'valid_username' };
      vi.mocked(UserService.updateUserProfile).mockResolvedValue(updatedUser);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy.mock.calls[0][0].data.username).toBe('valid_username');
    });
  });

  describe('Error handling', () => {
    it('should return 404 if user not found', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = { profileBio: 'test' };

      vi.mocked(UserService.updateUserProfile).mockResolvedValue(null);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'User not found'
      });
    });

    it('should return 409 for username already taken', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = { username: 'taken_username' };

      vi.mocked(UserService.updateUserProfile).mockRejectedValue(
        new Error('Username is already taken')
      );

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(409);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Username is already taken'
      });
    });

    it('should return 400 for invalid username format', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = { username: 'invalid username' };

      vi.mocked(UserService.updateUserProfile).mockRejectedValue(
        new Error('Invalid username format')
      );

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Invalid username format. Use 3-30 alphanumeric characters and underscores only.'
      });
    });

    it('should return 400 for invalid website URL', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = { profileWebsite: 'invalid-url' };

      vi.mocked(UserService.updateUserProfile).mockRejectedValue(
        new Error('Invalid website URL')
      );

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Invalid website URL format'
      });
    });

    it('should handle generic service errors', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = { profileBio: 'test' };

      vi.mocked(UserService.updateUserProfile).mockRejectedValue(
        new Error('Database connection failed')
      );

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Database connection failed'
      });
    });
  });
}); 