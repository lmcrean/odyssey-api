import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../shared/types';
import { getUserProfile } from '../../services/user-retrieval';

export const getUserProfileController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    const userProfile = await getUserProfile(userId);
    
    if (!userProfile) {
      return res.status(404).json({ 
        error: 'User profile not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: userProfile
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 