import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../shared/types';
import { findUserById, updateUser, checkUsernameExists } from '../../models/database';

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate username format
 */
function isValidUsername(username: string): boolean {
  // Username should be 3-30 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
}

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

    // Inline validation logic (previously in validateUpdateData service)
    
    // Validate website URL
    if (updateData.profileWebsite && !isValidUrl(updateData.profileWebsite)) {
      return res.status(400).json({
        error: 'Invalid website URL'
      });
    }

    // Validate username format
    if (updateData.username && !isValidUsername(updateData.username)) {
      return res.status(400).json({
        error: 'Invalid username format'
      });
    }

    // Check username availability if changing
    if (updateData.username) {
      const currentUser = await findUserById(userId);
      if (currentUser && currentUser.username !== updateData.username) {
        const usernameExists = await checkUsernameExists(updateData.username);
        if (usernameExists) {
          return res.status(400).json({
            error: 'Username is already taken'
          });
        }
      }
    }

    // Update the user in database
    const updatedProfile = await updateUser(userId, updateData);
    
    if (!updatedProfile) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 