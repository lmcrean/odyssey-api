import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../../shared/types';
import { updateUserProfile } from '../../../services/user-updates';
import { updateUserProfileController } from '../Controller';

// Mock updateUserProfile function
vi.mock('../../../services/user-updates', () => ({
  updateUserProfile: vi.fn()
}));

describe('updateUserProfileController', () => {
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<AuthenticatedRequest>;

  const mockUpdatedUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    username: 'janedoe',
    profileName: 'Jane Doe',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    mockRequest = {
      user: { id: 'test-user-id' },
      body: {}
    };

    vi.clearAllMocks();
  });

  it('should update user profile successfully', async () => {
    const updateData = { firstName: 'Jane', lastName: 'Doe' };
    mockRequest.body = updateData;

    vi.mocked(updateUserProfile).mockResolvedValue(mockUpdatedUser);

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(updateUserProfile).toHaveBeenCalledWith('test-user-id', updateData);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Profile updated successfully',
      data: mockUpdatedUser
    });
  });

  it('should return 401 when user is not authenticated', async () => {
    mockRequest.user = undefined;

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(updateUserProfile).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Authentication required'
    });
  });

  it('should return 400 for empty username', async () => {
    mockRequest.body = { username: '   ' };

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(updateUserProfile).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Username cannot be empty'
    });
  });

  it('should return 404 when user not found', async () => {
    mockRequest.body = { firstName: 'Jane' };
    vi.mocked(updateUserProfile).mockResolvedValue(null);

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'User not found'
    });
  });

  it('should handle errors and return 500', async () => {
    mockRequest.body = { firstName: 'Jane' };
    const error = new Error('Update failed');
    vi.mocked(updateUserProfile).mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: 'Update failed'
    });

    consoleSpy.mockRestore();
  });
}); 