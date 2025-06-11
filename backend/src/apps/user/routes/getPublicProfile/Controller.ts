import { Request, Response } from 'express';
import { getPublicUserProfile } from '../../services/user-retrieval';

export const getPublicProfileController = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    
    if (!identifier) {
      return res.status(400).json({ 
        error: 'Username or user ID is required' 
      });
    }

    // getPublicUserProfile handles both username and ID lookups
    const publicProfile = await getPublicUserProfile(identifier);
    
    if (!publicProfile) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: publicProfile
    });

  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 