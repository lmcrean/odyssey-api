import { db } from '../../../../shared/db/init-sqlite';
import { User } from '../../types';

/**
 * Search users by query string
 */
export async function searchUsers(query: string, limit: number = 10): Promise<User[]> {
  try {
    // Ensure the table exists
    const tableExists = await db.schema.hasTable('users');
    if (!tableExists) {
      console.log('⚠️  Users table not found - this should be created by init-sqlite.ts first');
      return [];
    }

    const users = await db('users')
      .where('username', 'like', `%${query}%`)
      .orWhere('firstName', 'like', `%${query}%`)
      .orWhere('lastName', 'like', `%${query}%`)
      .limit(limit)
      .select('*');

    // Convert all users to User format (without password)
    return users.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profileName: user.profileName,
      profilePicture: user.profilePicture || user.avatar,
      profileBio: user.profileBio || user.bio,
      profileLocation: user.profileLocation || user.location,
      profileWebsite: user.profileWebsite || user.website,
      profileBirthdate: user.profileBirthdate ? new Date(user.profileBirthdate) : undefined,
      profilePrivate: user.profilePrivate || false,
      postsCount: user.postsCount || 0,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    }));
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
} 