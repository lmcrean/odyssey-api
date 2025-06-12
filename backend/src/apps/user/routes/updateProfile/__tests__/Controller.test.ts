import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../../shared/types';
import { updateUserProfileController } from '../Controller';

// Mock database functions
vi.mock('../../../models/database', () => ({
  findUserById: vi.fn(),
  updateUser: vi.fn(),
  checkUsernameExists: vi.fn()
}));

import { findUserById, updateUser, checkUsernameExists } from '../../../models/database';

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

  const mockCurrentUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    password: 'hashed-password'
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

    vi.mocked(updateUser).mockResolvedValue(mockUpdatedUser);

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(updateUser).toHaveBeenCalledWith('test-user-id', updateData);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      data: mockUpdatedUser,
      message: 'Profile updated successfully'
    });
  });

  it('should return 401 when user is not authenticated', async () => {
    mockRequest.user = undefined;

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(updateUser).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Authentication required'
    });
  });

  it('should return 400 for invalid website URL', async () => {
    mockRequest.body = { profileWebsite: 'invalid-url' };

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(updateUser).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid website URL'
    });
  });

  it('should return 400 for invalid username format', async () => {
    mockRequest.body = { username: 'a' }; // Too short

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(updateUser).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid username format'
    });
  });

  it('should return 400 for taken username', async () => {
    mockRequest.body = { username: 'taken_username' };
    
    vi.mocked(findUserById).mockResolvedValue(mockCurrentUser);
    vi.mocked(checkUsernameExists).mockResolvedValue(true);

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(findUserById).toHaveBeenCalledWith('test-user-id');
    expect(checkUsernameExists).toHaveBeenCalledWith('taken_username');
    expect(updateUser).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Username is already taken'
    });
  });

  it('should allow username change when available', async () => {
    mockRequest.body = { username: 'new_username' };
    
    vi.mocked(findUserById).mockResolvedValue(mockCurrentUser);
    vi.mocked(checkUsernameExists).mockResolvedValue(false);
    vi.mocked(updateUser).mockResolvedValue(mockUpdatedUser);

    await updateUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(findUserById).toHaveBeenCalledWith('test-user-id');
    expect(checkUsernameExists).toHaveBeenCalledWith('new_username');
    expect(updateUser).toHaveBeenCalledWith('test-user-id', { username: 'new_username' });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('should return 404 when user not found', async () => {
    mockRequest.body = { firstName: 'Jane' };
    vi.mocked(updateUser).mockResolvedValue(null);

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
    vi.mocked(updateUser).mockRejectedValue(error);

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