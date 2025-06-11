import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { searchUsers } from '../../../models/database';
import { searchUsersController } from '../Controller';

// Mock searchUsers function
vi.mock('../../../models/database', () => ({
  searchUsers: vi.fn()
}));

describe('searchUsersController', () => {
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;

  const mockSearchResults = [
    {
      id: 'user-1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      profileName: 'John Doe'
    },
    {
      id: 'user-2', 
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
      profileName: 'Jane Smith'
    }
  ];

  beforeEach(() => {
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    mockRequest = {
      query: {}
    };

    vi.clearAllMocks();
  });

  it('should search users successfully', async () => {
    mockRequest.query = { q: 'john' };
    vi.mocked(searchUsers).mockResolvedValue(mockSearchResults);

    await searchUsersController(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(searchUsers).toHaveBeenCalledWith('john', 20);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      data: {
        query: 'john',
        results: mockSearchResults,
        count: 2
      }
    });
  });

  it('should use custom limit when provided', async () => {
    mockRequest.query = { q: 'john', limit: '5' };
    vi.mocked(searchUsers).mockResolvedValue(mockSearchResults);

    await searchUsersController(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(searchUsers).toHaveBeenCalledWith('john', 5);
  });

  it('should return 400 when query is missing', async () => {
    mockRequest.query = {};

    await searchUsersController(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(searchUsers).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Search query is required'
    });
  });

  it('should return 400 when query is too short', async () => {
    mockRequest.query = { q: 'a' };

    await searchUsersController(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(searchUsers).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Search query must be at least 2 characters long'
    });
  });

  it('should return 400 when limit exceeds maximum', async () => {
    mockRequest.query = { q: 'john', limit: '100' };

    await searchUsersController(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(searchUsers).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Search limit cannot exceed 50 results'
    });
  });

  it('should handle errors and return 500', async () => {
    mockRequest.query = { q: 'john' };
    const error = new Error('Database error');
    vi.mocked(searchUsers).mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await searchUsersController(
      mockRequest as Request,
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