import { PublicProfile } from '../../types';
import { findUserById, findUserByUsername } from '../../models/database';

/**
 * Get public user profile (for viewing other users)
 */
export async function getPublicUserProfile(identifier: string): Promise<PublicProfile | null> {
  let user = null;
  
  // Try to find by username first, then by ID
  if (identifier.match(/^[a-zA-Z0-9_]{3,30}$/)) {
    user = await findUserByUsername(identifier);
  } else {
    const userWithPassword = await findUserById(identifier);
    if (userWithPassword) {
      const { password, ...userWithoutPassword } = userWithPassword;
      user = userWithoutPassword;
    }
  }
  
  if (!user) return null;

  return {
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
} 