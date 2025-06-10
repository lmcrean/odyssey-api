import { Request, Response } from 'express';
import { UserService } from '../../services/UserService';

export const searchUsersController = async (req: Request, res: Response) => {
  try {
    const { q: query, limit } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      return res.status(400).json({ 
        error: 'Search query must be at least 2 characters long' 
      });
    }

    const searchLimit = limit ? parseInt(limit as string, 10) : 20;
    
    if (searchLimit > 50) {
      return res.status(400).json({ 
        error: 'Search limit cannot exceed 50 results' 
      });
    }

    const searchResults = await UserService.searchUsers(trimmedQuery, searchLimit);

    res.status(200).json({
      success: true,
      data: {
        query: trimmedQuery,
        results: searchResults,
        count: searchResults.length
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 