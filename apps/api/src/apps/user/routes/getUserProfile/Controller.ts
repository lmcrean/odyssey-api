import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../shared/types';
import { findUserById } from '../../models/database';

export const getUserProfileController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    // Get user directly from database
    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User profile not found' 
      });
    }

    // Remove password from response (inline business logic)
    const { password, ...userProfile } = user;

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