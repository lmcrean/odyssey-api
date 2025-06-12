import { db } from '../../../../shared/db/init-sqlite';
import { User } from '../../types';

/**
 * Find user by ID with lean validation
 * Enhanced function with essential checks only
 */
export async function findUserById(id: string): Promise<User | null> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!id?.trim()) {
      return null;
    }

    // 2. DATABASE QUERY
    const user = await db('users')
      .select('*')
      .where('id', id)
      .first();

    if (!user) {
      return null;
    }

    // 3. DATA TRANSFORMATION
    return transformToUser(user);

  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
}

/**
 * Transform database row to User type (includes password for auth)
 */
function transformToUser(dbRow: any): User {
  return {
    id: dbRow.id,
    email: dbRow.email,
    password: dbRow.password, // Include password for auth
    firstName: dbRow.firstName,
    lastName: dbRow.lastName,
    username: dbRow.username,
    profileName: dbRow.profileName,
    profilePicture: dbRow.profilePicture || dbRow.avatar,
    profileBio: dbRow.profileBio,
    profileLocation: dbRow.profileLocation,
    profileWebsite: dbRow.profileWebsite,
    profileBirthdate: dbRow.profileBirthdate ? new Date(dbRow.profileBirthdate) : undefined,
    profilePrivate: Boolean(dbRow.profilePrivate),
    postsCount: dbRow.postsCount || 0,
    followersCount: dbRow.followersCount || 0,
    followingCount: dbRow.followingCount || 0,
    createdAt: new Date(dbRow.created_at),
    updatedAt: new Date(dbRow.updated_at)
  };
} 