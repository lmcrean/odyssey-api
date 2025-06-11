import { Request, Response } from 'express';
import { getUserProfile } from '../../services/user-retrieval';
import { updateUserProfile } from '../../services/user-updates';

export class ProfileController {
  static async getProfile(req: Request, res: Response) {
    try {
      // TODO: Get user ID from authentication middleware
      const userId = req.params.id || 'mock-user-id';
      
      const profile = await getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({
          error: 'Profile not found',
          message: 'User profile does not exist'
        });
      }

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve user profile'
      });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      // TODO: Get user ID from authentication middleware
      const userId = req.params.id || 'mock-user-id';
      const updateData = req.body;

      const updatedProfile = await updateUserProfile(userId, updateData);

      res.json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update user profile'
      });
    }
  }
} 