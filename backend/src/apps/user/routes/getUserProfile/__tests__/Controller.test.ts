import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../../shared/types';
import { getUserProfileController } from '../Controller';
import { User, DEFAULT_PROFILE_PICTURE } from '../../../types';

// Mock database functions
vi.mock('../../../models/database', () => ({
  findUserById: vi.fn()
}));

import { findUserById } from '../../../models/database';

describe('getUserProfileController', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let jsonSpy: any;
  let statusSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    jsonSpy = vi.fn();
    statusSpy = vi.fn().mockReturnValue({ json: jsonSpy });
    
    mockReq = {};
    mockRes = {
      status: statusSpy,
      json: jsonSpy
    };
  });

  const mockUserWithPassword = {
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
    lastActiveAt: new Date('2024-01-03'),
    password: 'hashed-password'
  };

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

      await getUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Authentication required'
      });
    });

    it('should return 401 if user ID is missing', async () => {
      mockReq.user = { email: 'test@example.com' } as any; // User object without id

      await getUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Authentication required'
      });
    });
  });

  describe('Successful profile retrieval', () => {
    it('should return user profile without password', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      vi.mocked(findUserById).mockResolvedValue(mockUserWithPassword);

      await getUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(findUserById).toHaveBeenCalledWith('test-user-id');
      expect(statusSpy).toHaveBeenCalledWith(200);
      
      const responseData = jsonSpy.mock.calls[0][0].data;
      expect(responseData).not.toHaveProperty('password');
      expect(responseData.id).toBe('test-user-id');
      expect(responseData.email).toBe('test@example.com');
    });

    it('should return user profile with Cloudinary picture', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      vi.mocked(findUserById).mockResolvedValue(mockUserWithPassword);

      await getUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          profilePicture: expect.stringContaining('cloudinary.com')
        })
      });
    });

    it('should return user profile with default picture', async () => {
      const userWithDefaultPicture = {
        ...mockUserWithPassword,
        profilePicture: DEFAULT_PROFILE_PICTURE
      };
      
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      vi.mocked(findUserById).mockResolvedValue(userWithDefaultPicture);

      await getUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(jsonSpy.mock.calls[0][0].data.profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
    });

    it('should return all unified user model fields', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      vi.mocked(findUserById).mockResolvedValue(mockUserWithPassword);

      await getUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      const responseData = jsonSpy.mock.calls[0][0].data;
      
      // Account fields
      expect(responseData.id).toBe('test-user-id');
      expect(responseData.email).toBe('test@example.com');
      expect(responseData.username).toBe('testuser');
      
      // Profile fields
      expect(responseData.profileName).toBe('Test User');
      expect(responseData.profileBio).toBe('Test bio');
      expect(responseData.profileLocation).toBe('Test City');
      expect(responseData.profileWebsite).toBe('https://testuser.com');
      expect(responseData.profilePrivate).toBe(false);
      
      // Social counts
      expect(responseData.postsCount).toBe(5);
      expect(responseData.followersCount).toBe(100);
      expect(responseData.followingCount).toBe(50);
    });
  });

  describe('Error handling', () => {
    it('should return 404 if user profile not found', async () => {
      mockReq.user = { id: 'non-existent-id', email: 'test@example.com' };
      vi.mocked(findUserById).mockResolvedValue(null);

      await getUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'User profile not found'
      });
    });

    it('should handle database errors', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      const databaseError = new Error('Database connection failed');
      vi.mocked(findUserById).mockRejectedValue(databaseError);

      await getUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Database connection failed'
      });
    });

    it('should handle unknown errors', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      vi.mocked(findUserById).mockRejectedValue('Unknown error');

      await getUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Unknown error'
      });
    });
  });
}); 