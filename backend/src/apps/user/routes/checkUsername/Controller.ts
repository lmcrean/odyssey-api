import { Request, Response } from 'express';
import { checkUsernameExists } from '../../models/database';

export const checkUsernameController = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ 
        error: 'Username is required' 
      });
    }

    // Basic username validation
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ 
        error: 'Username must be between 3 and 30 characters' 
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        error: 'Username can only contain letters, numbers, and underscores' 
      });
    }

    const usernameExists = await checkUsernameExists(username);
    const isAvailable = !usernameExists;

    res.status(200).json({
      success: true,
      data: {
        username,
        available: isAvailable,
        message: isAvailable ? 'Username is available' : 'Username is already taken'
      }
    });

  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 