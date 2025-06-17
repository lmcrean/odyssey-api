import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../shared/types';
import { updateUser } from '../../models/database';

export const updateUserProfileController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    const updateData = req.body;

    // Basic validation - ensure we have some data to update
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        error: 'Update data is required' 
      });
    }

    // Update user profile using database function
    const updatedUser = await updateUser(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ 
        error: 'User not found or update failed' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 