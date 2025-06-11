import { db } from '../../../../shared/db/init-sqlite';
import { User } from '../../types';

/**
 * Find user by email with lean validation
 * Returns User with password for authentication purposes
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!email?.trim()) {
      return null;
    }

    // 2. DATABASE QUERY
    const user = await db('users')
      .select('*')
      .where('email', email)
      .first();

    if (!user) {
      return null;
    }

    // 3. DATA TRANSFORMATION
    return transformToUser(user);

  } catch (error) {
    console.error('Error finding user by email:', error);
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