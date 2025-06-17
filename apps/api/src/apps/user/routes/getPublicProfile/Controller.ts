import { Request, Response } from 'express';
import { findUserById, findUserByUsername } from '../../models/database';

export const getPublicProfileController = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    
    if (!identifier) {
      return res.status(400).json({ 
        error: 'Username or user ID is required' 
      });
    }

    let user = null;
    
    // Try to find by username first, then by ID (inline business logic)
    if (identifier.match(/^[a-zA-Z0-9_]{3,30}$/)) {
      user = await findUserByUsername(identifier);
    } else {
      const userWithPassword = await findUserById(identifier);
      if (userWithPassword) {
        const { password, ...userWithoutPassword } = userWithPassword;
        user = userWithoutPassword;
      }
    }
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Format public profile response (inline data transformation)
    const publicProfile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profileName: user.profileName,
      profilePicture: user.profilePicture,
      profileBio: user.profileBio,
      profileLocation: user.profileLocation,
      profileWebsite: user.profileWebsite,
      profilePrivate: user.profilePrivate || false,
      postsCount: user.postsCount || 0,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

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