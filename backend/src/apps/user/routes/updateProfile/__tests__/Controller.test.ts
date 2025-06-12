import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../../shared/types';
import { updateUserProfileController } from '../Controller';

// Mock database functions
vi.mock('../../../models/database', () => ({
  updateUser: vi.fn()
}));

import { updateUser } from '../../../models/database';

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

  const mockUpdatedUser = {
    id: 'test-user-id',
    email: 'updated@example.com',
    username: 'updateduser',
    firstName: 'Updated',
    lastName: 'User',
    profileName: 'Updated User',
    profileBio: 'Updated bio',
    profilePicture: 'https://example.com/updated-avatar.jpg',
    profileLocation: 'Updated City',
    profileWebsite: 'https://updated.com',
    profilePrivate: false,
    postsCount: 10,
    followersCount: 200,
    followingCount: 100,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-03')
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

    it('should return 401 if user ID is missing', async () => {
      mockReq.user = { email: 'test@example.com' } as any;

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Authentication required'
      });
    });
  });

  describe('Validation', () => {
    it('should return 400 if no update data provided', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = {};

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Update data is required'
      });
    });

    it('should return 400 if empty update data provided', async () => {
      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = null;

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Update data is required'
      });
    });
  });

  describe('Successful profile update', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        profileBio: 'Updated bio',
        profileLocation: 'Updated City'
      };

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;
      vi.mocked(updateUser).mockResolvedValue(mockUpdatedUser);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(updateUser).toHaveBeenCalledWith('test-user-id', updateData);
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        message: 'Profile updated successfully',
        data: mockUpdatedUser
      });
    });

    it('should handle username updates', async () => {
      const updateData = {
        username: 'newusername',
        profileName: 'New Display Name'
      };

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;
      vi.mocked(updateUser).mockResolvedValue(mockUpdatedUser);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(updateUser).toHaveBeenCalledWith('test-user-id', updateData);
      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe('Error handling', () => {
    it('should return 404 if user not found', async () => {
      const updateData = { profileBio: 'Updated bio' };

      mockReq.user = { id: 'non-existent-id', email: 'test@example.com' };
      mockReq.body = updateData;
      vi.mocked(updateUser).mockResolvedValue(null);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'User not found or update failed'
      });
    });

    it('should handle database errors', async () => {
      const updateData = { profileBio: 'Updated bio' };
      const databaseError = new Error('Database connection failed');

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;
      vi.mocked(updateUser).mockRejectedValue(databaseError);

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Database connection failed'
      });
    });

    it('should handle unknown errors', async () => {
      const updateData = { profileBio: 'Updated bio' };

      mockReq.user = { id: 'test-user-id', email: 'test@example.com' };
      mockReq.body = updateData;
      vi.mocked(updateUser).mockRejectedValue('Unknown error');

      await updateUserProfileController(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Unknown error'
      });
    });
  });
}); 