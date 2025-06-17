import { User, UserWithoutPassword } from '../../types';

/**
 * Transform database row to User type (includes password for auth purposes)
 */
export function transformToUser(dbRow: any): User {
  return {
    id: dbRow.id,
    email: dbRow.email,
    password: dbRow.password,
    firstName: dbRow.firstName,
    lastName: dbRow.lastName,
    username: dbRow.username,
    profileName: dbRow.profileName,
    profilePicture: dbRow.profilePicture,
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

/**
 * Transform database row to UserWithoutPassword type (for public use)
 */
export function transformToUserWithoutPassword(dbRow: any): UserWithoutPassword {
  return {
    id: dbRow.id,
    email: dbRow.email,
    firstName: dbRow.firstName,
    lastName: dbRow.lastName,
    username: dbRow.username,
    profileName: dbRow.profileName,
    profilePicture: dbRow.profilePicture,
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