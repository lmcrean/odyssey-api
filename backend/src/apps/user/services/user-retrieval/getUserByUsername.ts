import { PublicProfile } from '../../types';
import { findUserByUsername } from '../../models/database';

/**
 * Get user by username (public profile)
 */
export async function getUserByUsername(username: string): Promise<PublicProfile | null> {
  const user = await findUserByUsername(username);
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