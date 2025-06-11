import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { searchUsers } from '../../../models/database';
import { searchUsersController } from '../Controller';
import { UserService } from '../../../services/UserService';
import { User, UserSearchResult, DEFAULT_PROFILE_PICTURE } from '../../../types';

// Mock UserService
vi.mock('../../../services/UserService');

describe('searchUsersController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: any;
  let statusSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    jsonSpy = vi.fn();
    statusSpy = vi.fn().mockReturnValue({ json: jsonSpy });
    
    mockReq = {
      query: {}
    };
    mockRes = {
      status: statusSpy,
      json: jsonSpy
    };
  });

  const mockSearchResults: User[] = [
    {
      id: 'user1',
      email: 'john@example.com',
      username: 'john_doe',
      profileName: 'John Doe',
      profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile-pictures/john.jpg',
      profileBio: 'Software developer',
      followersCount: 150,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'user2',
      email: 'jane@example.com',
      username: 'jane_smith',
      profileName: 'Jane Smith',
      profilePicture: DEFAULT_PROFILE_PICTURE,
      profileBio: 'Designer',
      followersCount: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  describe('Query validation', () => {
    it('should return 400 if query is missing', async () => {
      mockReq.query = {};

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Search query is required'
      });
    });

    it('should return 400 if query is not a string', async () => {
      // Simulate non-string query parameter (unusual case, but test for robustness)
      mockReq.query = { q: 123 as any }; // Force non-string type

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Search query is required'
      });
    });

    it('should return 400 if query is too short', async () => {
      mockReq.query = { q: 'a' };

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Search query must be at least 2 characters long'
      });
    });

    it('should handle whitespace-only query', async () => {
      mockReq.query = { q: '   ' };

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Search query must be at least 2 characters long'
      });
    });
  });

  describe('Limit validation', () => {
    it('should use default limit when not provided', async () => {
      mockReq.query = { q: 'john' };
      vi.mocked(UserService.searchUsers).mockResolvedValue(mockSearchResults);

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(UserService.searchUsers).toHaveBeenCalledWith('john', 20);
    });

    it('should use provided limit', async () => {
      mockReq.query = { q: 'john', limit: '10' };
      vi.mocked(UserService.searchUsers).mockResolvedValue(mockSearchResults);

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(UserService.searchUsers).toHaveBeenCalledWith('john', 10);
    });

    it('should return 400 if limit exceeds maximum', async () => {
      mockReq.query = { q: 'john', limit: '100' };

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Search limit cannot exceed 50 results'
      });
    });
  });

  describe('Successful search', () => {
    it('should return search results with Cloudinary profile pictures', async () => {
      mockReq.query = { q: 'john' };
      vi.mocked(UserService.searchUsers).mockResolvedValue(mockSearchResults);

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(UserService.searchUsers).toHaveBeenCalledWith('john', 20);
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: {
          query: 'john',
          results: mockSearchResults,
          count: 2
        }
      });

      const responseData = jsonSpy.mock.calls[0][0].data;
      expect(responseData.results[0].profilePicture).toContain('cloudinary.com');
      expect(responseData.results[1].profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
    });

    it('should trim query and return results', async () => {
      mockReq.query = { q: '  john  ' };
      vi.mocked(UserService.searchUsers).mockResolvedValue(mockSearchResults);

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(UserService.searchUsers).toHaveBeenCalledWith('john', 20);
      expect(jsonSpy.mock.calls[0][0].data.query).toBe('john');
    });

    it('should return empty results', async () => {
      mockReq.query = { q: 'nonexistent' };
      vi.mocked(UserService.searchUsers).mockResolvedValue([]);

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy.mock.calls[0][0].data.results).toEqual([]);
      expect(jsonSpy.mock.calls[0][0].data.count).toBe(0);
    });

    it('should include all required search result fields', async () => {
      mockReq.query = { q: 'john' };
      vi.mocked(UserService.searchUsers).mockResolvedValue(mockSearchResults);

      await searchUsersController(mockReq as Request, mockRes as Response);

      const results = jsonSpy.mock.calls[0][0].data.results;
      
      results.forEach((result: User) => {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('username');
        expect(result).toHaveProperty('profileName');
        expect(result).toHaveProperty('profilePicture');
        expect(result).toHaveProperty('profileBio');
        expect(result).toHaveProperty('followersCount');
        
        // User objects do include email (unlike UserSearchResult)
        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('createdAt');
        expect(result).toHaveProperty('updatedAt');
      });
    });
  });

  describe('Search with custom limit', () => {
    it('should respect custom limit', async () => {
      mockReq.query = { q: 'user', limit: '5' };
      vi.mocked(UserService.searchUsers).mockResolvedValue(mockSearchResults.slice(0, 1));

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(UserService.searchUsers).toHaveBeenCalledWith('user', 5);
      expect(jsonSpy.mock.calls[0][0].data.count).toBe(1);
    });

    it('should handle limit at maximum boundary', async () => {
      mockReq.query = { q: 'user', limit: '50' };
      vi.mocked(UserService.searchUsers).mockResolvedValue(mockSearchResults);

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(UserService.searchUsers).toHaveBeenCalledWith('user', 50);
      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe('Error handling', () => {
    it('should handle service errors', async () => {
      mockReq.query = { q: 'john' };
      const serviceError = new Error('Database connection failed');
      vi.mocked(UserService.searchUsers).mockRejectedValue(serviceError);

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Database connection failed'
      });
    });

    it('should handle unknown errors', async () => {
      mockReq.query = { q: 'john' };
      vi.mocked(UserService.searchUsers).mockRejectedValue('Unknown error');

      await searchUsersController(mockReq as Request, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Unknown error'
      });
    });
  });

  describe('Profile picture variations', () => {
    it('should handle users with various profile picture states', async () => {
      const mixedResults: User[] = [
        {
          id: 'user1',
          email: 'user1@example.com',
          username: 'user_with_cloudinary',
          profileName: 'User One',
          profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile-pictures/user1.jpg',
          profileBio: 'Has Cloudinary picture',
          followersCount: 100,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'user2',
          email: 'user2@example.com',
          username: 'user_with_default',
          profileName: 'User Two',
          profilePicture: DEFAULT_PROFILE_PICTURE,
          profileBio: 'Has default picture',
          followersCount: 50,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'user3', 
          email: 'user3@example.com',
          username: 'user_without_picture',
          profileName: 'User Three',
          profilePicture: undefined,
          profileBio: 'No picture',
          followersCount: 25,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockReq.query = { q: 'user' };
      vi.mocked(UserService.searchUsers).mockResolvedValue(mixedResults);

      await searchUsersController(mockReq as Request, mockRes as Response);

      const results = jsonSpy.mock.calls[0][0].data.results;
      expect(results[0].profilePicture).toContain('cloudinary.com');
      expect(results[1].profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
      expect(results[2].profilePicture).toBeUndefined();
    });
  });
}); 