import { db } from '../../../../shared/db/init-sqlite';
import { UserWithoutPassword } from '../../types';

/**
 * Search users by query string with lean validation
 * Enhanced function with essential checks only
 */
export async function searchUsers(query: string, limit: number = 10): Promise<UserWithoutPassword[]> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!query?.trim()) {
      return [];
    }

    if (limit <= 0 || limit > 100) {
      limit = 10; // Sensible default and max limit
    }

    // 2. DATABASE SEARCH
    const users = await db('users')
      .where('username', 'like', `%${query}%`)
      .orWhere('firstName', 'like', `%${query}%`)
      .orWhere('lastName', 'like', `%${query}%`)
      .limit(limit)
      .select('*');

    // 3. DATA TRANSFORMATION
    return users.map(user => transformToUserWithoutPassword(user));

  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

/**
 * Transform database row to UserWithoutPassword type (for search results)
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