import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../../shared/types';
import { getUserProfileController } from '../Controller';
import { getUserProfile } from '../../../services/user-retrieval';
import { User, DEFAULT_PROFILE_PICTURE } from '../../../types';

// Mock getUserProfile function
vi.mock('../../../services/user-retrieval', () => ({
  getUserProfile: vi.fn()
}));

describe('getUserProfileController', () => {
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<AuthenticatedRequest>;

  beforeEach(() => {
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    mockRequest = {
      user: { id: 'test-user-id' }
    };

    vi.clearAllMocks();
  });

  it('should return user profile successfully', async () => {
    const mockUser: User = {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      profileName: 'John Doe',
      profilePicture: DEFAULT_PROFILE_PICTURE,
      profileBio: null,
      profileLocation: null,
      profileWebsite: null,
      profileBirthdate: undefined,
      profilePrivate: false,
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(getUserProfile).mockResolvedValue(mockUser);

    await getUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(getUserProfile).toHaveBeenCalledWith('test-user-id');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      data: mockUser
    });
  });

  it('should return 401 when user is not authenticated', async () => {
    mockRequest.user = undefined;

    await getUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(getUserProfile).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Authentication required'
    });
  });

  it('should return 404 when user profile not found', async () => {
    vi.mocked(getUserProfile).mockResolvedValue(null);

    await getUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'User profile not found'
    });
  });

  it('should handle errors and return 500', async () => {
    const error = new Error('Database error');
    vi.mocked(getUserProfile).mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await getUserProfileController(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: 'Database error'
    });

    consoleSpy.mockRestore();
  });
}); 