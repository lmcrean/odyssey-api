import { db } from '../../../../shared/db/init-sqlite';
import { User } from '../../types';

interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  username?: string;
  profileName?: string;
  profilePicture?: string;
  profileBio?: string;
  profileLocation?: string;
  profileWebsite?: string;
  profileBirthdate?: Date;
  profilePrivate?: boolean;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

/**
 * Update user record in database
 */
export async function updateUser(id: string, updateData: UpdateUserInput): Promise<User | null> {
  try {
    // Ensure the table exists
    const tableExists = await db.schema.hasTable('users');
    if (!tableExists) {
      throw new Error('Users table not found - this should be created by init-sqlite.ts first');
    }

    // Map to database column names
    const dbUpdateData: any = {};
    if (updateData.firstName !== undefined) dbUpdateData.firstName = updateData.firstName;
    if (updateData.lastName !== undefined) dbUpdateData.lastName = updateData.lastName;
    if (updateData.username !== undefined) dbUpdateData.username = updateData.username;
    if (updateData.profileName !== undefined) dbUpdateData.profileName = updateData.profileName;
    if (updateData.profilePicture !== undefined) dbUpdateData.profilePicture = updateData.profilePicture;
    if (updateData.profileBio !== undefined) dbUpdateData.profileBio = updateData.profileBio;
    if (updateData.profileLocation !== undefined) dbUpdateData.profileLocation = updateData.profileLocation;
    if (updateData.profileWebsite !== undefined) dbUpdateData.profileWebsite = updateData.profileWebsite;
    if (updateData.profileBirthdate !== undefined) dbUpdateData.profileBirthdate = updateData.profileBirthdate;
    if (updateData.profilePrivate !== undefined) dbUpdateData.profilePrivate = updateData.profilePrivate;
    if (updateData.postsCount !== undefined) dbUpdateData.postsCount = updateData.postsCount;
    if (updateData.followersCount !== undefined) dbUpdateData.followersCount = updateData.followersCount;
    if (updateData.followingCount !== undefined) dbUpdateData.followingCount = updateData.followingCount;
    
    dbUpdateData.updated_at = db.fn.now();

    const [updatedUser] = await db('users')
      .where({ id })
      .update(dbUpdateData)
      .returning('*');

    if (!updatedUser) return null;

    // Return user without password
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      profileName: updatedUser.profileName,
      profilePicture: updatedUser.profilePicture || updatedUser.avatar,
      profileBio: updatedUser.profileBio || updatedUser.bio,
      profileLocation: updatedUser.profileLocation || updatedUser.location,
      profileWebsite: updatedUser.profileWebsite || updatedUser.website,
      profileBirthdate: updatedUser.profileBirthdate ? new Date(updatedUser.profileBirthdate) : undefined,
      profilePrivate: updatedUser.profilePrivate || false,
      postsCount: updatedUser.postsCount || 0,
      followersCount: updatedUser.followersCount || 0,
      followingCount: updatedUser.followingCount || 0,
      createdAt: new Date(updatedUser.created_at),
      updatedAt: new Date(updatedUser.updated_at)
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
} 