import { db } from '../../../../shared/db/init-sqlite';
import { UserWithoutPassword } from '../../types';

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
 * Update user with lean validation and efficient mapping
 * Enhanced function with essential checks only
 */
export async function updateUser(id: string, updateData: UpdateUserInput): Promise<UserWithoutPassword | null> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!id?.trim()) {
      return null;
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return null;
    }

    // 2. PREPARE UPDATE DATA
    const dbUpdateData = prepareUpdateData(updateData);

    // 3. DATABASE UPDATE
    const [updatedUser] = await db('users')
      .where({ id })
      .update(dbUpdateData)
      .returning('*');

    if (!updatedUser) {
      return null;
    }

    // 4. DATA TRANSFORMATION
    return transformToUserWithoutPassword(updatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

/**
 * Prepare update data by mapping fields and adding timestamp
 */
function prepareUpdateData(updateData: UpdateUserInput): any {
  const dbData: any = {
    updated_at: db.fn.now()
  };

  // Direct mapping (field names match)
  const directFields = [
    'firstName', 'lastName', 'username', 'profileName', 'profilePicture',
    'profileBio', 'profileLocation', 'profileWebsite', 'profileBirthdate',
    'profilePrivate', 'postsCount', 'followersCount', 'followingCount'
  ];

  directFields.forEach(field => {
    if (updateData[field as keyof UpdateUserInput] !== undefined) {
      dbData[field] = updateData[field as keyof UpdateUserInput];
    }
  });

  return dbData;
}

/**
 * Transform database row to UserWithoutPassword type
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