import { db } from '../../../../shared/db/init-sqlite';
import { User } from '../../types';

/**
 * Find user by username (returns User without password)
 */
export async function findUserByUsername(username: string): Promise<User | null> {
  try {
    // Ensure the table exists
    const tableExists = await db.schema.hasTable('users');
    if (!tableExists) {
      console.log('⚠️  Users table not found - this should be created by init-sqlite.ts first');
      return null;
    }

    const user = await db('users')
      .select('*')
      .where('username', username)
      .first();

    if (!user) return null;

    // Convert database fields to User format (without password)
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profileName: user.profileName,
      profilePicture: user.profilePicture || user.avatar, // Handle both column names
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
    };
  } catch (error) {
    console.error('Error finding user by username:', error);
    return null;
  }
} 