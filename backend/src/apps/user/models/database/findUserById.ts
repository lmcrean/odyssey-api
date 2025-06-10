import { db } from '../../../../shared/db/init-sqlite';
import { DatabaseUser } from '../../types';

/**
 * Find user by ID with all profile fields
 */
export async function findUserById(id: string): Promise<DatabaseUser | null> {
  try {
    // Ensure the table exists (this method is from the original UserModel)
    const tableExists = await db.schema.hasTable('users');
    if (!tableExists) {
      console.log('⚠️  Users table not found - this should be created by init-sqlite.ts first');
      return null;
    }

    const user = await db('users')
      .select('*')
      .where('id', id)
      .first();

    if (!user) return null;

    // Convert database fields to DatabaseUser format
    return {
      id: user.id,
      email: user.email,
      password: user.password, // Include password for auth
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
    console.error('Error finding user by ID:', error);
    return null;
  }
} 