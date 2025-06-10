import { Request, Response } from 'express';
import { UserService } from '../../services/UserService';

export const getPublicProfileController = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    
    if (!identifier) {
      return res.status(400).json({ 
        error: 'Username or user ID is required' 
      });
    }

    let publicProfile;
    
    // Check if identifier is a UUID (user ID) or username
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(identifier)) {
      // It's a user ID
      publicProfile = await UserService.getPublicUserProfile(identifier);
    } else {
      // It's a username
      publicProfile = await UserService.getUserByUsername(identifier);
    }
    
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