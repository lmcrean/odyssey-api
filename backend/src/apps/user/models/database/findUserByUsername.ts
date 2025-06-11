import { db } from '../../../../shared/db/init-sqlite';
import { UserWithoutPassword } from '../../types';

/**
 * Find user by username with lean validation
 * Returns UserWithoutPassword for public profile purposes
 */
export async function findUserByUsername(username: string): Promise<UserWithoutPassword | null> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!username?.trim()) {
      return null;
    }

    // 2. DATABASE QUERY
    const user = await db('users')
      .select('*')
      .where('username', username)
      .first();

    if (!user) {
      return null;
    }

    // 3. DATA TRANSFORMATION
    return transformToUserWithoutPassword(user);

  } catch (error) {
    console.error('Error finding user by username:', error);
    return null;
  }
}

/**
 * Transform database row to UserWithoutPassword type (for public use)
 */
function transformToUserWithoutPassword(dbRow: any): UserWithoutPassword {
  return {
    id: dbRow.id,
    email: dbRow.email,
    firstName: dbRow.firstName,
    lastName: dbRow.lastName,
    username: dbRow.username,
    profileName: dbRow.profileName,
    profilePicture: dbRow.profilePicture || dbRow.avatar,
    profileBio: dbRow.profileBio || dbRow.bio,
    profileLocation: dbRow.profileLocation || dbRow.location,
    profileWebsite: dbRow.profileWebsite || dbRow.website,
    profileBirthdate: dbRow.profileBirthdate ? new Date(dbRow.profileBirthdate) : undefined,
    profilePrivate: dbRow.profilePrivate || false,
    postsCount: dbRow.postsCount || 0,
    followersCount: dbRow.followersCount || 0,
    followingCount: dbRow.followingCount || 0,
    createdAt: new Date(dbRow.created_at),
    updatedAt: new Date(dbRow.updated_at)
  };
} 