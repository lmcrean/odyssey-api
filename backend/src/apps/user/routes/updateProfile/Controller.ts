import { Request, Response } from 'express';
import { UserService } from '../../services/UserService';
import { UpdateUserRequest } from '../../types';

export const updateUserProfileController = async (req: Request, res: Response) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    const updateData: UpdateUserRequest = req.body;

    // Validate required fields if provided
    if (updateData.username && updateData.username.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Username cannot be empty' 
      });
    }

    const updatedProfile = await UserService.updateUserProfile(userId, updateData);
    
    if (!updatedProfile) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    
    // Handle specific validation errors
    if (error instanceof Error) {
      if (error.message.includes('Username is already taken')) {
        return res.status(409).json({ 
          error: 'Username is already taken' 
        });
      }
      if (error.message.includes('Invalid username format')) {
        return res.status(400).json({ 
          error: 'Invalid username format. Use 3-30 alphanumeric characters and underscores only.' 
        });
      }
      if (error.message.includes('Invalid website URL')) {
        return res.status(400).json({ 
          error: 'Invalid website URL format' 
        });
      }
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 